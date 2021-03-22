import {GetServerSideProps, NextPage} from 'next';
import React, {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import qs from 'querystring';
import '../styles/home.less'
import dayjs from 'dayjs';
import { usePager } from 'hooks/usePager';
import PageHeader from 'hooks/useHeader';

const Index: NextPage<articleType> = (props) => {
  const {posts,page,totalPage} = props;
  const {pager} = usePager({page, totalPage});

  return (
    <div className="container">
      <PageHeader />
      <ul className="article-wrapper">
      {
        posts.map(item=>{
          return(
            <li  className="article-item" key={item.id}>
              <Link  key={item.id} href={`/posts/${item.id}`}><h1 className="article-title">{item.title}</h1></Link>
              <div className="article-time"><img src="/time.png" alt=""/>{dayjs(item.createdAt).format('YYYY-MM-DD HH:ss:mm')}</div>
              <div className="article-content"  dangerouslySetInnerHTML = {{ __html: item.htmlContent }}></div>
            </li>
          )
        })
      }
      </ul>
      <footer>
        {pager}
      </footer>
    </div>
  );
};
export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const connection = await getDatabaseConnection()// 第一次链接能不能用 get
  const index = context.req.url.indexOf('?')
  const search = context.req.url.substring(index+1)
  const query = qs.parse(search)
  const page = parseInt(query.page?.toString()) || 1
  const perpage = 5
  //findAndCount 找到并返回总数量
  const [posts,count] = await connection.manager.findAndCount(Post,{skip:(page - 1) * perpage,take:perpage})
  return {
    props: {
      posts:JSON.parse(JSON.stringify(posts)),
      count,
      page,
      perpage,
      totalPage:Math.ceil(count / perpage)
    }
  };
};
import {GetServerSideProps, NextPage} from 'next';
import React, {useEffect, useState} from 'react';
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
  // (formData:typeof initFormData) 我们通过 typeof 操作符获取 initFormData 变量的类型并赋值给 formData 类型变量，之后我们就可以使用 formData 类型
  return (
    <div className="container">
      <PageHeader />
      <ul>
      {
        posts.map(item=>{
          return(
            <li  className="article-item" id={item.id}>
              <Link  key={item.id} href={`/posts/${item.id}`}><h1 className="article-title">{item.title}</h1></Link>
              <div className="article-time"><img src="/time.png" alt=""/>{dayjs(item.createdAt).format('YYYY-MM-DD HH:ss:mm')}</div>
              <p className="article-content">{item.content}</p>
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
  const perpage = 3
  //findAndCount 找到并返回总数量
  const [posts,count] = await connection.manager.findAndCount(Post,{skip:(page - 1) * perpage,take:perpage})
  for(let i = 0;i<posts.length;i++){
    posts[i].content = posts[i].content.slice(0,200)
  }
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
import {GetServerSideProps, NextPage} from 'next';
import {UAParser} from 'ua-parser-js';
import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import qs from 'query-string'

type Props = {
  posts:Post[],
  count:number,
  pageNum:number,
  perpage:number,
  totalPage:number,
}
const PostsIndex: NextPage<Props> = (props) => {
  const {posts,count,pageNum,perpage,totalPage} = props;
  //console.log(posts);
  return (
    <div>
      <h1>文章列表</h1>
      <ul>
      {
        posts.map((item)=>{
          return(
            <div>
              <Link  key={item.id} href={`/posts/${item.id}`}>
               <p>{item.title}</p>
              </Link>
            </div>
          )
        })
      }
      </ul>
      <footer>
        {
          pageNum > 1 && <Link href={`/posts?page=${pageNum - 1 }`}>上一页</Link>
        }
        当前总共有{count}条数据，当前在第{totalPage}页 每页{perpage}条
        {
          pageNum < totalPage &&   <Link href={`/posts?page=${pageNum + 1 }`}>下一页</Link>
        }
      </footer>
    </div>
  );
};
export default PostsIndex;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const connection = await getDatabaseConnection()// 第一次链接能不能用 get
  const index = context.req.url.indexOf('?')
  const search = context.req.url.substring(index+1)
  const query = qs.parse(search)
  const page = parseInt(query.page.toString()) || 1
  const perpage = 3
  //findAndCount 找到并返回总数量
  const [posts,count] = await connection.manager.findAndCount(Post,{skip:(page - 1) * perpage,take:perpage})
  console.log(count);
  return {
    props: {
      posts:JSON.parse(JSON.stringify(posts)),
      count,
      pageNum:page,
      perpage,
      totalPage:Math.ceil(count / page)
    }
  };
};
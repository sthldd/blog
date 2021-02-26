import {GetServerSideProps, NextPage} from 'next';
import {UAParser} from 'ua-parser-js';
import React, {useEffect, useState} from 'react';
import {getDatabaseConnection} from '../lib/getDatabaseConnection';
import {Post} from '../src/entity/Post'
import Link from 'next/link';


type Props = {
  posts:Post[],
}
const index: NextPage<Props> = (props) => {
  const {posts} = props;
  console.log(posts);
  return (
    <div>
      <h1>你的浏览器是131</h1>
      <ul>
      {
        posts.map((item)=>{
          return(
            <Link  key={item.id} href={`/posts/${item.id}`}>
              <p>{item.title}</p>
            </Link>
          )
        })
      }
      </ul>
    </div>
  );
};
export default index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const connection = await getDatabaseConnection()// 第一次链接能不能用 get
  const posts = await connection.manager.find(Post)
  return {
    props: {
      posts:JSON.parse(JSON.stringify(posts))
    }
  };
};
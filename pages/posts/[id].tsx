import React from 'react';
import {GetServerSideProps, NextPage} from 'next';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import PageHeader from 'hooks/useHeader';
import dayjs from 'dayjs';
type Props = {
  post: Post
}
const postsShow: NextPage<Props> = (props) => {
  const {post} = props;
  return (
    <div  className="container">
      <PageHeader />
      <h1>{post.title}</h1>
      <div className="article-time" style={{marginBottom:'10px'}}><img src="/time.png" alt=""/>{dayjs(post.createdAt).format('YYYY-MM-DD HH:ss:mm')}</div>
      <article dangerouslySetInnerHTML={   {__html: post.content}  }></article>
    </div>
  );
};
export default postsShow;
export const getServerSideProps: GetServerSideProps<any,{id:string}> = async (context) => {
  const connection = await getDatabaseConnection()// 第一次链接能不能用 get
  const post = await connection.manager.findOne(Post,context.params.id)
  return {
    props: {
      post:JSON.parse(JSON.stringify(post))
    }
  };
};
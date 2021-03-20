import React from 'react';
import {GetServerSideProps, NextPage} from 'next';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import PageHeader from 'hooks/useHeader';
import dayjs from 'dayjs';
import { Between } from 'typeorm';
import Link from 'next/link';

type Props = {
  post: Post
}
const record: NextPage<Props> = (props) => {
  const {post} = props;
  console.log(post);
  return (
    <div  className="container">
      <PageHeader />
      <div>
        {
          post.map(item=>
            <div key={item.year} className="record-item-wrapper">
              <h2>{item.year}</h2>
              <ul className="record-item">
                {
                  item.list.map(i=>
                    <li key={i.id}>
                      <span className="record-item-time">{dayjs(i.createdAt).format(`YYYY${'年'}MM${'月'}DD${'日'}`)}</span>
                      <Link  key={i.id} href={`/posts/${i.id}`}>
                        <span className="record-item-title">{i.title}</span>
                      </Link>
                    </li>
                  )
                }
              </ul>
            </div>
          )
        }
      </div>
    </div>
  );
};
export default record;
export const getServerSideProps: GetServerSideProps<any,{id:string}> = async (context) => {
  const connection = await getDatabaseConnection()// 第一次链接能不能用 get
  const latestOne = await connection.manager.findOne(Post,{order:{createdAt:'DESC'}})
  const oldOne = await connection.manager.findOne(Post,{order:{createdAt:'ASC'}})
  var data:any = []
  if(latestOne && latestOne.createdAt && oldOne && oldOne.createdAt){
    var latestYear = dayjs(latestOne.createdAt).year()
    var oldYear = dayjs(oldOne.createdAt).year()
    for(let i = latestYear;i > oldYear - 1;i--){
      const BetweenDates = () => Between(dayjs(i+'').startOf('year'), dayjs(i+'').endOf('year'));
      const found = await connection.manager.find(Post,{where:{createdAt:BetweenDates()}});
      data.push({
        year:i,
        list:found
      })
    }
  }
  return {
    props: {
      post:JSON.parse(JSON.stringify(data))
    }
  };
};
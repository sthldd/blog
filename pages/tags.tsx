import React from 'react';
import {GetServerSideProps, NextPage} from 'next';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import PageHeader from 'hooks/useHeader';
import Link from 'next/link';
import { Tag } from 'src/entity/Tag';
type Props = {
  post: Post;
  tagList:[{id:number,name:string}]
}
const tags: NextPage<Props> = (props) => {
  const {tagList,post} = props;
  return (
    <div  className="container">
      <PageHeader />
      {/* {
        tagList.map(item=><a  className="tag-name" style={{margin:'0 10px'}} href={`#${item.name}`} key={item.id}>{item.name}</a>)
      } */}
      <div>
        {
          //@ts-ignore
          post.map(item=>
            <div key={item.tagName} className="record-item-wrapper"> 
              <span id={item.tagName}  style={{fontWeight: 700,fontSize:'16px'}}>{item.tagName}</span>
              <ul className="record-item">
                {
                  //@ts-ignore
                  item.list.map(i=>
                    <li key={i.id} style={{listStyle:'none'}}>
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
export default tags;
export const getServerSideProps: GetServerSideProps<any,{id:string}> = async (context) => {
  const connection = await getDatabaseConnection()// 第一次链接能不能用 get
  const tagList = await connection.manager.find(Tag)
  var data:any = []
  for(let i = 0;i< tagList.length;i++){
    const found = await connection.manager.find(Post,{where:{tagId:tagList[i].id}});
    data.push({
      tagName:tagList[i].name,
      list:found
    })
  }
  return {
    props: {
      tagList:JSON.parse(JSON.stringify(tagList)),
      post:JSON.parse(JSON.stringify(data))
    }
  };
};
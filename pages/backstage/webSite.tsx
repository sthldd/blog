import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { withSession } from 'lib/withSession';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import { Tag } from 'src/entity/Tag';
import qs from 'querystring';
import {Button,message, Modal, Switch} from 'antd'
import React, {useRef, useState} from 'react';
import { useRouter } from 'next/router'
import request from 'utils/request';
type tagType ={
  tags:[{id:number,name:string}]
}

const webSite: NextPage<tagType> = (props) => {
  const router = useRouter()
  const onChange = (status:boolean) =>{
   
  }
  return(
    <>
     <Switch
          onChange={(e) => onChange(false)}
        />
    </>
  )
}

export default webSite;

export const getServerSideProps: GetServerSideProps = withSession( async (context:GetServerSidePropsContext) => {
  const connection = await getDatabaseConnection()// 第一次链接能不能用 get
  const index = context.req.url.indexOf('?')
  const search = context.req.url.substring(index+1)
  const query = qs.parse(search)
  const page = parseInt(query.page?.toString()) || 1
  const perpage = 10
  //findAndCount 找到并返回总数量
  const [tags,count] = await connection.manager.findAndCount(Tag,{skip:(page - 1) * perpage,take:perpage,order:{id:'ASC'}})
  return {
    props: {
      tags:JSON.parse(JSON.stringify(tags)),
      count,
      pageNum:page,
      perpage,
      totalPage:Math.ceil(count / page)
    }
  };
 })


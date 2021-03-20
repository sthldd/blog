import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { withSession } from 'lib/withSession';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import axios, {AxiosError, AxiosResponse} from 'axios';
import { Post } from 'src/entity/Post';
import qs from 'querystring';
import {Button, message, Modal, Table} from 'antd'
import dayjs from 'dayjs';
import {useState} from 'react';
import { useRouter } from 'next/router'
import request from '../../../utils/request';


const List: NextPage<articleType> = (props) => {
  const router = useRouter()
  const {posts} = props;
  const columns = [
    {
      title: '文章ID',
      dataIndex: 'id',
      key: 'id',
      align:'center',
    },
    {
      title: '文章名称',
      dataIndex: 'title',
      key: 'title',
      align:'center',
    },
    {
      title: '文章内容',
      dataIndex: 'content',
      key: 'content',
      width:'30%',
      align:'center',
      render: (text: string) => text.slice(0,100)
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align:'center',
        render: (text: dayjs.ConfigType) => text ? dayjs(text).format('YYYY-MM-DD HH:ss:mm') : '--'
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align:'center',
      render: (text: dayjs.ConfigType) => text ? dayjs(text).format('YYYY-MM-DD HH:ss:mm') : '--'
    },
    {
      title: '操作',
      key: 'operation',
      align:'center',
      render: (text:string, record:any) => {
          return (
              <>
                  <Button  type="primary" onClick={() => onEditItem(record.id)}>编辑</Button>
                  <Button  danger type="primary" style={{marginLeft:'10px'}} onClick={() => deleteItem(record.id)}>删除</Button>
              </>
          )
      }
    }
  ]

  const onEditItem = (id:number) =>{
    router.push(`/backstage/editOrAddArticle?id=${id}`)
  }
 
  const deleteItem = (id:number) =>{
    Modal.confirm({
      content: '确认要删除该文章吗？',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        request({
          url:`/api/v1/posts/${id}`,
          method:'delete'
        }) .then(() => {
          message.success('删除成功')
          router.reload()
        })
      }
    })
  }

  return(
    <>
      <Button type="primary" style={{marginBottom:'10px'}} onClick={()=>router.push('/backstage/editOrAddArticle')}>+添加文章</Button>
      <Table
          dataSource={posts}
          //@ts-ignore
          columns={columns}
          simple
          rowKey={record => record.id}
      />
    </>
  )
}

export default List;

export const getServerSideProps: GetServerSideProps = withSession( async (context:GetServerSidePropsContext) => {
  const connection = await getDatabaseConnection()// 第一次链接能不能用 get
  const index = context.req.url.indexOf('?')
  const search = context.req.url.substring(index+1)
  const query = qs.parse(search)
  const page = parseInt(query.page?.toString()) || 1
  const perpage = 10
  //findAndCount 找到并返回总数量
  const [posts,count] = await connection.manager.findAndCount(Post,{skip:(page - 1) * perpage,take:perpage,order:{createdAt:'DESC'}})

 
  return {
    props: {
      posts:JSON.parse(JSON.stringify(posts)),
      count,
      pageNum:page,
      perpage,
      totalPage:Math.ceil(count / page)
    }
  };
 })


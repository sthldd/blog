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


const TagsList: NextPage<articleType> = (props) => {
  const router = useRouter()
  const {posts,count,pageNum,perpage,totalPage} = props;
  const [currentItem,setCurrentItem] = useState({})

  const columns = [
    {
      title: '标签ID',
      dataIndex: 'id',
      key: 'id',
      align:'center',
    },
    {
      title: '标签名称',
      dataIndex: 'title',
      key: 'title',
      align:'center',
    },
    {
      title: '操作',
      key: 'operation',
      align:'center',
      render: (text:string, record:any) => {
          return (
              <>
                  <Button  type="primary" onClick={() => onEditItem(record.id)}>编辑</Button>
                  <Button  danger  onClick={() => deleteItem(record.id)}>删除</Button>
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
      content: '确认要删除该标签吗？',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {

      }
  })
  }

  return(
    <>
      <Button type="primary" style={{marginBottom:'10px'}} onClick={()=>router.push('/backstage/editOrAddArticle')}>+添加标签</Button>
      <Table
          dataSource={posts}
          columns={columns}
          simple
          rowKey={record => record.id}
      />
    </>
  )
}

export default TagsList;

// export const getServerSideProps: GetServerSideProps = withSession( async (context:GetServerSidePropsContext) => {
//   const connection = await getDatabaseConnection()// 第一次链接能不能用 get
//   const index = context.req.url.indexOf('?')
//   const search = context.req.url.substring(index+1)
//   const query = qs.parse(search)
//   const page = parseInt(query.page?.toString()) || 1
//   const perpage = 10
//   //findAndCount 找到并返回总数量
//   const [posts,count] = await connection.manager.findAndCount(Post,{skip:(page - 1) * perpage,take:perpage})
//   return {
//     props: {
//       posts:JSON.parse(JSON.stringify(posts)),
//       count,
//       pageNum:page,
//       perpage,
//       totalPage:Math.ceil(count / page)
//     }
//   };
//  })


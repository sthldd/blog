import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { withSession } from 'lib/withSession';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import { Tag } from 'src/entity/Tag';
import qs from 'querystring';
import {Button, Input, message, Modal, Table, Upload} from 'antd'
import React, {useRef, useState} from 'react';
import { useRouter } from 'next/router'
import request from 'utils/request';

type tagType ={
  tags:[{id:number,name:string}]
}

const TagsList: NextPage<tagType> = (props) => {
  const router = useRouter()
  const {tags} = props;
  const tagInputRef = useRef(null);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Tag>();
  const [modalType, setModalType] = useState<string>('add');

  const handleOk = () => {
    let {value} = tagInputRef.current.state
    if(!value)return message.error('请输入标签')
    if(modalType === 'add'){
      request({
        url:'/api/v1/tags',
        method:'post',
        data: {name:value}
      }) .then(() => {
        message.success('添加成功')
        setIsModalVisible(false);
        router.reload()
      })
    }else{
      request({
        url:`/api/v1/tags/${currentItem.id}`,
        method:'patch',
        data: {name:value,id:currentItem.id}
      }) .then(() => {
        message.success('更新成功')
        setIsModalVisible(false);
        router.reload()
      })
    }
  };
  const handleCancel = () => {
    setCurrentItem({id:null,name:''})
    setIsModalVisible(false);
  };
  const columns = [
    {
      title: '标签ID',
      dataIndex: 'id',
      key: 'id',
      align:'center',
    },
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      align:'center',
    },
    {
      title: '操作',
      key: 'operation',
      align:'center',
      render: (text:string, record:any) => {
          return (
              <>
                  <Button  type="primary" onClick={() => onEditItem(record)}>编辑</Button>
                  <Button  danger  type="primary" style={{marginLeft:'10px'}} onClick={() => deleteItem(record.id)}>删除</Button>
              </>
          )
      }
    }
  ]

  const onEditItem = (item:Tag) =>{
    setIsModalVisible(true);
    setModalType('edit')
    setCurrentItem(item);
  }
  const deleteItem = (id:number) =>{
    Modal.confirm({
      content: '确认要删除该标签吗？',
      cancelText: '取消',
      okText: '确定',
      onOk: () => {
        request({
          url:`/api/v1/tags/${id}`,
          method:'delete',
        }) .then(() => {
          message.success('删除成功')
          router.reload()
        })
      }
    })
  }
  return(
    <>
      <Button type="primary" style={{marginBottom:'10px'}} onClick={()=> setIsModalVisible(true)}>+添加标签</Button>
      <Table
          dataSource={tags}
          //@ts-ignore
          columns={columns}
          simple
          rowKey={record => record.id}
      />
      <Modal
        title="标签"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input placeholder="请输入标签" ref={tagInputRef} key={Math.random()} defaultValue={currentItem && currentItem.name}  />
      </Modal>
    </>
  )
}

export default TagsList;

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


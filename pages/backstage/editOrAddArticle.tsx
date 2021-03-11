import React, { useEffect, useRef, useState } from 'react';
import {Button,Form, Input, Select ,DatePicker, message} from 'antd';
import { GetServerSideProps, GetServerSidePropsContext, NextComponentType, NextPage } from 'next';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { withSession } from 'lib/withSession';
import { Post } from 'src/entity/Post';
import MarkdownIt from 'markdown-it'
import dynamic from "next/dynamic";
import hljs from 'highlight.js'
// import 'moment/locale/zh-cn';
import monent from 'moment'
// import locale from 'antd/es/date-picker/locale/zh_CN';
import { useRouter } from 'next/router'
import moment from 'moment';
import axios, { AxiosResponse } from 'axios';
const { Option } = Select;
console.log(111);
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false
});
console.log(333);
type Props = {
  post: Post;
  status:string
}

type atricleType = {
  id?:number;
  tag?:number;
  title:string;
  content:string;
  createdAt:string;
}
const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};
const tailLayout = {
  wrapperCol: { offset: 2, span: 16 },
};

const EditOrAddArticle:NextPage<Props>  = (props) =>{
  const router = useRouter()
  const editorRef = useRef(null);
  const {post:{title,createdAt,content,id},status} = props;
  const [editroVal,setEditroVal] = useState('')
  useEffect(()=>{
    if(status === 'edit' && content){
      setEditroVal(content)
    }
  },[status])
  const mdParser = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value
        } catch (__) {}
      }
      return ''
    }
  })


  const  onFinish = (values: atricleType) => {
    if(!editroVal)return message.error('请输入文章内容')
    delete values.tag
    values.createdAt = moment(values.createdAt).toISOString()
    values.content = editroVal
    if(id){
      values.id = id
    }
    postData(values)
  };

  const  postData = (values:atricleType) => {
    if(values.id){
      console.log(values,'values');
      axios.patch(`/api/v1/posts/${values.id}`, values)
      .then(() => {
        message.success('添加成功')
        router.back()
      }, (error) => {
        if (error.response) {
          const response: AxiosResponse = error.response;
          if (response.status === 422) {
            for(let key in response.data){
              if(response.data[key].length > 0){
                message.error(response.data[key][0])
              }
            }
          }
        }
      });
    }else{
      axios.post('/api/v1/posts', values)
      .then(() => {
        message.success('添加成功')
        router.back()
      }, (error) => {
        if (error.response) {
          const response: AxiosResponse = error.response;
          if (response.status === 422) {
            for(let key in response.data){
              if(response.data[key].length > 0){
                message.error(response.data[key][0])
              }
            }
          }
        }
      });
    }
  }


  const  onGenderChange = (values: any) => {
  };

  const  onFill = (values: any) => {
  };
  const  onChange = (values: any) => {
  };
  const  onOk = (values: any) => {
  };
  return(
    <Form {...layout}
      name="control-ref"
      onFinish={onFinish}
      initialValues={{ title,createdAt:createdAt && monent(createdAt)}}
    >
      <Form.Item name="title" label="名称" rules={[{ required: true }]}>
        <Input allowClear placeholder="请输入文章标题"/>
      </Form.Item>
      <Form.Item name="tag" label="分类" rules={[{ required: false }]}>
          <Select
            placeholder="请选择文章标签"
            onChange={onGenderChange}
            allowClear
          >
            <Option value="male">male</Option>
          </Select>
        </Form.Item>
        <Form.Item name="createdAt" label="发布时间" rules={[{ required: true }]}>
          <DatePicker   showTime onChange={onChange} onOk={onOk} />
        </Form.Item>
        <Form.Item  label="文章" rules={[{ required: true }]}>
          <MdEditor
            value={editroVal}
            style={{ height: "70vh" }}
            onChange={({ html, text }) => setEditroVal(text)}
            renderHTML={text => mdParser.render(text)}
            ref={editorRef}
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" onClick={()=>router.back()}>
            取消
          </Button>
          <Button type="primary" style={{marginLeft:'10px'}} htmlType="submit" onClick={onFill}>
           确定
          </Button>
        </Form.Item>
    </Form>
  )
}

export default EditOrAddArticle;

export const getServerSideProps: GetServerSideProps = withSession( async (context:GetServerSidePropsContext) => {
  const connection = await getDatabaseConnection()// 第一次链接能不能用 get
  let post
  if(context.query.id){
   post = await connection.manager.findOne(Post,Number(context.query.id))
  }
  return {
    props: {
      post:JSON.parse(JSON.stringify(post || {})),
      status:context.query.id ? 'edit' : 'add'
    }
  };
 })

import React, { useEffect, useRef, useState } from 'react';
import {Button,Form, Input, Select ,DatePicker, message, Upload} from 'antd';
import { GetServerSideProps, GetServerSidePropsContext, NextComponentType, NextPage } from 'next';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { withSession } from 'lib/withSession';
import { Post } from 'src/entity/Post';
import MarkdownIt from 'markdown-it'
import dynamic from "next/dynamic";
import hljs from 'highlight.js'
import emoji from 'markdown-it-emoji'
//@ts-ignore
import subscript from 'markdown-it-sub'
//@ts-ignore
import superscript from 'markdown-it-sup'
//@ts-ignore
import footnote from 'markdown-it-footnote'
//@ts-ignore
import deflist from 'markdown-it-deflist'
//@ts-ignore
import abbreviation from 'markdown-it-abbr'
//@ts-ignore
import insert from 'markdown-it-ins'
//@ts-ignore
import mark from 'markdown-it-mark'
//@ts-ignore
import tasklists from 'markdown-it-task-lists'
// import 'moment/locale/zh-cn';
import monent from 'moment'
// import locale from 'antd/es/date-picker/locale/zh_CN';
import { useRouter } from 'next/router'
import moment from 'moment';
import axios, { AxiosResponse } from 'axios';
import { Tag } from 'src/entity/Tag';
import request from 'utils/request';
const { Option } = Select;
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false
});
type Props = {
  post: Post;
  status:string;
  tagList:[{id:number,name:string}]
}

type atricleType = {
  id?:number;
  tagId?:number;
  title:string;
  content:string;
  htmlContent:string;
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
  const {post:{title,createdAt,content,id,tagId},status,tagList} = props;
  const [editroVal,setEditroVal] = useState<any>('')
  const [editroHtmlVal,setEditroHtmlVal] = useState<string>('')
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
  }).use(emoji)
  .use(subscript)
  .use(superscript)
  .use(footnote)
  .use(deflist)
  .use(abbreviation)
  .use(insert)
  .use(mark)
  .use(tasklists)


  const  onFinish = (values: atricleType) => {
    if(!editroVal)return message.error('请输入文章内容')
    values.createdAt = moment(values.createdAt).toISOString()
    values.content = editroVal
    values.htmlContent = editroHtmlVal
    if(id){
      values.id = id
    }
    postData(values)
  };

  const  postData = (values:atricleType) => {
    if(values.id){
      request({
        url:`/api/v1/posts/${values.id}`,
        method:'patch',
        data: values
      }) .then(() => {
        message.success('更新成功')
        router.back()
      })
    }else{
      request({
        url:'/api/v1/posts',
        method:'post',
        data: values
      }) .then(() => {
        message.success('添加成功')
        //router.back()
      })
    }
  }

  const handleImageUpload = (file: File): Promise<string> => {
    return new Promise(resolve => {
      const formData = new FormData();
		  formData.append('file', file);
      axios.post('/api/v1/uploadImg', formData)
      .then((res) => {
        resolve(res.data.url);
        message.success('上传成功')
      }, (error) => {
        if (error.response) {
          message.error('上传图片出错了')
        }
      });
    });
  };
  const setVal = (event:any) =>{
    setEditroVal(event.text)
    setEditroHtmlVal(event.html)
  }
  return(
    <Form {...layout}
      name="control-ref"
      onFinish={onFinish}
      initialValues={{ title,createdAt:createdAt && monent(createdAt),tagId}}
    >
      <Form.Item name="title" label="名称" rules={[{ required: true }]}>
        <Input allowClear placeholder="请输入文章标题"/>
      </Form.Item>
      <Form.Item name="tagId" label="分类" rules={[{ required: true }]}>
          <Select
            placeholder="请选择文章标签"
            allowClear
          >
            {
              tagList && tagList.length > 0 && tagList.map(item=><Option value={item.id} key={item.id}>{item.name}</Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item name="createdAt" label="发布时间" rules={[{ required: true }]}>
          <DatePicker   showTime/>
        </Form.Item>
        <Form.Item  label="文章" rules={[{ required: true }]}>
          <MdEditor
            value={editroVal}
            style={{ height: "70vh" }}
            //@ts-ignore
            onChange={setVal}
            config={{
              view: {
                menu: true,
                md: true,
                html: true,
                fullScreen: true,
                hideMenu: true,
              },
            }}
            onImageUpload={handleImageUpload}
            renderHTML={(text: string) => mdParser.render(text)}
            ref={editorRef}
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary"  onClick={()=>router.back()}>
            取消
          </Button>
          <Button type="primary" style={{marginLeft:'10px'}} htmlType="submit">
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
  let tag = await connection.manager.find(Tag)
  if(context.query.id){
   post = await connection.manager.findOne(Post,Number(context.query.id))
  }
  return {
    props: {
      tagList:JSON.parse(JSON.stringify(tag)),
      post:JSON.parse(JSON.stringify(post || {})),
      status:context.query.id ? 'edit' : 'add'
    }
  };
 })

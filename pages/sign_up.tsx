import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import React, {useCallback, useState} from 'react';
import axios, {AxiosError, AxiosResponse} from 'axios';
import { withSession } from 'lib/withSession';
import { Input,Form,Button, message } from 'antd';
import   '../styles/sign_in.less'
import { useRouter } from 'next/router';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const SignUp: NextPage = () => {
  const initFormData =  {  username: '',password: '',passwordConfirmation: ''}
  const router = useRouter()
  const onSubmit = (formData:typeof initFormData) => {
    axios.post(`/api/v1/users`, formData)
      .then(() => {
        message.success('注册成功')
        router.push('/sign_in')
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



  return (
    <div className='login_modal_container'>
      <Form
        {...layout}
        name="basic"
        onFinish={onSubmit}
      >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Password"
        name="passwordConfirmation"
        rules={[{ required: true, message: '请重复输入密码' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          注册
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default SignUp;

export const getServerSideProps: GetServerSideProps = withSession( async (context:GetServerSidePropsContext) => {
  //@ts-ignore
   const user = context.req.session.get('currentUser') //获取浏览器 application 中的cookie数据 存的时候在登陆存的
   if(user){
     //@ts-ignore
    context.req.session.destroy()
   }
   return {
     props:{
       user:null
     }
   }
 })
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import {useCallback, useState} from 'react';
import axios, {AxiosError, AxiosResponse} from 'axios';
import { withSession } from 'lib/withSession';
import { User } from '../src/entity/User';
import { useForm } from 'hooks/useForm';
import { Form, Input, Button, message } from 'antd';
import   '../styles/sign_in.less'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const SignIn: NextPage<{user:User}> = (props) => {

  const onSubmit =(formData:typeof initFormData) => {
    axios.post(`/api/v1/sessions`, formData)
      .then(() => {
        message.success('登陆成功')
        window.location.reload()
      }, (error) => {
        if (error.response) {
          const response: AxiosResponse = error.response;
          if (response.status === 422) {
            for(let key in response.data){
              if(response.data[key].length > 0){
                message.error(response.data[key][0])
              }
            }
            setErrors(response.data);
          }
        }
      });
  }

  const initFormData =  {  username: '1234',password: '567',}
  const {form,setErrors} = useForm({
      initFormData,
      fields:[
        {label:'用户名',type:'text',key:'username'},
        {label:'密码',type:'password',key:'password'}
      ],
      onSubmit,
      buttons:<button type="submit">登陆</button>
    }
  )

  return (
    props.user ? <div>当前登陆用户：{props.user.username}
    </div>:
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

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          登陆
        </Button>
      </Form.Item>
    </Form>
  </div>
  );
};

export default SignIn;
export const getServerSideProps: GetServerSideProps = withSession( async (context:GetServerSidePropsContext) => {
 //@ts-ignore
  const user = context.req.session.get('currentUser') //获取浏览器 application 中的cookie数据 存的时候在登陆存的
  return {
    props:{
      user:user ? JSON.parse(JSON.stringify(user)) : null
    }
  }
})
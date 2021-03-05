import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import {useCallback, useState} from 'react';
import axios, {AxiosError, AxiosResponse} from 'axios';
import { withSession } from 'lib/withSession';
import { Session } from 'inspector';
import { User } from '../src/entity/User';
import { useForm } from 'hooks/useForm';

const SignIn: NextPage<{user:User}> = (props) => {

  const onSubmit =(formData:typeof initFormData) => {
    axios.post(`/api/v1/sessions`, formData)
      .then(() => {
        window.alert('登陆成功')
        window.location.reload()
      }, (error) => {
        if (error.response) {
          const response: AxiosResponse = error.response;
          if (response.status === 422) {
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
    <>
    {
      props.user ? <div>
        当前登陆用户：{props.user.username}
      </div> : <>
      <h1>登陆</h1>
      {form}
      </>
    }
    </>
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
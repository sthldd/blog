import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import {useCallback, useState} from 'react';
import axios, {AxiosError, AxiosResponse} from 'axios';
import { useForm } from 'hooks/useForm';
import { withSession } from 'lib/withSession';

const SignUp: NextPage = () => {

  const onSubmit = (formData:typeof initFormData) => {
    axios.post(`/api/v1/users`, formData)
      .then(() => {
        window.alert('注册成功')
        window.location.href = '/sign_in'
      }, (error) => {
        if (error.response) {
          const response: AxiosResponse = error.response;
          if (response.status === 422) {
            setErrors(response.data);
          }
        }
      });
  }

  const initFormData =  {  username: '1234',password: '567',passwordConfirmation: '567'}
  const {form,setErrors} = useForm({
      initFormData,
      fields:[
        {label:'用户名',type:'text',key:'username'},
        {label:'密码',type:'password',key:'password'},
        {label:'确认密码',type:'password',key:'passwordConfirmation'}
      ],
      onSubmit,
      buttons:<button type="submit">注册</button>
    }
  )

  return (
    <>
      <h1>注册</h1>
      {form}
    </>
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
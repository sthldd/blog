import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import {useCallback, useState} from 'react';
import axios, {AxiosError, AxiosResponse} from 'axios';
import { withSession } from 'lib/withSession';
import { Session } from 'inspector';
import { User } from '../src/entity/User';
import { Form } from '../components/Form';

const SignIn: NextPage<{user:User}> = (props) => {
  const [formData, setFormData] = useState({
    username: '1234',
    password: '567',
  });
  const [errors, setErrors] = useState({
    username: [], password: []
  });
  const onSubmit = useCallback((e) => {
    e.preventDefault();
    axios.post(`/api/v1/sessions`, formData)
      .then(() => {
      }, (error) => {
        if (error.response) {
          const response: AxiosResponse = error.response;
          if (response.status === 422) {
            setErrors(response.data);
          }
        }
      });
  }, [formData]);

  const onchange = useCallback((key,value)=>{
    setFormData({
      ...formData,
      [key]: value
    })
  },[formData])
  return (
    <>
    {
      props.user ? <div>
        当前登陆用户：{props.user.username}
      </div> : <>
      <h1>登陆</h1>
      <Form fields={[
        {label:'用户名',type:'text',value:formData.username,onchange:e => onchange('username',e.target.value),
          errors:errors.username
        },
        {label:'密码',type:'password',value:formData.password,onchange:e => onchange('password',e.target.value),
          errors:errors.password
        }
      ]}
        onSubmit={onSubmit}
        buttons={
          <>
            <button type="submit">登陆</button>
          </>
        }
      />
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
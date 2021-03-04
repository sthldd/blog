import axios, { AxiosResponse } from 'axios';
import {GetStaticProps, NextPage} from 'next';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { Form } from '../../components/Form';

const PostsNew: NextPage = (props) => {
  const [errors, setErrors] = useState({
    title: [], content: []
  });
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const onchange = useCallback((key,value)=>{
    setFormData({
      ...formData,
      [key]: value
    })
  },[formData])
  const onSubmit = useCallback((e) => {
    e.preventDefault();
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
  }, [formData]);
  return (
    <div>
      <h1>文章</h1>
      <Form fields={[
        {label:'标题',type:'text',value:formData.title,onchange:e => onchange('title',e.target.value),
        errors:errors.title
        },
        {label:'内容',type:'textarea',value:formData.content,onchange:e => onchange('content',e.target.value),
        errors:errors.content
        }
      ]}
        onSubmit={onSubmit}
        buttons={
          <>
            <button type="submit">添加文章</button>
          </>
        }
      />
    </div>
  );
};

export default PostsNew;


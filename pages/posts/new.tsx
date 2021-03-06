import axios, { AxiosResponse } from 'axios';
import {GetStaticProps, NextPage} from 'next';
import { useForm } from '../../hooks/useForm';

const PostsNew: NextPage = (props) => {
  const onSubmit = (formData:typeof initFormData) => {
    //我们通过 typeof 操作符获取 initFormData 变量的类型并赋值给 formData 类型变量，之后我们就可以使用 formData 类型
    axios.post(`/api/v1/posts`, formData)
      .then(() => {
        window.alert('添加成功')
        window.location.href = '/posts'
      }, (error) => {
        if (error.response) {
          const response: AxiosResponse = error.response;
          if (response.status === 422) {
            setErrors(response.data);
          }
        }
      });
  }

  const initFormData =  {title:'',content:''}
  const {form,setErrors} = useForm({
      initFormData,
      fields:[
        {label:'标题',type:'text',key:'title'},
        {label:'内容',type:'textarea',key:'content'}
      ],
      onSubmit,
      buttons:<button type="submit">提交</button>
    }
  )
  return (
    <div>
      <h1>文章</h1>
      {form}
    </div>
  );
};

export default PostsNew;


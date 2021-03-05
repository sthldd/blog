import {ReactChild, useCallback, useState} from 'react';

type Field<T> = {
  label:string,
  type:'text' | 'textarea' | 'password',
  key:keyof T,
}

type useFromOptions<T> = {
  initFormData:T;
  fields:Field<T>[];
  onSubmit:(fd:T)=>void;
  buttons:ReactChild;
}
export function useForm<T>(options:useFromOptions<T>){ //useForm的data有个类型 就是initFormData的类型 不知道要传的什么类型参数 T就是占位符 useForm<T>的T就是声明T 占的就是initFormData的位
  const {initFormData,fields,onSubmit,buttons} = options
  const [formData,setFormData] = useState(initFormData)
  const [errors,setErrors] = useState(()=>{
    var e:{[key in keyof T]?:string[]} = {}  //声明的是 {user:['11']} 这种类型 ?代表我现在没有 等会可能会有
    for(let key in initFormData){
      if(initFormData.hasOwnProperty(key)){
        e[key] = []
      }
    }
    return e
  })

  const onchange = useCallback((key:keyof T,value:any)=>{
    setFormData({
      ...formData,
      [key]: value
    })
  },[formData])

  const _onsubmit = useCallback((e) =>{
    e.preventDefault();
    onSubmit(formData)
  },[onSubmit,formData])
  const form = (
    <form onSubmit={_onsubmit}>
    {fields.map((field,index)=>
      <div key={index}>
        <label>
          {field.label}
          {field.type === 'textarea' ? <textarea  onChange={(e)=>onchange(field.key,e.target.value)} value={formData[field.key].toString()}></textarea> : <input type={field.type} value={formData[field.key].toString()} onChange={(e)=>onchange(field.key,e.target.value)}/>}
        </label>
        {errors[field.key]?.length > 0 && <div>
          {errors[field.key].join(',')}
          </div>}
      </div>
    )}
    <div>{buttons}</div>
  </form>
  )

  return {
    form:form,
    setErrors:setErrors
  }
}
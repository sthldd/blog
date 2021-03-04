import { ChangeEventHandler, FormEventHandler, ReactChild } from "react"

type Props = {
  fields:{
    label:string,
    type:'text' | 'textarea' | 'password',
    value:string | number,
    onchange:ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    errors:string[],
  }[],
  onSubmit:FormEventHandler<HTMLFormElement>,
  buttons:ReactChild
}

export const Form:React.FC<Props> = (props) =>{
  return(
    <form onSubmit={props.onSubmit}>
      {props.fields.map(field=>
        <div>
          <label>
            {field.label}
            {field.type === 'textarea' ? <textarea  onChange={field.onchange}>{field.value}</textarea> : <input type={field.type} value={field.value} onChange={field.onchange}/>}
          </label>
          {field.errors?.length > 0 && <div>
            {field.errors.join(',')}
            </div>}
        </div>
      )}
      <div>{props.buttons}</div>
    </form>
  )
}
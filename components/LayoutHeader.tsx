import { Layout, Menu } from 'antd';
const { Header  } = Layout


export const LayoutHeader:React.FC= (props) =>{
  return(
    <Header className='layout_header'>
      <div className="header_title">LIFE IS A FUCKING MOVIE</div>
    </Header>
  )
}
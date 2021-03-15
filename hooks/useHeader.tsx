import { NextPage} from 'next';
import React, {useState} from 'react';
import Link from 'next/link';
import '../styles/home.less'

const PageHeader: NextPage = () => {
  const [activeIndex,setActiveIndex] = useState<number>(1)
  const hrefList =[
    {title:'首页',index:1,href:'/'},
    {title:'归档',index:2,href:'/'},
    {title:'关于',index:3,href:'/'},
  ]

  const clickHandle = (index:typeof activeIndex) =>{
    setActiveIndex(index)
  }
  return (
      <header>
        <h1>文章列表</h1>
        <div className="nav-menu">
          {
            hrefList.map(item=>{
              return(
                <Link href={item.href} key={item.index}>
                    <span  className="nav-menu-item" onClick={()=>clickHandle(item.index)}>{item.title}</span>
                </Link>
              )
            })
          }
        </div>
      </header>
  );
};
export default PageHeader;


import { NextPage} from 'next';
import React, {useState} from 'react';
import Link from 'next/link';
import '../styles/home.less'
import image from '../next-env';

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
        <Link href={'/'}><img src="/title.png" /></Link>
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


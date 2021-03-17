import {GetServerSideProps, NextPage} from 'next';
import React, {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import qs from 'querystring';
import '../styles/home.less'
import dayjs from 'dayjs';
import { usePager } from 'hooks/usePager';
import PageHeader from 'hooks/useHeader';
import ReactAudioPlayer from 'react-audio-player';

const Index: NextPage<articleType> = (props) => {
  const {posts,page,totalPage} = props;
  const {pager} = usePager({page, totalPage});
  const [audioStatus,setAudioStatus] = useState<boolean>(true)
  useEffect(() => {
    window.addEventListener('click', handleScroll);
    return () => window.removeEventListener('click', handleScroll);
  });
  const handleScroll = () => {
    if(audioRef && audioRef.audioEl){
      audioRef.audioEl.current.play()
    }
  }
  let audioRef = useRef<HTMLInputElement>()
  // (formData:typeof initFormData) 我们通过 typeof 操作符获取 initFormData 变量的类型并赋值给 formData 类型变量，之后我们就可以使用 formData 类型
  const audioHandle = () =>{
    if(audioStatus){
      setAudioStatus(false)
      audioRef.audioEl.current.pause()
    }else{
      setAudioStatus(true)
      audioRef.audioEl.current.play()
    }
  }
  return (
    <div className="container">
      <PageHeader />
      <div className={`logo-wrapper ${audioStatus ? 'play-music' : 'pause-music'}`} onClick={audioHandle}>
        <img src="/music.svg" alt="" className="music-logo"/>
      </div>
      <ul>
      {
        posts.map(item=>{
          return(
            <li  className="article-item" id={item.id}>
              <Link  key={item.id} href={`/posts/${item.id}`}><h1 className="article-title">{item.title}</h1></Link>
              <div className="article-time"><img src="/time.png" alt=""/>{dayjs(item.createdAt).format('YYYY-MM-DD HH:ss:mm')}</div>
              <p className="article-content">{item.content}</p>
            </li>
          )
        })
      }
      </ul>
      <div>
        <ReactAudioPlayer
          id="musicplayer"
          ref={(element) => { audioRef = element; }}
          src="https://sthl-1256208836.cos.ap-shanghai.myqcloud.com/%E8%AE%B8%E5%B5%A9%20-%20%E5%8D%97%E5%B1%B1%E5%BF%86.mp3"
          autoPlay
          />
      </div>
      <footer>
        {pager}
      </footer>
    </div>
  );
};
export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const connection = await getDatabaseConnection()// 第一次链接能不能用 get
  const index = context.req.url.indexOf('?')
  const search = context.req.url.substring(index+1)
  const query = qs.parse(search)
  const page = parseInt(query.page?.toString()) || 1
  const perpage = 3
  //findAndCount 找到并返回总数量
  const [posts,count] = await connection.manager.findAndCount(Post,{skip:(page - 1) * perpage,take:perpage})
  for(let i = 0;i<posts.length;i++){
    posts[i].content = posts[i].content.slice(0,200)
  }
  return {
    props: {
      posts:JSON.parse(JSON.stringify(posts)),
      count,
      page,
      perpage,
      totalPage:Math.ceil(count / perpage)
    }
  };
};
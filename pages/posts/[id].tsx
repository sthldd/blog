import React, { useEffect, useRef, useState } from 'react';
import {GetServerSideProps, NextPage} from 'next';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import PageHeader from 'hooks/useHeader';
import dayjs from 'dayjs';
import ReactAudioPlayer from 'react-audio-player';

var musicList = [
  'https://sthl-1256208836.cos.ap-shanghai.myqcloud.com/music/%E8%AE%B8%E5%B5%A9%20-%20%E5%8D%97%E5%B1%B1%E5%BF%86.mp3',
]
//'https://sthl-1256208836.cos.ap-shanghai.myqcloud.com/music/Ed%20Harcourt%20-%20Like%20Sunday%2C%20Like%20Rain%20%28mp3cut%20%28mp3cut.net%29.mp3'
type Props = {
  post: Post
}
const postsShow: NextPage<Props> = (props) => {
  const {post} = props;
  const [audioStatus,setAudioStatus] = useState<boolean>(true)
  const [currentSrcIndex,setCurrentSrcIndex] = useState<number>(0)
  let audioRef = useRef<HTMLInputElement>()


  useEffect(() => {
    window.addEventListener('click', handleScroll);
    return () => window.removeEventListener('click', handleScroll);
  });
  const handleScroll = () => {
    //@ts-ignore
    controlAudio(true)
    setAudioStatus(true)
  }
  //@ts-ignore
  const audioHandle = (e) =>{
    e.stopPropagation();
    if(audioStatus){
      setAudioStatus(false)
      //@ts-ignore
      controlAudio(false)
    }else{
      setAudioStatus(true)
      //@ts-ignore
      controlAudio(true)
    }
  }

  const controlAudio = (val:boolean) =>{
    //@ts-ignore
    if(audioRef && audioRef.audioEl ){
      if(val){
        //@ts-ignore
        audioRef.audioEl.current.play()
      }else{
        //@ts-ignore
        audioRef.audioEl.current.pause()
      }
    }
  }

  //@ts-ignore
  const onEnded = (e) =>{
      setAudioStatus(false)
      controlAudio(false)
    // if(currentSrcIndex === 0){
    //   setCurrentSrcIndex(1)
    // }else{
    //   setCurrentSrcIndex(0)
    //   setAudioStatus(false)
    //   controlAudio(false)
    // }
  }
  return (
    <div  className="container">
      <PageHeader />
      <div className="article-title-wrapper">
        <h1>{post.title}</h1>
        <div className="logo-wrapper" onClick={(e)=>audioHandle(e)}>
            <img src="/music.svg" alt=""  className={`music-logo ${audioStatus ? 'play-music' : 'pause-music'}`} />
        </div>
      </div>
      <div className="article-time" style={{marginBottom:'10px'}}><img src="/time.png" alt=""/>{dayjs(post.createdAt).format('YYYY-MM-DD HH:ss:mm')}</div>
      <div className="custom-html-style" dangerouslySetInnerHTML = {{ __html: post.htmlContent }}></div>
      <ReactAudioPlayer
        id="musicplayer"
        //@ts-ignore
        controls
        ref={(element) => { audioRef = element; }}
        src={musicList[currentSrcIndex]}
        autoPlay
        onEnded={onEnded}
      />
    </div>
  );
};
export default postsShow;
export const getServerSideProps: GetServerSideProps<any,{id:string}> = async (context) => {
  const connection = await getDatabaseConnection()// 第一次链接能不能用 get
  const post = await connection.manager.findOne(Post,context.params.id)
  return {
    props: {
      post:JSON.parse(JSON.stringify(post))
    }
  };
};
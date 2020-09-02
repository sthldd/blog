import axios from 'axios';
import React,{useEffect,useState} from 'react';


export  const  usePosts = () =>{
    const [posts,setPosts] = useState<Post[]>([])
    useEffect(()=>{
        axios.get('api/v1/posts').then(res=>{
            setPosts(res.data)
        })
    },[])
    return {posts,setPosts}
}

import {NextPage} from 'next';
import React  from 'react';
import {getPosts} from '../../lib/posts';

type Props = {
    posts:Post[]
}

const PostsIndex:NextPage<Props> = (props) =>{
    const {posts} = props
    return (
        <div>
            {
                posts.map((item,index)=>
                        <li key={item.id}>{item.title}</li>
                )
            }
        </div>
    )
}
export default  PostsIndex

export const getStaticProps = async () =>{  //next语法 getStaticProps 固定返回props
    const result = await getPosts()
    return{
        props:{
            posts:JSON.parse(JSON.stringify(result))
        }
    }
}

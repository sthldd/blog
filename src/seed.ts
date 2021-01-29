import "reflect-metadata";
import {createConnection} from "typeorm";
import { Post } from "./entity/Post";

createConnection().then(async connection => {
    let {manager} = connection
    const posts = await manager.find(Post) //引入post 进行操作 posts表里的内容
    if(posts.length === 0){
        await manager.save([1,2,3,4,5,6,7,8,9,10].map(n=>{
            return new Post({title:`post${n}`,content:`这是第${n}篇`})
        }))
    }
    connection.close()
}).catch(error => console.log(error));

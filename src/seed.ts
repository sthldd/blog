import "reflect-metadata";
import {createConnection} from "typeorm";
//import { Curses } from "./entity/Curses";
import { User } from "./entity/User";
import { Post } from './entity/Post';
import { Comment } from './entity/Comment';
createConnection().then(async connection => {

    let {manager} = connection

    const u1 = new User()
    u1.username = 'maliang'
    u1.passwordDigest = '123'
    await manager.save(u1)


    const p1 = new Post()
    p1.title = 'post1'
    p1.content = '第一篇文章'
    p1.author = u1
    await manager.save(p1)

    const c1 = new Comment()
    c1.user = u1
    c1.post = p1
    c1.content = 'Awesome'
    await manager.save(c1)
    await connection.close()







    // const posts = await manager.find(Curses) //引入post 进行操作 posts表里的内容
    // console.log(posts,'posts')
    // await manager.save(arr.map(n=>{
    //     return new Curses({content:`${n}`})
    // }))
    // connection.close()
}).catch(error => console.log(error));

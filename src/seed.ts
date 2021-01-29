import "reflect-metadata";
import {createConnection} from "typeorm";
// import { Curses } from "./entity/Curses";
createConnection().then(async connection => {

    // let {manager} = connection
    // const posts = await manager.find(Curses) //引入post 进行操作 posts表里的内容
    // console.log(posts,'posts')
    // if(posts.length === 0){
    //     await manager.save(arr.map(n=>{
    //         return new Curses({content:`${n}`})
    //     }))
    // }
    connection.close()
}).catch(error => console.log(error));

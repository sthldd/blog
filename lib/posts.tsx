import path from "path";
import fs, {promises as fsPromises} from "fs";
import matter from 'gray-matter';

export const getPosts = async () =>{
    const markDownDir = path.join(process.cwd(),'markdown')  //process.cwd() 当前的目录  用path.join来适配mac或者win 找到markdown文件夹
    const fileNames = await fsPromises.readdir(markDownDir) //同步读取markdown所有子文件
    const result = fileNames.map(fileName=>{
        const fullPath = path.join(markDownDir,fileName)
        var id = fileName.replace(/\.md$/g,'')
        const text = fs.readFileSync(fullPath,'utf-8') //以utf8的格式来读取文件内容
        const {data:{title,date},content} =  matter(text)
        return {
            id,title,date,content
        }
    })
    return result
};

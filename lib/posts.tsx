import path from 'path';
import matter from 'gray-matter';
import fs, {promises as fsPromise} from 'fs';
import marked from 'marked';

const markdownDir = path.join(process.cwd(), 'markdown');

export const getPosts = async () => {
  const fileNames = await fsPromise.readdir(markdownDir);
  const posts = fileNames.map(fileName => {
    const fullPath = path.join(markdownDir, fileName);
    const id = fileName.replace(/\.md$/g, '');
    const text = fs.readFileSync(fullPath, 'utf-8');
    // const {data, content} = matter(text)
    // const {title, date} = data
    const {data: {title, date}, content} = matter(text);
    return {
      id, title, date
    };
  });
  return posts;
};

export const getPost = async (id: string) => {
  const fullPath = path.join(markdownDir, id + '.md');
  const text = fs.readFileSync(fullPath, 'utf-8');
  const {data: {title, date}, content} = matter(text);
  const htmlContent = marked(content);
  return JSON.parse(JSON.stringify({
    id, title, date, content, htmlContent
  }));
};


export const getPostIds = async () => {
  const fileNames = await fsPromise.readdir(markdownDir);
  return fileNames.map(fileName => fileName.replace(/\.md$/g, ''));
};

// export const getPosts = async () =>{
//     const markDownDir = path.join(process.cwd(),'markdown')  //process.cwd() 当前的目录  用path.join来适配mac或者win 找到markdown文件夹
//     const fileNames = await fsPromises.readdir(markDownDir) //同步读取markdown所有子文件
//     const result = fileNames.map(fileName=>{
//         const fullPath = path.join(markDownDir,fileName)
//         var id = fileName.replace(/\.md$/g,'')
//         const text = fs.readFileSync(fullPath,'utf-8') //以utf8的格式来读取文件内容
//         const {data:{title,date},content} =  matter(text)
//         return {
//             id,title,date,content
//         }
//     })
//     return result
// };

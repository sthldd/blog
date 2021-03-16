import React from 'react';
import {GetServerSideProps, NextPage} from 'next';
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { Post } from 'src/entity/Post';
import PageHeader from 'hooks/useHeader';
import dynamic from "next/dynamic";
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false
});
import dayjs from 'dayjs';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js'
import emoji from 'markdown-it-emoji'
//@ts-ignore
import subscript from 'markdown-it-sub'
//@ts-ignore
import superscript from 'markdown-it-sup'
//@ts-ignore
import footnote from 'markdown-it-footnote'
//@ts-ignore
import deflist from 'markdown-it-deflist'
//@ts-ignore
import abbreviation from 'markdown-it-abbr'
//@ts-ignore
import insert from 'markdown-it-ins'
//@ts-ignore
import mark from 'markdown-it-mark'
//@ts-ignore
import tasklists from 'markdown-it-task-lists'
type Props = {
  post: Post
}
const postsShow: NextPage<Props> = (props) => {
  const {post} = props;
  const mdParser = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value
        } catch (__) {}
      }
      return ''
    }
  }).use(emoji)
  .use(subscript)
  .use(superscript)
  .use(footnote)
  .use(deflist)
  .use(abbreviation)
  .use(insert)
  .use(mark)
  .use(tasklists)
  return (
    <div  className="container">
      <PageHeader />
      <h1>{post.title}</h1>
      <div className="article-time" style={{marginBottom:'10px'}}><img src="/time.png" alt=""/>{dayjs(post.createdAt).format('YYYY-MM-DD HH:ss:mm')}</div>
      <MdEditor
            value={post.content}
            config={{
              view: {
                menu: false,
                md: false,
                html: true,
                fullScreen: true,
                hideMenu: false,
              },
            }}
            renderHTML={(text: string)=> mdParser.render(text)}
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
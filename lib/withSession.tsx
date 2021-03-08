import { NextApiHandler, GetServerSideProps } from 'next';
import  {withIronSession} from 'next-iron-session'

export function withSession(handler:NextApiHandler | GetServerSideProps) {
    //@ts-ignore
  return withIronSession(handler, {
    // password: process.env.SECRET_COOKIE_PASSWORD,
    // 可以把密码放到本机上 export SECRET = 密码  然后用 process.env.SECRET来获取  next.js 用.env.local文件来存储
    password: process.env.SECRET, //应该是文件加密  
    cookieName: 'blog', //cookie的名字
    cookieOptions: {
      secure:false,//secure 是只有在https下才生效 开发环境false
    },
  })
}
import { NextApiHandler } from 'next'
import  {withIronSession} from 'next-iron-session'

export function withSession(handler:NextApiHandler) {
  return withIronSession(handler, {
    // password: process.env.SECRET_COOKIE_PASSWORD,
    password: '6513b707-cf12-4d00-9364-4f7034309749', //应该是文件加密
    cookieName: 'blog', //cookie的名字
    cookieOptions: {
      secure:false,//secure 是只有在https下才生效 开发环境false
    },
  })
}
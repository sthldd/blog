import { NextApiHandler } from 'next';
import * as next from 'next'
/// <reference types="next" />
/// <reference types="next/types/global" />
declare module "*.png" {
    const image: string;
    export default image;
}
type Post  = {
    id:string;
    title:string;
    date:string;
    content:string;
}

declare module 'next'{
    import { Session } from 'next-iron-session';
    interface NextApiHandler{
        session:Session
    }
}
import { NextApiHandler } from 'next';
import * as next from 'next'
/// <reference types="next" />
/// <reference types="next/types/global" />
declare module "*.png" {
    const image: string;
    export default image;
}


declare module 'next'{
    import { Session } from 'next-iron-session';
    interface NextApiHandler{
        session:Session
    }
}
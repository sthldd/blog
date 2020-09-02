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

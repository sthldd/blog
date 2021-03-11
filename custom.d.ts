type Post  = {
  id:string;
  title:string;
  date:string;
  content:string;
  createdAt:string
}

type articleType = {
  posts:Post[],
  count:number,
  pageNum:number,
  perpage:number,
  totalPage:number,
}

type articleItemType = {
  id: number,
  title: string,
  content: string,
  authorId: number,
  createdAt: Date,
  updatedAt: Date,
  author: number,
  comments:string
}
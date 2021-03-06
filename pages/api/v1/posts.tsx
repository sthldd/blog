
import {NextApiHandler} from 'next';
import {Post} from '../../../src/entity/Post';
import {getDatabaseConnection} from '../../../lib/getDatabaseConnection';
import {withSession} from '../../../lib/withSession';

//@ts-ignore
const Posts: NextApiHandler = withSession(async (req, res) => {
  if (req.method === 'POST') {
    const {title, content,id,tagId,htmlContent} = req.body;
    const post = new Post();
    post.title = title;
    post.content = content;
    post.tagId = tagId;
    post.htmlContent = htmlContent;
    const user = req.session.get('currentUser');
    if(!user){
      res.statusCode = 401
      res.end()
    }
    post.author = user;
    const connection = await getDatabaseConnection();
    await connection.manager.save(post);
    res.json(post);
  }
});
export default Posts;
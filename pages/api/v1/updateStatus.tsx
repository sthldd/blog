import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { withSession } from 'lib/withSession';
import {NextApiHandler} from 'next';

//@ts-ignore
const UpdateStatus: NextApiHandler = withSession(async (req, res) => {
  if (req.method === 'PATCH') {
    const connection = await getDatabaseConnection();
    const {id,status} = req.body;
    const post = await connection.manager.findOne<Post>('Post', id);
    post.status = status;
    const user = req.session.get('currentUser');
    if (!user) {
      res.statusCode = 401;
      res.end();
      return;
    }
    await connection.manager.save(post);
    res.json(post);
  }

});
export default UpdateStatus;
import { getDatabaseConnection } from 'lib/getDatabaseConnection';
import { withSession } from 'lib/withSession';
import {NextApiHandler} from 'next';


const Tags: NextApiHandler = withSession(async (req, res) => {
  if (req.method === 'PATCH') {
    const connection = await getDatabaseConnection();
    const {name, id} = req.body;
    const tag = await connection.manager.findOne<Tag>('Tag', id);
    tag.name = name;
    const user = req.session.get('currentUser');
    if (!user) {
      res.statusCode = 401;
      res.end();
      return;
    }
    await connection.manager.save(tag);
    res.json(tag);
  } else if (req.method === 'DELETE') {
    const id = req.query.id.toString();
    const connection = await getDatabaseConnection();
    const result = await connection.manager.delete('Tag', id);
    res.statusCode = result.affected >= 0 ? 200 : 400;
    res.end();
  }

});
export default Tags;

import {NextApiHandler} from 'next';
import {Tag} from '../../../src/entity/Tag';
import {getDatabaseConnection} from '../../../lib/getDatabaseConnection';
import {withSession} from '../../../lib/withSession';

//@ts-ignore
const Tags: NextApiHandler = withSession(async (req, res) => {
  if (req.method === 'POST') {
    const {name} = req.body;
    const tag = new Tag();
    tag.name = name;
    const user = req.session.get('currentUser');
    if(!user){
      res.statusCode = 401
      res.end()
    }
    const connection = await getDatabaseConnection();
    await connection.manager.save(tag);
    res.json(tag);
  }
});
export default Tags;
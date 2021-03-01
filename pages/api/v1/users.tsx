import {NextApiHandler} from 'next';
import { User } from 'src/entity/User';
import {getDatabaseConnection} from 'lib/getDatabaseConnection';


// unique 可以保证username不重复 但是需要同步数据库功能开启 ormconfig 的 synchronize

const Users: NextApiHandler = async (req, res) => {
  let {  username, password, passwordConfirmation} = req.body
  const connection = await getDatabaseConnection()
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const user = new User()
  user.username = username.trim()
  user.password = password
  user.passwordConfirmation = passwordConfirmation
  await user.validata()
  // const found = await connection.manager.find(
  //   User, {username: username});
  // if (found.length > 0) {
  //   res.statusCode = 422 //无法处理的实体 语法和数据都对 但是我就是接受不了 
  //   res.write(JSON.stringify({...user.errors,password:['密码重复了']}))
  // }
  if(await user.hasErrors()){
    res.statusCode = 422 //无法处理的实体 语法和数据都对 但是我就是接受不了 
    res.write(JSON.stringify(user.errors))
  }else{
    await connection.manager.save(user)
    res.statusCode = 200
    res.write(JSON.stringify(user))
  }
  res.end();
};
export default Users;
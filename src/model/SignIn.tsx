import { getDatabaseConnection } from "lib/getDatabaseConnection";
import md5 from "md5";
import { User } from "src/entity/User";

export class SignIn{
  username:string;
  password:string;
  user:User;
  errors = {username:[] as string[],password:[] as string[]};
  async validate(){
    const connection = await getDatabaseConnection()
    if (this.username.trim() === '') {
      this.errors.username.push('不能为空');
    }
    const user = await connection.manager.findOne(User,{where:{username:this.username}})
    this.user = user
    if(user){
      if(user.passwordDigest !==  md5(this.password)){
        this.errors.password.push('密码不匹配')
      }
    }else{
      this.errors.username.push('用户不存在');
    }
  }
  hasErrors() {
    return !!Object.values(this.errors).find(v => v.length > 0);
  }
}
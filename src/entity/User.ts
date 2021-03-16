import {BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Post} from './Post'
import {Comment} from './Comment'
import md5 from 'md5'
import _ from 'lodash'

@Entity('users') //实体关联表
export class User {
  @PrimaryGeneratedColumn('increment') //主要的被创建的colunm
  id:string;
  @Column('varchar')
  username:string;
  @Column('varchar')
  passwordDigest:string;
  @CreateDateColumn()
  createdAt:Date;
  @UpdateDateColumn()
  updatedAt:Date;
  @OneToMany('Post','author') //一个user有多个文章
  posts:Post[]
  @OneToMany('Comment','user') //一个user有多个评论
  comments:Comment[];
  errors = {
    username: [] as string[],
    password: [] as string[],
    passwordConfirmation: [] as string[]
  };
  password: string;
  passwordConfirmation: string;
  async validata(){
    if (this.username.trim() === '') {
      this.errors.username.push('不能为空');
    }
    if (!/[a-zA-Z0-9]/.test(this.username.trim())) {
      this.errors.username.push('格式不合法');
    }
    if (this.username.trim().length > 42) {
      this.errors.username.push('太长');
    }
    if (this.username.trim().length <= 3) {
      this.errors.username.push('太短');
    }
    if (this.password === '') {
      this.errors.password.push('不能为空');
    }
    if (this.password !== this.passwordConfirmation) {
      this.errors.passwordConfirmation.push('密码不匹配');
    }
  }
  hasErrors() {
    return !!Object.values(this.errors).find(v => v.length > 0);
  }

  @BeforeInsert() //插入数据库之前  BeforeUpdate()
  generatePasswordDigest(){
    this.passwordDigest = md5(this.password)
  }
  toJSON(){
    return _.omit(this,['password', 'passwordConfirmation','passwordDigest','errors'])
  }
}

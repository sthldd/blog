import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Post} from './Post'
import {Comment} from './Comment'

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
  @OneToMany(type => Post,post => post.author) //一个user有多个文章
  posts:Post[]
  @OneToMany(type => Comment,comment => comment.user) //一个user有多个评论
  comments:Comment[]
}

import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { User } from "./User";
import {Post} from './Post'

@Entity('comments') //实体关联表
export class Comment {
  @PrimaryGeneratedColumn('increment') //主要的被创建的colunm
  id:string;
  @Column('text')
  content:string;
  @ManyToOne('User','comments') //很多评论会对应一个user
  user:User;
  @ManyToOne('Post','comments') //很多评论对应一篇文章
  post:Post;
  @CreateDateColumn()
  createdAt:Date;
  @UpdateDateColumn()
  updatedAt:Date;
}

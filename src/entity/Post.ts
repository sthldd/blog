import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity('posts') //实体关联表
export class Post {
  @PrimaryGeneratedColumn('increment') //主要的被创建的colunm
  id:number;
  @Column('varchar')
  title: string;
  @Column('text')
  content:string;
  @Column('int')
  authorId:number;
  @CreateDateColumn()
  createdAt:Date;
  @UpdateDateColumn()
  updatedAt:Date;
  @ManyToOne(type => User,user => user.posts) //很多文章会对应一个user
  author:User;
  @OneToMany(type => Comment,comment => comment.post) //一片文章很多个评论
  comments:Comment[];
}

import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('tags')
export class Tag {
  //修饰器来对应数据库和js id比较特殊 是自增并主键
  //数据库主键，指的是一个列或多列的组合，其值能唯一地标识表中的每一行，通过它可强制表的实体完整性。主键主要是用与其他表的外键关联，以及本记录的修改与删除
  @PrimaryGeneratedColumn('increment')
  id:number;
  @Column('varchar')
  name:string;
}
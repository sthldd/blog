import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddCreateAtAndUpdateAt1611909393683 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('users',[
            new TableColumn({name:'createdAt',type:'time',isNullable:false,default:'now()'}),
            new TableColumn({name:'updatedAt',type:'time',isNullable:false,default:'now()'})
        ])
        await queryRunner.addColumns('posts',[
            new TableColumn({name:'createdAt',type:'time',isNullable:false,default:'now()'}),
            new TableColumn({name:'updatedAt',type:'time',isNullable:false,default:'now()'})
        ])
        await queryRunner.addColumns('comments',[
            new TableColumn({name:'createdAt',type:'time',isNullable:false,default:'now()'}),
            new TableColumn({name:'updatedAt',type:'time',isNullable:false,default:'now()'})
        ])
        await queryRunner.addColumns('curses',[
            new TableColumn({name:'createdAt',type:'time',isNullable:false,default:'now()'}),
            new TableColumn({name:'updatedAt',type:'time',isNullable:false,default:'now()'})
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users','createdAt');
        await queryRunner.dropColumn('users','updatedAt');
        await queryRunner.dropColumn('posts','createdAt');
        await queryRunner.dropColumn('posts','updatedAt');
        await queryRunner.dropColumn('comments','createdAt');
        await queryRunner.dropColumn('comments','updatedAt');
        await queryRunner.dropColumn('curses','createdAt');
        await queryRunner.dropColumn('curses','updatedAt');
    }

}

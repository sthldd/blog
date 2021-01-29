import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreatePosts1611906425048 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(new Table({
            name:'posts',
            columns:[
                {name:'id',isGenerated:true,type:'int',generationStrategy:'increment',isPrimary:true},
                {name:'title',type:'varchar'},
                {name:'content',type:'text'},
                {name:'author_id',type:'int'},
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('posts')
    }
}

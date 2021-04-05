import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreatePosts1611906425048 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        return await queryRunner.createTable(new Table({
            name:'posts',
            columns:[
                {name:'id',isGenerated:true,type:'int',generationStrategy:'increment',isPrimary:true},
                {name:'title',type:'varchar'},
                {name:'content',type:'text'},
                {name:'htmlContent',type:'text'},
                {name:'author_id',type:'int'},
                {name:'tagId',type:'int'},
                {name:'status',type:'boolean',default:false},
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        return await queryRunner.dropTable('posts')
    }
}

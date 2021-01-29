import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateComments1611906468603 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(new Table({
            name:'comments',
            columns:[
                {name:'id',isGenerated:true,type:'int',generationStrategy:'increment',isPrimary:true},
                {name:'user_id',type:'int'},
                {name:'post_id',type:'int'},
                {name:'content',type:'text'},
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('comments')
    }

}


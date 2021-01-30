import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCurses1611906587163 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        return await queryRunner.createTable(new Table({
            name:'curses',
            columns:[
                {name:'id',isGenerated:true,type:'int',generationStrategy:'increment',isPrimary:true},
                {name:'content',type:'text'},
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       return await queryRunner.dropTable('curses')
    }
}

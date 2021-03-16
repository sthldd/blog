import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateTags1615886915973 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        return await queryRunner.createTable(new Table({
            name:'tags',
            columns:[
                {name:'id',isGenerated:true,type:'int',generationStrategy:'increment',isPrimary:true},
                {name:'name',type:'text'},
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        return await queryRunner.dropTable('tags')
    }

}

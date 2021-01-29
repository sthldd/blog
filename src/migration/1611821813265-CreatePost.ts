import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreatePost1611821813265 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
       //升级数据库  isPrimary - 主键   isGenerated - 自动创建 generationStrategy - 自增长
        return await queryRunner.createTable(new Table({
          name: 'posts',
          columns: [{
            name: 'id', type: 'int', isPrimary: true, isGenerated: true,
            generationStrategy: 'increment'
          }, {
            name: 'title', type: 'varchar'
          }, {
            name: 'content', type: 'text'
          }]
        }));
      }

      public async down(queryRunner: QueryRunner): Promise<void> {
        // 降级数据库
        return await queryRunner.dropTable('posts');
      }
}
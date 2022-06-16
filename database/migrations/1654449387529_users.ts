import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('first_name', 255).nullable()
      table.string('last_name', 255).nullable()
      table.string('email', 255).notNullable()
      table.tinyint('email_verified').nullable()
      table.string('password', 180).notNullable()
      table.date('date_of_birth').nullable()
      table.string('image_url', 255).nullable()
      table.tinyint('is_enabled').nullable()
      table.tinyint('is_deleted').nullable()
      table.text('json_config').nullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('first_name', 255).nullable()
      table.string('last_name', 255).nullable()
      table.string('email', 255).notNullable()
      table.string('password', 180).notNullable()
      table.timestamp('date_of_birth').nullable()
      table.string('image_url', 255).nullable()
      table.text('json_config').nullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

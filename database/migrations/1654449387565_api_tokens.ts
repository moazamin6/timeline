import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ApiTokens extends BaseSchema {
  protected tableName = 'api_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('token', 200).notNullable().unique()
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('expires_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

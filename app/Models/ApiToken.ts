import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ApiToken extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({columnName: 'user_id'})
  public user_id: string

  @column({columnName: 'token'})
  public token: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime()
  public expires_at: DateTime
}

import {DateTime} from 'luxon'
import {BaseModel, beforeSave, column} from '@ioc:Adonis/Lucid/Orm'
import Hash from "@ioc:Adonis/Core/Hash";

export default class User extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column({columnName: 'first_name'})
  public first_name: string

  @column({columnName: 'last_name'})
  public last_name: string

  @column()
  public email: string

  @column({serializeAs: null})
  public password: string

  @column({columnName: 'date_of_birth'})
  public date_of_birth: DateTime

  @column({columnName: 'image_url'})
  public image_url: string

  @column.dateTime({autoCreate: true})
  public created_at: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updated_at: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}

import {DateTime} from 'luxon'
import {BaseModel, beforeSave, column} from '@ioc:Adonis/Lucid/Orm'
import Hash from "@ioc:Adonis/Core/Hash";
import Database from "@ioc:Adonis/Lucid/Database";

export default class User extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column({columnName: 'first_name'})
  public first_name: string

  @column({columnName: 'last_name'})
  public last_name: string

  @column()
  public email: string

  @column({columnName: 'is_email_verified'})
  public is_email_verified: number

  @column({serializeAs: null})
  public password: string

  @column({columnName: 'date_of_birth'})
  public date_of_birth: DateTime

  @column({columnName: 'image_url'})
  public image_url: string

  @column({columnName: 'is_enabled'})
  public is_enabled: number

  @column({columnName: 'is_deleted'})
  public is_deleted: number

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

  public static async updateEmailVerificationStatus(user_id, status) {

    return Database
      .from('users')
      .returning('id')
      .where('id', user_id)
      .update({is_email_verified: status})
  }

  public static async getUserByUserId(user_id) {

    return Database.from('users').where('id', user_id).first()
  }
}

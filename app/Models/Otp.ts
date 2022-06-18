import {DateTime} from 'luxon'
import {BaseModel, column} from '@ioc:Adonis/Lucid/Orm'
import Database from "@ioc:Adonis/Lucid/Database";

export default class Otp extends BaseModel {

  public static async addOtpCode(user_id, otp_code) {

    return Database
      .table('otp')
      .returning('id')
      .insert({
        user_id: user_id,
        otp_code: otp_code,
        is_used: 0
      });
  }

  public static async getOtp(otp_id, otp_code) {

    return Database.from('otp').where('id', 'like', otp_id).andWhere('otp_code', 'like', otp_code).first()
  }


  public static async deleteOtp(otp_id) {

    return Database
      .from('otp')
      .where('id', otp_id)
      .delete()
  }
}

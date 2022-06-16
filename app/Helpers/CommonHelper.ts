import {DateTime} from 'luxon'
import {BaseModel, beforeSave, column} from '@ioc:Adonis/Lucid/Orm'
import Hash from "@ioc:Adonis/Core/Hash";

export default class CommonHelper {

  public static async generateToken(user_id) {

    const chars1 = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ%&1234567890aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ%&1234567890'
    let token = ''
    let charactersLength = chars1.length

    for (let i = 0; i < charactersLength; i++) {
      token += chars1.charAt(Math.floor(Math.random() * charactersLength));
    }

    token = token.substring(0, 50);
    const hash = await Hash.make(user_id.toString())
    return `${token}.${hash}`
  }
}

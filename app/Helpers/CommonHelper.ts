import Hash from "@ioc:Adonis/Core/Hash";
import Mail from "@ioc:Adonis/Addons/Mail";

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

  public static async sendEmail(from: string, to: string, subject: string, template: string, data: object) {

    await Mail.send((message) => {
      message.from(from)
        .to(to)
        .subject(subject)
        .htmlView(template, data)
    })
  }
}

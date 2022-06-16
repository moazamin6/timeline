import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseController from "App/Controllers/Http/BaseController";
import User from "App/Models/User";
import CreateUserValidator from "App/Validators/CreateUserValidator";
import Application from "@ioc:Adonis/Core/Application";
import Database from "@ioc:Adonis/Lucid/Database";
import Hash from "@ioc:Adonis/Core/Hash";
import CommonHelper from "App/Helpers/CommonHelper";
import Mail from "@ioc:Adonis/Addons/Mail";

export default class LoginController extends BaseController {

  constructor() {
    super();
  }

  public async login(ctx: HttpContextContract) {

    const email = ctx.request.input('email')
    const password = ctx.request.input('password')

    const user = await Database.from('users').where('email', email).first()

    if (user) {

      if (!(await Hash.verify(user.password, password))) {

        ctx.response.status(200)
        return {
          status: false,
          message: 'Please login using valid credentials'
        }
      }

      const authToken = await CommonHelper.generateToken(user.id);

      // Delete old token
      await Database
        .from('api_tokens')
        .where('user_id', user.id)
        .delete()

      //
      await Database
        .table('api_tokens')
        .returning(['id', 'user_id'])
        .insert({
          user_id: user.id,
          token: authToken,
        })

      let image_url = process.env.BASE_API_URL + 'v1/image/' + user.image_url
      const userInfo = {
        user_id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        full_name: user.first_name + ' ' + user.last_name,
        email: user.email,
        date_of_birth: user.date_of_birth,
        image_url: image_url,
        authToken: authToken
      }
      return {
        status: true,
        message: 'User logged in successfully',
        data: {
          userInfo: userInfo
        }
      }

    } else {

      ctx.response.status(200)
      return {
        status: false,
        message: 'User not found please check your credentials'
      }
    }
  }

  public async register(ctx) {

    await Mail.send((message) => {
      message
        .from('moazamin6@gmail.com')
        .to('moaz@vfairs.com')
        .subject('Welcome Onboard!')
        .htmlView('emails/otp', { name: 'Virk' })
    })
    return 111
    const userData = ctx.request.body()

    await ctx.request.validate(CreateUserValidator)

    const user = await User.create({
      first_name: userData['first_name'],
      last_name: userData['last_name'],
      email: userData['email'],
      password: userData['password'],
      date_of_birth: userData['date_of_birth'],
      is_enabled: 1,
      is_deleted: 0,
    })

    if (user) {

      const image_url = ctx.request.file('image_url')
      if (image_url) {

        const file_name = 'profile_image_' + Date.now() + '.' + image_url.extname;
        image_url.move(Application.publicPath('image_assets'), {overwrite: true, name: file_name})
        await Database
          .from('users')
          .where('id', user.id)
          .update({image_url: file_name})
      }

      await Mail.send((message) => {
        message
          .from('moazamin6@gmail.com')
          .to('moaz@vfairs.com')
          .subject('Welcome Onboard!')
          .htmlView('emails/otp', { name: 'Virk' })
      })
      ctx.response.status(201)
      return {
        status: true,
        message: 'User created successfully'
      }
    } else {

      return {
        status: false,
        message: 'Something went wrong when creating user'
      }
    }
  }
}

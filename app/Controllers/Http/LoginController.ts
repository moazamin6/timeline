import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseController from "App/Controllers/Http/BaseController";
import User from "App/Models/User";
import CreateUserValidator from "App/Validators/CreateUserValidator";
import Application from "@ioc:Adonis/Core/Application";
import Database from "@ioc:Adonis/Lucid/Database";

export default class LoginController extends BaseController {

  constructor() {
    super();
  }

  public async login({request, response}: HttpContextContract) {

    const email = request.input('email')
    const password = request.input('password')
  }

  //@ts-ignore
  public async register(ctx) {

    const userData = ctx.request.body()

    await ctx.request.validate(CreateUserValidator)

    const user = await User.create({
      first_name: userData['first_name'],
      last_name: userData['last_name'],
      email: userData['email'],
      password: userData['password'],
      date_of_birth: userData['date_of_birth'],
    })

    if (user) {

      const image_url = ctx.request.file('image_url')
      if (image_url) {

        const file_name = 'profile_image_' + Date.now() + '.' + image_url.extname;
        // return file_name;
        image_url.move(Application.publicPath('image_assets'), {overwrite: true, name: file_name})
        await Database
          .from('users')
          .where('id', user.id)
          .update({image_url: file_name})
      }

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

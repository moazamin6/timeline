import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseController from "App/Controllers/Http/BaseController";
import User from "App/Models/User";
import CreateUserValidator from "App/Validators/CreateUserValidator";

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

    const payload = await ctx.request.validate(CreateUserValidator)

    const data = await User.create({
      first_name: userData['first_name'],
      last_name: userData['last_name'],
      email: userData['email'],
      password: userData['password'],
      date_of_birth: userData['date_of_birth'],
      image_url: userData['image_url'],
    })

    return payload;

    if (data) {
      const res = {
        status : true,
        message : 'User created successfully',
      }

      ctx.response.status(201)
      return res;
    }

  }

}

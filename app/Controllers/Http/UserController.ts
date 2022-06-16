import BaseController from "App/Controllers/Http/BaseController";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class UserController extends BaseController {

  public async list(ctx: HttpContextContract) {

    const users = await Database.from('users')
    return users;
  }
}

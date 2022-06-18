import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import BaseController from "App/Controllers/Http/BaseController";
import User from "App/Models/User";
import CreateUserValidator from "App/Validators/CreateUserValidator";
import Application from "@ioc:Adonis/Core/Application";
import Database from "@ioc:Adonis/Lucid/Database";
import Hash from "@ioc:Adonis/Core/Hash";
import CommonHelper from "App/Helpers/CommonHelper";
import Otp from "App/Models/Otp";

export default class LoginController extends BaseController {

  constructor() {
    super();
  }

  public async login(ctx: HttpContextContract) {

    const email = ctx.request.input('email', '')
    const password = ctx.request.input('password', '')

    if (email == '' || password == '') {

      ctx.response.status(422)
      return {
        status: false,
        message: 'Please provide valid email and password'
      }
    }
    const user = await Database.from('users').where('email', email).first()

    if (user) {

      if (user.is_email_verified == 0) {

        ctx.response.status(422)
        return {
          status: false,
          message: 'Email is not verified.',
          data: {
            email: user.email,
            user_id: user.id
          }
        }
      }
      if (!(await Hash.verify(user.password, password))) {

        ctx.response.status(422)
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
        is_email_verified: user.is_email_verified,
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
        message: 'Please login using valid credentials'
      }
    }
  }

  public async register(ctx: HttpContextContract) {

    const userData = ctx.request.body()

    try {

      await ctx.request.validate(CreateUserValidator)
    } catch (error) {

      ctx.response.status(422)
      return {

        status: false,
        message: error.messages.errors[0].message,
        'errors': error.messages.errors
      }
    }

    const user = await User.create({
      first_name: userData['first_name'],
      last_name: userData['last_name'],
      email: userData['email'],
      password: userData['password'],
      date_of_birth: userData['date_of_birth'],
      is_email_verified: 0,
      is_enabled: 1,
      is_deleted: 0,
    })

    if (user) {

      const image_url = ctx.request.file('image_url')
      if (image_url) {

        const file_name = 'profile_image_' + Date.now() + '.' + image_url.extname;
        await image_url.move(Application.publicPath('image_assets'), {overwrite: true, name: file_name})
        await Database
          .from('users')
          .where('id', user.id)
          .update({image_url: file_name})
      }

      const otp_code = Math.floor(1000 + Math.random() * 9000);
      const otp_id = await Otp.addOtpCode(user.id, otp_code);

      await CommonHelper.sendEmail('moazamin6@gmail.com', user.email, 'OTP Verification Email', 'emails/otp', {
        name: `${user.first_name} ${user.last_name}`,
        otp: otp_code
      })
      ctx.response.status(201)
      return {
        status: true,
        message: 'User created successfully. Please check your email for OTP to verify email address.',
        data: {
          otp_id: otp_id[0],
          otp_code: otp_code
        }
      }
    } else {

      return {
        status: false,
        message: 'Something went wrong when creating user'
      }
    }
  }

  public async verifyEmailViaOtp(ctx: HttpContextContract) {

    const otp_id = ctx.request.input('otp_id', 0)
    const otp_code = ctx.request.input('otp_code', 0)

    if (otp_id == 0 || otp_code == 0) {

      ctx.response.status(422)
      return {
        status: false,
        message: 'Please provide valid otp_id and otp_code'
      }
    }

    const otp_data = await Otp.getOtp(otp_id, otp_code)

    if (otp_data) {

      User.updateEmailVerificationStatus(otp_data.user_id, 1)
      Otp.deleteOtp(otp_id)
      ctx.response.status(200)
      return {
        status: true,
        message: 'Email verified successfully'
      }
    } else {

      ctx.response.status(422)
      return {
        status: false,
        message: 'Otp mismatch'
      }
    }
  }

  public async sendVerificationEmail(ctx: HttpContextContract) {

    const user_id = ctx.request.input('user_id', 0)

    if (user_id == 0) {

      ctx.response.status(422)
      return {
        status: false,
        message: 'Please provide valid user_id'
      }
    }

    const user = await User.getUserByUserId(user_id)

    if (user) {

      const otp_code = Math.floor(1000 + Math.random() * 9000);
      const otp_id = await Otp.addOtpCode(user.id, otp_code);

      await CommonHelper.sendEmail('moazamin6@gmail.com', user.email, 'OTP Verification Email', 'emails/otp', {
        name: `${user.first_name} ${user.last_name}`,
        otp: otp_code
      })

      ctx.response.status(200)
      return {
        status: true,
        message: `OTP sent to ${user.email}.`,
        data: {
          otp_id: otp_id[0],
          otp_code: otp_code
        }
      }
    } else {

      ctx.response.status(422)
      return {
        status: false,
        message: `User not found`,
      }
    }

  }
}

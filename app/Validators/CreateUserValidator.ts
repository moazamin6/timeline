import {schema, CustomMessages, rules} from '@ioc:Adonis/Core/Validator'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    first_name: schema.string(),
    last_name: schema.string(),
    email: schema.string([
      rules.email(),
      rules.unique({table: 'users', column: 'email', caseInsensitive: true})
    ]),
    password: schema.string([
      rules.confirmed('password_confirmed')
    ]),

    date_of_birth: schema.string(),

    image_url: schema.file.optional({
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png'],
    }),
  })

  public messages: CustomMessages = {
    'first_name.required': 'First Name is required',

    'last_name.required': 'Last Name is required',

    'email.required': 'Email is required',
    'email.email': 'Please provide valid email',
    'email.unique': 'User already exist with this email',

    'password.required': 'Password is required',
    'password_confirmed.confirmed': 'Please confirm your password',

    'date_of_birth.required': 'Date of Birth is required',

    'image_url.file': 'Image'
  }
}

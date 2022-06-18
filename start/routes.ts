import Route from '@ioc:Adonis/Core/Route'
import Application from "@ioc:Adonis/Core/Application";

Route.group(() => {

  Route.post('/user/login', 'LoginController.login')
  Route.post('/user/register', 'LoginController.register')
  Route.get('image/:fileName', 'HelperController.getFile')
  Route.get('/user/list', 'UserController.list')
  Route.post('/user/login/verify-email-via-otp', 'LoginController.verifyEmailViaOtp')

  Route.post('/user/login/send-verification-email', 'LoginController.sendVerificationEmail')
}).prefix('/v1')

Route.get('/', async () => {

  return {message: 'This is AdonisJs Application with runner'}
})


Route.post('/file', async ({request}) => {

  const coverImage = request.file('cover_image')
  // return coverImage?.toJSON()
  if (coverImage) {
    // return coverImage.tmpPath;
    return coverImage.move(Application.tmpPath('uploads'), {overwrite: true})
  }

  return {hello: Application.tmpPath('')}
})

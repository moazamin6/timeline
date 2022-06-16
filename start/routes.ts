/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Application from "@ioc:Adonis/Core/Application";

Route.group(() => {

  Route.post('/user/login', 'LoginController.login')
  Route.post('/user/register', 'LoginController.register')

  Route.get('image/:fileName', 'HelperController.getFile')

  Route.get('/user/list', 'UserController.list')
}).prefix('/v1')

Route.get('/', async () => {

  return {hello: Application.publicPath()}
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

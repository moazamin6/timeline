import BaseController from "App/Controllers/Http/BaseController";
import Application from "@ioc:Adonis/Core/Application";

export default class HelperController extends BaseController {

  public async getFile({params, response}) {

    const filePath = `image_assets/${params.fileName}`;
    return response.download(Application.publicPath(filePath));
  }
}

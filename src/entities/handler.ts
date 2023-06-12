import { IDataService, IParser, IPreloadService } from '../interfaces/services';
import { ControllerClass, DataServiceClass, ParserClass, PreloadClass } from '../types/classes';
import { Reflector } from './reflector';
import { SendMailOptions, Transporter } from 'nodemailer';
import { Coroutine } from '@evgenii-shcherbakov/coroutine';

export abstract class Handler<Params, Data, Event extends string = string> {
  private configs: SendMailOptions[] = [];
  private readonly controllers: ControllerClass<IDataService<Data, Event>>[] = [];

  constructor(
    private readonly parserClass: ParserClass<Params>,
    private readonly preloadServiceClass: PreloadClass<Params, Data>,
    private readonly dataServiceClass: DataServiceClass<Data, Event>,
    private readonly transport: Transporter,
  ) {}

  protected getConfigs(): SendMailOptions[] {
    return this.configs;
  }

  setControllers(
    ...controllers: ControllerClass<IDataService<Data, Event>>[]
  ): Handler<Params, Data, Event> {
    this.controllers.push(...controllers);
    return this;
  }

  async handle(event: any) {
    const parser: IParser<Params> = new this.parserClass(event);
    const preloadService: IPreloadService<Params, Data> = new this.preloadServiceClass();

    preloadService.setParams(parser.parse(event));

    const data: Data = await preloadService.load();

    this.onInit(data);

    const dataService: IDataService<Data> = new this.dataServiceClass(data);
    this.configs = await new Reflector(dataService, this.controllers).buildConfigs();

    this.onRender(dataService);

    await Coroutine.asyncArr(this.configs, async (config: SendMailOptions) => {
      await this.transport.sendMail(config);
    });

    this.onStop();
  }

  protected onInit(data: Data) {}

  protected onRender(dataService: IDataService<Data>) {}

  protected onStop() {}
}

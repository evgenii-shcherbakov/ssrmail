import 'reflect-metadata';
import { SendMailOptions } from 'nodemailer';
import { ControllerClass } from '../types/classes';
import { IController } from '../interfaces/controllers';
import { IDataService } from '../interfaces/services';
import { Coroutine } from '@evgenii-shcherbakov/coroutine';
import { MetadataKey } from '../constants/enums';
import { ControllerMetadata } from '../types/metadata';

export class Reflector<Data, Event extends string> {
  private sendEmailConfigs: SendMailOptions[] = [];

  constructor(
    private readonly dataService: IDataService<Data, Event>,
    private readonly controllers: ControllerClass<IDataService<Data, Event>>[],
  ) {}

  async buildConfigs(): Promise<SendMailOptions[]> {
    const event: Event = this.dataService.getEvent();

    await Coroutine.asyncArr(
      this.controllers,
      async (Controller: ControllerClass<IDataService<Data, Event>>) => {
        const controllerInstance: IController = new Controller(this.dataService);

        const metadata: ControllerMetadata<Event> | undefined = Reflect.getMetadata(
          MetadataKey.EVENT,
          Controller,
        );

        if (!(metadata?.events || []).includes(event)) return;

        this.sendEmailConfigs.push(...(await controllerInstance.getConfigs()));
      },
    );

    if (!this.sendEmailConfigs.length) {
      throw new Error('Send email config not provided');
    }

    return this.sendEmailConfigs;
  }
}

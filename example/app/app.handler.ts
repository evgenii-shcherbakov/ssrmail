import { createTransport } from 'nodemailer';
import { IDataService, EmailHandler } from '../../src';
import { EventEnum } from '../constants/enums';
import { Data, Params } from '../types/data';
import { ParseService } from '../services/parse.service';
import { PreloadService } from '../services/preload.service';
import { DataService } from '../services/data.service';

export class AppHandler extends EmailHandler<Params, Data, EventEnum> {
  constructor() {
    super(
      ParseService,
      PreloadService,
      DataService,
      createTransport({
        streamTransport: true,
        newline: 'windows',
      }),
    );
  }

  protected onInit(data: any) {
    console.log('onInit');
    console.log('data', data);
  }

  protected onRender(dataService: IDataService<Data, EventEnum>) {
    console.log('onRender');
    console.log('dataService', dataService);
  }

  protected onStop() {
    console.log('onStop');
    console.log('built configs', this.getConfigs());
  }
}

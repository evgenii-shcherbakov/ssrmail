import { IDataService, IParser, IPreloadService } from '../interfaces/services';
import { IController } from '../interfaces/controllers';

export type ControllerClass<DataService> = new (dataService: DataService) => IController;

export type ParserClass<Params> = new (event: any) => IParser<Params>;

export type PreloadClass<Params, Data> = new () => IPreloadService<Params, Data>;

export type DataServiceClass<Data, Event extends string = string> = new (
  data: Data,
) => IDataService<Data, Event>;

export interface IParser<Params> {
  parse(event: any): Params;
}

export interface IPreloadService<Params, Data> {
  setParams(params: Params): IPreloadService<Params, Data>;
  load(): Promise<Data>;
}

export interface IDataService<Data, Event extends string = string> {
  getData(): Data;
  getEvent(): Event;
}

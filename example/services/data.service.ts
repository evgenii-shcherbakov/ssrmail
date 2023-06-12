import { IDataService } from '../../src';
import { Data, Todo } from '../types/data';
import { EventEnum } from '../constants/enums';

export class DataService implements IDataService<Data, EventEnum> {
  constructor(private readonly data: Data) {}

  getData(): Data {
    return this.data;
  }

  getEvent(): EventEnum {
    return this.data.event;
  }

  getId(): string {
    return this.data.entity.id;
  }

  getPath(): string {
    return this.data.entity.path;
  }

  getIds(): string[] {
    return this.data.ids;
  }

  getTodos(): Todo[] {
    return this.data.entity.todos;
  }
}

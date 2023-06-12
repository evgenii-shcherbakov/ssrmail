import { IPreloadService } from '../../src';
import { Data, Params } from '../types/data';

export class PreloadService implements IPreloadService<Params, Data> {
  private params: Params | undefined;

  async load(): Promise<Data> {
    if (!this.params) {
      throw new Error();
    }

    return Promise.resolve({
      event: this.params.event,
      ids: this.params.ids ?? [],
      entity: {
        id: this.params.id,
        message: this.params.message,
        path: `${this.params.event}/${this.params.id}/${this.params.message}`,
        todos: this.params.todos ?? [],
      },
    });
  }

  setParams(params: Params): IPreloadService<Params, Data> {
    this.params = params;
    return this;
  }
}

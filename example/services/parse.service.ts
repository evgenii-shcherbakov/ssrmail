import { IParser } from '../../src';
import { Params } from '../types/data';
import { EventEnum } from '../constants/enums';

export class ParseService implements IParser<Params> {
  parse(event: any): Params {
    const parsed: Record<string, any> = JSON.parse(event ?? {});

    return {
      event: parsed['event'] ?? EventEnum.SINGLE,
      id: parsed['id'] ?? '123',
      message: parsed['message'] ?? 'Hello!',
      ids: parsed['ids'],
      todos: parsed['todos'],
    };
  }
}

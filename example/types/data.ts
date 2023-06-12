import { EventEnum } from '../constants/enums';

export type Params = {
  event: EventEnum;
  id: string;
  message: string;
  ids?: string[];
  todos?: Todo[];
};

export type Data = {
  event: EventEnum;
  ids: string[];
  entity: {
    id: string;
    message: string;
    path: string;
    todos: Todo[];
  };
};

export type Todo = {
  id: string;
  text: string;
  isCompleted: boolean;
};

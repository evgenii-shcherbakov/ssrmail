# ssrmail
Typescript email SSR-framework

[![npm version](https://img.shields.io/npm/v/ssrmail.svg)](https://npmjs.org/package/ssrmail)
[![npm license](https://img.shields.io/npm/l/ssrmail.svg)](https://npmjs.org/package/ssrmail)
[![npm type definitions](https://img.shields.io/npm/types/ssrmail)](https://npmjs.org/package/ssrmail)

### Install

Install ssrmail via npm

```shell
npm install ssrmail
```

Add flags `"experimentalDecorators": true` and `"emitDecoratorMetadata": true` in `tsconfig.json` file

### Setup

Declare Parser class

```typescript
import { IParser } from 'ssrmail';
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
```

Declare PreloadService class

```typescript
import { IPreloadService } from 'ssrmail';
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
```

Declare DataService class

```typescript
import { IDataService } from 'ssrmail';
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
```

Declare EmailHandler typed class

```typescript
import { createTransport } from 'nodemailer';
import { IDataService, EmailHandler } from 'ssrmail';
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
```

Then use declared AppHandler in app

```typescript
import { AppHandler } from './app/app.handler';
import { EventEnum } from './constants/enums';
import { SingleController } from './controllers/single.controller';
import { SsrController } from './controllers/ssr.controller';

(async () => {
  const handler = new AppHandler().setControllers(SingleController, SsrController);

  await handler.handle(
    `{ "event": "${EventEnum.SINGLE}", "id": "1", "message": "single-handler message", "todos": [{ "id": "1", "isCompleted": true, "text": "test todo" }, { "id": "2", "isCompleted": false, "text": "test todo 2" }] }`,
  );

  await handler.handle(
    `{ "event": "${EventEnum.SSR}", "id": "2", "message": "ssr-handler message", "ids": ["1", "2", "3"] }`,
  );
})();
```

### Usage

##### SingleEmailController

```typescript
import { EmailEvent, SingleEmailController } from 'ssrmail';
import { DataService } from '../services/data.service';
import { EMAIL_SENDER } from '../constants/common';
import { SingleNotificationView } from '../views/single/single.notification.view';
import { EventEnum } from '../constants/enums';

@EmailEvent(EventEnum.SINGLE)
export class SingleController extends SingleEmailController<DataService> {
  protected getEmails(): Promise<string[]> | string[] {
    return [`test.${this.dataService.getId()}@mail.ru`];
  }

  protected getSenderEmail(): Promise<string> | string {
    return EMAIL_SENDER;
  }

  protected getSubject(): Promise<string> | string {
    return `Single notification`;
  }

  protected renderNotification(): Promise<string> | string {
    return new SingleNotificationView(this.dataService.getData()).render();
  }
}
```

##### SSREmailController

```typescript
import { EmailEvent, SSREmailController } from 'ssrmail';
import { DataService } from '../services/data.service';
import { EMAIL_SENDER } from '../constants/common';
import { Coroutine } from '@evgenii-shcherbakov/coroutine';
import { SsrNotificationView } from '../views/ssr/ssr.notification.view';
import { EventEnum } from '../constants/enums';

@EmailEvent(EventEnum.SSR)
export class SsrController extends SSREmailController<
  DataService,
  { path: string; email: string }
> {
  protected getSenderEmail(): Promise<string> | string {
    return EMAIL_SENDER;
  }

  protected getSubject(props: { path: string; email: string }): Promise<string> | string {
    return `SSR notification for ${props.email}`;
  }

  protected preLoadProps(): Promise<{ path: string; email: string }[]> {
    return Coroutine.launchArr(this.dataService.getIds(), async (id: string) => {
      return {
        path: `entities/${id}/message`,
        email: `test+${id}@mail.ru`,
      };
    });
  }

  protected renderNotification(props: { path: string; email: string }): Promise<string> | string {
    return new SsrNotificationView({ path: props.path }).render();
  }
}
```

##### EmailNotificationView

```handlebars
<body>
  <h2>{{message}}</h2>
  <p>You was received {{event}} event with id '{{id}}' and path '{{path}}'</p>
  <ul>
    {{todos}}
  </ul>
</body>
```

```css
h2 {
    color: blue;
    font-size: 24px;
}

ul {
    padding: 1em;
}
```

```typescript
import { Data, Todo } from '../../types/data';
import { EmailView, IComponent, TemplateVars, EmailNotificationView } from 'ssrmail';
import { TodoComponentView } from './components/todo/todo.component.view';

@EmailView(__dirname)
export class SingleNotificationView extends EmailNotificationView<Data> {
  async render(): Promise<string> {
    const todosComponents: IComponent[] = await this.lazy(
      ...this.props.entity.todos.map((todo: Todo) => {
        return new TodoComponentView(todo);
      }),
    );

    const vars: TemplateVars = {
      id: this.props.entity.id,
      path: this.props.entity.path,
      event: this.props.event,
      message: this.props.entity.message,
      todos: todosComponents
        .map((todoComponent: IComponent) => todoComponent.getTemplate())
        .join(''),
    };

    return this.merge(vars, ...todosComponents);
  }
}
```

##### EmailComponentView

```handlebars
<li>
  <p>Todo</p>
  <p>id: <strong>{{id}}</strong></p>
  <p>{{text}}</p>
  <label>Completed
    <input type='checkbox' checked='{{checked}}'>
  </label>
</li>
```

```typescript
import { EmailComponentView, EmailView, TemplateVars } from 'ssrmail';
import { Todo } from '../../../../types/data';

@EmailView(__dirname)
export class TodoComponentView extends EmailComponentView<Todo> {
  protected getVars(): TemplateVars | Promise<TemplateVars> {
    return {
      id: this.props?.id ?? 'unknown',
      text: this.props?.text ?? 'unknown',
      checked: !!this.props?.isCompleted,
    };
  }
}
```

### Other

[More usage examples](example)

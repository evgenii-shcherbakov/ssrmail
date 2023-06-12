import { SingleController as SingleEmailController } from './controllers/single.controller';
import { SsrController as SSREmailController } from './controllers/ssr.controller';
import { View as EmailView } from './decorators/view.decorator';
import { Event as EmailEvent } from './decorators/event.decorator';
import { Handler as EmailHandler } from './entities/handler';
import { IController } from './interfaces/controllers';
import { IDataService, IPreloadService, IParser } from './interfaces/services';
import { IComponent, INotification } from './interfaces/views';
import { ControllerClass, DataServiceClass, PreloadClass, ParserClass } from './types/classes';
import { ControllerMetadata } from './types/metadata';
import { TemplateVars } from './types/views';
import { ComponentView as EmailComponentView } from './views/component.view';
import { NotificationView as EmailNotificationView } from './views/notification.view';

export {
  SingleEmailController,
  SSREmailController,
  EmailView,
  EmailEvent,
  EmailHandler,
  IController,
  IDataService,
  IPreloadService,
  IParser,
  IComponent,
  INotification,
  ControllerClass,
  DataServiceClass,
  PreloadClass,
  ParserClass,
  ControllerMetadata,
  TemplateVars,
  EmailComponentView,
  EmailNotificationView,
};

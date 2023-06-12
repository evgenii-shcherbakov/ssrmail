import { EmailEvent, SSREmailController } from '../../src';
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

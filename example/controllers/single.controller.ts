import { EmailEvent, SingleEmailController } from '../../src';
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

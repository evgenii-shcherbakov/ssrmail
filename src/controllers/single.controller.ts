import { BaseController } from './base.controller';
import { SendMailOptions } from 'nodemailer';
import { IController } from '../interfaces/controllers';

export abstract class SingleController<DataService>
  extends BaseController<DataService>
  implements IController
{
  protected abstract getEmails(): Promise<string[]> | string[];

  protected abstract getSubject(): Promise<string> | string;

  protected abstract renderNotification(): Promise<string> | string;

  async getConfigs(): Promise<SendMailOptions[]> {
    const emails: string[] = await this.getEmails();
    const from: string = await this.getSenderEmail();
    const subject: string = await this.getSubject();
    const html: string = await this.renderNotification();

    return [
      {
        from,
        to: emails.join(','),
        subject,
        html,
      },
    ];
  }
}

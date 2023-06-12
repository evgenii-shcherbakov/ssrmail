import { BaseController } from './base.controller';
import { IController } from '../interfaces/controllers';
import { SendMailOptions } from 'nodemailer';
import { Coroutine } from '@evgenii-shcherbakov/coroutine';

export abstract class SsrController<DataService, Props extends { email: string }>
  extends BaseController<DataService>
  implements IController
{
  protected abstract preLoadProps(): Promise<Props[]>;

  protected abstract getSubject(props: Props): Promise<string> | string;

  protected abstract renderNotification(props: Props): Promise<string> | string;

  protected getDynamicSenderEmail(_: Props): Promise<string> | string {
    return this.getSenderEmail();
  }

  async getConfigs(): Promise<SendMailOptions[]> {
    const propsArr: Props[] = await this.preLoadProps();

    return Coroutine.asyncArr(propsArr, async (props: Props) => {
      const from: string = await this.getDynamicSenderEmail(props);
      const subject: string = await this.getSubject(props);
      const html: string = await this.renderNotification(props);

      return {
        from,
        to: props.email,
        subject,
        html,
      };
    });
  }
}

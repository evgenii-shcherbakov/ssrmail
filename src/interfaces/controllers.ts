import { SendMailOptions } from 'nodemailer';

export interface IController {
  getConfigs(): Promise<SendMailOptions[]>;
}

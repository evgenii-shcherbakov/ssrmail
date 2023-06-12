import { EmailNotificationView, EmailView, TemplateVars } from '../../../src';

@EmailView(__dirname)
export class SsrNotificationView extends EmailNotificationView<{ path: string }> {
  render(): Promise<string> {
    const vars: TemplateVars = {
      path: this.props.path,
    };

    return this.merge(vars);
  }
}

import { EmailComponentView, EmailView, TemplateVars } from '../../../../../src';
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

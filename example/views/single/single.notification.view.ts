import { Data, Todo } from '../../types/data';
import { EmailView, IComponent, TemplateVars, EmailNotificationView } from '../../../src';
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

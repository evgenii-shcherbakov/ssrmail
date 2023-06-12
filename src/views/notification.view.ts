import { BaseView } from './base.view';
import { Coroutine } from '@evgenii-shcherbakov/coroutine';
import { TemplateVars } from '../types/views';
import { IComponent, INotification } from '../interfaces/views';

export abstract class NotificationView<Props = any>
  extends BaseView<Props>
  implements INotification
{
  constructor(protected readonly props: Props) {
    super(props);
  }

  protected lazy(...components: IComponent[]): Promise<IComponent[]> {
    return Coroutine.launchArr(components, async (component: IComponent) => component.preRender());
  }

  abstract render(): Promise<string>;

  protected async merge(props: TemplateVars, ...lazyComponents: IComponent[]): Promise<string> {
    const styles: string = await this.tsx(this.stylePath);

    const templateVars = {
      ...props,
      styles: lazyComponents.reduce((acc: string, lazyComponent: IComponent) => {
        return acc + lazyComponent.getStyles();
      }, styles),
    };

    return this.tsx(this.templatePath, templateVars);
  }
}

import { BaseView } from './base.view';
import { TemplateVars } from '../types/views';
import { Coroutine } from '@evgenii-shcherbakov/coroutine';
import { IComponent } from '../interfaces/views';

export abstract class ComponentView<Props extends TemplateVars = TemplateVars>
  extends BaseView<Props>
  implements IComponent
{
  protected template: string = '';
  protected styles: string = '';

  protected getVars(): TemplateVars | Promise<TemplateVars> {
    return this.props || {};
  }

  async onPreRender() {
    const [template, styles] = await Coroutine.launch(
      this.tsx(this.templatePath, await this.getVars()),
      this.tsx(this.stylePath),
    );

    this.styles = styles;
    this.template = template;
  }

  async preRender() {
    if (this.canPreRender) {
      await this.onPreRender();
    }

    return this;
  }

  protected get canPreRender(): boolean {
    return !!this.props;
  }

  getTemplate(): string {
    return this.template;
  }

  getStyles(): string {
    return this.styles;
  }
}

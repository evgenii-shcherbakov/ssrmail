import 'reflect-metadata';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { TemplateVars } from '../types/views';
import { MetadataKey } from '../constants/enums';
import { ViewMetadata } from '../types/metadata';

export abstract class BaseView<Props> {
  protected readonly metadata: ViewMetadata = Reflect.getMetadata(
    MetadataKey.VIEW,
    this['constructor'],
  );

  protected constructor(protected readonly props?: Props) {}

  protected get templatePath(): string {
    return './template.hbs';
  }

  protected get stylePath(): string {
    return './styles.css';
  }

  protected async tsx(relativePath: string, vars: TemplateVars = {}): Promise<string> {
    const path: string = join(this.metadata.directory ?? '', relativePath);

    try {
      const target: string = (await readFile(path)).toString();
      return this.injectVars(target, vars);
    } catch (error) {
      console.log(`File '${path}' not provided, use empty string instead...`);
      return '';
    }
  }

  protected injectVars(target: string, vars: TemplateVars = {}): string {
    return Object.keys(vars).reduce(
      (acc: string, variable: string) =>
        acc.replace(
          new RegExp(`{{( ?| +)${variable}( ?| +)}}`, 'gi'),
          vars[variable]?.toString() || '',
        ),
      target,
    );
  }
}

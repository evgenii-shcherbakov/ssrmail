import 'reflect-metadata';
import { MetadataKey } from '../constants/enums';
import { ViewMetadata } from '../types/metadata';

export const View = (directory: string): ClassDecorator => {
  return (target) => {
    const metadata: ViewMetadata = {
      directory,
    };

    Reflect.defineMetadata(MetadataKey.VIEW, metadata, target);
  };
};

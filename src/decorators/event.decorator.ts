import 'reflect-metadata';
import { MetadataKey } from '../constants/enums';
import { ControllerMetadata } from '../types/metadata';

export const Event = <EventType extends string = string>(
  ...events: EventType[]
): ClassDecorator => {
  return (target) => {
    const metadata: ControllerMetadata<EventType> = {
      events,
    };

    Reflect.defineMetadata(MetadataKey.EVENT, metadata, target);
  };
};

export type ControllerMetadata<Event extends string = string> = {
  events: Event[];
};

export type ViewMetadata = {
  directory?: string;
};

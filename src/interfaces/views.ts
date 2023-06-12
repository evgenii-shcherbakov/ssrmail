export interface IComponent {
  onPreRender(): Promise<void>;
  preRender(): Promise<IComponent>;
  getTemplate(): string;
  getStyles(): string;
}

export interface INotification {
  render(): Promise<string>;
}

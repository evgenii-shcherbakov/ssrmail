export abstract class BaseController<DataService> {
  constructor(protected readonly dataService: DataService) {}

  protected abstract getSenderEmail(): Promise<string> | string;
}

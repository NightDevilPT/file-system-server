export class CreateHistoryCommand {
  constructor(
    public readonly resourceId: string,
    public readonly eventName: string,
    public readonly from?: Record<string, any>,
    public readonly to?: Record<string, any>,
  ) {}
}

/* eslint-disable import/no-extraneous-dependencies */
import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

type SendEventInput = {
  time: Date;
  source: string;
  detailType: string;
  detail: any;
};

export class EventBusAdapter {
  constructor(
    private readonly eventBusName: string,
    private readonly eventBridgeClient = new EventBridgeClient({})
  ) {}

  async send(input: SendEventInput): Promise<void> {
    await this.eventBridgeClient.send(
      new PutEventsCommand({
        Entries: [
          {
            EventBusName: this.eventBusName,
            Time: input.time,
            Source: input.source,
            DetailType: input.detailType,
            Detail: JSON.stringify(input.detail),
          },
        ],
      })
    );
  }
}

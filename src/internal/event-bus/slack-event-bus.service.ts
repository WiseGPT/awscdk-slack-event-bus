import { EventBusAdapter } from "./event-bus-adapter";
import { SlackEvent } from "../slack/slack-parse-event";

function assertSlackEventPayloadUnreachable(payload: never): never {
  throw new Error(
    `unknown slack event type encountered: ${(payload as any).type}`
  );
}

export class SlackEventBusService {
  private static readonly SLACK_EVENT_BUS_NAME =
    process.env.SLACK_EVENT_BUS_NAME!;
  private static readonly SLACK_EVENT_SOURCE = "com.slack";

  constructor(
    private readonly eventBusAdapter = new EventBusAdapter(
      SlackEventBusService.SLACK_EVENT_BUS_NAME
    )
  ) {}

  async send({ payload, time }: SlackEvent): Promise<void> {
    switch (payload.type) {
      case "app_rate_limited":
        return this.eventBusAdapter.send({
          detail: payload,
          detailType: "AppRateLimited",
          source: SlackEventBusService.SLACK_EVENT_SOURCE,
          time,
        });
      case "event_callback":
        return this.eventBusAdapter.send({
          detail: payload,
          detailType: `EventCallback.${payload.event.type}`,
          source: SlackEventBusService.SLACK_EVENT_SOURCE,
          time,
        });
      case "url_verification": {
        // do not send url_verification events
        return;
      }
      default:
        assertSlackEventPayloadUnreachable(payload);
    }
  }
}

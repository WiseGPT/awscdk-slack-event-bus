import type * as Lambda from "aws-lambda";
import { HandlerContext } from "./handlers.dto";
import { SlackEventBusService } from "../event-bus/slack-event-bus.service";
import { SlackEvent } from "../slack/slack-parse-event";
import { SlackService } from "../slack/slack.service";

function assertSlackEventPayloadUnreachable(payload: never): never {
  throw new Error(
    `unknown slack event type encountered: ${(payload as any).type}`
  );
}

export class SlackEventHandlerService {
  constructor(
    private readonly slackEventBusService: SlackEventBusService = new SlackEventBusService(),
    private readonly slackService: SlackService = new SlackService()
  ) {}

  async handle(
    context: HandlerContext,
    event: Lambda.APIGatewayProxyEventV2
  ): Promise<Lambda.APIGatewayProxyStructuredResultV2> {
    const slackEvent = await this.verifyAndParseSlackEvent(context, event);
    const { payload } = slackEvent;

    switch (payload.type) {
      case "url_verification": {
        return {
          statusCode: 200,
          body: JSON.stringify({ challenge: payload.challenge }),
        };
      }
      case "app_rate_limited":
      case "event_callback": {
        await this.slackEventBusService.send(slackEvent);

        return {
          statusCode: 200,
          body: JSON.stringify({}),
        };
      }
      default:
        return assertSlackEventPayloadUnreachable(payload);
    }
  }

  private async verifyAndParseSlackEvent(
    { appId }: HandlerContext,
    { body, headers }: Lambda.APIGatewayProxyEventV2
  ): Promise<SlackEvent> {
    const verified = this.slackService.verifySignature({
      appId,
      body,
      headers,
    });

    if (!verified) {
      throw new Error(
        `event verification failed, the event is not from Slack or secrets mis-configured for appId '${appId}'`
      );
    }

    return this.slackService.parseEvent(body!);
  }
}

import type * as Lambda from "aws-lambda";
import { SlackEventBusService } from "../internal/event-bus/slack-event-bus.service";
import { SlackSecretsService } from "../internal/secrets/slack-secrets.service";
import { SlackService } from "../internal/slack/slack.service";
import { BaseLambda, createLambdaHandler } from "./base-lambda";

const DEFAULT_HEADERS = {
  "content-type": "application/json",
};

function assertSlackEventPayloadUnreachable(payload: never): never {
  throw new Error(
    `unknown slack event type encountered: ${(payload as any).type}`
  );
}

export class SlackEventsLambda extends BaseLambda {
  constructor(
    private readonly slackSecretsService: SlackSecretsService = new SlackSecretsService(),
    private readonly slackEventBusService: SlackEventBusService = new SlackEventBusService(),
    private readonly slackService: SlackService = new SlackService()
  ) {
    super();
  }

  protected async handle(
    event: Lambda.APIGatewayProxyEventV2
  ): Promise<Lambda.APIGatewayProxyResultV2> {
    const slackEvent = await this.verifyAndParseSlackEvent(event);
    const { payload } = slackEvent;

    switch (payload.type) {
      case "url_verification": {
        return {
          statusCode: 200,
          headers: DEFAULT_HEADERS,
          body: JSON.stringify({ challenge: payload.challenge }),
        };
      }
      case "app_rate_limited":
      case "event_callback": {
        await this.slackEventBusService.send(slackEvent);

        return {
          statusCode: 200,
          headers: DEFAULT_HEADERS,
          body: JSON.stringify({}),
        };
      }
      default:
        return assertSlackEventPayloadUnreachable(payload);
    }
  }

  private async verifyAndParseSlackEvent(
    event: Lambda.APIGatewayProxyEventV2WithRequestContext<Lambda.APIGatewayEventRequestContextV2>
  ) {
    const appId = event.pathParameters?.appId;
    if (appId === undefined) {
      throw new Error(
        "{appId} is undefined, make sure your request url includes {appId} path parameter"
      );
    }

    const appSecretsMap = await this.slackSecretsService.retrieve();
    const appSecrets = appSecretsMap[appId];

    if (appSecrets === undefined) {
      throw new Error(
        `unknown appId '${appId}', insert signing-secret for the given app`
      );
    }

    const verified = this.slackService.verifySignature({
      signingSecret: appSecrets.signingSecret,
      rawBody: event.body!,
      requestTimestampHeader: event.headers["x-slack-request-timestamp"]!,
      signatureHeader: event.headers["x-slack-signature"]!,
    });

    if (!verified) {
      throw new Error(
        `event verification failed, the event is not from Slack or secrets mis-configured for appId '${appId}'`
      );
    }

    return this.slackService.parseEvent(event.body!);
  }
}

export const handler = createLambdaHandler(new SlackEventsLambda());

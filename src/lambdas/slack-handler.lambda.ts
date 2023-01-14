import type * as Lambda from "aws-lambda";
import { BaseLambda, createLambdaHandler } from "./base-lambda";
import { SlackEventBusService } from "../internal/event-bus/slack-event-bus.service";
import { HandlerContext } from "../internal/handlers/handlers.dto";
import { SlackEventHandlerService } from "../internal/handlers/slack-event-handler.service";
import { SlackService } from "../internal/slack/slack.service";
import { SLACK_PATH_EVENTS_API } from "../path-constants";

const DEFAULT_HEADERS = {
  "content-type": "application/json",
};

const globalSlackEventBusService = new SlackEventBusService();
const globalSlackService = new SlackService();

export class SlackHandlerLambda extends BaseLambda {
  constructor(
    private readonly slackEventHandlerService: SlackEventHandlerService = new SlackEventHandlerService(
      globalSlackEventBusService,
      globalSlackService
    )
  ) {
    super();
  }

  protected async handle(
    event: Lambda.APIGatewayProxyEventV2
  ): Promise<Lambda.APIGatewayProxyResultV2> {
    const appId = event.pathParameters?.appId;
    if (appId === undefined) {
      throw new Error(
        "{appId} is undefined, make sure the url includes {appId} path parameter"
      );
    }

    const result = await this.handleByPath({ appId }, event);

    return {
      ...result,
      headers: {
        ...DEFAULT_HEADERS,
        ...result.headers,
      },
    };
  }

  private async handleByPath(
    handlerContext: HandlerContext,
    event: Lambda.APIGatewayProxyEventV2
  ): Promise<Lambda.APIGatewayProxyStructuredResultV2> {
    const path = event.requestContext.http.path;
    if (path.endsWith(SLACK_PATH_EVENTS_API)) {
      return this.slackEventHandlerService.handle(handlerContext, event);
    }

    throw new Error(`unknown path: '${path}'`);
  }
}

export const handler = createLambdaHandler(new SlackHandlerLambda());

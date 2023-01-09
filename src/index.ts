import * as apigwv2 from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { aws_events as Events } from "aws-cdk-lib";
import { Alias, Architecture, IFunction } from "aws-cdk-lib/aws-lambda";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import { SlackHandlerFunction } from "./lambdas/slack-handler-function";
import { SLACK_PATH_APP_PREFIX, SLACK_PATH_EVENTS_API } from "./path-constants";

export interface SlackEventBusProps {
  /**
   * `secret` is a reference to the Secret parameter that stores the signing-secret
   * and also if oAuth enabled; client id / client secret for each individual appId
   */
  readonly secret: ISecret;

  /**
   * `eventBusName` optional name to override the event bus name
   */
  readonly eventBusName?: string;
}

export class SlackEventBus extends Construct {
  private static readonly SLACK_EVENT_BUS_NAME = "slack-event-bus";

  private static appPath(appId?: string) {
    return appId !== undefined
      ? SLACK_PATH_APP_PREFIX.replace("{appId}", appId)
      : SLACK_PATH_APP_PREFIX;
  }

  private readonly pEventBus: Events.EventBus;
  private readonly pSlackHandlerLambdaAlias: Alias;
  private readonly httpApi: apigwv2.HttpApi;

  constructor(scope: Construct, id: string, props: SlackEventBusProps) {
    super(scope, id);

    this.pEventBus = new Events.EventBus(this, "EventBus", {
      eventBusName: props.eventBusName || SlackEventBus.SLACK_EVENT_BUS_NAME,
    });

    const slackHandlerLambda = new SlackHandlerFunction(
      this,
      "SlackHandlerLambda",
      {
        description:
          "Lambda that handles Slack Events, Interactions, Commands and oAuth",
        architecture: Architecture.ARM_64,
        environment: {
          SLACK_SECRET_ARN: props.secret.secretArn,
          SLACK_EVENT_BUS_NAME: this.pEventBus.eventBusName,
        },
      }
    );

    this.pSlackHandlerLambdaAlias = new Alias(
      this,
      "SlackHandlerLambdaLiveAlias",
      {
        aliasName: "latest",
        version: slackHandlerLambda.currentVersion,
      }
    );

    props.secret.grantRead(this.pSlackHandlerLambdaAlias);
    this.pEventBus.grantPutEventsTo(this.pSlackHandlerLambdaAlias);

    this.httpApi = new apigwv2.HttpApi(this, "HttpApi", {
      description: "Slack Handler Http Api",
    });

    // add for handling slack events route
    this.httpApi.addRoutes({
      path: `${SLACK_PATH_APP_PREFIX}${SLACK_PATH_EVENTS_API}`,
      // ALL methods expect OPTIONS / ANY should be handled by our Lambda
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        "EventsPostIntegration",
        this.pSlackHandlerLambdaAlias
      ),
    });
  }

  slackEventsRequestUrl(appId?: string): string {
    return `${this.httpApi.apiEndpoint}${SlackEventBus.appPath(
      appId
    )}${SLACK_PATH_EVENTS_API}`;
  }

  get eventBus(): Events.EventBus {
    return this.pEventBus;
  }

  get slackHandlerLambdaAlias(): IFunction {
    return this.pSlackHandlerLambdaAlias;
  }
}

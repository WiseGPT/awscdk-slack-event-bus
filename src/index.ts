import * as apigwv2 from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { aws_events as Events } from "aws-cdk-lib";
import { Alias, Architecture, IFunction } from "aws-cdk-lib/aws-lambda";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import { SlackEventsFunction } from "./lambdas/slack-events-function";

export interface SlackEventBusProps {
  /**
   * `tokenSecret` is a reference to the Secret parameter that stores the
   */
  readonly tokenSecret: ISecret;
}

export class SlackEventBus extends Construct {
  private static readonly SLACK_EVENTS_PATH = "/app/{appId}/slack/events";
  private static readonly SLACK_EVENT_BUS_NAME = "slack-event-bus";

  private readonly pEventBus: Events.EventBus;
  private readonly pEventListenerLambdaLiveAlias: Alias;
  private readonly httpApi: apigwv2.HttpApi;

  constructor(scope: Construct, id: string, props: SlackEventBusProps) {
    super(scope, id);

    this.pEventBus = new Events.EventBus(this, "EventBus", {
      eventBusName: SlackEventBus.SLACK_EVENT_BUS_NAME,
    });

    const eventListenerLambda = new SlackEventsFunction(
      this,
      "EventListenerLambda",
      {
        description: "Slack Events API Request URL Handler",
        architecture: Architecture.ARM_64,
        environment: {
          SLACK_SECRET_ARN: props.tokenSecret.secretArn,
          SLACK_EVENT_BUS_NAME: this.pEventBus.eventBusName,
        },
      }
    );

    this.pEventListenerLambdaLiveAlias = new Alias(
      this,
      "EventListenerLambdaLiveAlias",
      {
        aliasName: "live",
        version: eventListenerLambda.currentVersion,
      }
    );

    props.tokenSecret.grantRead(this.pEventListenerLambdaLiveAlias);
    this.pEventBus.grantPutEventsTo(this.pEventListenerLambdaLiveAlias);

    this.httpApi = new apigwv2.HttpApi(this, "HttpApi", {
      description: "Slack Events Http Api",
    });

    this.httpApi.addRoutes({
      path: SlackEventBus.SLACK_EVENTS_PATH,
      // ALL methods expect OPTIONS / ANY should be handled by our Lambda
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        "EventsPostIntegration",
        this.pEventListenerLambdaLiveAlias
      ),
    });
  }

  slackEventsRequestUrl(appId?: string): string {
    const path =
      appId !== undefined
        ? SlackEventBus.SLACK_EVENTS_PATH.replace("{appId}", appId)
        : SlackEventBus.SLACK_EVENTS_PATH;

    return `${this.httpApi.apiEndpoint}${path}`;
  }

  get eventBus(): Events.EventBus {
    return this.pEventBus;
  }

  get eventListenerLambdaLiveAlias(): IFunction {
    return this.pEventListenerLambdaLiveAlias;
  }
}

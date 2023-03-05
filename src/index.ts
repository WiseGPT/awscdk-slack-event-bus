import * as apigwv2 from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { aws_events as Events } from "aws-cdk-lib";
import { Alias, Architecture, IFunction } from "aws-cdk-lib/aws-lambda";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import { SlackHandlerFunction } from "./lambdas/slack-handler-function";
import { SLACK_PATH_APP_PREFIX, SLACK_PATH_EVENTS_API } from "./path-constants";

const withSlash = (path: string) => (path.startsWith("/") ? path : "/" + path);

export interface SlackEventBusSingleAppProps {
  /**
   * `appId` to use for all request validating
   */
  readonly appId: string;

  /**
   * `eventsApiPath` which would be used for the events path
   */
  readonly eventsApiPath: string;
}

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

  /**
   * `httpApi` optional HTTP API to use, instead of Construct creating a new one
   */
  readonly httpApi?: apigwv2.HttpApi;

  /**
   * `singleApp` optionally configure to use a single application
   * with fixed app id and path to use
   */
  readonly singleApp?: SlackEventBusSingleAppProps;
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
  private readonly pHttpApi: apigwv2.HttpApi;

  constructor(
    scope: Construct,
    id: string,
    private readonly props: SlackEventBusProps
  ) {
    super(scope, id);

    this.pEventBus = new Events.EventBus(this, "EventBus", {
      eventBusName:
        this.props.eventBusName || SlackEventBus.SLACK_EVENT_BUS_NAME,
    });

    const slackHandlerLambda = new SlackHandlerFunction(
      this,
      "SlackHandlerLambda",
      {
        description:
          "Lambda that handles Slack Events, Interactions, Commands and oAuth",
        architecture: Architecture.ARM_64,
        environment: {
          SLACK_SECRET_ARN: this.props.secret.secretArn,
          SLACK_EVENT_BUS_NAME: this.pEventBus.eventBusName,
          ...(this.props.singleApp
            ? { SLACK_APP_ID: this.props.singleApp.appId }
            : {}),
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

    this.props.secret.grantRead(this.pSlackHandlerLambdaAlias);
    this.pEventBus.grantPutEventsTo(this.pSlackHandlerLambdaAlias);

    this.pHttpApi = this.props.httpApi
      ? this.props.httpApi
      : new apigwv2.HttpApi(this, "HttpApi", {
          description: "Slack Handler Http Api",
        });

    // add for handling slack events route
    this.pHttpApi.addRoutes({
      path: this.props.singleApp?.eventsApiPath
        ? withSlash(this.props.singleApp.eventsApiPath)
        : `${SLACK_PATH_APP_PREFIX}${SLACK_PATH_EVENTS_API}`,
      // ALL methods expect OPTIONS / ANY should be handled by our Lambda
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        "EventsPostIntegration",
        this.pSlackHandlerLambdaAlias
      ),
    });
  }

  slackEventsRequestUrl(appId?: string): string {
    if (this.props.singleApp && this.props.singleApp.appId !== appId) {
      throw new Error(
        `you can only use with '${this.props.singleApp.appId}' appId because props.singleApp is configured`
      );
    }

    if (this.props.singleApp) {
      const { eventsApiPath } = this.props.singleApp;

      return `${this.pHttpApi.apiEndpoint}${withSlash(eventsApiPath)}`;
    }

    return `${this.pHttpApi.apiEndpoint}${SlackEventBus.appPath(
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

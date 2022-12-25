# @wisegpt/awscdk-slack-event-bus

This library was created to fulfill the need of integrating Slack as a Event Source for [AWS EventBridge](https://aws.amazon.com/eventbridge/).

Library exposes an AWS CDK Construct that;

1. Creates [EventBus](https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-events.EventBus.html) to send all events to
2. Creates [AWS HTTP API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html) for exposing [Slack Events API Request URL](https://api.slack.com/apis/connections/events-api#the-events-api__subscribing-to-event-types__events-api-request-urls)
3. Creates and exposes an [AWS Lambda](https://aws.amazon.com/lambda/) via [AWS HTTP API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html) to be used as [Slack Events API Request URL](https://api.slack.com/apis/connections/events-api#the-events-api__subscribing-to-event-types__events-api-request-urls)
   1. **Lambda** responds to initial handshake which is received when Slack App is configured with the Request URL
   2. **Lambda** validates the signature for each received event
   3. **Lambda** sends all received events to **EventBus**


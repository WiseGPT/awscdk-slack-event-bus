import type * as Lambda from "aws-lambda";
import { SlackEventsLambda } from "../../../src/lambdas/slack-events.lambda";

function createMockEventAndContext({
  request,
}: {
  request: {
    appId?: string;
  };
}): { event: any; context: any } {
  const event: Partial<Lambda.APIGatewayProxyEventV2> = {
    ...(request.appId ? { pathParameters: { appId: request.appId } } : {}),
    headers: {
      "x-slack-request-timestamp": "mock-request-timestamp",
      "x-slack-signature": "mock-slack-signature",
    },
    body: "mock-body",
  };

  return {
    event,
    context: {},
  };
}

describe("SlackEventsLambda", () => {
  let mockSlackSecretsService: any;
  let mockSlackEventBusService: any;
  let mockSlackService: any;
  let slackEventsLambda: SlackEventsLambda;

  beforeEach(() => {
    mockSlackSecretsService = { retrieve: jest.fn() };
    mockSlackEventBusService = { send: jest.fn() };
    mockSlackService = { verifySignature: jest.fn(), parseEvent: jest.fn() };
    slackEventsLambda = new SlackEventsLambda(
      mockSlackSecretsService,
      mockSlackEventBusService,
      mockSlackService
    );
  });

  describe("execute()", () => {
    const appId = "APP01";
    const signingSecret = "app-01-signing-secret";

    describe("success scenarios", () => {
      beforeEach(() => {
        mockSlackSecretsService.retrieve.mockResolvedValue({
          [appId]: { signingSecret },
        });

        mockSlackService.verifySignature.mockReturnValue(true);
      });

      it("should execute url verification", async () => {
        const challenge = "some-mock-challenge";
        const time = new Date();

        const { event, context } = createMockEventAndContext({
          request: { appId },
        });

        mockSlackService.parseEvent.mockReturnValue({
          payload: { type: "url_verification", challenge },
          time,
        });

        const result = await slackEventsLambda.execute(event, context);

        expect(result).toEqual({
          statusCode: 200,
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ challenge }),
        });
      });

      it("should execute event callback", async () => {
        const time = new Date();

        const { event, context } = createMockEventAndContext({
          request: { appId },
        });

        mockSlackService.parseEvent.mockReturnValue({
          payload: { type: "event_callback" },
          time,
        });

        mockSlackEventBusService.send.mockResolvedValue(void 0);

        const result = await slackEventsLambda.execute(event, context);

        expect(result).toEqual({
          statusCode: 200,
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({}),
        });

        expect(mockSlackEventBusService.send).toHaveBeenCalledTimes(1);
      });
    });

    it("should return 500 for an error scenario", async () => {
      const { event, context } = createMockEventAndContext({
        request: {},
      });

      const result = await slackEventsLambda.execute(event, context);

      expect(result).toEqual({
        statusCode: 500,
        headers: {
          "content-type": "application/json",
        },
        body: '{"message":"internal error occurred. please check logs."}',
      });
    });
  });
});

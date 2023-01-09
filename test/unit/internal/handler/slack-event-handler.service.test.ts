import type * as Lambda from "aws-lambda";
import { SlackEventHandlerService } from "../../../../src/internal/handlers/slack-event-handler.service";

function createMockEventAndContext({
  request,
}: {
  request: {
    appId: string;
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
    context: { appId: request.appId },
  };
}

describe("SlackEventHandlerService", () => {
  let mockSlackEventBusService: any;
  let mockSlackService: any;
  let slackEventsLambda: SlackEventHandlerService;

  beforeEach(() => {
    mockSlackEventBusService = { send: jest.fn() };
    mockSlackService = { verifySignature: jest.fn(), parseEvent: jest.fn() };
    slackEventsLambda = new SlackEventHandlerService(
      mockSlackEventBusService,
      mockSlackService
    );
  });

  describe("execute()", () => {
    const appId = "APP01";

    describe("success scenarios", () => {
      beforeEach(() => {
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

        const result = await slackEventsLambda.handle(context, event);

        expect(result).toEqual({
          statusCode: 200,
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

        const result = await slackEventsLambda.handle(context, event);

        expect(result).toEqual({
          statusCode: 200,
          body: JSON.stringify({}),
        });

        expect(mockSlackEventBusService.send).toHaveBeenCalledTimes(1);
      });
    });
  });
});

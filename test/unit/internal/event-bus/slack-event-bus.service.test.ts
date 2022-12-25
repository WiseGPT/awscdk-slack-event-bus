import { SlackEventBusService } from "../../../../src/internal/event-bus/slack-event-bus.service";
import { SlackEvent } from "../../../../src/internal/slack/slack-parse-event";

describe("SlackEventBusService", () => {
  const time = new Date(1518467820000);
  const source = "com.slack";
  let mockEventBusAdapter: any;
  let slackEventBusService: SlackEventBusService;

  beforeEach(() => {
    mockEventBusAdapter = { send: jest.fn() };
    slackEventBusService = new SlackEventBusService(mockEventBusAdapter);

    mockEventBusAdapter.send.mockResolvedValue(void 0);
  });

  describe("send()", () => {
    it("should send app rate limited", async () => {
      const slackEvent: SlackEvent = {
        time,
        payload: {
          type: "app_rate_limited",
          minute_rate_limited: 1000,
          api_app_id: "mock-api-app-id",
          team_id: "mock-team-id",
        },
      };

      const result = await slackEventBusService.send(slackEvent);

      expect(result).toBeUndefined();
      expect(mockEventBusAdapter.send).toHaveBeenCalledTimes(1);
      expect(mockEventBusAdapter.send.mock.calls[0][0]).toEqual({
        detail: slackEvent.payload,
        detailType: "AppRateLimited",
        source,
        time,
      });
    });

    it("should send event callback", async () => {
      const slackEvent: SlackEvent = {
        time,
        payload: {
          type: "event_callback",
          api_app_id: "mock-api-app-id",
          team_id: "mock-team-id",
          event: {
            type: "some_event",
            event_ts: "mock-event-ts",
            user: "mock-user",
            extra: "bar",
          },
          event_id: "mock-event-id",
          event_time: 1000,
          extra: "foo",
        },
      };

      const result = await slackEventBusService.send(slackEvent);

      expect(result).toBeUndefined();
      expect(mockEventBusAdapter.send).toHaveBeenCalledTimes(1);
      expect(mockEventBusAdapter.send.mock.calls[0][0]).toEqual({
        detail: slackEvent.payload,
        detailType: "EventCallback.some_event",
        source,
        time,
      });
    });

    it("should ignore url verification event", async () => {
      const slackEvent: SlackEvent = {
        time,
        payload: {
          type: "url_verification",
          challenge: "mock-challenge",
        },
      };

      const result = await slackEventBusService.send(slackEvent);

      expect(result).toBeUndefined();
      expect(mockEventBusAdapter.send).toHaveBeenCalledTimes(0);
    });
  });
});

import { slackParseEvent } from "../../../../src/internal/slack/slack-parse-event";

describe("slackParseEvent()", () => {
  it("should parse url verification", () => {
    const event = {
      type: "url_verification",
      challenge: "some-challenge",
      token: "some-token",
    };

    const result = slackParseEvent(JSON.stringify(event));

    expect(result).toMatchObject(
      expect.objectContaining({
        payload: {
          type: event.type,
          challenge: event.challenge,
        },
      })
    );
  });

  it("should parse event callback", () => {
    const event = {
      type: "event_callback",
      event_time: 10000,
      token: "some-token",
    };

    const result = slackParseEvent(JSON.stringify(event));

    expect(result).toEqual({
      payload: { ...event, token: undefined },
      time: new Date(event.event_time * 1000),
    });
  });

  it("should parse app rate limited", () => {
    const event = {
      type: "app_rate_limited",
      token: "some-token",
      minute_rate_limited: 10000,
    };

    const result = slackParseEvent(JSON.stringify(event));

    expect(result).toEqual({
      payload: { ...event, token: undefined },
      time: new Date(event.minute_rate_limited * 1000),
    });
  });

  it("should throw on unknown type", () => {
    const callback = () => slackParseEvent(JSON.stringify({}));

    expect(callback).toThrow();
  });
});

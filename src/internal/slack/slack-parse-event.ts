export type SlackEventUrlVerification = {
  type: "url_verification";
  challenge: string;
};

export type SlackEventCallback = {
  type: "event_callback";
  api_app_id: string;
  team_id: string;
  event: {
    type: string;
    event_ts: string;
    user: string;
    // dynamic types changing according to the type
    [key: string]: any;
  };
  event_id: string;
  event_time: number;
  // rest of the params, we do not care about
  [key: string]: any;
};

export type SlackEventAppRateLimited = {
  type: "app_rate_limited";
  api_app_id: string;
  team_id: string;
  minute_rate_limited: number;
};

export type SlackEvent = {
  payload:
    | SlackEventUrlVerification
    | SlackEventCallback
    | SlackEventAppRateLimited;
  time: Date;
};

/**
 * `slackParseEvent` parses the given request body into typed Slack event
 * removes the `token` parameter inside the event because we do not use it
 * and don't want to expose it anywhere
 * @param rawBody
 */
export function slackParseEvent(rawBody: string): SlackEvent {
  const event = JSON.parse(rawBody);

  switch (event.type) {
    case "url_verification": {
      const payload: SlackEventUrlVerification = {
        type: "url_verification",
        challenge: event.challenge,
      };

      return { payload, time: new Date() };
    }
    case "app_rate_limited": {
      const payload: SlackEventAppRateLimited = {
        ...event,
        type: "app_rate_limited",
        token: undefined,
      };

      return { payload, time: new Date(payload.minute_rate_limited * 1000) };
    }
    case "event_callback": {
      const payload: SlackEventCallback = {
        ...event,
        type: "event_callback",
        token: undefined,
      };

      return { payload, time: new Date(payload.event_time * 1000) };
    }
    default:
      throw new Error(`could not parse unknown event type ${event.type}`);
  }
}

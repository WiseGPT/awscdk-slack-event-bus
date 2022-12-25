import { SlackEvent, slackParseEvent } from "./slack-parse-event";
import {
  slackVerifySignature,
  VerifySignatureInput,
} from "./slack-verify-signature";

export class SlackService {
  verifySignature(input: VerifySignatureInput): boolean {
    return slackVerifySignature(input);
  }

  parseEvent(rawBody: string): SlackEvent {
    return slackParseEvent(rawBody);
  }
}

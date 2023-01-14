import { SlackEvent, slackParseEvent } from "./slack-parse-event";
import { slackVerifySignature } from "./slack-verify-signature";
import { SlackSecretsService } from "../secrets/slack-secrets.service";

export class SlackService {
  constructor(
    private readonly slackSecretsService: SlackSecretsService = new SlackSecretsService()
  ) {}

  async verifySignature(input: {
    appId: string;
    body?: string;
    headers: Record<string, string | undefined>;
  }): Promise<boolean> {
    const appSecretsMap = await this.slackSecretsService.retrieve();
    const appSecrets = appSecretsMap[input.appId];

    if (appSecrets === undefined) {
      throw new Error(
        `unknown appId '${input.appId}', insert signing-secret for the given app`
      );
    }

    return slackVerifySignature({
      signingSecret: appSecrets.signingSecret,
      rawBody: input.body!,
      requestTimestampHeader: input.headers["x-slack-request-timestamp"]!,
      signatureHeader: input.headers["x-slack-signature"]!,
    });
  }

  parseEvent(rawBody: string): SlackEvent {
    return slackParseEvent(rawBody);
  }
}

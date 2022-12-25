import { slackVerifySignature } from "../../../../src/internal/slack/slack-verify-signature";

describe("slackVerifySignature", () => {
  const signingSecret = "some-secret-string";
  const rawBody = "raw-body";

  it.each([
    { signingSecret, rawBody: "raw-body", signatureHeader: "signature-header" },
    {
      signingSecret,
      rawBody,
      requestTimestampHeader: "request-timestamp-header",
    },
    {
      signingSecret,
      rawBody,
      signatureHeader: "signature-header",
      requestTimestampHeader: "request-timestamp-header",
    },
    {
      signingSecret,
      rawBody,
      signatureHeader: "signature-header",
      requestTimestampHeader: "request-timestamp-header",
    },
    {
      signingSecret,
      rawBody,
      signatureHeader: "v1=some-hex-value",
      requestTimestampHeader: "request-timestamp-header",
    },
  ])("should throw with invalid input", (input) => {
    const callback = () => slackVerifySignature(input);

    expect(callback).toThrow();
  });

  it("should return false if signature does not match", () => {
    const result = slackVerifySignature({
      signingSecret,
      rawBody,
      requestTimestampHeader: "1671957628",
      signatureHeader:
        "v0=c441f329d15bc2c19d3d9a90db97b01975e91a2f50189c7777658681509cd014",
    });

    expect(result).toBe(false);
  });

  it("should signature to match", () => {
    const result = slackVerifySignature({
      signingSecret,
      rawBody,
      requestTimestampHeader: "1671957628",
      signatureHeader:
        "v0=c441f329d15bc2c19d3d9a90db97b01975e91a2f50189c7777658681509cd015",
    });

    expect(result).toBe(true);
  });
});

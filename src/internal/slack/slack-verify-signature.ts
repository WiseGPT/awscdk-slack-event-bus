import { createHmac, timingSafeEqual } from "crypto";

export type VerifySignatureInput = {
  signingSecret: string;
  rawBody: string;
  requestTimestampHeader?: string;
  signatureHeader?: string;
};

export function slackVerifySignature({
  signingSecret,
  rawBody,
  requestTimestampHeader,
  signatureHeader,
}: VerifySignatureInput): boolean {
  if (!signatureHeader) {
    throw new Error("slack signature header is not present");
  }

  if (!requestTimestampHeader) {
    throw new Error("request timestamp header is not present");
  }

  const [version, signature] = signatureHeader.split("=");

  if (version !== "v0" || !signature) {
    throw new Error("invalid slack signature format");
  }

  try {
    const receivedSignatureBuffer = Buffer.from(signature, "hex");

    const baseString = `${version}:${requestTimestampHeader}:${rawBody}`;
    const calculatedSignatureBuffer = Buffer.from(
      createHmac("sha256", signingSecret)
        .update(baseString)
        .digest()
        .toString("hex"),
      "hex"
    );

    return timingSafeEqual(calculatedSignatureBuffer, receivedSignatureBuffer);
  } catch {
    return false;
  }
}

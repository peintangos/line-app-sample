import crypto from "crypto";

export function verifySignature(
  rawBody: string,
  signature: string | null
): boolean {
  if (!signature) return false;
  const channelSecret = process.env.LINE_CHANNEL_SECRET!;
  const hash = crypto
    .createHmac("sha256", channelSecret)
    .update(rawBody)
    .digest("base64");
  return hash === signature;
}

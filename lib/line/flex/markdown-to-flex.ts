import { convertToFlexMessage } from "markdown-flex-message";
import { messagingApi } from "@line/bot-sdk";

type FlexMessage = messagingApi.FlexMessage;

export async function markdownToFlex(
  markdown: string,
  altText?: string
): Promise<FlexMessage | null> {
  try {
    const { flexMessage } = await convertToFlexMessage(markdown);
    if (altText) {
      flexMessage.altText = altText;
    }
    return flexMessage;
  } catch {
    return null;
  }
}

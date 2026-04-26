import { lineClient } from "./client";

export async function showLoadingAnimation(userId: string): Promise<void> {
  try {
    await lineClient.showLoadingAnimation({
      chatId: userId,
      loadingSeconds: 60,
    });
  } catch {
    // グループチャットでは動作しないため、エラーを無視
  }
}

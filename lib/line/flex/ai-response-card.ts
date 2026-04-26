import { messagingApi } from "@line/bot-sdk";

type FlexMessage = messagingApi.FlexMessage;

export function buildAiResponseCard(
  content: string,
  title?: string
): FlexMessage {
  return {
    type: "flex",
    altText: content.slice(0, 100),
    contents: {
      type: "bubble",
      size: "mega",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: title ?? "AI Response",
            weight: "bold",
            size: "lg",
            color: "#FFFFFF",
          },
        ],
        backgroundColor: "#7C3AED",
        paddingAll: "16px",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: content.length > 2000 ? content.slice(0, 1997) + "..." : content,
            wrap: true,
            size: "sm",
            color: "#333333",
          },
        ],
        paddingAll: "16px",
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "Powered by Claude",
            size: "xxs",
            color: "#999999",
            align: "center",
          },
        ],
        paddingAll: "8px",
      },
      styles: {
        header: {
          backgroundColor: "#7C3AED",
        },
      },
    },
  };
}

import { messagingApi } from "@line/bot-sdk";

type FlexMessage = messagingApi.FlexMessage;
type FlexBubble = messagingApi.FlexBubble;
type FlexBox = messagingApi.FlexBox;

const LIFF_URL = `https://liff.line.me/${process.env.LIFF_ID}`;

export function appendLiffButton(flexMessage: FlexMessage): FlexMessage {
  const bubble = flexMessage.contents as FlexBubble;

  const liffFooter: FlexBox = {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "separator",
      },
      {
        type: "button",
        action: {
          type: "uri",
          label: "ストリーミングで会話する",
          uri: LIFF_URL,
        },
        style: "link",
        height: "sm",
        color: "#7C3AED",
      },
    ],
    paddingTop: "8px",
  };

  return {
    ...flexMessage,
    contents: {
      ...bubble,
      footer: liffFooter,
    },
  };
}

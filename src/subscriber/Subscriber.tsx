import usePartySocket from "partysocket/react";
import { useState } from "react";

const Subscriber: React.FC = () => {
  const [isRelayConnected, setIsRelayConnected] = useState(false);
  const [text, setText] = useState("");
  const [draftText, setDraftText] = useState("");
  usePartySocket({
    room: "transcription-room",
    onMessage(evt) {
      const data = JSON.parse(evt.data);
      console.log("data", data);
      if (data.type === "reset-session") {
        setText("");
        setDraftText("");
      } else if (data.type === "draft-text") {
        setDraftText(data.text);
      } else if (data.type === "final-text") {
        setDraftText("");
        setText((currentText) => currentText + data.text + " ");
      } else if (data.type === "session") {
        // @ts-expect-error
        const initialText = data.session.map((rawMessage) => {
          const message = JSON.parse(rawMessage);
          if (message.type === "final-text") {
            return message.text;
          }
          return "";
        });
        setText((currentText) => initialText.join(" ") + " " + currentText);
      }
    },
    onOpen() {
      // console.log("Partykit Opened");
      setIsRelayConnected(true);
    },
    onClose() {
      // console.log("Partykit Closed");
      setIsRelayConnected(false);
    },
    onError() {
      console.log("Partykit Error");
    },
  });

  return (
    <>
      <p>
        Connection status:{" "}
        {isRelayConnected ? "🟢 connected" : "❌ disconnected"}
      </p>
      <p>
        {text} <span style={{ color: "gray" }}>{draftText}</span>
      </p>
    </>
  );
};

export default Subscriber;

import usePartySocket from "partysocket/react";
import { useState } from "react";
import { Button } from "../components/Button/Button";
import { testRecording } from "../fixtures/test-recording";
import { getEndpoint } from "./utils/getEndpoint";

let testRecordingLog: any[] = [];

type Props = {};

const RecorderInterface: React.FC<Props> = () => {
  const endpoint = getEndpoint();

  const sessionId = "current-session-id";
  const [isRelayConnected, setIsRelayConnected] = useState(false);
  const partykitSocket = usePartySocket({
    room: "transcription-room",
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

  const transformAndSendMessage = (received: any) => {
    const transcript = received.channel.alternatives[0].transcript;
    if (transcript && received.is_final) {
      // document.querySelector("#transcript").textContent = transcript;
      if (partykitSocket) {
        partykitSocket.send(
          JSON.stringify({
            type: "final-text",
            text: transcript,
            sessionId,
          })
        );
      }
    } else if (transcript) {
      if (partykitSocket) {
        partykitSocket.send(
          JSON.stringify({
            type: "draft-text",
            text: transcript,
            sessionId,
          })
        );
      }
    }
  };

  return (
    <>
      <p>
        Relay connection:{" "}
        {isRelayConnected ? "🟢 connected" : "❌ disconnected"}
      </p>
      <br />
      <Button
        onClick={async () => {
          // partykitSocket.send("Test data");
          for (const transcript of testRecording) {
            await new Promise((resolve) => setTimeout(resolve, 250));
            // console.log(transcript);
            transformAndSendMessage(transcript);
          }
        }}
      >
        Send Test data to server
      </Button>
      <Button
        onClick={async (event) => {
          event.preventDefault();
          if (partykitSocket) {
            partykitSocket.send(
              JSON.stringify({
                type: "reset-session",
                sessionId,
              })
            );
          } else {
            alert("Failed to reset the session");
          }

          // try {
          //   const result = await fetch(`${endpoint}/party/session/reset`, {
          //     headers: {
          //       Authorization: appToken,
          //     },
          //   });
          //   const { status } = await result.json();
          //   if (status === "ok") {
          //     alert("Successfully reset the session");
          //   }
          // } catch (error) {
          //   alert("Failed to reset the session");
          // }
        }}
      >
        Reset Session (will delete the current content on the server and for all
        current subscribers)
      </Button>
    </>
  );
};

export default RecorderInterface;

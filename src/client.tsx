import { createRoot } from "react-dom/client";
import RecorderInterface from "./recorder/RecorderInterface";
import "./styles.css";
import Subscriber from "./subscriber/Subscriber";

createRoot(document.getElementById("app")!).render(
  <>
    <RecorderInterface />
    <Subscriber />
  </>
);

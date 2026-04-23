import type { Page } from "../../types";
import "./meditation.scss";
import html from "./meditation.html?raw";
import "@components/top/c-top";
import "@/components/c-anh-to_bot";

export const meditationPage: Page = () => {
  return {
    html: html.replaceAll(
      "{{VITE_TGBOT_MEDITATION_URL}}",
      import.meta.env.VITE_TGBOT_MEDITATION_URL,
    ),
    init() {},
    title: "Медитация",
  };
};

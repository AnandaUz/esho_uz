import type { Page } from "../../types";
import "./meet.scss";
import html from "./meet.html?raw";
import "@components/top/c-top";
import "@components/c-form-meet/c-form-meet";
import "@/components/c-anh-to_bot";

export const meetPage: Page = () => {
  return {
    html: html.replaceAll(
      "{{VITE_TGBOT_MEET_URL}}",
      import.meta.env.VITE_TGBOT_MEET_URL,
    ),
    init() {},
    title: "Встреча",
  };
};

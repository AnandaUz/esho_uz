import type { Page } from "../../types";
import "./location.scss";

import html from "./location.html?raw";
import "@components/top/c-top";
import "@/components/c-anh-to_bot";
import "@components/c-v-player/c-v-player";

export const locationPage: Page = () => {
  return {
    html: html.replaceAll(
      "{{VITE_TGBOT_MEDITATION_URL}}",
      import.meta.env.VITE_TGBOT_MEDITATION_URL,
    ),
    init() {
      const btn_maps = document.querySelector(".btn-maps") as HTMLAnchorElement;
      btn_maps.addEventListener("click", () => {
        const track = (window as any).guestTrack;
        if (track) {
          track("btnMaps");
        }
      });
    },
    title: "Медитация",
  };
};

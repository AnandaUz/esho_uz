import type { Page } from "../../types";
import "./guide.scss";
import html from "./guide.html?raw";
import "@components/top/c-top";

export const guidePage: Page = () => {
  return {
    html: html,
    init() {
      const btn = document.querySelector(".open_pdf");
      btn?.addEventListener("click", () => {
        const track = (window as any).guestTrack;
        if (track) {
          track("goalBtnGaude");
        }
      });
    },
    title: "Гайд",
    pageClass: "guide-page",
  };
};

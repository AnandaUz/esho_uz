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
        // fbq('track', 'Lead', {value: 1.00, currency: 'USD'});
        const track = (window as any).guestTrack;
        if (track) {
          track("goalBtnGaude");
        }

        //         const fbp = getCookie('_fbp')
        //         const fbc = getCookie('_fbc')

        //             const message = `${getVisiterId()} 🤖🤖🤖 Скачали гайд
        // fbp:${fbp}
        // fbc:${fbc}`

        //               sendTrackingMessage(message);
      });
    },
    title: "Гайд",
    pageClass: "guide-page",
  };
};

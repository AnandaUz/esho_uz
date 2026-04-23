export class CAnhToBot extends HTMLElement {
  async connectedCallback() {
    const botUrl =
      this.getAttribute("data-bot-url") || import.meta.env.VITE_BOT_URL;
    const attr = this.getAttribute("data-attr") || "f1";
    const btnText = this.getAttribute("btn-text") || "Отправить";
    const classAttr = this.getAttribute("data-class") || "";

    this.innerHTML = `
     <a href=""
               class="btn btn-meet "
               target="_blank">
                <span class="${classAttr}">${btnText}</span>
            </a>
     `;

    this.querySelector("a")?.addEventListener("click", (e) => {
      e.preventDefault();
      const track = (window as any).guestTrack;
      if (track) {
        track("goalBtnClick");
      }
      let guestID = localStorage.getItem("guestID") || "";
      if (guestID) {
        guestID = "__" + guestID;
      }
      // const fbq = (window as any).fbq;
      // if (fbq) {
      //   fbq('track', 'Contact', {value: 0.50, currency: 'USD', content_name: attr})
      // }
      window.open(`${botUrl}?start=${attr}${guestID}`, "_blank");
    });
  }
}
customElements.define("c-anh-to_bot", CAnhToBot);

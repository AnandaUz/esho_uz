export class CAnhToBot extends HTMLElement {   

  async connectedCallback() {
    const botUrl = this.getAttribute('data-bot-url') || import.meta.env.VITE_BOT_URL;
    const attr = this.getAttribute('data-attr') || 'f1';
    const btnText = this.getAttribute('btn-text') || 'Отправить';
    const classAttr = this.getAttribute('data-class') || '';
    let userID = localStorage.getItem('good_visiter') || '';
    if (userID) {
      userID = '__'+userID
    }
    this.innerHTML = `
     <a href="${botUrl}?start=${attr}${userID}"
               class="btn btn-meet "
               target="_blank">
                <span class="${classAttr}">${btnText}</span>
            </a>
     `   
    
    this.querySelector('a')?.addEventListener('click', () => {
      const guest = (window as any).guest;
      if (guest) {
        guest.track('goalBtnClick');
      }
      // const fbq = (window as any).fbq;
      // if (fbq) {
      //   fbq('track', 'Contact', {value: 0.50, currency: 'USD', content_name: attr})
      // }
    
    });
  }
}
customElements.define('c-anh-to_bot', CAnhToBot);
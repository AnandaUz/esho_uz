import { sendTrackingEvent } from "@/main";
import "./c-form-meet.scss";

export class CFormMeet extends HTMLElement {     

  async connectedCallback() {
    const attr = this.getAttribute('data-attr') || 'f1';
    const btnText = this.getAttribute('btn-text') || 'Отправить';
    const bottomText = this.getAttribute('bottom-text') || '';
    this.innerHTML = `
    <div class="form-meet">
        <div class="body">
            <input type="text" class="name" name="userName" placeholder="Имя" required>
            <input type="text" class="contact" name="userContact" placeholder="Ник в Telegram или телефон" required>
            <div class="footer">
                <button class="btn_send btn-meet">
                    ${btnText}
                </button>
                <div class="bottom-text">${bottomText}</div>
            </div>
        </div>
        
        <div class="formMessage">
            Заявка отправлена!
        </div>
        <div class="formError">
            Произошла ошибка при отправке заявки. Попробуйте еще раз.
        </div>
    </div>    
    `    
    const formMeet = this.querySelector('.form-meet') as HTMLFormElement;
    const formBody = this.querySelector('.body') as HTMLFormElement;
    const formMessage = this.querySelector('.formMessage') as HTMLElement;
    const formError = this.querySelector('.formError') as HTMLElement;
    const btnSend = this.querySelector('.btn_send') as HTMLButtonElement;

    if (formMeet) {
        const userName = formMeet.querySelector('.name') as HTMLInputElement;
        const userContact = formMeet.querySelector('.contact') as HTMLInputElement;
        userName.addEventListener('focus', () => {
            sendTrackingEvent('input_name')
        });
        userContact.addEventListener('focus', () => {
            sendTrackingEvent('input_contact')
        });

        btnSend.addEventListener('click', async () => {                       
            
            //- отправка события в Pixel
            if (typeof window.fbq === 'function') {
                fbq('track', 'Lead', {value: 1.00, currency: 'USD', content_name: 'meet_form'});
            }

            const str = `📩 Новая заявка с сайта (Встреча)
Имя: ${userName?.value}
Контакт: ${userContact?.value}
Форма: ${attr}`
            const result = await sendTrackingEvent(str);

            if (result) {              
                formBody.style.display = 'none';
                formMessage.style.display = 'block';
            } else {
                formBody.style.display = 'none';
                formError.style.display = 'block';
                setTimeout(() => {
                    formError.style.display = 'none';
                    formBody.style.display = 'flex';
                    sendTrackingEvent('error_form_reset');
                }, 3000);
                sendTrackingEvent('error_form')
            }
        });
    }
  }
}
customElements.define('c-form-meet', CFormMeet);
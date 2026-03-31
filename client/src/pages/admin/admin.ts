import type { Page } from '../../types';
import "./admin.scss";

interface Btn {
  name: string;
  status: string;
  title: string;
  storageName: string;
  isOff: boolean;
  btnElement: HTMLButtonElement | null;
}
const btns: Btn[] = [
  { name: 'btn_GTM', 
    status: 'GTM', 
    title: 'GoogleTagManager', 
    storageName:'off_GTM',
    isOff:false,
    btnElement: null
  },
  { name: 'btn_Pixel', 
    status: 'Pixel', 
    title: 'Pixel', 
    storageName:'off_Pixel',
    isOff:false,
    btnElement: null 
  },
  { name: 'btn_MyStat', 
    status: 'MyStat', 
    title: 'Моя статистика', 
    storageName:'off_MyStat',
    isOff:false,
    btnElement: null
  }
]


function getStorageStatus() {
  btns.forEach(btn => {
    const status = localStorage.getItem(btn.storageName);
    if (status) {
      btn.isOff = status === 'true';
      if (btn.isOff) {
        btn.btnElement?.classList.add('off');
      } else {
        btn.btnElement?.classList.remove('off');
      }
    }
  })
  return localStorage.getItem('no_analytics');
}


export const adminPage: Page = () => {
  return {
    html: `
    <div class="admin">
      <h1>Управление статистикой</h1>

<button class="btn_big btn_off_all">Выключить всё</button>
<div class="btns">
  
</div>
           
    </div>
    `,
    init() {
      document.querySelector('.btn_off_all')?.addEventListener('click', () => {
        btns.forEach(btn => {
          btn.isOff = true;
          localStorage.setItem(btn.storageName, btn.isOff.toString());
        })
        getStorageStatus();
      })

      const btnsContainer = document.querySelector('.btns');

      btns.forEach(btn => {
        const btnElement = document.createElement('button');
        btnElement.classList.add('btn_big');
        btnElement.classList.add(btn.name);
        btnElement.innerHTML = btn.title + '<span class="isOff">Выключено</span><span class="isOn">Включено</span>';
        btn.btnElement = btnElement;

       
        btnElement.addEventListener('click', () => {
          btn.isOff = !btn.isOff;
          localStorage.setItem(btn.storageName, btn.isOff.toString());
          getStorageStatus();
        });
        
        if (btnsContainer) {
          btnsContainer.appendChild(btnElement);
        }
      })   
      getStorageStatus();
      
    },
    title: 'Админ'
  };
}

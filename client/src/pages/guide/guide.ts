import type { Page } from '../../types';
import "./guide.scss";
import html from "./guide.html?raw";
import '@components/top/c-top';

export const guidePage: Page = () => {
  return {
    html: html,
    init() {
      
      
    },
    title: 'Гайд',
    pageClass: 'guide-page',
  };
}

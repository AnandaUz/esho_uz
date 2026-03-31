import type { Page } from '../../types';
import "./meet.scss";
import html from "./meet.html?raw";
import '@components/top/c-top';

export const meetPage: Page = () => {
  return {
    html: html,
    init() {
      
      
    },
    title: 'Встреча'
  };
}

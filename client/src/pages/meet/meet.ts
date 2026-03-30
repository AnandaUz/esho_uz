import type { Page } from '../../types';
import "./meet.scss";
import html from "./meet.html?raw";

export const meetPage: Page = () => {
  return {
    html: html,
    init() {
      
      
    },
    title: 'Встреча'
  };
}

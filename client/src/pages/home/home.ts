import type { Page } from '../../types';
import html from "@pages/home/home.html?raw"

export const homePage: Page = () => {
  return {
    html: html,
    init() {

    }
  };
}
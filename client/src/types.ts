export type PageResult = {
  html: string;
  title?: string;
  init?: () => void;
};

export type Page = (params: Record<string, string>) => PageResult | Promise<PageResult>;

export type Routes = Record<string, Page>;
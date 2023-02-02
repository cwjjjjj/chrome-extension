export enum TAB_ACTION {
  CREATE = "CREATE",
  REMOVE = "REMOVE",
  ACTIVE = "ACTIVE",
}

export const ADD_ICON_POSITION = [
  { right: 260, bottom: 56 },
  { right: 199, bottom: 56 },
  { right: 138, bottom: 56 },
  { right: 77, bottom: 56 },
  { right: 16, bottom: 56 },
  { right: 260, bottom: 0 },
  { right: 199, bottom: 0 },
  { right: 138, bottom: 0 },
  { right: 77, bottom: 0 },
  { right: 16, bottom: 0 },
];

export const DEFAULT_PINNED_TABS = [
  {
    url: "https://web.okjike.com/",
    id: "1",
    favIconUrl: "https://web.okjike.com/favicon.ico",
  },
  {
    url: "https://mail.google.com/mail",
    id: "2",
    favIconUrl: "https://www.google.com/a/cpanel/iftech.io/images/favicon.ico",
  },
  {
    url: "https://www.douban.com/",
    id: "3",
    favIconUrl: "https://www.douban.com/favicon.ico",
  },
  {
    url: "https://www.zhihu.com/",
    id: "4",
    favIconUrl: "https://www.zhihu.com/favicon.ico",
  },
  {
    url: "https://www.bilibili.com",
    id: "5",
    favIconUrl: "https://www.bilibili.com/favicon.ico",
  },
  {
    url: "https://www.github.com",
    id: "6",
    favIconUrl: "https://www.github.com/favicon.ico",
  },
];

export type SearchEngine = Record<string, string>;

export const SEARCH_ENGINE = {
  Google: "https://www.google.com/search?q=",
  Baidu: "https://www.baidu.com/s?wd=",
  Bing: "https://www.bing.com/search?q=",
};

export const URLRegExp =
  /^(?:(http|https|ftp):\/\/)((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;

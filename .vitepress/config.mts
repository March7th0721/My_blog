import { defineConfig } from 'vitepress'
import { socialLinksConfig } from './config/socialLinks'
import { generateSidebar } from 'vitepress-sidebar';


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "March 7th's blog",
  description: "awa",
  base: '/',
  srcDir: 'articles',

  ignoreDeadLinks: true,
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // logo: '/yuki.webp',
    
    sidebar: generateSidebar({
      // https://vitepress-sidebar.cdget.com/guide/getting-started
      documentRootPath: '/articles',
      useTitleFromFileHeading: true,
      sortMenusByName: true,
      collapsed: false,
      collapseDepth: 3,
      rootGroupCollapsed: false,
      includeEmptyFolder: false,
      includeFolderIndexFile: false,
      useFolderTitleFromIndexFile: true,
      sortFolderTo: 'bottom',
    }),
    lastUpdated: {
      text: 'Last Updated At',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    nav: [
      { text: 'Home', link: '/' },
    ],

    socialLinks: socialLinksConfig,

    search: {
      provider: 'local',
    },
  },

  markdown: {
    lineNumbers: true,
  },
})

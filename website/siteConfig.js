const siteConfig = {
  title: 'React Tidy',
  tagline:
    'A collection of handy, flexible, tested and documented React custom hooks.',
  url: 'https://webneat.net',
  baseUrl: '/react-tidy/',
  projectName: 'react-tidy',
  organizationName: 'webneat',
  headerLinks: [
    // {doc: 'doc1', label: 'Docs'},
    // {doc: 'doc4', label: 'API'},
    // {page: 'help', label: 'Help'}
  ],
  headerIcon: 'img/logo-light.svg',
  footerIcon: 'img/logo-light.svg',
  favicon: 'img/favicon.png',
  colors: {
    primaryColor: '#0c6ad6',
    secondaryColor: '#08448a',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js'
  ],

  stylesheets: [
    'https://fonts.googleapis.com/css?family=IBM+Plex+Mono:500,700|Source+Code+Pro:500,700|Source+Sans+Pro:400,400i,700',
  ],

  /* Custom fonts for website */
  fonts: {
    fontMain: ['Source Sans Pro', 'sans-serif'],
    fontCode: ['IBM Plex Mono', 'monospace'],
  },

  copyright: `Copyright © ${new Date().getFullYear()} Amine Ben hammou`,
  usePrism: true,
  highlight: {
    theme: 'default', // Highlight.js theme
    defaultLang: 'javascript',
  },

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  cleanUrl: false,

  // Open Graph and Twitter card images.
  ogImage: 'img/undraw_online.svg',
  twitterImage: 'img/undraw_tweetstorm.svg',

  // For sites with a sizable amount of content, set collapsible to true.
  // Expand/collapse the links and subcategories under categories.
  // docsSideNavCollapsible: true,

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
}

module.exports = siteConfig

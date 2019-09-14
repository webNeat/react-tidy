const siteConfig = {
  title: 'React Tidy',
  tagline: 'A collection of handy, flexible, tested and documented React custom hooks.',
  url: 'https://webneat.github.io',
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

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */
  copyright: `Copyright © ${new Date().getFullYear()} Amine Ben hammou`,
  highlight: {
    theme: 'default', // Highlight.js theme
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

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
};

module.exports = siteConfig;

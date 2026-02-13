import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['intro/overview', 'intro/architecture'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Core Platform',
      items: ['core/dashboard', 'core/api-gateway'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Scanners & Tools',
      items: [
        'scanners/web-domain-scanner',
        'scanners/database-scanner',
        'scanners/code-scanner',
        'scanners/misconfig-checker',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Security Audits',
      items: ['audit/overview'],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Infrastructure',
      items: ['infrastructure/deployment'],
      collapsed: false,
    },
    {
      type: 'doc',
      id: 'contribution',
      label: 'Contributing',
    },
  ],
};

export default sidebars;

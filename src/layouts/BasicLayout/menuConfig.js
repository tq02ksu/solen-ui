const headerMenuConfig = [];
const asideMenuConfig = [
  {
    name: 'IOT',
    path: '/',
    icon: 'sorting',
    children: [
      {
        name: '设备列表',
        path: '/device/list',
      },
      {
        name: '事件列表',
        path: '/event/list',
      },
    ],
  },
];
export { headerMenuConfig, asideMenuConfig };

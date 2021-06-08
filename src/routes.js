import UserLayout from '@/layouts/UserLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import BasicLayout from '@/layouts/BasicLayout';
import Device from '@/pages/Device';
import DeviceDetailPage from '@/pages/Device/components/DeviceDetailPage';
import Event from '@/pages/Event'

const routerConfig = [
  {
    path: '/user',
    component: UserLayout,
    children: [
      {
        path: '/login',
        component: Login,
      },
      {
        path: '/register',
        component: Register,
      },
      {
        path: '/',
        redirect: '/user/login',
      },
    ],
  },
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/device/list',
        component: Device,
      },
      {
        path: '/device/:deviceId',
        component: DeviceDetailPage,
      },
      {
        path: '/event/list',
        component: Event,
      },
      {
        path: '/',
        redirect: '/device/list',
      },
    ],
  },
];
export default routerConfig;

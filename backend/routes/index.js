import cities from './admin/cities.js';
import routes from './admin/routes.js';

export default [
  {
    url: 'admin/cities',
    router: cities,
  },
  {
    url: 'admin/routes',
    router: routes,
  },
];

import cities from './admin/cities.js';
import routes from './admin/routes.js';
import busModels from './admin/bus-models.js';

export default [
  {
    url: 'admin/cities',
    router: cities,
  },
  {
    url: 'admin/routes',
    router: routes,
  },
  {
    url: 'admin/bus-models',
    router: busModels,
  },
];

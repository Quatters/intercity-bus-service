import cities from './admin/cities.js';
import routes from './admin/routes.js';
import busModels from './admin/bus-models.js';
import buses from './admin/buses.js';
import schedule from './admin/schedule.js';

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
  {
    url: 'admin/buses',
    router: buses,
  },
  {
    url: 'admin/schedule',
    router: schedule,
  },
];

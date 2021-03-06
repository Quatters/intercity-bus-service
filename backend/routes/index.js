import cities from './admin/cities.js';
import routes from './admin/routes.js';
import busModels from './admin/bus-models.js';
import buses from './admin/buses.js';
import schedule from './admin/schedule.js';
import flights from './admin/flights.js';
import tickets from './admin/tickets.js';
import freeSeats from './root/free-seats.js';
import reports from './admin/reports.js';

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
  {
    url: 'admin/flights',
    router: flights,
  },
  {
    url: 'admin/tickets',
    router: tickets,
  },
  {
    url: 'free-seats',
    router: freeSeats,
  },
  {
    url: 'admin/reports',
    router: reports,
  },
];

import { Router } from 'express';
import db from '../../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const inline = Boolean(req.query?.inline);
    let sql;

    if (inline) {
      sql =
        "SELECT CONCAT(route_number, ' (', DATE_FORMAT(departure_time,'%H:%i'), " +
        "'-', DATE_FORMAT(arrival_time,'%H:%i'), ')') AS 'schedule', schedule_id " +
        'FROM route_schedule';
    } else {
      sql =
        "SELECT r.route_number AS 'route_number', DATE_FORMAT(departure_time,'%H:%i') AS 'departure_time', " +
        "DATE_FORMAT(arrival_time,'%H:%i') AS 'arrival_time', r.from AS 'from', r.to AS 'to', " +
        "c1.city AS 'from_city', c2.city AS 'to_city' " +
        'FROM route_schedule rs ' +
        'LEFT JOIN route r ON r.route_number = rs.route_number ' +
        'LEFT JOIN city c1 ON r.from = c1.city_id ' +
        'LEFT JOIN city c2 ON r.to = c2.city_id ' +
        'ORDER BY r.route_number ASC';
    }

    const [rows] = await db.query(sql);

    return res.json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const data = getValidatedData(req.body);
    await db.insert('route_schedule', data);
    return res.status(201).json(data);
  } catch (error) {
    console.log(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ code: error.code });
    } else if (error.code === 'ER_INVALID') {
      return res.status(400).json(error);
    }
    return res.status(500).json(error);
  }
});

router.put('/', async (req, res) => {
  try {
    const oldData = getValidatedData(req.body.oldData);
    let newData = getValidatedData(req.body.newData);
    if (req.body.newData.arrival_time === '') {
      newData.arrival_time = null;
    }

    await db.update('route_schedule', oldData, newData);
    return res.status(200).json(newData);
  } catch (error) {
    console.log(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ code: error.code });
    } else if (error.code === 'ER_INVALID') {
      return res.status(400).json(error);
    }
    return res.status(500).json(error);
  }
});

function getValidatedData(data) {
  let route_number = data.route_number;
  let departure_time = data.departure_time;
  let arrival_time = data.arrival_time;

  const timeWithoutSecondsRegex = /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/;
  const timeWithSecondsRegex =
    /^([0-1][0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9])$/;

  let returnedData = { route_number };

  let errors = { route_number: [], departure_time: [], arrival_time: [] };
  let wereErrors = false;

  if (!route_number) {
    errors.route_number.push('This field is required.');
    wereErrors = true;
  } else {
    if (route_number.length > 5) {
      errors.route_number.push('This field can be 5 characters max.');
      wereErrors = true;
    }
  }
  if (!departure_time) {
    errors.departure_time.push('This field is required.');
    wereErrors = true;
  } else {
    if (timeWithoutSecondsRegex.test(departure_time)) {
      departure_time = departure_time + ':00';
    }
    if (!timeWithSecondsRegex.test(departure_time)) {
      errors.departure_time.push(
        'This field must be in format HH:mm or HH:mm:ss.'
      );
      wereErrors = true;
    }
  }
  if (arrival_time) {
    if (timeWithoutSecondsRegex.test(arrival_time)) {
      arrival_time = arrival_time + ':00';
    }
    if (!timeWithSecondsRegex.test(arrival_time)) {
      errors.arrival_time.push(
        'This field must be in format HH:mm or HH:mm:ss.'
      );
      wereErrors = true;
    }
  }

  if (wereErrors) {
    throw { code: 'ER_INVALID', errors };
  }

  returnedData.departure_time = '1000-01-01 ' + departure_time;

  if (arrival_time) {
    returnedData.arrival_time = '1000-01-01 ' + arrival_time;
  }

  return returnedData;
}

export default router;

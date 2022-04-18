import { Router } from 'express';
import db from '../../data/db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    let sql;
    if (req.query?.inline) {
      sql =
        'SELECT ' +
        "CONCAT(rs.route_number, ' (', DATE_FORMAT(f.departure_date, '%Y-%m-%d'), ', ', " +
        "DATE_FORMAT(rs.departure_time,'%H:%i'), " +
        "'-', DATE_FORMAT(rs.arrival_time,'%H:%i'), ')') AS 'flight', " +
        "f.flight_id AS 'flight_id' " +
        'FROM flight f ' +
        'LEFT JOIN route_schedule rs ON rs.schedule_id = f.schedule_id';
    } else {
      sql =
        'SELECT bus_number, price, ' +
        "DATE_FORMAT(f.departure_date, '%Y-%m-%d') AS 'departure_date', " +
        "CONCAT(rs.route_number, ' (', DATE_FORMAT(rs.departure_time,'%H:%i'), " +
        "'-', DATE_FORMAT(rs.arrival_time,'%H:%i'), ')') AS 'schedule', " +
        "f.schedule_id AS 'schedule_id' " +
        'FROM flight f ' +
        'LEFT JOIN route_schedule rs ON f.schedule_id = rs.schedule_id ';
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
    await db.insert('flight', data);
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
    const newData = getValidatedData(req.body.newData);
    await db.update('flight', oldData, newData);
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
  let schedule_id = data.schedule_id;
  let bus_number = data.bus_number;
  let departure_date = data.departure_date;
  let price = data.price;

  const dateRegex = /^([1-9]\d\d\d)-(0\d|1[0-2])-([0-2]\d|3[0-1])$/;

  let returnedData = { bus_number };

  let errors = {
    bus_number: [],
    departure_date: [],
    schedule_id: [],
    price: [],
  };
  let wereErrors = false;

  if (!schedule_id) {
    errors.schedule_id.push('This field is required.');
    wereErrors = true;
  } else {
    schedule_id = +schedule_id;
    returnedData.schedule_id = schedule_id;
    if (isNaN(schedule_id)) {
      errors.schedule_id.push('This field must be numeric.');
      wereErrors = true;
    }
  }
  if (!bus_number) {
    errors.bus_number.push('This field is required.');
    wereErrors = true;
  } else {
    if (bus_number.length !== 6) {
      errors.route_number.push('This field must be exact 6 characters max.');
      wereErrors = true;
    }
  }
  if (!price) {
    errors.price.push('This field is required.');
    wereErrors = true;
  } else {
    price = +price;
    returnedData.price = price;
    if (isNaN(price)) {
      errors.price.push('This field must be numeric.');
      wereErrors = true;
    }
  }
  if (!departure_date) {
    errors.departure_date.push('This field is required.');
    wereErrors = true;
  } else {
    returnedData.departure_date = departure_date;
    if (!dateRegex.test(departure_date)) {
      errors.departure_date.push('This field must be in format yyyy-mm-dd.');
      wereErrors = true;
    }
  }

  if (wereErrors) {
    throw { code: 'ER_INVALID', errors };
  }

  return returnedData;
}

export default router;

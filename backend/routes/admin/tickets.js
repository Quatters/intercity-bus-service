import { Router } from 'express';
import db from '../../data/db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const sql =
      'SELECT first_name, last_name, patr, seat_number, f.price, ' +
      "DATE_FORMAT(f.departure_date, '%Y-%m-%d') AS 'departure_date', CONCAT(rs.route_number, ' (', " +
      "DATE_FORMAT(rs.departure_time,'%H:%i'), " +
      "'-', DATE_FORMAT(rs.arrival_time,'%H:%i'), ')') AS 'flight', " +
      "f.flight_id AS 'flight_id' " +
      'FROM ticket t ' +
      'LEFT JOIN flight f ON f.flight_id = t.flight_id ' +
      'LEFT JOIN route_schedule rs ON rs.schedule_id = f.schedule_id ' +
      'ORDER BY f.departure_date DESC';

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
    await db.insert('ticket', data);
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

    await db.update('ticket', oldData, newData);
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
  let seat_number = data.seat_number;
  let flight_id = data.flight_id;
  let first_name = data.first_name;
  let last_name = data.last_name;
  let patr = data.patr;

  let returnedData = { first_name, last_name };

  let errors = {
    seat_number: [],
    flight_id: [],
    first_name: [],
    last_name: [],
    patr: [],
  };
  let wereErrors = false;

  if (!seat_number) {
    errors.route_number.push('This field is required.');
    wereErrors = true;
  } else {
    seat_number = +seat_number;
    returnedData.seat_number = seat_number;
    if (isNaN(seat_number)) {
      errors.seat_number.push('This field must be numeric.');
      wereErrors = true;
    }
  }
  if (!flight_id) {
    errors.flight_id.push('This field is required.');
    wereErrors = true;
  } else {
    flight_id = +flight_id;
    returnedData.flight_id = flight_id;
    if (isNaN(flight_id)) {
      errors.flight_id.push('This field must be numeric.');
      wereErrors = true;
    }
  }
  if (!first_name) {
    errors.first_name.push('This field is required.');
    wereErrors = true;
  }
  if (!last_name) {
    errors.last_name.push('This field is required.');
    wereErrors = true;
  }
  if (patr) {
    returnedData.patr = patr;
  }

  if (wereErrors) {
    throw { code: 'ER_INVALID', errors };
  }

  return returnedData;
}

export default router;

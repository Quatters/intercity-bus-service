import { Router } from 'express';
import db from '../../data/db.js';
import {
  validate,
  validateForNumber,
  validateForDate,
  validateRequired,
} from '../../data/validators.js';

const router = Router();

const defaultSql =
  'SELECT bus_number, price, ' +
  "DATE_FORMAT(f.departure_date, '%Y-%m-%d') AS 'departure_date', " +
  "CONCAT(rs.route_number, ' (', DATE_FORMAT(rs.departure_time,'%H:%i'), " +
  "'-', DATE_FORMAT(rs.arrival_time,'%H:%i'), ')') AS 'schedule', " +
  "f.schedule_id AS 'schedule_id' " +
  'FROM flight f ' +
  'LEFT JOIN route_schedule rs ON f.schedule_id = rs.schedule_id';

router.get('/', async (req, res) => {
  try {
    let sql = `${defaultSql} WHERE YEAR(f.departure_date) = YEAR(CURRENT_DATE()) ORDER BY f.departure_date DESC, rs.route_number ASC`;
    if (req.query?.inline) {
      sql =
        'SELECT ' +
        "CONCAT(rs.route_number, ' (', DATE_FORMAT(f.departure_date, '%Y-%m-%d'), ', ', " +
        "DATE_FORMAT(rs.departure_time,'%H:%i'), " +
        "'-', DATE_FORMAT(rs.arrival_time,'%H:%i'), ')') AS 'flight', " +
        "f.flight_id AS 'flight_id' " +
        'FROM flight f ' +
        'LEFT JOIN route_schedule rs ON rs.schedule_id = f.schedule_id ' +
        'WHERE YEAR(f.departure_date) = YEAR(CURRENT_DATE()) ';
    }

    const [rows] = await db.query(sql);
    return res.json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.get('/archive', async (req, res) => {
  try {
    const sql = `${defaultSql} WHERE YEAR(f.departure_date) != YEAR(CURRENT_DATE()) ORDER BY f.departure_date DESC, rs.route_number ASC`;
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

router.delete('/archive', async (req, res) => {
  try {
    const sql =
      'DELETE FROM flight ' +
      'WHERE YEAR(departure_date) != YEAR(CURRENT_DATE())';

    await db.query(sql);
    return res.status(201).send();
  } catch (error) {
    return res.status(500).json(error);
  }
});

function getValidatedData(data) {
  const [schedule_id, schedule_idErrors] = validate(
    { schedule_id: data.schedule_id },
    validateRequired,
    validateForNumber
  );
  const [bus_number, bus_numberErrors] = validate(
    { bus_number: data.bus_number },
    validateRequired
  );
  const [departure_date, departure_dateErrors] = validate(
    { departure_date: data.departure_date },
    validateRequired,
    validateForDate
  );
  const [price, priceErrors] = validate(
    { price: data.price },
    validateRequired,
    validateForNumber
  );

  let errors = [];

  if (schedule_idErrors) {
    errors.push({ schedule_id: schedule_idErrors });
  }
  if (bus_numberErrors) {
    errors.push({ bus_number: bus_numberErrors });
  }
  if (departure_dateErrors) {
    errors.push({ departure_date: departure_dateErrors });
  }
  if (priceErrors) {
    errors.push({ price: priceErrors });
  }

  if (errors.length > 0) {
    throw { code: 'ER_INVALID', errors };
  }

  return { schedule_id, bus_number, departure_date, price };
}

export default router;

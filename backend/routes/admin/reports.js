import { Router } from 'express';
import db from '../../data/db.js';
import { validateForDate, validateForLength } from '../../data/validators.js';

const router = Router();

router.get('/statistics', async (req, res) => {
  try {
    const { date_from, date_to, flight_id } = getValidatedData(req.query);
    let sql =
      'SELECT SUM(f.price) AS income, ' +
      'COUNT(t.ticket_id) AS ticket_count ' +
      'FROM flight f ' +
      'JOIN ticket t ON f.flight_id = t.flight_id';

    let whereStatement = 'WHERE';
    whereStatement =
      whereStatement +
      (date_from ? ` departure_date >= '${date_from}' AND` : ' TRUE AND');
    whereStatement =
      whereStatement +
      (date_to ? ` departure_date <= '${date_to}' AND` : ' TRUE AND');
    whereStatement =
      whereStatement + (flight_id ? ` t.flight_id = ${flight_id}` : ' TRUE');

    if (whereStatement !== 'WHERE') {
      sql = `${sql} ${whereStatement}`;
    }

    const [[rows]] = await db.query(sql);

    return res.status(200).json(rows);
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
  let validatedData = {};
  let errors = [];

  if (data.date_from) {
    let [date_from, error] = validateForDate(data.date_from);
    validatedData.date_from = date_from;
    if (error) {
      errors.push({ date_from: error });
    }
  }
  if (data.date_to) {
    let [date_to, error] = validateForDate(data.date_to);
    validatedData.date_to = date_to;
    if (error) {
      errors.push({ date_to: error });
    }
  }
  if (data.flight_id) {
    let [flight_id, error] = validateForLength(data.flight_id, 5);
    validatedData.flight_id = flight_id;
    if (error) {
      errors.push({ flight_id: error });
    }
  }

  if (errors.length > 0) {
    throw { code: 'ER_INVALID', errors };
  }

  return validatedData;
}

export default router;

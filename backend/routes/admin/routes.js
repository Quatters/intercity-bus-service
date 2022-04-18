import { Router } from 'express';
import db from '../../data/db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT route_number, distance_km, r.from, r.to, c1.city AS 'from_city', c2.city AS 'to_city' " +
        'FROM route r ' +
        'LEFT JOIN city c1 ON r.from = c1.city_id ' +
        'LEFT JOIN city c2 ON r.to = c2.city_id ' +
        'ORDER BY route_number ASC'
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const data = getValidatedData(req.body);
    await db.insert('route', data);
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
    const oldData = req.body.oldData;
    const newData = req.body.newData;

    await db.update('route', oldData, newData);
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
  let from = data.from;
  let to = data.to;
  let distance_km = data.distance_km;

  let returnedData = { route_number, to };

  let errors = { route_number: [], to: [], from: [], distance_km: [] };
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
  if (!to) {
    errors.to.push('This field is required.');
    wereErrors = true;
  } else {
    to = +to;
    if (isNaN(to)) {
      errors.to.push('This field must be numeric.');
      wereErrors = true;
    }
  }
  if (from) {
    from = +from;
    returnedData.from = from;
    if (isNaN(from)) {
      errors.from.push('This field must be numeric.');
      wereErrors = true;
    }
  }
  if (distance_km) {
    returnedData.distance_km = distance_km;
    distance_km = +distance_km;
    if (isNaN(distance_km)) {
      errors.distance_km.push('This field must be numeric.');
      wereErrors = true;
    }
  }

  if (wereErrors) {
    throw { code: 'ER_INVALID', errors };
  }

  return returnedData;
}

export default router;

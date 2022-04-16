import { Router } from 'express';
import db from '../../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT bus_number, b.model_id, model, seats_amount ' +
        'FROM bus b ' +
        'JOIN bus_model bm ON b.model_id = bm.model_id ' +
        'ORDER BY bus_number ASC'
    );
    return res.json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const data = getValidatedData(req.body);
    await db.insert('bus', data);
    return res.status(201).json(data);
  } catch (error) {
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

    await db.update('bus', oldData, newData);
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
  let bus_number = data.bus_number;
  let model_id = data.model_id;

  let errors = { bus_number: [], model_id: [] };
  let wereErrors = false;

  if (!bus_number) {
    errors.bus_number.push('This field is required.');
    wereErrors = true;
  } else {
    if (bus_number.length !== 6) {
      errors.route_number.push('This field must be exact 6 characters max.');
      wereErrors = true;
    }
  }
  if (!model_id) {
    errors.model_id.push('This field is required.');
    wereErrors = true;
  }

  if (wereErrors) {
    throw { code: 'ER_INVALID', errors };
  }

  return { bus_number };
}

export default router;

import { Router } from 'express';
import db from '../../db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await db.select('bus_model', '*', { columns: 'model' });
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  try {
    let data = getValidatedData(req.body);
    const model_id = await db.insert('bus_model', data);
    data.model_id = model_id;
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

    await db.update('bus_model', oldData, newData);
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
  let model = data.model;
  let seats_amount = data.seats_amount;

  let errors = { model: [], seats_amount: [] };
  let wereErrors = false;

  if (!model) {
    errors.model.push('This field is required.');
    wereErrors = true;
  }

  if (!seats_amount) {
    errors.seats_amount.push('This field is required.');
    wereErrors = true;
  }

  if (wereErrors) {
    throw { code: 'ER_INVALID', errors };
  }

  return { model, seats_amount };
}

export default router;

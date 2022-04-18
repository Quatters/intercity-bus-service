import { Router } from 'express';
import db from '../../data/db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await db.select('city', '*', { columns: 'city' });
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  try {
    let data = getValidatedData(req.body);
    const city_id = await db.insert('city', data);
    data.city_id = city_id;
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

    await db.update('city', oldData, newData);
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
  let city = data.city;

  let errors = { city: [] };
  let wereErrors = false;

  if (!city) {
    errors.city.push('This field is required.');
    wereErrors = true;
  }

  if (wereErrors) {
    throw { code: 'ER_INVALID', errors };
  }

  return { city };
}

export default router;

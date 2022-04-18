import { Router } from 'express';
import db from '../../db.js';

const router = Router();

router.get('/:flightId', async (req, res) => {
  try {
    const { flightId } = getValidatedData(req.params);
    const [[rows]] = await db.query(`CALL GetFreeSeats(${flightId})`);
    return res.json(rows);
  } catch (error) {
    console.log(error);
    if (error.code === 'ER_INVALID') {
      return res.status(400).json(error);
    }
    return res.status(500).json(error);
  }
});

function getValidatedData(data) {
  let flightId = data.flightId;
  flightId = +flightId;

  if (isNaN(flightId)) {
    const errors = { flightId: ['This field must be numeric.'] };
    throw { code: 'ER_INVALID', errors };
  }

  return { flightId };
}

export default router;

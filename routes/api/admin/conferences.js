const express = require('express');
const { check, validationResult } = require('express-validator');

const auth = require('../../../middleware/auth');
const isAdmin = require('../../../middleware/isAdmin');
const checkObjectId = require('../../../middleware/checkObjectId');
const Conference = require('../../../models/Conference');

const router = express.Router();

// @route    POST api/admin/conferences/
// @desc     Add Conference
// @access   Private Admin
router.post(
  '/',
  auth,
  isAdmin,
  check('title', 'Title is required').notEmpty(),
  check('location', 'Location is required').notEmpty(),
  check('ticketsLeft', 'Tickets Left is required').notEmpty(),
  check('time', 'Time is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, technology, location, ticketsLeft, time } =
      req.body;

    try {
      const newConference = new Conference({
        title,
        description,
        technology,
        location,
        ticketsLeft,
        time: Date.parse(time),
      });

      const conference = await newConference.save();

      res.json(conference);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/admin/conferences/:id
// @desc     Delete a conference
// @access   Private Admin
router.delete('/:id', auth, isAdmin, checkObjectId('id'), async (req, res) => {
  try {
    const conference = await Conference.findById(req.params.id);

    if (!conference) {
      return res.status(404).json({ msg: 'Conference not found' });
    }

    await conference.remove();

    res.json({ msg: 'Conference removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    POST api/admin/conferences/:id
// @desc     Update Conference
// @access   Private
router.put('/:id', auth, isAdmin, checkObjectId('id'), async (req, res) => {
  const updateFields = req.body;
  try {
    // Using upsert option (creates new doc if no match is found):
    let conference = await Conference.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...updateFields } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.json(conference);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');
const Conference = require('../../models/Conference');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route    GET api/conferences
// @desc     Get all conferences
// @access   Private Customer/admin
router.get('/', auth, async (req, res) => {
  try {
    const conferences = await Conference.find().sort({ date: -1 });
    res.json(conferences);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/conferences/:id/:ticketCount
// @desc     Book tickets
// @access   Private Customer
router.post('/:conferenceId/:ticketCount', auth, async (req, res) => {
  const ticketCount = req.params.ticketCount;
  if (ticketCount > 2 || ticketCount < 1) {
    return res.status(400).json({ msg: 'Ticket count invalid' });
  }
  try {
    const conferenceId = req.params.conferenceId;
    const conferences = await Conference.findById(conferenceId);
    if (ticketCount > conferences.ticketsLeft) {
      return res
        .status(400)
        .json({ msg: `Tickets left: ${conferences.ticketsLeft} ` });
    }
    const userId = req.user.id;

    const status = await bookTicket(userId, conferenceId, ticketCount);
    if (status) {
      res.json(conferences);
    } else {
      return res.status(400).json({ msg: 'Booking Failed' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

async function bookTicket(userId, conferenceId, ticketCount) {
  const session = await User.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const User = await User.findById(userId);

    const decrementTickets = await Conference.findByIdAndUpdate(
      conferenceId,
      {
        $inc: { ticketsLeft: -ticketCount },
      },
      { upsert: true }
    );
    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

module.exports = router;

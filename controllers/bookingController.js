// // controllers/bookingController.js
// const bookingModel = require('../models/bookingModel');

// exports.getAvailableTimeSlots = async (req, res) => {
//   try {
//     const { date, stylistId, serviceDuration } = req.body;

//     const bufferTime = 10;
//     const totalDuration = serviceDuration + bufferTime;
//     const interval = 15;

//     // Get working hours
//     const workingHours = await bookingModel.getWorkingHours(date);

//     let openTime = '08:00:00';
//     let closeTime = '18:00:00';

//     if (workingHours) {
//       if (workingHours.is_closed) {
//         return res.json({ availableSlots: [] });
//       }
//       openTime = workingHours.open_time;
//       closeTime = workingHours.close_time;
//     }

//     const segments = generateTimeSegments(openTime, closeTime, interval);

//     const appointments = await bookingModel.getAppointmentsByDate(date, stylistId);
//     const blockedSlots = new Set();

//     appointments.forEach(app => {
//       const duration = app.time_duration + bufferTime;
//       const start = app.appointment_time;
//       const blocksNeeded = Math.ceil(duration / interval);
//       const blocked = getBlockedSlots(start, blocksNeeded, segments);
//       blocked.forEach(slot => blockedSlots.add(slot));
//     });

//     const requiredBlocks = Math.ceil(totalDuration / interval);
//     const availableSlots = [];

//     for (let i = 0; i <= segments.length - requiredBlocks; i++) {
//       const slice = segments.slice(i, i + requiredBlocks);
//       const isBlocked = slice.some(time => blockedSlots.has(time));
//       if (!isBlocked) {
//         availableSlots.push(slice[0]);
//       }
//     }

//     res.json({ availableSlots });
//   } catch (err) {
//     console.error('Error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Helpers
// function generateTimeSegments(start, end, stepMinutes) {
//   const segments = [];
//   let current = new Date(`2025-01-01T${start}`);
//   const endTime = new Date(`2025-01-01T${end}`);

//   while (current < endTime) {
//     segments.push(current.toTimeString().substring(0, 5));
//     current.setMinutes(current.getMinutes() + stepMinutes);
//   }

//   return segments;
// }

// function getBlockedSlots(startTime, blocksNeeded, allSegments) {
//   const index = allSegments.indexOf(startTime.substring(0, 5));
//   if (index === -1) return [];
//   return allSegments.slice(index, index + blocksNeeded);
// }








const bookingModel = require('../models/bookingModel');

exports.getAvailableTimeSlots = async (req, res) => {
  try {
    const { date, stylistId, serviceDuration } = req.body;

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const bufferTime = 10;
    const totalDuration = serviceDuration + bufferTime;
    const interval = 15;

    // Get working hours - pass the raw date string
    const workingHours = await bookingModel.getWorkingHours(date);

    let openTime = '08:00:00';
    let closeTime = '18:00:00';

    if (workingHours) {
      if (workingHours.is_closed) {
        return res.json({ availableSlots: [] });
      }
      openTime = workingHours.open_time;
      closeTime = workingHours.close_time;
    }

    const segments = generateTimeSegments(openTime, closeTime, interval);

    // Pass raw date string to model
    const appointments = await bookingModel.getAppointmentsByDate(date, stylistId);
    const blockedSlots = new Set();

    appointments.forEach(app => {
      const duration = app.time_duration + bufferTime;
      const start = app.appointment_time;
      const blocksNeeded = Math.ceil(duration / interval);
      const blocked = getBlockedSlots(start, blocksNeeded, segments);
      blocked.forEach(slot => blockedSlots.add(slot));
    });

    const requiredBlocks = Math.ceil(totalDuration / interval);
    const availableSlots = [];

    for (let i = 0; i <= segments.length - requiredBlocks; i++) {
      const slice = segments.slice(i, i + requiredBlocks);
      const isBlocked = slice.some(time => blockedSlots.has(time));
      if (!isBlocked) {
        availableSlots.push(slice[0]);
      }
    }

    res.json({ availableSlots });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helpers - unchanged
function generateTimeSegments(start, end, stepMinutes) {
  const segments = [];
  let current = new Date(`2025-01-01T${start}`);
  const endTime = new Date(`2025-01-01T${end}`);

  while (current < endTime) {
    segments.push(current.toTimeString().substring(0, 5));
    current.setMinutes(current.getMinutes() + stepMinutes);
  }

  return segments;
}

function getBlockedSlots(startTime, blocksNeeded, allSegments) {
  const index = allSegments.indexOf(startTime.substring(0, 5));
  if (index === -1) return [];
  return allSegments.slice(index, index + blocksNeeded);
}
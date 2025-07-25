
const bookingModel = require('../models/bookingModel');

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to get all dates between two dates
function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// Helper function to generate time segments
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

// Helper function to get blocked slots
function getBlockedSlots(startTime, blocksNeeded, allSegments) {
  const index = allSegments.indexOf(startTime.substring(0, 5));
  if (index === -1) return [];
  return allSegments.slice(index, index + blocksNeeded);
}


exports.getAvailableDates = async (req, res) => {
  try {
    const { startDate, endDate, stylistId, serviceDuration } = req.body;

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    // Get all dates in the range
    const dates = getDatesInRange(startDate, endDate);
    const availableDates = [];

    // Calculate 12 hours from now cutoff time
    const now = new Date();
    const cutoffTime = new Date(now);
    cutoffTime.setHours(now.getHours() + 12);
    const cutoffDate = formatDate(cutoffTime);

    // For each date, check if there are available slots
    for (const date of dates) {
      const workingHours = await bookingModel.getWorkingHours(date);
      
      // Skip if salon is closed on this date
      if (workingHours && workingHours.is_closed) continue;

      // Check if the day is in the past
      if (new Date(date) < new Date(new Date().setHours(0, 0, 0, 0))) continue;

      // Define open and close times
      let openTime = '08:00:00';
      let closeTime = '18:00:00';

      if (workingHours) {
        openTime = workingHours.open_time;
        closeTime = workingHours.close_time;
      }

      // Calculate time segments for this day
      const bufferTime = 10; 
      const totalDuration = serviceDuration + bufferTime;
      const interval = 15; 
      const segments = generateTimeSegments(openTime, closeTime, interval);

      // Get appointments for this date
      const appointments = await bookingModel.getAppointmentsByDate(date, stylistId);
      const blockedSlots = new Set();

      appointments.forEach(app => {
        const duration = app.time_duration + bufferTime;
        const start = app.appointment_time;
        const blocksNeeded = Math.ceil(duration / interval);
        const blocked = getBlockedSlots(start, blocksNeeded, segments);
        blocked.forEach(slot => blockedSlots.add(slot));
      });

      // Calculate available slots
      const requiredBlocks = Math.ceil(totalDuration / interval);
      let hasAvailableSlot = false;
      const todayDate = formatDate(new Date());
      
      if (date < todayDate) {
        continue;
      } else if (date === todayDate) {
        // Today - need to check individual time slots against cutoff time
        for (let i = 0; i <= segments.length - requiredBlocks; i++) {
          const slice = segments.slice(i, i + requiredBlocks);
          const isBlocked = slice.some(time => blockedSlots.has(time));
          
          // Create a date object for this time slot
          const timeSlotDate = new Date(`${date}T${slice[0]}:00`);
          
          // Check if this time slot is at least 12 hours in the future
          const isAfterCutoff = timeSlotDate >= cutoffTime;
          
          if (!isBlocked && isAfterCutoff) {
            hasAvailableSlot = true;
            break;
          }
        }
      } else if (date === cutoffDate) {
        // Cutoff date - need to check times against cutoff time
        for (let i = 0; i <= segments.length - requiredBlocks; i++) {
          const slice = segments.slice(i, i + requiredBlocks);
          const isBlocked = slice.some(time => blockedSlots.has(time));
          
          // Create a date object for this time slot
          const timeSlotDate = new Date(`${date}T${slice[0]}:00`);
          
          // Check if this time slot is at least 12 hours in the future
          const isAfterCutoff = timeSlotDate >= cutoffTime;
          
          if (!isBlocked && isAfterCutoff) {
            hasAvailableSlot = true;
            break;
          }
        }
      } else {
        // Future date beyond cutoff - just check for availability
        for (let i = 0; i <= segments.length - requiredBlocks; i++) {
          const slice = segments.slice(i, i + requiredBlocks);
          const isBlocked = slice.some(time => blockedSlots.has(time));
          if (!isBlocked) {
            hasAvailableSlot = true;
            break;
          }
        }
      }

      // If there's at least one available slot, add this date to available dates
      if (hasAvailableSlot) {
        availableDates.push(date);
      }
    }

    res.json({ availableDates });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getAvailableTimeSlots = async (req, res) => {
  try {
    const { date, stylistId, serviceDuration } = req.body;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const bufferTime = 10; 
    const totalDuration = serviceDuration + bufferTime;
    const interval = 15; 

    // Get working hours
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

    // Calculate cutoff time (12 hours from now)
    const now = new Date();
    const cutoffTime = new Date(now);
    cutoffTime.setHours(now.getHours() + 12);

    // Generate all possible time slots at the interval
    const allSlots = generateTimeSegments(openTime, closeTime, interval);
    
    // Get appointments for this date
    const appointments = await bookingModel.getAppointmentsByDate(date, stylistId);
    const blockedSlots = new Set();

    // Mark blocked times
    appointments.forEach(app => {
      const duration = app.time_duration + bufferTime;
      const start = app.appointment_time;
      const blocksNeeded = Math.ceil(duration / interval);
      const blocked = getBlockedSlots(start, blocksNeeded, allSlots);
      blocked.forEach(slot => blockedSlots.add(slot));
    });

    const requiredBlocks = Math.ceil(totalDuration / interval);
    const availableSlots = [];

    // Check each potential slot
    for (let i = 0; i <= allSlots.length - requiredBlocks; i++) {
      const slotTime = allSlots[i];
      const slotEndTime = new Date(`2025-01-01T${slotTime}:00`);
      slotEndTime.setMinutes(slotEndTime.getMinutes() + totalDuration);
      
      // Check if slot would end after closing time
      const closingTime = new Date(`2025-01-01T${closeTime}`);
      if (slotEndTime > closingTime) {
        continue; // Skip slots that would end after closing
      }

      // Check if any of the required blocks are blocked
      const isBlocked = allSlots.slice(i, i + requiredBlocks).some(time => blockedSlots.has(time));
      
      // Check if slot is at least 12 hours in the future
      const slotDateTime = new Date(`${date}T${slotTime}:00`);
      const isAfterCutoff = slotDateTime >= cutoffTime;
      
      if (!isBlocked && isAfterCutoff) {
        availableSlots.push(slotTime);
      }
    }

    res.json({ availableSlots });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
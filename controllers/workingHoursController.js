// controllers/workingHoursController.js

const WorkingHours = require('../models/workingHoursModel');

// Create new working hours entry
const createWorkingHours = async (req, res) => {
  try {
    const { date, is_closed, open_time, close_time } = req.body;
    const result = await WorkingHours.create(date, is_closed, open_time, close_time);
    res.status(201).json({ message: "Working hours created successfully", data: result });
  } catch (error) {
    res.status(500).json({ message: "Error creating working hours", error: error.message });
  }
};

// Get all working hours
const getAllWorkingHours = async (req, res) => {
  try {
    const workingHours = await WorkingHours.getAll();
    res.status(200).json({ data: workingHours });
  } catch (error) {
    res.status(500).json({ message: "Error fetching working hours", error: error.message });
  }
};

// Get working hours by date
const getWorkingHoursByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const workingHours = await WorkingHours.getByDate(date);
    if (workingHours) {
      res.status(200).json({ data: workingHours });
    } else {
      res.status(404).json({ message: "No working hours found for this date" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching working hours", error: error.message });
  }
};

// Update working hours entry
const updateWorkingHours = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, is_closed, open_time, close_time } = req.body;
    const result = await WorkingHours.update(id, date, is_closed, open_time, close_time);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Working hours updated successfully" });
    } else {
      res.status(404).json({ message: "Working hours not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating working hours", error: error.message });
  }
};

// Delete working hours entry
const deleteWorkingHours = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await WorkingHours.delete(id);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Working hours deleted successfully" });
    } else {
      res.status(404).json({ message: "Working hours not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting working hours", error: error.message });
  }
};

module.exports = {
  createWorkingHours,
  getAllWorkingHours,
  getWorkingHoursByDate,
  updateWorkingHours,
  deleteWorkingHours,
};

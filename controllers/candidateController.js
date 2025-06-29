const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 
const {
  createCandidateWithPhones,
  getAllCandidates,
  getCandidateById,
  updateCandidateDetails,
  deleteCandidate: deleteCandidateFromDB 
} = require('../models/candidateModel');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Upload resume to Cloudinary
const uploadResume = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      public_id: `candidates/resumes/${Date.now()}` 
    });
    return result.secure_url; 
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Create a new candidate 
const createCandidate = async (req, res) => {
  const { first_name, last_name, email, phone_numbers, reason, resume_url, status } = req.body;

  console.log('Received candidate data:', req.body);

  if (!first_name || !email) {
    return res.status(400).json({ message: 'First name and email are required' });
  }

  if (!resume_url) {
    return res.status(400).json({ message: 'Resume URL is required' });
  }

  try {
    let phoneNumbersArray = [];

    if (phone_numbers) {
      if (typeof phone_numbers === 'string') {
        phoneNumbersArray = [phone_numbers];
      } else if (Array.isArray(phone_numbers)) {
        phoneNumbersArray = phone_numbers;
      }
    }

    const result = await createCandidateWithPhones(
      first_name,
      last_name,
      email,
      resume_url,
      reason,
      status || 'pending', 
      phoneNumbersArray
    );

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating candidate:', error);
    if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('email')) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }
    res.status(500).json({ message: 'Error creating candidate', error: error.message });
  }
};

// Get all candidates
const getCandidates = async (req, res) => {
  try {
    const candidates = await getAllCandidates();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidates', error: error.message });
  }
};

// Get a specific candidate by ID
const getCandidate = async (req, res) => {
  const { candidate_id } = req.params;
  try {
    const candidate = await getCandidateById(candidate_id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidate', error: error.message });
  }
};

// Update candidate details
const updateCandidate = async (req, res) => {
  const { candidate_id } = req.params;
  const { first_name, last_name, email, phone_numbers, reason, resume_url, status } = req.body;

  try {
    const updatedCandidate = await updateCandidateDetails(
      candidate_id,
      first_name,
      last_name,
      email,
      resume_url,
      reason,
      status,
      phone_numbers
    );
    if (!updatedCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json(updatedCandidate);
  } catch (error) {
    res.status(500).json({ message: 'Error updating candidate', error: error.message });
  }
};

// Update only the status of a candidate
const updateCandidateStatus = async (req, res) => {
  const { candidate_id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
   
    const currentCandidate = await getCandidateById(candidate_id);
    
    if (!currentCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    
    const updatedCandidate = await updateCandidateDetails(
      candidate_id,
      currentCandidate.first_name,
      currentCandidate.last_name,
      currentCandidate.email,
      currentCandidate.resume_url,
      currentCandidate.reason,
      status, 
      currentCandidate.phone_numbers 
    );

    res.status(200).json({ 
      message: 'Candidate status updated successfully',
      candidate_id: candidate_id,
      status: status
    });
  } catch (error) {
    console.error('Error in updateCandidateStatus:', error);
    res.status(500).json({ 
      message: 'Error updating candidate status', 
      error: error.message 
    });
  }
};

// Delete a candidate by ID
const removeCandidate = async (req, res) => {
  const { candidate_id } = req.params;

  try {
    const result = await deleteCandidateFromDB(candidate_id);
    if (!result) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting candidate', error: error.message });
  }
};

// Export all controller functions
module.exports = {
  createCandidate,
  getCandidates,
  getCandidate,
  updateCandidate,
  updateCandidateStatus,
  removeCandidate,
  upload,
  uploadResume 
};
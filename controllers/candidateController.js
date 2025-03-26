// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs'); // File system for cleaning up temp files
// const {
//   createCandidateWithPhones,
//   getAllCandidates,
//   getCandidateById,
//   updateCandidateDetails,
//   deleteCandidate: deleteCandidateFromDB // Renaming the imported function
// } = require('../models/candidateModel');

// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Store files temporarily in 'uploads' folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to avoid overwriting
//   }
// });

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === 'application/pdf') {
//       cb(null, true); // Accept only PDF files
//     } else {
//       cb(new Error('Only PDF files are allowed'), false);
//     }
//   }
// });

// // Upload resume to Cloudinary
// const uploadResume = async (filePath) => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       resource_type: 'auto',
//       public_id: `candidates/resumes/${Date.now()}` // Generate a unique ID for the file
//     });
//     return result.secure_url; // Return the Cloudinary URL of the uploaded file
//   } catch (error) {
//     console.error('Error uploading to Cloudinary:', error);
//     throw error;
//   }
// };

// // Create a new candidate along with phone numbers and resume upload
// const createCandidate = async (req, res) => {
//   const { first_name, last_name, email, phone_numbers, reason, resume_url, status } = req.body;

//   console.log('Received candidate data:', req.body);

//   if (!first_name || !email) {
//     return res.status(400).json({ message: 'First name and email are required' });
//   }

//   if (!resume_url) {
//     return res.status(400).json({ message: 'Resume URL is required' });
//   }

//   try {
//     let phoneNumbersArray = [];

//     if (phone_numbers) {
//       if (typeof phone_numbers === 'string') {
//         phoneNumbersArray = [phone_numbers];
//       } else if (Array.isArray(phone_numbers)) {
//         phoneNumbersArray = phone_numbers;
//       }
//     }

//     const result = await createCandidateWithPhones(
//       first_name,
//       last_name,
//       email,
//       resume_url,
//       reason,
//       phoneNumbersArray,
//       status || 'pending' // Default status to 'pending' if not provided
//     );

//     res.status(201).json(result);
//   } catch (error) {
//     console.error('Error creating candidate:', error);
//     if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage.includes('email')) {
//       return res.status(409).json({ message: 'An account with this email already exists' });
//     }
//     res.status(500).json({ message: 'Error creating candidate', error: error.message });
//   }
// };

// // Get all candidates
// const getCandidates = async (req, res) => {
//   try {
//     const candidates = await getAllCandidates();
//     res.status(200).json(candidates);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching candidates', error: error.message });
//   }
// };

// // Get a specific candidate by ID
// const getCandidate = async (req, res) => {
//   const { candidate_id } = req.params;
//   try {
//     const candidate = await getCandidateById(candidate_id);
//     if (!candidate) {
//       return res.status(404).json({ message: 'Candidate not found' });
//     }
//     res.status(200).json(candidate);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching candidate', error: error.message });
//   }
// };

// // Update candidate details
// const updateCandidate = async (req, res) => {
//   const { candidate_id } = req.params;
//   const { first_name, last_name, email, phone_numbers, reason, resume_url, status } = req.body;

//   try {
//     const updatedCandidate = await updateCandidateDetails(
//       candidate_id,
//       first_name,
//       last_name,
//       email,
//       resume_url,
//       reason,
//       phone_numbers,
//       status
//     );
//     if (!updatedCandidate) {
//       return res.status(404).json({ message: 'Candidate not found' });
//     }
//     res.status(200).json(updatedCandidate);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating candidate', error: error.message });
//   }
// };

// // ✅ Update only the status of a candidate
// const updateCandidateStatus = async (req, res) => {
//   const { candidate_id } = req.params;
//   const { status } = req.body;

//   if (!status) {
//     return res.status(400).json({ message: 'Status is required' });
//   }

//   try {
//     const updatedCandidate = await updateCandidateDetails(
//       candidate_id,
//       null, // Keeping first_name unchanged
//       null, // Keeping last_name unchanged
//       null, // Keeping email unchanged
//       null, // Keeping resume_url unchanged
//       null, // Keeping reason unchanged
//       [],   // Keeping phone_numbers unchanged
//       status // ✅ Only updating status
//     );

//     if (!updatedCandidate) {
//       return res.status(404).json({ message: 'Candidate not found' });
//     }

//     res.status(200).json({ message: 'Candidate status updated successfully', updatedCandidate });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating candidate status', error: error.message });
//   }
// };

// // Delete a candidate by ID
// const removeCandidate = async (req, res) => {
//   const { candidate_id } = req.params;

//   try {
//     const result = await deleteCandidateFromDB(candidate_id);
//     if (!result) {
//       return res.status(404).json({ message: 'Candidate not found' });
//     }
//     res.status(200).json({ message: 'Candidate deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting candidate', error: error.message });
//   }
// };

// // ✅ Export all controller functions
// module.exports = {
//   createCandidate,
//   getCandidates,
//   getCandidate,
//   updateCandidate,
//   updateCandidateStatus, // ✅ Make sure this is exported
//   removeCandidate
// };



const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // File system for cleaning up temp files
const {
  createCandidateWithPhones,
  getAllCandidates,
  getCandidateById,
  updateCandidateDetails,
  deleteCandidate: deleteCandidateFromDB // Renaming the imported function
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
    cb(null, 'uploads/'); // Store files temporarily in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to avoid overwriting
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true); // Accept only PDF files
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
      public_id: `candidates/resumes/${Date.now()}` // Generate a unique ID for the file
    });
    return result.secure_url; // Return the Cloudinary URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Create a new candidate along with phone numbers and resume upload
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
      status || 'pending', // Default status to 'pending' if not provided
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
    // First, get the current candidate data
    const currentCandidate = await getCandidateById(candidate_id);
    
    if (!currentCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Call updateCandidateDetails with the correct parameter order
    const updatedCandidate = await updateCandidateDetails(
      candidate_id,
      currentCandidate.first_name,
      currentCandidate.last_name,
      currentCandidate.email,
      currentCandidate.resume_url,
      currentCandidate.reason,
      status, // ✅ The status is in the correct position now
      currentCandidate.phone_numbers // ✅ Using the current phone numbers
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
  upload, // Export multer upload if needed elsewhere
  uploadResume // Export uploadResume if needed elsewhere
};
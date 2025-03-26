// const express = require('express');
// const { 
//   createCandidate, 
//   getCandidates, 
//   getCandidate, 
//   updateCandidate, 
//   removeCandidate
// } = require('../controllers/candidateController');
// const multer = require('multer');

// const router = express.Router();

// // Multer middleware for file upload
// const upload = multer({ dest: 'uploads/' }); // Temporary storage before uploading to Cloudinary

// // Route to handle file upload and candidate creation
// router.post('/', upload.single('resume'), createCandidate); // 'resume' is the name of the field in the form

// // Other CRUD operations
// // Create a new candidate
// router.post('/candidates/create', createCandidate); // Create a new candidate
// router.get('/candidates', getCandidates); // Get all candidates
// router.get('/candidates/:candidate_id', getCandidate); // Get a specific candidate by ID
// router.put('/candidates/:candidate_id', updateCandidate); // Update a candidate's details
// router.delete('/candidates/:candidate_id', removeCandidate); // Delete a candidate by ID

// module.exports = router;


{/*const express = require('express');
const {
   createCandidate,
   getCandidates,
   getCandidate,
   updateCandidate,
   removeCandidate
} = require('../controllers/candidateController');

const router = express.Router();

// CRUD operations
// Create a new candidate - no file upload middleware needed
router.post('/create', createCandidate);
// Get all candidates
router.get('/', getCandidates);
// Get a specific candidate by ID
router.get('/:candidate_id', getCandidate);
// Update a candidate's details
router.put('/:candidate_id', updateCandidate);
// Delete a candidate by ID
router.delete('/:candidate_id', removeCandidate);

module.exports = router; */}


const express = require('express');
const {
   createCandidate,
   getCandidates,
   getCandidate,
   updateCandidate,
   removeCandidate,
   updateCandidateStatus // ✅ Add this function
} = require('../controllers/candidateController');

const router = express.Router();

// CRUD operations
router.post('/create', createCandidate);
router.get('/', getCandidates);
router.get('/:candidate_id', getCandidate);
router.put('/:candidate_id', updateCandidate);
router.put('/:candidate_id/status', updateCandidateStatus); // ✅ New route for updating status
router.delete('/:candidate_id', removeCandidate);

module.exports = router;


const express = require('express');
const {
   createCandidate,
   getCandidates,
   getCandidate,
   updateCandidate,
   removeCandidate,
   updateCandidateStatus 
} = require('../controllers/candidateController');

const router = express.Router();

router.post('/create', createCandidate);
router.get('/', getCandidates);
router.get('/:candidate_id', getCandidate);
router.put('/:candidate_id', updateCandidate);
router.put('/:candidate_id/status', updateCandidateStatus);
router.delete('/:candidate_id', removeCandidate);

module.exports = router;

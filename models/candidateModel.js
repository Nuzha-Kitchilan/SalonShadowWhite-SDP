// models/candidateModel.js
const pool = require('../config/db');

// Create a new candidate along with phone numbers, reason, and status
const createCandidateWithPhones = async (first_name, last_name, email, resume_url, reason, status, phone_numbers) => {
  try {
    // Create candidate record with the reason and status
    const [candidateResult] = await pool.execute(
      `INSERT INTO Candidate (first_name, last_name, email, resume_url, reason, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, resume_url, reason, status]
    );
    const candidate_id = candidateResult.insertId;

    // Add associated phone numbers
    if (phone_numbers && phone_numbers.length > 0) {
      const phoneValues = phone_numbers.map(phone_num => [candidate_id, phone_num]);
      await pool.query(
        `INSERT INTO Candidate_Phone_Num (candidate_id, phone_num) VALUES ?`,
        [phoneValues]
      );
    }

    return { candidate_id, message: 'Candidate and phone numbers added successfully' };
  } catch (error) {
    console.error('Error creating candidate with phone numbers:', error);
    throw error;
  }
};

// Get all candidates along with their phone numbers, reason, and status
const getAllCandidates = async () => {
  try {
    const [candidates] = await pool.execute(`SELECT * FROM Candidate`);
    const [phones] = await pool.execute(`SELECT * FROM Candidate_Phone_Num`);
    
    // Merge candidates with their phone numbers
    const mergedData = candidates.map(candidate => {
      const candidatePhones = phones.filter(phone => phone.candidate_id === candidate.candidate_id);
      return { ...candidate, phone_numbers: candidatePhones.map(phone => phone.phone_num) };
    });
    
    return mergedData;
  } catch (error) {
    console.error('Error fetching candidates with phone numbers:', error);
    throw error;
  }
};

// Get a single candidate along with their phone numbers, reason, and status
const getCandidateById = async (candidate_id) => {
  try {
    const [candidate] = await pool.execute(
      `SELECT * FROM Candidate WHERE candidate_id = ?`,
      [candidate_id]
    );
    if (candidate.length === 0) return null;

    const [phones] = await pool.execute(
      `SELECT * FROM Candidate_Phone_Num WHERE candidate_id = ?`,
      [candidate_id]
    );

    return { ...candidate[0], phone_numbers: phones.map(phone => phone.phone_num) };
  } catch (error) {
    console.error('Error fetching candidate by ID:', error);
    throw error;
  }
};

// Update candidate's details (including their phone numbers, reason, and status)
const updateCandidateDetails = async (candidate_id, first_name, last_name, email, resume_url, reason, status, phone_numbers) => {
  try {
    // Update candidate record with the reason and status
    const [result] = await pool.execute(
      `UPDATE Candidate SET first_name = ?, last_name = ?, email = ?, resume_url = ?, reason = ?, status = ? WHERE candidate_id = ?`,
      [first_name, last_name, email, resume_url, reason, status, candidate_id]
    );

    // Delete existing phone numbers and add updated ones
    await pool.execute(`DELETE FROM Candidate_Phone_Num WHERE candidate_id = ?`, [candidate_id]);

    if (phone_numbers && phone_numbers.length > 0) {
      const phoneValues = phone_numbers.map(phone_num => [candidate_id, phone_num]);
      await pool.query(
        `INSERT INTO Candidate_Phone_Num (candidate_id, phone_num) VALUES ?`,
        [phoneValues]
      );
    }

    return result;
  } catch (error) {
    console.error('Error updating candidate and phone numbers:', error);
    throw error;
  }
};

// Delete candidate along with their phone numbers
const deleteCandidate = async (candidate_id) => {
  try {
    // Delete candidate phone numbers first
    await pool.execute(`DELETE FROM Candidate_Phone_Num WHERE candidate_id = ?`, [candidate_id]);

    // Delete candidate record
    const [result] = await pool.execute(
      `DELETE FROM Candidate WHERE candidate_id = ?`,
      [candidate_id]
    );
    return result;
  } catch (error) {
    console.error('Error deleting candidate and phone numbers:', error);
    throw error;
  }
};

module.exports = {
  createCandidateWithPhones,
  getAllCandidates,
  getCandidateById,
  updateCandidateDetails,
  deleteCandidate
};

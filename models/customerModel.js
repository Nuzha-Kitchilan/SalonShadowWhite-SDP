const db = require("../config/db"); // Import the database connection

async function createCustomer(firstname, lastname, email, username, password, phoneNumbers) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
  
      // Insert into Customer table
      const [result] = await connection.execute(
        "INSERT INTO Customer (firstname, lastname, email, username, password) VALUES (?, ?, ?, ?, ?)",
        [firstname, lastname, email, username, password]
      );
  
      const customerId = result.insertId;
  
      // Insert phone numbers if provided
      if (Array.isArray(phoneNumbers) && phoneNumbers.length > 0) {
        for (const number of phoneNumbers) {
          if (number && number.trim() !== '') {
            await connection.execute(
              "INSERT INTO Customer_Phone_Num (customer_ID, phone_num) VALUES (?, ?)",
              [customerId, number.trim()]
            );
          }
        }
      }
  
      await connection.commit();
      return { success: true, customerId };
    } catch (err) {
      await connection.rollback();
      console.error("Database error in createCustomer:", {
        message: err.message,
        code: err.code,
        stack: err.stack
      });
      throw new Error("Error creating customer: " + err.message);
    } finally {
      connection.release();
    }
}

// Get Customer by ID
async function getCustomerById(customer_ID) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM Customer WHERE customer_ID = ?",
      [customer_ID]
    );
    return rows[0]; // Return the first matching customer
  } catch (err) {
    throw new Error("Error fetching customer by ID: " + err.message);
  }
}

// Get Customer by Username (to check if user exists)
async function getCustomerByUsername(username) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM Customer WHERE username = ?",
      [username]
    );
    return rows[0]; // Return the first matching customer
  } catch (err) {
    throw new Error("Error fetching customer by username: " + err.message);
  }
}

// Get Customer by Email (to check if email exists)
async function getCustomerByEmail(email) {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM Customer WHERE email = ?",
      [email]
    );
    return rows[0]; // Return the first matching customer
  } catch (err) {
    throw new Error("Error fetching customer by email: " + err.message);
  }
}

// Update Customer Details
async function updateCustomer(customer_ID, firstname, lastname, email, username, password) {
  try {
    const [result] = await db.execute(
      "UPDATE Customer SET firstname = ?, lastname = ?, email = ?, username = ?, password = ? WHERE customer_ID = ?",
      [firstname, lastname, email, username, password, customer_ID]
    );
    return result;
  } catch (err) {
    throw new Error("Error updating customer: " + err.message);
  }
}

// Delete Customer
async function deleteCustomer(customer_ID) {
  try {
    const [result] = await db.execute(
      "DELETE FROM Customer WHERE customer_ID = ?",
      [customer_ID]
    );
    return result;
  } catch (err) {
    throw new Error("Error deleting customer: " + err.message);
  }
}

// Add Phone Number for Customer
async function addPhoneNumber(customer_ID, phone_num) {
  try {
    const [result] = await db.execute(
      "INSERT INTO Customer_Phone_Num (customer_ID, phone_num) VALUES (?, ?)",
      [customer_ID, phone_num]
    );
    return result;
  } catch (err) {
    throw new Error("Error adding phone number: " + err.message);
  }
}

// Get Customer's Phone Numbers
async function getCustomerPhoneNumbers(customer_ID) {
  try {
    const [rows] = await db.execute(
      "SELECT phone_num FROM Customer_Phone_Num WHERE customer_ID = ?",
      [customer_ID]
    );
    return rows;
  } catch (err) {
    throw new Error("Error fetching phone numbers: " + err.message);
  }
}

// Delete Phone Number for Customer
async function deletePhoneNumber(customer_ID, phone_num) {
  try {
    const [result] = await db.execute(
      "DELETE FROM Customer_Phone_Num WHERE customer_ID = ? AND phone_num = ?",
      [customer_ID, phone_num]
    );
    return result;
  } catch (err) {
    throw new Error("Error deleting phone number: " + err.message);
  }
}

module.exports = {
  createCustomer,
  getCustomerById,
  getCustomerByUsername,
  getCustomerByEmail,  // Added this export
  updateCustomer,
  deleteCustomer,
  addPhoneNumber,
  getCustomerPhoneNumbers,
  deletePhoneNumber,
};
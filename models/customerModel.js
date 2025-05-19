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
// async function getCustomerById(customer_ID) {
//   try {
//     const [rows] = await db.execute(
//       "SELECT * FROM Customer WHERE customer_ID = ?",
//       [customer_ID]
//     );
//     return rows[0]; // Return the first matching customer
//   } catch (err) {
//     throw new Error("Error fetching customer by ID: " + err.message);
//   }
// }



async function getCustomerById(customer_ID) {
  try {
    // Get customer basic info
    const [customerRows] = await db.execute(
      "SELECT * FROM Customer WHERE customer_ID = ?",
      [customer_ID]
    );
    
    if (!customerRows[0]) return null;
    
    // Get customer phone numbers
    const [phoneRows] = await db.execute(
      "SELECT phone_num FROM Customer_Phone_Num WHERE customer_ID = ?",
      [customer_ID]
    );
    
    // Combine results
    return {
      ...customerRows[0],
      phoneNumbers: phoneRows.map(row => row.phone_num)
    };
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



// Backend update function (suggested implementation)
async function updateCustomerProfile(customer_ID, profileData) {
  // Get a connection from the pool
  const connection = await db.getConnection();
  
  try {
    const { firstname, lastname, email, username, phoneNumbers } = profileData;
    
    console.log("Update profile with data:", {
      customer_ID,
      firstname,
      lastname,
      email,
      username,
      phoneNumbers: Array.isArray(phoneNumbers) ? phoneNumbers : [],
      phoneNumbersType: typeof phoneNumbers
    });
    
    // Start a transaction
    await connection.beginTransaction();
    
    // Update customer details
    await connection.execute(
      "UPDATE Customer SET firstname = ?, lastname = ?, email = ?, username = ? WHERE customer_ID = ?",
      [firstname, lastname, email, username, customer_ID]
    );
    
    // Delete existing phone numbers
    await connection.execute(
      "DELETE FROM Customer_Phone_Num WHERE customer_ID = ?",
      [customer_ID]
    );
    
    // Insert new phone numbers if they exist
    if (Array.isArray(phoneNumbers) && phoneNumbers.length > 0) {
      for (const phone of phoneNumbers) {
        await connection.execute(
          "INSERT INTO Customer_Phone_Num (customer_ID, phone_num) VALUES (?, ?)",
          [customer_ID, phone]
        );
      }
    }
    
    // Commit the transaction
    await connection.commit();
    console.log("Profile successfully updated");
    return true;
  } catch (err) {
    // Rollback the transaction on error
    console.error("Error updating profile in model:", err);
    await connection.rollback();
    throw err;
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
}

// Update Customer Password
async function updateCustomerPassword(customer_ID, newPassword) {
  try {
    const [result] = await db.execute(
      "UPDATE Customer SET password = ? WHERE customer_ID = ?",
      [newPassword, customer_ID]
    );
    return { success: true, result };
  } catch (err) {
    throw new Error("Error updating password: " + err.message);
  }
}



async function getAllCustomers(page = 1, limit = 10, search = '') {
  try {
    // First query to get customers with pagination
    let query = `
      SELECT 
        c.customer_ID, 
        c.firstname, 
        c.lastname, 
        c.email, 
        c.username
      FROM Customer c
    `;
    
    let countQuery = "SELECT COUNT(*) as total FROM Customer";
    let params = [];
    
    // Add search functionality if search parameter provided
    if (search) {
      const searchClause = `
        WHERE 
          c.firstname LIKE ? OR 
          c.lastname LIKE ? OR 
          c.email LIKE ? OR 
          c.username LIKE ?
      `;
      
      query += searchClause;
      countQuery += " " + searchClause;
      
      const searchParam = `%${search}%`;
      params = [searchParam, searchParam, searchParam, searchParam];
    }
    
    // Add pagination
    const offset = (page - 1) * limit;
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);
    query += " ORDER BY customer_ID DESC LIMIT " + limitNum + " OFFSET " + offsetNum;
    
    // Execute queries
    const [customers] = await db.execute(query, params);
    
    // Get total count for pagination
    const [countResult] = await db.execute(
      countQuery, 
      search ? [params[0], params[1], params[2], params[3]] : []
    );
    
    const total = countResult[0].total;
    
    // Fetch phone numbers for each customer
    if (customers.length > 0) {
      const customerIds = customers.map(customer => customer.customer_ID);
      
      // Create a placeholder string for the IN clause
      const placeholders = customerIds.map(() => '?').join(',');
      
      const phoneQuery = `
        SELECT 
          customer_ID, 
          phone_num 
        FROM Customer_Phone_Num 
        WHERE customer_ID IN (${placeholders})
      `;
      
      const [phoneResults] = await db.execute(phoneQuery, customerIds);
      
      // Group phone numbers by customer_ID
      const phonesByCustomerId = {};
      phoneResults.forEach(phone => {
        if (!phonesByCustomerId[phone.customer_ID]) {
          phonesByCustomerId[phone.customer_ID] = [];
        }
        phonesByCustomerId[phone.customer_ID].push(phone.phone_num);
      });
      
      // Add phone numbers to each customer
      customers.forEach(customer => {
        customer.phoneNumbers = phonesByCustomerId[customer.customer_ID] || [];
      });
    }
    
    return {
      customers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (err) {
    console.error("Error fetching customers:", err);
    throw new Error("Failed to retrieve customers: " + err.message);
  }
}


// Get customer details by ID with phone numbers
// Updated getCustomerDetailById function with direct SQL query



async function getCustomerDetailById(customerId) {
  const connection = await db.getConnection();

  try {
    // Fetch main customer info
    const [customerRows] = await connection.execute(
      `SELECT customer_ID, firstname, lastname, email, username, is_walk_in 
       FROM Customer 
       WHERE customer_ID = ?`,
      [customerId]
    );

    if (customerRows.length === 0) {
      return null;
    }

    const customer = customerRows[0];

    // Fetch phone numbers
    const [phoneRows] = await connection.execute(
      `SELECT phone_num FROM Customer_Phone_Num WHERE customer_ID = ?`,
      [customerId]
    );

    customer.phoneNumbers = phoneRows.map(row => row.phone_num);

    // Fetch appointment count - ensure proper aliasing and error handling
    const [appointmentRows] = await connection.execute(
      `SELECT COUNT(*) AS appointmentCount FROM Appointment WHERE customer_ID = ?`,
      [customerId]
    );

    // Log the raw result for debugging
    console.log("Appointment count SQL result:", JSON.stringify(appointmentRows));
    
    // Check if we have valid results before assigning
    if (appointmentRows && appointmentRows.length > 0) {
      // Different SQL engines might return COUNT as different field names or types
      // MySQL typically uses the requested alias, but might be lowercase in some cases
      const row = appointmentRows[0];
      
      // Try different possible field names (case-insensitive check)
      const countField = Object.keys(row).find(key => 
        key.toLowerCase() === 'appointmentcount' || 
        key.toLowerCase() === 'appointment_count' || 
        key.toLowerCase() === 'count(*)');
      
      if (countField) {
        // Explicitly convert to number to ensure proper type
        customer.appointmentCount = Number(row[countField]);
        // Handle NaN case
        if (isNaN(customer.appointmentCount)) {
          customer.appointmentCount = 0;
        }
      } else {
        // Fallback if field name isn't found
        customer.appointmentCount = 0;
        console.error("Could not find appointment count field in result:", row);
      }
    } else {
      customer.appointmentCount = 0;
    }

    // Final validation check before returning
    if (customer.appointmentCount === undefined) {
      customer.appointmentCount = 0;
    }

    console.log("Final customer object with appointment count:", {
      customerID: customer.customer_ID,
      hasAppointmentCount: 'appointmentCount' in customer,
      appointmentCountValue: customer.appointmentCount
    });

    return customer;

  } catch (err) {
    console.error("Error in getCustomerDetailById:", err);
    throw err;
  } finally {
    connection.release();
  }
}






// Admin update customer
async function updateCustomer(customerId, updateData) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    const { firstname, lastname, email, username, phoneNumbers } = updateData;
    
    // Update customer basic info
    await connection.execute(
      `UPDATE Customer 
       SET firstname = ?, lastname = ?, email = ?, username = ? 
       WHERE customer_ID = ?`,
      [firstname, lastname, email, username, customerId]
    );
    
    // Handle phone numbers if provided
    if (Array.isArray(phoneNumbers)) {
      // Remove existing phone numbers
      await connection.execute(
        "DELETE FROM Customer_Phone_Num WHERE customer_ID = ?",
        [customerId]
      );
      
      // Add new phone numbers
      for (const phone of phoneNumbers) {
        if (phone && phone.trim()) {
          await connection.execute(
            "INSERT INTO Customer_Phone_Num (customer_ID, phone_num) VALUES (?, ?)",
            [customerId, phone.trim()]
          );
        }
      }
    }
    
    await connection.commit();
    return { success: true };
  } catch (err) {
    await connection.rollback();
    console.error("Error updating customer:", err);
    throw new Error("Failed to update customer: " + err.message);
  } finally {
    connection.release();
  }
}

// Admin reset customer password
async function resetCustomerPassword(customerId, newPassword) {
  try {
    const [result] = await db.execute(
      "UPDATE Customer SET password = ? WHERE customer_ID = ?",
      [newPassword, customerId]
    );
    
    if (result.affectedRows === 0) {
      throw new Error("Customer not found");
    }
    
    return { success: true };
  } catch (err) {
    console.error("Error resetting password:", err);
    throw new Error("Failed to reset password: " + err.message);
  }
}

// Delete customer (if needed)
async function deleteCustomer(customerId) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    // Check if customer has any appointments
    const [appointmentCheck] = await connection.execute(
      "SELECT COUNT(*) as appointmentCount FROM Appointment WHERE customer_ID = ?",
      [customerId]
    );
    
    if (appointmentCheck[0].appointmentCount > 0) {
      throw new Error("Cannot delete customer with existing appointments. Consider deactivating instead.");
    }
    
    // Delete phone numbers first (foreign key constraint)
    await connection.execute(
      "DELETE FROM Customer_Phone_Num WHERE customer_ID = ?",
      [customerId]
    );
    
    // Delete customer
    const [result] = await connection.execute(
      "DELETE FROM Customer WHERE customer_ID = ?",
      [customerId]
    );
    
    if (result.affectedRows === 0) {
      throw new Error("Customer not found");
    }
    
    await connection.commit();
    return { success: true };
  } catch (err) {
    await connection.rollback();
    console.error("Error deleting customer:", err);
    throw new Error(err.message);
  } finally {
    connection.release();
  }
}

// Get customer's appointment history
async function getCustomerAppointments(customerId, page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;

    // Validate inputs
    const parsedCustomerId = Number(customerId);
    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);
    const parsedPage = Number(page);

    if (isNaN(parsedCustomerId) || isNaN(parsedLimit) || isNaN(parsedOffset)) {
      throw new Error("Invalid pagination or customer ID values.");
    }

    // Main appointment fetch query
    const [appointments] = await db.execute(
      `SELECT 
        a.appointment_ID,
        a.appointment_date AS date,
        a.appointment_time AS time_slot,
        a.appointment_status AS status,
        a.cancel_request_time,
        a.cancellation_status,
        s.service_name,
        s.time_duration,
        s.price,
        st.firstname AS stylist_firstname,
        st.lastname AS stylist_lastname
      FROM Appointment a
      LEFT JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
      LEFT JOIN Service s ON ass.service_ID = s.service_ID
      LEFT JOIN stylists st ON ass.stylist_ID = st.stylist_ID
      WHERE a.customer_ID = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
      LIMIT ${parsedLimit} OFFSET ${parsedOffset}`,
      [parsedCustomerId]
    );

    // Total count of appointments
    const [countResult] = await db.execute(
      "SELECT COUNT(*) AS total FROM Appointment WHERE customer_ID = ?",
      [parsedCustomerId]
    );

    const total = countResult[0]?.total || 0;

    return {
      appointments,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit)
      }
    };
  } catch (err) {
    console.error("Error fetching customer appointments:", err);
    throw new Error("Failed to retrieve customer appointments: " + err.message);
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
  updateCustomerProfile,
  updateCustomerPassword,
  getAllCustomers,
  getCustomerDetailById,
  resetCustomerPassword,
  getCustomerAppointments,
  updateCustomerPassword
};
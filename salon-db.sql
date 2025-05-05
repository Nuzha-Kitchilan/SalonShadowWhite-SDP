CREATE DATABASE salon;
USE salon;
-- when u make the tabale payament remove unqiue from the appointment id

CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE admins
ADD COLUMN profile_url VARCHAR(255);

SELECT * FROM admins WHERE username = 'johndoe';

INSERT INTO admins (first_name, last_name, email, username, password, role)
VALUES 
('John', 'Doe', 'john.doe@example.com', 'johndoe', 'hashedpassword1', 'Admin'),
('Jane', 'Smith', 'jane.smith@example.com', 'janesmith', 'hashedpassword2', 'Admin');


update admins
set password = "Ad001#s"
where username = "johndoe";

update admins
set password = "Ad002#s"
where username = "janesmith";


CREATE TABLE ServiceCategory (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    category_name VARCHAR(255) NOT NULL
);

ALTER TABLE ServiceCategory
ADD CONSTRAINT FK_Admin
FOREIGN KEY (admin_id) REFERENCES admins(id);


CREATE TABLE Service (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    admin_id INT NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    time_duration INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES ServiceCategory(category_id) ON DELETE CASCADE
);

ALTER TABLE Service
ADD COLUMN description VARCHAR(500);

INSERT INTO ServiceCategory (admin_id, category_name) VALUES
(1, 'Haircut'),
(1, 'Hair Color');
-- (2, 'Facial Treatment'),
-- (2, 'Massage');

INSERT INTO Service (category_id, admin_id, service_name, time_duration, price, description) VALUES
(1, 1, 'Men’s Haircut', 30, 20.00, hehehe),
(1, 1, 'Women’s Haircut', 45, 35.00, hahahah);
-- (2, 1, 'Hair Coloring - Short', 60, 50.00),
-- (2, 1, 'Hair Coloring - Long', 90, 80.00),
-- (3, 2, 'Basic Facial', 40, 40.00),
-- (3, 2, 'Anti-Aging Facial', 60, 70.00),
-- (4, 2, 'Swedish Massage', 60, 60.00),
-- (4, 2, 'Deep Tissue Massage', 90, 90.00);





CREATE TABLE inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    manufacture_date DATE NOT NULL,
    expire_date DATE NOT NULL,
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);


INSERT INTO inventory (product_name, quantity, price, manufacture_date, expire_date, admin_id)
VALUES
('Shampoo', 50, 15.00, '2023-01-01', '2025-01-01', 1),
('Conditioner', 30, 20.00, '2023-02-01', '2025-02-01', 1);



ALTER TABLE inventory
ADD COLUMN brand VARCHAR(255);

DROP TABLE inventory;

CREATE TABLE inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    manufacture_date DATE NOT NULL,
    expire_date DATE NOT NULL,
    brand VARCHAR(255),  -- New brand column
    admin_id INT,
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

INSERT INTO inventory (product_name, quantity, price, manufacture_date, expire_date, brand, admin_id)
VALUES
('Shampoo', 50, 15.00, '2023-01-01', '2025-01-01', 'BrandX', 1),
('Conditioner', 30, 20.00, '2023-02-01', '2025-02-01', 'BrandY', 1);



CREATE TABLE Customer (
    customer_ID INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);


CREATE TABLE Customer_Phone_Num (
    customer_ID INT,
    phone_num VARCHAR(20) NOT NULL,
    PRIMARY KEY (customer_ID, phone_num),
    FOREIGN KEY (customer_ID) REFERENCES Customer(customer_ID) ON DELETE CASCADE
);


CREATE TABLE Payment (
    payment_ID INT PRIMARY KEY AUTO_INCREMENT,
    customer_ID INT,
    payment_amount DECIMAL(10,2) NOT NULL,
    payment_date DATETIME NOT NULL,
    FOREIGN KEY (customer_ID) REFERENCES Customer(customer_ID) 
);

ALTER TABLE Payment
ADD COLUMN appointment_ID INT UNIQUE,
ADD CONSTRAINT fk_payment_appointment
    FOREIGN KEY (appointment_ID) REFERENCES Appointment(appointment_ID) ON DELETE CASCADE;
    
ALTER TABLE Payment
ADD COLUMN payment_status ENUM('Paid', 'Pending', 'Failed') DEFAULT 'Pending',
ADD COLUMN payment_type ENUM('Online', 'InSalon') DEFAULT 'Online',
ADD COLUMN is_partial BOOLEAN DEFAULT FALSE,
ADD COLUMN is_first_time BOOLEAN DEFAULT FALSE,
ADD COLUMN stripe_payment_intent_id VARCHAR(255),
MODIFY COLUMN payment_date DATETIME NULL; 

ALTER TABLE Payment DROP INDEX appointment_ID;

ALTER TABLE Payment MODIFY COLUMN payment_type VARCHAR(20);

ALTER TABLE Payment
ADD amount_paid DECIMAL(10,2) AFTER payment_amount;

ALTER TABLE Payment 
MODIFY payment_status ENUM('Paid', 'Pending', 'Failed', 'Partially Paid');

ALTER TABLE Payment 
MODIFY payment_status ENUM('Paid', 'Pending', 'Failed', 'Partially Paid', 'Refunded');



-- CREATE TABLE Refund (
   --  refund_ID INT PRIMARY KEY AUTO_INCREMENT,
--    payment_ID INT,
  --  refund_amount DECIMAL(10,2) NOT NULL,
--    refund_fee DECIMAL(10,2) DEFAULT 0.00, -- E.g., 5% fee
--    refund_status ENUM('Pending', 'Processed', 'Rejected') DEFAULT 'Pending',
--    refund_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--    stripe_refund_id VARCHAR(255),

--    FOREIGN KEY (payment_ID) REFERENCES Payment(payment_ID) ON DELETE CASCADE
-- );

-- drop table refund;

CREATE TABLE Refund (
    refund_ID INT PRIMARY KEY AUTO_INCREMENT,
    appointment_ID INT NOT NULL,
    payment_ID INT NOT NULL,
    admin_ID INT, -- Admin who processed the refund
    refund_amount DECIMAL(10,2) NOT NULL,
    refund_status ENUM('Pending', 'Processed', 'Rejected') DEFAULT 'Pending',
    refund_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stripe_refund_id VARCHAR(255),

    FOREIGN KEY (appointment_ID) REFERENCES Appointment(appointment_ID) ON DELETE CASCADE,
    FOREIGN KEY (payment_ID) REFERENCES Payment(payment_ID) ON DELETE CASCADE,
    FOREIGN KEY (admin_ID) REFERENCES Admins (id) ON DELETE SET NULL
);


CREATE TABLE special_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NULL, -- Can be NULL if requests come from non-customers
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    request_details TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_ID) ON DELETE SET NULL
);

CREATE TABLE Customer_Balance (
  balance_ID INT PRIMARY KEY AUTO_INCREMENT,
  customer_ID INT,
  balance_due DECIMAL(10,2),
  reason TEXT,
  related_appointment_ID INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_ID) REFERENCES Customer(customer_ID),
  FOREIGN KEY (related_appointment_ID) REFERENCES Appointment(appointment_ID)
);

drop table Customer_Balance;

CREATE TABLE Appointment (
    appointment_ID INT PRIMARY KEY AUTO_INCREMENT,
    customer_ID INT,
    payment_ID INT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_status ENUM('Scheduled', 'Completed', 'Cancelled') NOT NULL,
    FOREIGN KEY (customer_ID) REFERENCES Customer(customer_ID) ON DELETE SET NULL,
    FOREIGN KEY (payment_ID) REFERENCES Payment(payment_ID) ON DELETE SET NULL
);

ALTER TABLE Appointment
DROP FOREIGN KEY Appointment_ibfk_2;

ALTER TABLE Appointment
DROP COLUMN payment_ID;

ALTER TABLE Appointment
ADD COLUMN cancel_request_time DATETIME NULL,
ADD COLUMN cancellation_status ENUM('None', 'Requested', 'Approved', 'Rejected') DEFAULT 'None';


ALTER TABLE Appointment MODIFY COLUMN appointment_status VARCHAR(20);

describe Appointment;

CREATE TABLE Appointment_Service (
    appointment_ID INT,
    service_ID INT,
    PRIMARY KEY (appointment_ID, service_ID),
    FOREIGN KEY (appointment_ID) REFERENCES Appointment(appointment_ID) ON DELETE CASCADE,
    FOREIGN KEY (service_ID) REFERENCES Service(service_ID) ON DELETE CASCADE
);



CREATE TABLE Stylists (
    stylist_ID INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    profile_url VARCHAR(255), -- Added column for profile picture URL
    house_no VARCHAR(50),
    street VARCHAR(100),
    city VARCHAR(100)
);

ALTER TABLE Stylists
ADD COLUMN description VARCHAR(1000);

ALTER TABLE Stylists
CHANGE COLUMN description bio TEXT;


INSERT INTO Stylists (firstname, lastname, email, username, password, role, house_no, street, city)
VALUES 
('Sophia', 'Johnson', 'sophia.johnson@example.com', 'sophiaj', 'hashedpassword1', 'Hair Stylist', '12A', 'Main Street', 'New York'),
('Michael', 'Smith', 'michael.smith@example.com', 'michaels', 'hashedpassword2', 'Barber', '45B', '2nd Avenue', 'Los Angeles'),
('Emma', 'Brown', 'emma.brown@example.com', 'emmab', 'hashedpassword3', 'Color Specialist', '78C', '3rd Street', 'Chicago');



CREATE TABLE Employee_Phone_Num (
    stylist_ID INT,
    phone_num VARCHAR(20) NOT NULL,
    PRIMARY KEY (stylist_ID, phone_num),
    FOREIGN KEY (stylist_ID) REFERENCES Stylists(stylist_ID) ON DELETE CASCADE
);

INSERT INTO Employee_Phone_Num (stylist_ID, phone_num)
VALUES 
(1, '123-456-7890'),
(1, '987-654-3210'),
(2, '555-123-4567'),
(3, '444-555-6666'),
(3, '111-222-3333');

INSERT INTO Employee_Phone_Num (stylist_ID, phone_num)
VALUES
(1, '123-456-7890'),
(1, '987-654-3210'),
(2, '555-123-4567');

CREATE TABLE Appointment_Stylist (
    stylist_ID INT,
    appointment_ID INT,
    PRIMARY KEY (stylist_ID, appointment_ID),
    FOREIGN KEY (stylist_ID) REFERENCES Stylists(stylist_ID) ON DELETE CASCADE,
    FOREIGN KEY (appointment_ID) REFERENCES Appointment(appointment_ID) ON DELETE CASCADE
);



-- Create the new table
CREATE TABLE Appointment_Service_Stylist (
    appointment_ID INT,
    service_ID INT,
    stylist_ID INT,
    PRIMARY KEY (appointment_ID, service_ID, stylist_ID),
    FOREIGN KEY (appointment_ID) REFERENCES Appointment(appointment_ID) ON DELETE CASCADE,
    FOREIGN KEY (service_ID) REFERENCES Service(service_ID) ON DELETE CASCADE,
    FOREIGN KEY (stylist_ID) REFERENCES Stylists(stylist_ID) ON DELETE CASCADE
);

-- Insert data from existing tables (assuming each service-appointment pair has a stylist)
INSERT INTO Appointment_Service_Stylist (appointment_ID, service_ID, stylist_ID)
SELECT aps.appointment_ID, aps.service_ID, ast.stylist_ID
FROM Appointment_Service aps
JOIN Appointment_Stylist ast ON aps.appointment_ID = ast.appointment_ID;

DROP TABLE Appointment_Stylist;
DROP TABLE Appointment_Service;


CREATE TABLE TimeSlots (
  id INTEGER PRIMARY KEY,
  start_time DATETIME
);
ALTER TABLE TimeSlots MODIFY start_time TIME;

ALTER TABLE TimeSlots MODIFY id INT NOT NULL AUTO_INCREMENT;



INSERT INTO TimeSlots (start_time) VALUES 
('08:00:00'),
('08:15:00'),
('08:30:00'),
('08:45:00'),
('09:00:00'),
('09:15:00'),
('09:30:00'),
('09:45:00'),
('10:00:00'),
('10:15:00'),
('10:30:00'),
('10:45:00'),
('11:00:00'),
('11:15:00'),
('11:30:00'),
('11:45:00'),
('12:00:00'),
('12:15:00'),
('12:30:00'),
('12:45:00'),
('13:00:00'),
('13:15:00'),
('13:30:00'),
('13:45:00'),
('14:00:00'),
('14:15:00'),
('14:30:00'),
('14:45:00'),
('15:00:00'),
('15:15:00'),
('15:30:00'),
('15:45:00'),
('16:00:00'),
('16:15:00'),
('16:30:00'),
('16:45:00'),
('17:00:00'),
('17:15:00'),
('17:30:00'),
('17:45:00');

CREATE TABLE WorkingHours (
  id INT PRIMARY KEY AUTO_INCREMENT,
  date DATE UNIQUE,                  -- Specific date (can be null for default)
  is_closed BOOLEAN DEFAULT FALSE,   -- True if salon is closed that day
  open_time TIME,                    -- Custom opening time
  close_time TIME                    -- Custom closing time
);

INSERT INTO WorkingHours (date, is_closed, open_time, close_time) VALUES
('2025-04-06', true, NULL, NULL),          -- Salon closed on April 6th
('2025-04-07', false, '08:00:00', '18:00:00'), -- Regular working hours (8 AM to 6 PM)
('2025-04-08', false, '08:00:00', '12:00:00'), -- Half-day on April 8th (8 AM to 12 PM)
('2025-04-09', false, '10:00:00', '18:00:00'), -- Late opening (10 AM to 6 PM)
('2025-04-10', true, NULL, NULL),          -- Salon closed on April 10th
('2025-04-11', false, '08:00:00', '18:00:00'); -- Regular working hours on April 11th

SELECT * FROM WorkingHours;

CREATE TABLE Gallery (
  image_id INT AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(255) NOT NULL,
  title VARCHAR(100),
  description TEXT
);

CREATE TABLE Candidate (
    candidate_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    submit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resume_url VARCHAR(255),  -- URL or path to the resume
    reason TEXT NOT NULL  -- Reason why they want to join the salon
);


ALTER TABLE Candidate 
ADD COLUMN status ENUM('pending', 'interviewed', 'accepted', 'rejected') DEFAULT 'pending';




CREATE TABLE Candidate_Phone_Num (
    phone_id INT PRIMARY KEY AUTO_INCREMENT,
    candidate_id INT,  -- Foreign key linking to the Candidate table
    phone_num VARCHAR(15) UNIQUE NOT NULL,  -- You can adjust the length of the phone number if needed
    FOREIGN KEY (candidate_id) REFERENCES Candidate(candidate_id) ON DELETE CASCADE
);


CREATE TABLE Appointment_Cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    service_id INT NOT NULL,
    stylist_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_ID),
    FOREIGN KEY (service_id) REFERENCES Service(service_id),
    FOREIGN KEY (stylist_id) REFERENCES Stylists(stylist_ID)
);

drop table Appointment_Cart;

CREATE TABLE Appointment_Cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    service_id INT NOT NULL,
    stylist_id INT,
    selected_date DATE NOT NULL,         -- ✅ New column for selected date
    selected_time TIME NOT NULL,         -- ✅ New column for selected time
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_ID),
    FOREIGN KEY (service_id) REFERENCES Service(service_id),
    FOREIGN KEY (stylist_id) REFERENCES Stylists(stylist_ID)
);
select * from Appointment_Cart where customer_ID = "1";



SELECT CONSTRAINT_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'Payment'
  AND COLUMN_NAME = 'appointment_ID'
  AND CONSTRAINT_SCHEMA = 'salon';


ALTER TABLE Payment DROP FOREIGN KEY fk_payment_appointment;

ALTER TABLE Payment DROP INDEX appointment_ID;


ALTER TABLE Payment
ADD CONSTRAINT fk_payment_appointment
FOREIGN KEY (appointment_ID)
REFERENCES Appointment(appointment_ID)
ON DELETE CASCADE;

-- when u make the tabale payament remove unqiue from the appointment id
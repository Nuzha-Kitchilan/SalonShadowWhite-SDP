CREATE DATABASE salon;
USE salon;

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
(1, 'Hair Color'),
(2, 'Facial Treatment'),
(2, 'Massage');

INSERT INTO Service (category_id, admin_id, service_name, time_duration, price) VALUES
(1, 1, 'Men’s Haircut', 30, 20.00),
(1, 1, 'Women’s Haircut', 45, 35.00),
(2, 1, 'Hair Coloring - Short', 60, 50.00),
(2, 1, 'Hair Coloring - Long', 90, 80.00),
(3, 2, 'Basic Facial', 40, 40.00),
(3, 2, 'Anti-Aging Facial', 60, 70.00),
(4, 2, 'Swedish Massage', 60, 60.00),
(4, 2, 'Deep Tissue Massage', 90, 90.00);





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
('Conditioner', 30, 20.00, '2023-02-01', '2025-02-01', 2);



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
('Conditioner', 30, 20.00, '2023-02-01', '2025-02-01', 'BrandY', 2);



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



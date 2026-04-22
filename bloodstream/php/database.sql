CREATE DATABASE IF NOT EXISTS bloodstream;
USE bloodstream;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    bloodGroup VARCHAR(5) NOT NULL,
    age INT NOT NULL,
    phone VARCHAR(15) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    address TEXT,
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO donors (fullName, bloodGroup, age, phone, city, state) VALUES
('Animesh Das', 'O-', 28, '9876543210', 'Rayagada', 'Odisha'),
('Sneha Mohanty', 'A+', 24, '8877665544', 'Bhubaneswar', 'Odisha'),
('Vikram Singh', 'B+', 32, '7766554433', 'Rayagada', 'Odisha');

-- Library Management Database Schema
-- Database: library_management

CREATE DATABASE IF NOT EXISTS library_management;
USE library_management;

CREATE TABLE IF NOT EXISTS books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    isbn VARCHAR(17) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    total_copies INT NOT NULL,
    available_copies INT NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(10) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS book_issues (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    returned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (member_id) REFERENCES members(id)
);

-- Sample Data (optional - Hibernate ddl-auto=update will create tables automatically)

INSERT INTO books (title, author, isbn, category, total_copies, available_copies, available, created_at, updated_at) VALUES
('Clean Code', 'Robert Martin', '978-0132350884', 'Programming', 3, 3, TRUE, NOW(), NOW()),
('Effective Java', 'Joshua Bloch', '978-0134685991', 'Programming', 2, 2, TRUE, NOW(), NOW()),
('The Pragmatic Programmer', 'David Thomas', '978-0135957059', 'Programming', 1, 1, TRUE, NOW(), NOW());

INSERT INTO members (name, email, phone, address, created_at, updated_at) VALUES
('John Doe', 'john.doe@email.com', '9876543210', '123 Main Street, City', NOW(), NOW()),
('Jane Smith', 'jane.smith@email.com', '9123456789', '456 Oak Avenue, Town', NOW(), NOW());

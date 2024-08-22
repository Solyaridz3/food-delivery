const setup = ```CREATE TABLE Drivers (
driver_id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
phone VARCHAR(20) NOT NULL,
location VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
status VARCHAR(255) NOT NULL
);
```;

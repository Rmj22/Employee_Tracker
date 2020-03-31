DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_DB;

USE employee_db;

CREATE TABLE department(
  dept_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (dept_id)
);

CREATE TABLE role(
    role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT NOT NULL
    PRIMARY KEY (role_id),
    FOREIGN KEY (dept_id) REFERENCES department(dept_id)
    
);

CREATE TABLE employee(
   emp_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    PRIMARY KEY (emp_id),
    FOREIGN KEY (role_id) REFERENCES department(role_id)
);
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
);

CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) 
    REFERENCES department(id)
);


CREATE TABLE employee (
  id INT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

CREATE INDEX idx_role_department_id ON role(department_id);

CREATE INDEX idx_employee_role_id ON employee(role_id);

CREATE INDEX idx_employee_manager_id ON employee(manager_id);

CREATE TRIGGER tr_employee_manager_id_insert
BEFORE INSERT ON employee
FOR EACH ROW
BEGIN
  IF NEW.manager_id = NEW.id THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Cannot set an employee as their own manager';
  END IF;
END;

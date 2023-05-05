
CREATE VIEW employee_details AS
SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department_name, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
FROM employee e
JOIN role r ON e.role_id = r.id
JOIN department d ON r.department_id = d.id
LEFT JOIN employee m ON e.manager_id = m.id;


CREATE PROCEDURE add_employee (
  IN p_first_name VARCHAR(30),
  IN p_last_name VARCHAR(30),
  IN p_role_id INT,
  IN p_manager_id INT
)
BEGIN
  DECLARE v_id INT;
  INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES (p_first_name, p_last_name, p_role_id, p_manager_id);
  SET v_id = LAST_INSERT_ID();
  SELECT * FROM employee_details WHERE id = v_id;
END;

CREATE PROCEDURE update_employee_manager (
  IN p_employee_id INT,
  IN p_manager_id INT
)
BEGIN
  UPDATE employee SET manager_id = p_manager_id WHERE id = p_employee_id;
  SELECT * FROM employee_details WHERE id = p_employee_id;
END;

CREATE PROCEDURE delete_department (
  IN p_department_id INT
)
BEGIN
  DELETE FROM role WHERE department_id = p_department_id;
  DELETE FROM department WHERE id = p_department_id;
END;

CREATE PROCEDURE delete_role (
  IN p_role_id INT
)
BEGIN
  DELETE FROM employee WHERE role_id = p_role_id;
  DELETE FROM role WHERE id = p_role_id;
END;

CREATE PROCEDURE delete_employee (
  IN p_employee_id INT
)
BEGIN
  DELETE FROM employee WHERE id = p_employee_id;
END;

CREATE VIEW department_budgets AS
SELECT d.name AS department_name, SUM(r.salary) AS total_salary
FROM department d
JOIN role r ON d.id = r.department_id
JOIN employee e ON r.id = e.role_id
GROUP BY d.id;
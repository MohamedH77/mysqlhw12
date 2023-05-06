USE employees_db;

INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('Marketing');

INSERT INTO role (title, salary, department_id) VALUES ('Salesperson', 50000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Sales Manager', 70000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 110000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Software Manager', 160800, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Marketing Coordinator', 45000, 3);
INSERT INTO role (title, salary, department_id) VALUES ('Marketing Manager', 98000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Max', 'Jackjohnson', 6,  NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Ali', 'Swan', 4, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jack', 'Joe', 2, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Micheal', 'Stacy', 5, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Rob', 'Stone', 3, 3);

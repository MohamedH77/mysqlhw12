const mysql = require("mysql2");
const inquirer = require("inquirer");
require("dotenv").config();


const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function mainMenu() {
  inquirer.prompt({
    type: "rawlist",
    name: "action",
    message: "What would you like to do?",
    choices: [
      { name: "View all departments", value: "view_departments" },
      { name: "View all roles", value: "view_roles" },
      { name: "View all employees", value: "view_employees" },
      { name: "Add a department", value: "add_department" },
      { name: "Add a role", value: "add_role" },
      { name: "Add an employee", value: "add_employee" },
      { name: "Update an employee role", value: "update_employee" },
      { name: "Exit", value: "exit" },
    ],
  }, function(err, { action }) {

    if (err) {
      console.error(`Error: ${err.message}\n`);
      return;
    }

    switch (action) {
      case "view_departments":
        viewAllDepartments();
        break;
      case "view_roles":
        viewAllRoles();
        break;
      case "view_employees":
        viewAllEmployees();
        break;
      case "add_department":
        addDepartment();
        break;
      case "add_role":
        addRole();
        break;
      case "add_employee":
        addEmployee();
        break;
      case "update_employee":
        updateEmployeeRole();
        break;
      case "exit":
        console.log("Exiting the application");
        connection.end();
        process.exit(0);
    }
  });
}

function viewAllDepartments() {
  connection.query(
    "SELECT id AS `Department ID`, name AS `Department Name` FROM departments",
    function(err, [rows]) {
      if (err) {
        console.error(`Error: ${err.message}\n`);
        mainMenu();
        return;
      }
      console.log("\n");
      console.table(rows);
      mainMenu();
    }
  );
}

function viewAllRoles() {
  connection.query(
    `
    SELECT roles.id AS 'Role ID', roles.title AS 'Job Title', departments.name AS 'Department', roles.salary AS 'Salary'
    FROM roles
    INNER JOIN departments ON roles.department_id = departments.id
  `,
    function(err, [rows]) {
      if (err) {
        console.error(`Error: ${err.message}\n`);
        mainMenu();
        return;
      }
      console.log("\n");
      console.table(rows);
      mainMenu();
    }
  );
}

function viewAllEmployees() {
  connection.query(
    `
    SELECT employees.id AS 'Employee ID', employees.first_name AS 'First Name', employees.last_name AS 'Last Name',
    roles.title AS 'Job Title', departments.name AS 'Department', roles.salary AS 'Salary',
    CONCAT(managers.first_name, ' ', managers.last_name) AS 'Manager'
    FROM employees
    INNER JOIN roles ON employees.role_id = roles.id
    INNER JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS managers ON employees.manager_id = managers.id
  `,
    function (err, [rows]) {
      if (err) {
        console.error(`Error: ${err.message}\n`);
        mainMenu();
        return;
      }
      console.log("\n");
      console.table(rows);
      mainMenu();
    }
  );
}

async function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "name",
      message: "Enter the department name:",
      validate: (value) => (value ? true : "Please enter the department name."),
    })
    .then((answer) => {
      connection.query(
        "INSERT INTO departments (name) VALUES (?)",
        [answer.name],
        (error, results) => {
          if (error) {
            console.error(`Error adding department: ${error.message}\n`);
          } else {
            console.log(`Added department ${answer.name} successfully!\n`);
          }
          mainMenu();
        }
      );
    })
    .catch((error) => {
      console.error(`Error adding department: ${error.message}\n`);
      mainMenu();
    });
}

mainMenu();
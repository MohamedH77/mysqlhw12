const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
require("dotenv").config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  queueLimit: 0,
});

async function mainMenu() {
  const { action } = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      { name: "View all departments", value: "view_departments" },
      { name: "View all role", value: "view_roles" },
      { name: "View all employees", value: "view_employees" },
      { name: "Add a department", value: "add_department" },
      { name: "Add a role", value: "add_role" },
      { name: "Add an employee", value: "add_employee" },
      { name: "Update an employee role", value: "update_employee" },
      { name: "Exit", value: "exit" },
    ],
  });

  switch (action) {
    case "view_departments":
      await viewAllDepartments();
      break;
    case "view_roles":
      await viewAllRoles();
      break;
    case "view_employees":
      await viewAllEmployees();
      break;
    case "add_department":
      await addDepartment();
      break;
    case "add_role":
      await addRole();
      break;
    case "add_employee":
      await addEmployee();
      break;
    case "update_employee":
      await updateEmployeeRole();
      break;
    case "exit":
      console.log("Exiting the application");
      pool.end();
      process.exit(0);
  }
}

async function viewAllDepartments() {
  const [rows] = await pool.execute(
    "SELECT id AS `department id`, name AS `department name` FROM department"
  );
  console.log("\n");
  console.table(rows);
  mainMenu();
}

async function viewAllRoles() {
  const [rows] = await pool.execute(
    `
    SELECT role.id AS 'Role ID', role.title AS 'Job Title', department.name AS 'Department', role.salary AS 'Salary'
    FROM role
    INNER JOIN department ON role.department_id = department.id
  `
  );
  console.log("\n");
  console.table(rows);
  mainMenu();
}

async function viewAllEmployees() {
  const [rows] = await pool.execute(
    `
    SELECT employee.id AS 'Employee ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name',
    role.title AS 'Job Title', department.name AS 'Department', role.salary AS 'Salary',
    CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
  `
  );
  console.log("\n");
  console.table(rows);
  mainMenu();
}


async function updateEmployeeRole() {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "employeeId",
        message: "Enter the ID of the employee you want to update:",
      },
      {
        type: "input",
        name: "roleId",
        message: "Enter the ID of the new role for the employee:",
      },
    ]);

    const employeeId = answers.employeeId;
    const roleId = answers.roleId;

    const [rows] = await pool.execute(
      "UPDATE employee SET role_id = ? WHERE id = ?",
      [roleId, employeeId]
    );

    console.log(`Updated ${rows.affectedRows} row(s)\n`);
    mainMenu();
  } catch (error) {
    console.error(`Error: ${error.message}\n`);
    mainMenu();
  }
}

async function addRole() {
  try {
    const departments = await pool.execute("SELECT * FROM department");

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the title of the new role:",
      },
      {
        type: "number",
        name: "salary",
        message: "Enter the salary of the new role:",
      },
      {
        type: "list",
        name: "department_id",
        message: "Select the department for the new role:",
        choices: departments[0].map((department) => ({
          name: department.name,
          value: department.id,
        })),
      },
    ]);

    const { title, salary, department_id } = answers;

    const [rows] = await pool.execute(
      "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
      [title, salary, department_id]
    );

    console.log(`Added ${rows.affectedRows} row(s)\n`);
    mainMenu();
  } catch (error) {
    console.error(`Error: ${error.message}\n`);
    mainMenu();
  }
}



async function addDepartment() {
  try {
    const answers = await inquirer.prompt({
      type: "input",
      name: "name",
      message: "Enter the name of the new department:",
    });

    const { name } = answers;

    const [rows] = await pool.execute(
      "INSERT INTO department (name) VALUES (?)",
      [name]
    );

    console.log(`Added ${rows.affectedRows} row(s)\n`);
    mainMenu();
  } catch (error) {
    console.error(`Error: ${error.message}\n`);
    mainMenu();
  }
}


async function addEmployee() {
  try {
    const roles = await pool.execute("SELECT * FROM role");
    const employees = await pool.execute("SELECT * FROM employee");

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "first_name",
        message: "Enter the first name of the employee:",
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter the last name of the employee:",
      },
      {
        type: "list",
        name: "role_id",
        message: "Select the role for the employee:",
        choices: roles[0].map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
      {
        type: "list",
        name: "manager_id",
        message: "Select the manager for the employee:",
        choices: [{ name: "None", value: null }].concat(
          employees[0].map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          }))
        ),
      },
    ]);

    const { first_name, last_name, role_id, manager_id } = answers;

    const [rows] = await pool.execute(
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
      [first_name, last_name, role_id, manager_id]
    );

    console.log(`Added ${rows.affectedRows} row(s)\n`);
    mainMenu();
  } catch (error) {
    console.error(`Error: ${error.message}\n`);
    mainMenu();
  }
}



mainMenu();

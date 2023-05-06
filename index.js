require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

async function mainMenu() {
  const { action } = await inquirer.prompt({
    type: 'rawlist',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      { name: 'View all departments', value: 'view_departments' },
      { name: 'View all roles', value: 'view_roles' },
      { name: 'View all employees', value: 'view_employees' },
      { name: 'Add a department', value: 'add_department' },
      { name: 'Add a role', value: 'add_role' },
      { name: 'Add an employee', value: 'add_employee' },
      { name: 'Update an employee role', value: 'update_employee' },
      { name: 'Exit', value: 'exit' }
    ]
  });

  switch (action) {
    case 'view_departments':
      await viewAllDepartments();
      break;
    case 'view_roles':
      await viewAllRoles();
      break;
    case 'view_employees':
      await viewAllEmployees();
      break;
    case 'add_department':
      await addDepartment();
      break;
    case 'add_role':
      await addRole();
      break;
    case 'add_employee':
      await addEmployee();
      break;
    case 'update_employee':
      await updateEmployeeRole();
      break;
    case 'exit':
      console.log('Exiting the application');
      connection.end();
      process.exit(0);
  }
}

async function viewAllDepartments() {
  const [rows] = await connection.query('SELECT id AS `Department ID`, name AS `Department Name` FROM departments');
  console.log('\n');
  console.table(rows);
  await mainMenu();
}

async function viewAllRoles() {
  const [rows] = await connection.query(`
    SELECT roles.id AS 'Role ID', roles.title AS 'Job Title', departments.name AS 'Department', roles.salary AS 'Salary'
    FROM roles
    INNER JOIN departments ON roles.department_id = departments.id
  `);
  console.log('\n');
  console.table(rows);
  await mainMenu();
}

async function viewAllEmployees() {
  const [rows] = await connection.query(`
    SELECT employees.id AS 'Employee ID', employees.first_name AS 'First Name', employees.last_name AS 'Last Name',
    roles.title AS 'Job Title', departments.name AS 'Department', roles.salary AS 'Salary',
    CONCAT(managers.first_name, ' ', managers.last_name) AS 'Manager'
    FROM employees
    INNER JOIN roles ON employees.role_id = roles.id
    INNER JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS managers ON employees.manager_id = managers.id
  `);
  console.log('\n');
  console.table(rows);
  await mainMenu();
}

async function addDepartment() {
  try {
    const { name } = await inquirer.prompt({
      type: "input",
      name: "name",
      message: "Enter the department name:",
      validate: (value) => (value ? true : "Please enter the department name."),
    });

    await connection.execute("INSERT INTO departments (name) VALUES (?)", [
      name,
    ]);
    console.log(`Added department ${name} successfully!\n`);

    await mainMenu();
  } catch (error) {
    console.error(`Error adding department: ${error.message}\n`);
    await mainMenu();
  }
};


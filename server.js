const inq = require("inquirer");
const mysql = require("mysql");
require("console.table");

const connection = mysql.createConnection({
   host: "localhost",

   // Your port; if not 3306
   port: 3306,

   // Your username
   user: "root",

   // Your password
   password: "juanita1",
   database: "employee_db"
});

connection.connect(function(err) {
   if (err) throw err;
   console.log("Connected as id " + connection.threadId + "\n");
   // put code here
});

const questions = [
   {
      name: "startingQuestion",
      type: "list",
      message: "What would you like to do?",
      choices: [
         "Add departments",
         "Add roles",
         "Add employees",
         "View departments",
         "View roles",
         "View employees",
         "Update employee roles",
         "End task"
      ]
   },
   // here is the question for 'add departments'
   {
      name: "departmentName",
      type: "input",
      message: "What is the department's name?"
   }
];

console.log(questions)

function start() {
   inq.prompt(questions).then(function(res) {
      switch (res.startingQuestion) {
         case "Add department":
            addDepartment();
            break;
         case "Add role":
            addRole();
            break;
         case "Add employee":
            addEmployee();
            break;
         case "View department":
            viewDepartment();
            break;
         case "View role":
            viewRoles();
            break;
         case "View employee":
            viewEmployees();
            break;
         case "Update employee role":
            updateEmployeeRole();
            break;
         case "End task":
            connection.end();
      }
   });
}

function addDepartment() {
   inq.prompt(questions[1]).then(function(res) {
      let name = res.departmentName;
      let query = "INSERT INTO departments SET ?";
      connection.query(query, { dept_name: name }, function(err) {
         if (err) throw err;
         start();
      });
   });
}

function viewDepartment() {
   let query = "SELECT * FROM department";
   connection.query(query, function(err, res) {
      if (err) throw err;
   });
}

function addRole() {
   let query = "SELECT * FROM department";
   connection.query(query, function(err, departmentTable) {
      if (err) throw err;
      let allDepartments = [];

      departmentTable.forEach(department => {
         allDepartments.push(department.dept_name);
      });

      const rolesQuestions = [
         // here is the first question for 'add roles'
         {
            name: "whichDpt",
            type: "list",
            message: "Which department would you like to add the role to?",
            choices: allDepartments
         },
         // here is the second question for 'add roles'
         {
            name: "roleTitle",
            type: "input",
            message: "What's the title of the role?"
         },
         // here is the third question for 'add roles'
         {
            name: "roleSalary",
            type: "input",
            message: "What's the salary for this role?"
         }
      ];

      inq.prompt(rolesQuestions).then(function(fullResult) {
         let deptID = "";
         let title = fullResult.roleTitle;
         let salary = fullResult.roleSalary;

         for (let i = 0; i < allDepartments.length; i++) {
            if (fullResult.whichDpt === departmentTable[i].dept_name) {
               deptID = departmentTable[i].dept_id;
            }
         }

         connection.query(
            "INSERT INTO roles SET ?",
            { title: title, salary: salary, dept_id: deptID },
            function(err) {
               if (err) throw err;
               start();
            }
         );
      });
   });
}

function viewRole() {
   let query =
      "SELECT roles.roles_id, roles.title, roles.salary, departments.dept_name FROM roles INNER JOIN departments ON (roles.dept_id = departments.dept_id)";
   connection.query(query, function(err, res) {
      if (err) throw err;
   
     start();
   });
}

function addEmployee() {
   let query = "SELECT * FROM roles";
   connection.query(query, function(err, rolesTable) {
      if (err) throw err;
      let allRoles = [];

      rolesTable.forEach(role => {
         allRoles.push(role.title);
      });

      const employeeQuestions = [
         // here is the first question for 'add roles'
         {
            name: "whichRole",
            type: "list",
            message: "Which role will this employee have?",
            choices: allRoles
         },
         // here is the second question for 'add roles'
         {
            name: "employeeFirstName",
            type: "input",
            message: "What's the employee's first name?"
         },
         // here is the third question for 'add roles'
         {
            name: "employeeLastName",
            type: "input",
            message: "What's the employee's last name?"
         }
      ];

      inq.prompt(employeeQuestions).then(function(employee) {
         let roleID;
         let firstName = employee.employeeFirstName;
         let lastName = employee.employeeLastName;

         for (let i = 0; i < allRoles.length; i++) {
            if (employee.whichRole === rolesTable[i].title) {
               roleID = rolesTable[i].roles_id;
            }
         }

         connection.query(
            "INSERT INTO employee SET ?",
            {
               first_name: firstName,
               last_name: lastName,
               roles_id: roleID
            },
            function(err) {
               if (err) throw err;
               start();
            }
         );
      });
   });
}

function viewEmployees() {
   let query =
      "SELECT employee.employee_id, employee.first_name, employee.last_name, roles.title, roles.salary, departments.dept_name FROM employee INNER JOIN roles ON (employee.roles_id = roles.roles_id) INNER JOIN departments ON (roles.dept_id = departments.dept_id)";
   connection.query(query, function(err, res) {
      if (err) throw err;
      
      start();
   });
}

function updateEmployeeRole() {
   let query = "SELECT * FROM roles";
   connection.query(query, function(err, rolesTable) {
      if (err) throw err;
      let allRoles = [];
      rolesTable.forEach(role => {
         allRoles.push(role.title);
      });
      const updateQuestions = [
         // here is the first question for 'add roles'
         {
            name: "whichRole",
            type: "list",
            message: "Which role do you want to update?",
            choices: allRoles
         },
         {
            name: "whichUpdate",
            type: "list",
            message: "What would you like to update?",
            choices: ["Salary", "Title"]
         }
      ];
      inq.prompt(updateQuestions).then(function(role) {
         let roleID;
         for (let i = 0; i < allRoles.length; i++) {
            if (role.whichRole === rolesTable[i].title) {
               roleID = rolesTable[i].roles_id;
            }
         }

         if (role.whichUpdate === "Salary") {
            inq.prompt({
               name: "newSalary",
               type: "input",
               message: "What's the new salary?"
            }).then(function(response) {
               let newSalary = response.newSalary;
               newSalary = parseInt(newSalary);

               let query = `UPDATE roles SET ? WHERE roles_id = ${roleID}`;
               connection.query(query, { salary: newSalary }, function(err) {
                  if (err) throw err;
                  start();
               });
            });
         } else {
            inq.prompt({
               name: "newTitle",
               type: "input",
               message: "What's the new title?"
            }).then(function(response) {
               let newTitle = response.newTitle;
               let query = `UPDATE roles SET ? WHERE roles_id = ${roleID}`;
               connection.query(query, { title: newTitle }, function(err) {
                  if (err) throw err;
                  start();
               });
            });
         }
      });
   });
}

start();
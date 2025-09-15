import mysql from "mysql2/promise";

//? 1: to connect to mysql server
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "9650946277@1234",
  database: "mysql_db",
});
console.log("MySQL Connected Successfully");

//? 2: we need to create a db
// await db.execute(`create database mysql_db`);
// console.log(await db.execute("show databases"));

//? 3: we need to create table
// await db.execute(`
//     CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     username VARCHAR(100) NOT NULL,
//     email VARCHAR(100) NOT NULL UNIQUE
//     );
//     `);
//? 4: is to perform CRUD operation
//! insert;
//! Using Inline Values (Not Recommended)
// await db.execute(`
//     insert into users (username, email) values('vinod', 'vinod@thapa.com')
//     `);

//* Using Prepared Statements (Best Practice)
// await db.execute(`insert into users (username, email) values(?,?)`, [
//   "thapa",
//   "thapa@thapa.com",
// ]);

// const values = [
//   ["Alice", "alice@example.com"],
//   ["bob", "bob@example.com"],
//   ["Charlie", "charlie@example.com"],
//   ["David", "david@example.com"],
//   ["Emma", "emma@example.com"],
// ];

// await db.query("insert into users(username, email) values ?", [values]);
//! Read
const [rows] = await db.execute(`select * from users`);
// const [rows] = await db.execute(`select * from users where username="thapa"`);
console.log(rows);

//! update
//? Syntax
// UPDATE table_name
// SET column1 = value1, column2 = value2, ...
// WHERE condition;

// try {
//   const [rows] = await db.execute(
//     "update users SET username= ? where email= ?",
//     ["vinodThapa", "vinod@thapa.com"]
//   );
//   console.log("All Users:", rows);
// } catch (error) {
//   console.error(error);
// }

//? Syntax
// DELETE FROM table_name
// WHERE condition
// try {
//   const [rows] = await db.execute("DELETE FROM users where email=?", [
//     "bob@example.com",
//   ]);
//   console.log("All Users:", rows);
// } catch (error) {
//   console.log(error);
// }

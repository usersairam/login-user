const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
const dbPath = path.join(__dirname, "userData.db");
app.use(express.json());

let dataBase = null;

const initializeDbAndServer = async () => {
  try {
    dataBase = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server  is running at http://localhost:3000/")
    );
  } catch (e) {
    console.log(`DB-Error : ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();
const validatePassword = (password) => password.length > 4;

app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
  const databaseUser = await database.get(selectUserQuery);

  if (databaseUser === undefined) {
    const createUserQuery = `
     INSERT INTO
      user (username, name, password, gender, location)
     VALUES
      (
       '${username}',
       '${name}',
       '${hashedPassword}',
       '${gender}',
       '${location}'  
      );`;
    if (validatePassword(password)) {
      await database.run(createUserQuery);
      response.send("User created successfully");
    } else {
      response.status(400);
      response.send("Password is too short");
    }
  } else {
    response.status(400);
    response.send("User already exists");
  }
});
const isCorrectPassword = (user,password) =>{
    return bcrypt.compare(password,user.password)
}
app.post("/login",async (request,response)=>{
    const { username,password } = request.body;
    const getUserQuery = `SELECT * FROM user WHERE username = `${username}`;`;
    isUser = await dataBase.get(getUserQuery);
    if (isUser===undefined){
        response.status(400);
        response.send("Invalid user");
    }
    else {
        if(isCorrectPassword(isUser,password)===false){
            response.status(400);
            response.send("Invalid password");
        }else {
            response.status(200);
            response.send("Login Success!")
        }
    }
});
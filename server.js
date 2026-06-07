const fs = require("fs");
const { execSync } = require("child_process");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get("/commit", (req, res) => {
  console.log(
    "=====================================Got a new commit========================================="
  );

  var rand = Math.random();
  rand = Math.round(rand * 1000 + 1);
  var str = `This is ${rand} line`;

  setTimeout(() => {
    fs.writeFileSync("data.txt", str, "utf8");
  }, 100);

  setTimeout(() => {
    execSync(`git add .`);
    console.log("Files added to staging area!");
  }, 500);

  setTimeout(() => {
    var result = execSync(`git commit -m "this is ${rand}th commit`);
    console.log(result.toString());
    console.log("Files commited to local repo.");
  }, 1500);

  setTimeout(() => {
    var result = execSync(`git push origin master`);
    console.log(result.toString());
    console.log("Files pushed to remote repo!");
  }, 2500);

  setTimeout(() => {
    res.send("ok");
    console.log("sending back resposne...");
  }, 8000);
});

app.listen(8082, () => console.log("server listening on port 8082"));

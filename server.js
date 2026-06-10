const fs = require("fs");
const { execSync } = require("child_process");

const BRANCH = "master";

function makeCommit() {
  try {
    const rand = Math.floor(Math.random() * 1000000);

    fs.writeFileSync(
      "data.txt",
      `Auto Commit
Random: ${rand}
Timestamp: ${new Date().toISOString()}
`,
      "utf8"
    );

    execSync("git add .", { stdio: "inherit" });

    execSync(
      `git commit -m "Auto commit ${rand}"`,
      { stdio: "inherit" }
    );

    execSync(`git push origin ${BRANCH}`, {
      stdio: "inherit",
    });

    console.log(`Committed & pushed: ${rand}`);
  } catch (err) {
    console.error(err.message);
  }
}

console.log("Auto Commit Bot Started");
console.log("1 Commit Per Second");

setInterval(makeCommit, 1000);

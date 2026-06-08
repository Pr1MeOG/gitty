const fs = require("fs");
const { execSync } = require("child_process");

const BRANCH = "master"; // change to "master" if your repo uses master
const INTERVAL = 30 * 60 * 1000;

function makeCommit() {
  try {
    console.log("\n========================================");
    console.log("Starting automatic commit...");
    console.log("Time:", new Date().toLocaleString());

    const rand = Math.floor(Math.random() * 100000);

    fs.writeFileSync(
      "data.txt",
      `This is auto-generated line ${rand}\nTimestamp: ${new Date().toISOString()}`,
      "utf8"
    );

    console.log("Updated data.txt");

    execSync("git add .", { stdio: "inherit" });

    try {
      execSync(
        `git commit -m "Auto commit ${rand} - ${new Date().toLocaleString()}"`,
        { stdio: "inherit" }
      );
    } catch {
      console.log("No changes detected. Skipping commit.");
      return;
    }

    execSync(`git push origin ${BRANCH}`, {
      stdio: "inherit",
    });

    console.log("Successfully pushed to GitHub!");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

console.log("========================================");
console.log("GitHub Auto Commit Bot Started");
console.log(`Branch: ${BRANCH}`);
console.log(`Interval: ${INTERVAL / 1000} seconds`);
console.log("========================================");

// First commit immediately
makeCommit();

// Then repeat forever
setInterval(makeCommit, INTERVAL);
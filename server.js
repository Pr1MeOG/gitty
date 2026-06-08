const fs = require("fs");
const { execSync } = require("child_process");

const BRANCH = "master";

function getISTTime() {
  const now = new Date();

  return new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  );
}

function makeCommit() {
  try {
    const istNow = getISTTime();

    console.log("\n========================================");
    console.log("Starting automatic commit...");
    console.log("IST Time:", istNow.toLocaleString("en-IN"));

    const rand = Math.floor(Math.random() * 100000);

    fs.writeFileSync(
      "data.txt",
      `This is auto-generated line ${rand}
Timestamp: ${new Date().toISOString()}
IST Time: ${istNow.toLocaleString("en-IN")}
Random: ${Math.random()}`,
      "utf8"
    );

    console.log("Updated data.txt");

    execSync("git add .", { stdio: "inherit" });

    try {
      execSync(
        `git commit -m "Auto commit ${rand} - ${istNow.toLocaleString(
          "en-IN"
        )}"`,
        { stdio: "inherit" }
      );
    } catch {
      console.log("No changes detected. Skipping commit.");
      scheduleNextRun();
      return;
    }

    execSync(`git push origin ${BRANCH}`, {
      stdio: "inherit",
    });

    console.log("Successfully pushed to GitHub!");
  } catch (err) {
    console.error("Error:", err.message);
  }

  scheduleNextRun();
}

function getNextInterval() {
  const istNow = getISTTime();

  const hour = istNow.getHours();
  const minute = istNow.getMinutes();

  // IST: 12:00 AM -> 1:29 AM
  if (hour === 0 || (hour === 1 && minute < 30)) {
    return 5 * 60 * 1000; // 5 minutes
  }

  // Rest of day
  return 60 * 60 * 1000; // 1 hour
}

function scheduleNextRun() {
  const interval = getNextInterval();

  console.log(
    `Next commit in ${Math.floor(interval / 60000)} minutes`
  );

  setTimeout(makeCommit, interval);
}

console.log("========================================");
console.log("GitHub Auto Commit Bot Started");
console.log("Timezone: Asia/Kolkata (IST)");
console.log("12:00 AM - 1:30 AM IST => Every 5 Minutes");
console.log("Rest of Day IST => Every 1 Hour");
console.log("========================================");

makeCommit();
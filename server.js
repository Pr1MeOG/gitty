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

  // 12:00 AM - 12:19 AM
  if (hour === 0 && minute < 20) {
    return 10 * 60 * 1000;
  }

  // 12:20 AM - 1:24 AM
  if (
    (hour === 0 && minute >= 20) ||
    (hour === 1 && minute < 25)
  ) {
    return 30 * 60 * 1000;
  }

  // 1:25 AM - 1:29 AM
  if (hour === 1 && minute >= 25 && minute < 30) {
    return 1000;
  }

  // Rest of Day
  return 30 * 60 * 1000;
}

function scheduleNextRun() {
  const interval = getNextInterval();

  if (interval === 1000) {
    console.log("Next commit in 1 second");
  } else {
    console.log(
      `Next commit in ${Math.floor(interval / 60000)} minutes`
    );
  }

  setTimeout(makeCommit, interval);
}

console.log("========================================");
console.log("GitHub Auto Commit Bot Started");
console.log("Timezone: Asia/Kolkata (IST)");
console.log("12:00 AM - 12:20 AM => Every 10 Minutes");
console.log("12:20 AM - 1:25 AM => Every 30 Minutes");
console.log("1:25 AM - 1:30 AM => Every 1 Second");
console.log("Rest of Day => Every 30 Minutes");
console.log("========================================");

makeCommit();
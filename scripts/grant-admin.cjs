const fs = require("node:fs");
const path = require("node:path");
const number = process.argv[2];
if (!/^\d{10}$/.test(number || "")) {
  console.error("Usage: npm run grant-admin -- <registered 10-digit number>");
  process.exit(1);
}
const database = path.resolve(__dirname, "../db.json");
const data = JSON.parse(fs.readFileSync(database, "utf8"));
const user = data.users.find((entry) => String(entry.number) === number);
if (!user) {
  console.error("Register this number in the app first.");
  process.exit(1);
}
user.role = "admin";
fs.writeFileSync(database, JSON.stringify(data, null, 2) + "\n");
console.log("Local administrator role granted. Sign out and sign in again.");

// Enrich only records that explicitly name a city in their original catalog text.
// Localities and neighboring IDs are deliberately not used to guess a city.
const fs = require("node:fs");
const rules = [
  ["Bengaluru", /\b(?:bengaluru|bangalore)\b/i],
  ["New Delhi", /\b(?:new\s+delhi|delhi)\b/i],
  ["Goa", /\bgoa\b/i],
];
for (const filename of ["db.seed.json", "db.json"]) {
  if (!fs.existsSync(filename)) continue;
  const data = JSON.parse(fs.readFileSync(filename, "utf8"));
  const summary = { added: 0, unmapped: 0 };
  for (const hotel of data.hotel || []) {
    if (hotel.city) continue;
    const text = ["name", "place", "location", "description", "additional", "additional1", "additional2"].map((field) => hotel[field] || "").join(" ");
    const matches = rules.filter(([, pattern]) => pattern.test(text));
    if (matches.length === 1) { hotel.city = matches[0][0]; summary.added++; }
    else summary.unmapped++;
  }
  if (!process.argv.includes("--check")) fs.writeFileSync(filename, JSON.stringify(data, null, 2) + "\n");
  console.log(filename, JSON.stringify(summary), process.argv.includes("--check") ? "(preview only)" : "saved");
}

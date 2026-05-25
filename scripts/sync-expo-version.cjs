#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const nextVersion = process.argv[2];

if (!nextVersion) {
  console.error("Usage: node scripts/sync-expo-version.cjs <version>");
  process.exit(1);
}

const appJsonPath = path.resolve(__dirname, "..", "app.json");
const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));

appJson.expo = appJson.expo || {};
appJson.expo.version = nextVersion;

fs.writeFileSync(appJsonPath, `${JSON.stringify(appJson, null, 2)}\n`);
console.log(`Synced Expo app version to ${nextVersion}.`);

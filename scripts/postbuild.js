#!/usr/bin/env node
import path from "path";
const { log } = console;
import fs from "fs";

const main = async () => {
  log("Changing build file names for extension purpose...");
  const files = fs.readdirSync("./dist/assets");
  files.forEach((fileName) => {
    log(`Renaming ${fileName} to ${"main"}${path.extname(fileName)}`);
    fs.renameSync(
      `./dist/assets/${fileName}`,
      `./dist/assets/${"main"}${path.extname(fileName)}`
    );
  });
  log("Done.")
};

main();

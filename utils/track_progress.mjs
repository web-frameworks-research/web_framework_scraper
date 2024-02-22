import sqlite3 from "better-sqlite3";
import fs from "fs/promises";

const db = sqlite3("store.db", {});
db.exec("CREATE TABLE IF NOT EXISTS progress (domain TEXT PRIMARY KEY, data TEXT, rank INTEGER)");

async function loadDomainsFromDisk(rank) {
    const data = await fs.readFile(`domains_${rank}.txt`, "utf-8");
    const domains = data.trim().split("\n");
    db.exec("INSERT OR REPLACE INTO progress (domain, rank, data) VALUES " + domains.map((domain) => `('${domain}', ${rank}, NULL)`).join(", ") + ";");
    return domains;
}

function remainingDomains(rank) {
    return db.prepare(`SELECT domain FROM progress WHERE data IS NULL AND rank = ${rank}`).all().map((row) => row.domain);
}

function updateProgress(domain, data) {
    db.prepare("INSERT OR REPLACE INTO progress (domain, data) VALUES (?, ?)").run(domain, data);
}

function exitHandler() {
    console.log();
    console.log("saving progress...");
    db.close();
    console.log("progress saved!");
}

process.on("exit", exitHandler);

export { remainingDomains, updateProgress };
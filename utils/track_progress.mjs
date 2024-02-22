import sqlite3 from "sqlite3";
import fs from "fs/promises";

const db = new sqlite3.Database("store.db");
await db.run("CREATE TABLE IF NOT EXISTS progress (domain TEXT PRIMARY KEY, data TEXT, rank INTEGER)");

async function loadDomainsFromDisk(rank) {
    const data = await fs.readFile(`domains_${rank}.txt`, "utf-8");
    const domains = data.split("\n");
    await db.exec("INSERT OR REPLACE INTO progress (domain, rank, data) VALUES " + domains.map((domain) => `('${domain}', ${rank}, NULL)`).join(", ") + ";");
    return domains;
}

function remainingDomains(rank) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT domain FROM progress WHERE data IS NULL AND rank = ${rank}`, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if(rows.length === 0) {
                    loadDomainsFromDisk(rank).then((domains) => {
                        resolve(domains);
                    });
                }
                resolve(rows.map((row) => row.domain));
            }
        });
    });
}

function updateProgress(domain, data) {
    return new Promise((resolve, reject) => {
        db.run("INSERT OR REPLACE INTO progress (domain, data) VALUES (?, ?)", domain, data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export { remainingDomains, updateProgress };
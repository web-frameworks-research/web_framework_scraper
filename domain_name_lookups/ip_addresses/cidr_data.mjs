import { parseIp } from "ip-bigint";
import IPCIDR from "ip-cidr";
import { awsIPAddresses } from "./aws_cidr.mjs";
import { azureIpAddresses } from "./azure_cidr.mjs";
import { googleIPAddresses } from "./google_cidr.mjs";
import { cloudflareIPAddresses } from "./cloudflare_cidr.mjs";
import { githubPagesIPAddresses } from "./github_pages_cidr.mjs";

let allIPAddresses = awsIPAddresses.concat(azureIpAddresses).concat(googleIPAddresses).concat(cloudflareIPAddresses).concat(githubPagesIPAddresses);

for (let i = 0; i < allIPAddresses.length; i++) {
    let ip = new IPCIDR(allIPAddresses[i][0]);
    allIPAddresses[i][0] = [ip.start({ type: "bigInteger" }), ip.end({ type: "bigInteger" })];
}

allIPAddresses.sort((a, b) => a[0][0] > b[0][0] ? 1 : -1);

let allIPAddressesRanges = allIPAddresses.map(([ip, _]) => ip);
let allIPAddressesNames = allIPAddresses.map(([_, name]) => name);
console.log(`Found ${allIPAddresses.length} public cloud IP address ranges.`);

//let totalNumberOfIPAddresses = allIPAddresses.map(([ip, name]) => ip.getAmount()).reduce((a, b) => a + b, 0);
//console.log(`Found ${BigInt(totalNumberOfIPAddresses)} public cloud IP addresses`);

//num is a list of bigints
//rangeList is a list of [bigint, bigint] sorted by the first element
//ranges are guaranteed to not overlap
function rangeListBinaryCheck(num, rangeList) {
    let left = 0;
    let right = rangeList.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const [start, end] = rangeList[mid];

        if (num >= start && num <= end) {
            return mid; // Number is within the current range
        } else if (num < start) {
            right = mid - 1; // Search the left half
        } else {
            left = mid + 1; // Search the right half
        }
    }

    return null; // Number is not within any range
}

function checkIPAddresses(ipAddresses) {
    ipAddresses = ipAddresses.map((str) => parseIp(str).number)
    let results = new Set();
    
    for (let i = 0; i < ipAddresses.length; i++){
        let val = rangeListBinaryCheck(ipAddresses[i], allIPAddressesRanges);
        if (val !== null) {
            results.add(allIPAddressesNames[val]);
        }
    }

    return [...results];
}

export { checkIPAddresses };
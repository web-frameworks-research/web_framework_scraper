import dns from 'node:dns';
import { checkIPAddresses } from './ip_addresses/cidr_data.mjs';

async function getIPAddresses(domainName) {
    const ipv4_addrs = new Promise((resolve, reject) => {
        dns.resolve4(domainName, (err, addresses) => {
            if (err) {
                if (err.code === 'ENODATA') {
                    resolve([]);
                }
                reject(err);
            } else {
                resolve(addresses);
            }
        });
    });
    const ipv6_addrs = new Promise((resolve, reject) => {
        dns.resolve6(domainName, (err, addresses) => {
            if (err) {
                if (err.code === 'ENODATA') {
                    resolve([]);
                }
                reject(err);
            } else {
                resolve(addresses);
            }
        });
    });
    return (await ipv4_addrs).concat(await ipv6_addrs);
}

async function cloudCheck(domainName) {
    const ipAddresses = await getIPAddresses(domainName);
    return checkIPAddresses(ipAddresses);
}

// console.log(await cloudCheck('www.npmjs.com'));
// console.log(await cloudCheck('www.google.com'));
// console.log(await cloudCheck('www.cloudflare.com'));
// console.log(await cloudCheck('www.microsoft.com'));
// console.log(await cloudCheck('www.amazon.com'));
// console.log(await cloudCheck('www.github.com'));
// console.log(await cloudCheck('www.heroku.com'));
// console.log(await cloudCheck('www.digitalocean.com'));
// console.log(await cloudCheck('www.noteflight.com'));
// console.log(await cloudCheck('www.stackpath.com'));
// console.log(await cloudCheck('www.stackoverflow.com'));
// console.log(await cloudCheck('www.oracle.com'));
// console.log(await cloudCheck('www.ibm.com'));   
// console.log(await cloudCheck('mongodb.com'));
// console.log(await cloudCheck('www.mongodb.com'));
// console.log(await cloudCheck('mozilla.org'));
// console.log(await cloudCheck('apple.com'));
// console.log(await cloudCheck('news.ycombinator.com'));
// console.log(await cloudCheck('umd.edu'));
// console.log(await cloudCheck('omduggineni.com'));
// console.log(await cloudCheck('dev.to'));

export { getIPAddresses };
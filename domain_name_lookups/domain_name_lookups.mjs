import Tangerine from 'tangerine';
import { checkIPAddresses } from './ip_addresses/cidr_data.mjs';
import { dnsServerIPAddresses } from './dns_server_data.mjs';

const dns = new Tangerine();

dns.setServers([
    "1.1.1.1",
    "1.0.0.1",
    "8.8.8.8",
    "8.8.4.4",
    ...dnsServerIPAddresses
]);

async function cloudCheck(domainName) {
    const ipAddresses = (await dns.lookup(domainName, { all: true }))
        .map((result) => result.address);
    return checkIPAddresses(ipAddresses);
}

//console.log(await cloudCheck('www.npmjs.com'));
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

export { cloudCheck };
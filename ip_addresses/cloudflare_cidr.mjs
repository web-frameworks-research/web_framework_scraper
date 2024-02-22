const CLOUDFLARE_IPv4_CIDR = "https://www.cloudflare.com/ips-v4/"
const CLOUDFLARE_IPv6_CIDR = "https://www.cloudflare.com/ips-v6/"

const fetchCloudflareIPAddresses = async () => {
    const response_v4 = await fetch(CLOUDFLARE_IPv4_CIDR);
    const response_v6 = await fetch(CLOUDFLARE_IPv6_CIDR);
    
    const data_v4 = await response_v4.text();
    const data_v6 = await response_v6.text();

    return data_v4.trim().split('\n').concat(data_v6.trim().split('\n')).map((cidr) => [cidr, 'Cloudflare']);
}

let cloudflareIPAddresses = await fetchCloudflareIPAddresses();

export { cloudflareIPAddresses };
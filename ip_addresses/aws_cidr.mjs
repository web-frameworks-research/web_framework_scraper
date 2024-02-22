const AWS_IP_ADDRESSES = "https://ip-ranges.amazonaws.com/ip-ranges.json"

const fetchAWSIPAddresses = async () => {
    const response = await fetch(AWS_IP_ADDRESSES);
    
    const data = await response.json();

    function decodePrefix(prefix) {
        if(prefix.ip_prefix) {
            return [prefix.ip_prefix, `Amazon Web Services (${prefix.region})`];
        } else {
            return [prefix.ipv6_prefix, `Amazon Web Services (${prefix.region})`];
        }
    }

    return data.prefixes.map(decodePrefix);
}

let awsIPAddresses = await fetchAWSIPAddresses();

export { awsIPAddresses };
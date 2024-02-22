const GOOGLE_IP_ADDRESSES = "https://www.gstatic.com/ipranges/goog.json"
const GOOGLE_CLOUD_IP_ADDRESSES = "https://www.gstatic.com/ipranges/cloud.json"

const fetchGoogleIPAddresses = async () => {
    const response_google = await fetch(GOOGLE_IP_ADDRESSES);
    const response_cloud = await fetch(GOOGLE_CLOUD_IP_ADDRESSES);
    
    const data_google = await response_google.json();
    const data_cloud = await response_cloud.json();

    function decodePrefix(prefix) {
        if(prefix.ipv4Prefix) {
            return [prefix.ipv4Prefix, 'Google Cloud'];
        } else {
            return [prefix.ipv6Prefix, 'Google Cloud'];
        }
    }

    const cidr_google = data_google.prefixes.map(decodePrefix);
    const cidr_cloud = data_cloud.prefixes.map(decodePrefix);

    return cidr_google.concat(cidr_cloud);
}

let googleIPAddresses = await fetchGoogleIPAddresses();

export { googleIPAddresses };
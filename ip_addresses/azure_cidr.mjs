import { azure_cidr_data } from "./azure_cidr_data.mjs";

let azureIpAddresses = azure_cidr_data.values.map((value) => {
    return value.properties.addressPrefixes.map((addressPrefix) => {
        return [addressPrefix, `Microsoft Azure (${value.name})`];
    });
}).flat();

export { azureIpAddresses };
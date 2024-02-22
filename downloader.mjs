import { cloudCheck } from './domain_name_lookups/domain_name_lookups.mjs';
import { getWhatRunsData } from './whatruns/whatruns_parser.mjs';
import { throttleFunctionCall } from './utils/throttle_function_call.mjs';
import { remainingDomains, updateProgress } from './utils/track_progress.mjs';

const getData = throttleFunctionCall(async (domainName) => {
    try {
        const cloudCheckResult = await cloudCheck(domainName);
        const whatrunsData = await getWhatRunsData(domainName);
        return {
            cloudCheck: cloudCheckResult,
            whatrunsData: whatrunsData,
        };
    } catch (e) {
        console.error(`Error getting data for ${domainName}: ${e}`);
        return null;
    }
}, 25);

const ranks = [
    1000,
    5000,
    10000,
    50000,
    100000,
    500000,
    1000000,
    5000000,
    10000000,
    50000000
];


for (const rank of ranks) {
    console.log(`--------Rank ${rank}--------`);
    const domains = await remainingDomains(rank);
    for (let i = 0; i < domains.length; i++){
        let domainName = domains[i];

        console.log(`(${i}/${domains.length}, rank=${rank}) getting data for ${domainName}`);
        const dataCall = await getData(domainName);
        dataCall().then((data) => {
            updateProgress(domainName, JSON.stringify(data));
        });
    }
}
import { JSDOM } from 'jsdom';
import { parseWhatRunsData } from './whatruns_script_vm.mjs';
import { throttleFunctionCall } from './throttle_function_call.mjs';

const downloadWhatRunsScript = throttleFunctionCall(async (domainName) => {
    const { window } = await JSDOM.fromURL(
        `https://www.whatruns.com/website/${domainName}`,
        {
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        }
    );
    //console.log(window.document.body.parentElement.outerHTML);
    const techNamesScript = window.document.querySelector('body > script:nth-child(6)').textContent;
    //console.log("Downloaded!")
    return techNamesScript;
}, 25);

const getWhatRunsData = async (domainName) => {
    const techNamesScript = await downloadWhatRunsScript(domainName);
    const techNamesObject = parseWhatRunsData(techNamesScript);

    const dates = Object.keys(techNamesObject);
    dates.map(parseInt);
    let latestDate = Math.max(...dates);
    return techNamesObject[latestDate];
};

for (let i = 0; i < 1000000; i++) {
    getWhatRunsData('noteflight.com').then(() => console.log(`done with request ${i}`));
}

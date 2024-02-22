import { JSDOM } from 'jsdom';
import { parseWhatRunsData } from './whatruns_script_vm.mjs';

const downloadWhatRunsScript = async (domainName) => {
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
};

const getWhatRunsData = async (domainName) => {
    const techNamesScript = await downloadWhatRunsScript(domainName);
    const techNamesObject = parseWhatRunsData(techNamesScript);

    const dates = Object.keys(techNamesObject);
    if(dates.length === 0) {
        return { date: null, data: {} };
    }
    dates.map(parseInt);
    let latestDate = Math.max(...dates);
    return { date: latestDate, data: techNamesObject[latestDate] };
}

//console.log(await getWhatRunsData('xalabahia.com'));

export { getWhatRunsData };


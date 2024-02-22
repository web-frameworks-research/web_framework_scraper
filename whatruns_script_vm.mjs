import vm from 'node:vm';
import util from 'node:util';

// an object that will always return itself 
// any of its properties will also return itself
// with the exception of any properties in exceptions
// it is also a function that will return itself
function any(exceptions = {}) {
    let obj = new Proxy(() => { return obj }, {
        get: (target, prop) => {
            if(prop in exceptions) {
                return exceptions[prop];
            }
            return obj;
        },
        getPrototypeOf: () => {
            return obj;
        },
    });
    return obj;
}

function removeOnReadyScope(techNamesScript) {
    // remove "$(document).ready(function(e) {" from the beginning of the script
    // and "})" from the end of the script
    const functionHeaderRegex = /^\$\( *document *\) *\. *ready\( *function\( *e *\) *\{/;
    if (functionHeaderRegex.test(techNamesScript)) {
        techNamesScript = techNamesScript.replace(functionHeaderRegex, '');
    } else {
        throw new Error('Unexpected script format');
    }
    const endingRegex = /\}\);?$/;
    if(endingRegex.test(techNamesScript)) {
        techNamesScript = techNamesScript.replace(endingRegex, '');
    }
    return techNamesScript;
}

function checkTechNamesSchema(value) {
    if(value === undefined || value === null) {
        return false;
    }
    if(typeof value !== 'object') {
        return false;
    }
    if (util.types.isProxy(value)) {
        return false;
    }
    if (value instanceof Array || value instanceof String || value instanceof Number || value instanceof Function) {
        return false;
    }
    let keys = Object.keys(value);
    if (keys.length === 0) {
        return false;
    }
    for (let key of keys) {
        if(typeof key !== 'string') {
            return false;
        }
        let intValue = parseInt(key);
        if (isNaN(intValue) || intValue < 0) {
            return false;
        }
    }
    return true;
}

const document = any({
    innerHTML: '',
    innerText: '',
    textContent: ''
});
const $ = any();
function parseWhatRunsData(techNamesScript) {
    const techNamesScriptContext = {
        $,
        document
    };
    vm.createContext(techNamesScriptContext);

    //console.log(techNamesScript);
    techNamesScript = removeOnReadyScope(techNamesScript);
    // if (SHOULD_FORMAT_SCRIPT) {
    //     import beautify from 'js-beautify';
    //     techNamesScript = beautify(techNamesScript, {
    //         indent_size: 4,
    //         space_in_empty_paren: true
    //     });
    // }
    //console.log(techNamesScript);
    
    const techNamesScriptVm = new vm.Script(techNamesScript);
    techNamesScriptVm.runInContext(techNamesScriptContext);

    delete techNamesScriptContext.$;
    delete techNamesScriptContext.document;

    let objectCandidates = Object.entries(techNamesScriptContext).filter((entry) => {
        return checkTechNamesSchema(entry[1]);
    });

    if(objectCandidates.length === 0) {
        throw new Error('No valid tech names object found');
    } else if(objectCandidates.length > 1) {
        throw new Error('Multiple valid tech names objects found');
    }
    //console.log(`found tech names object at varname ${objectCandidates[0][0]}`)
    const techData = objectCandidates[0][1];
    return techData;
}

export { parseWhatRunsData };
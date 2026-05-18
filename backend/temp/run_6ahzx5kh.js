


/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
    // Write your code here
};

const testCases = [{"input":"intervals = [[1,3],[2,6],[8,10],[15,18]]","expectedOutput":"[[1,6],[8,10],[15,18]]","isSample":true,"_id":"6a0b3ff33ee44eadd2b73c02"},{"input":"intervals = [[1,4],[4,5]]","expectedOutput":"[[1,5]]","isSample":true,"_id":"6a0b3ff33ee44eadd2b73c03"}];
const results = [];

function formatInputToJs(inputStr) {
  let depth = 0;
  let inQuote = null;
  let result = "";
  for (let i = 0; i < inputStr.length; i++) {
    const char = inputStr[i];
    if (char === '"' || char === "'") {
      if (!inQuote) inQuote = char;
      else if (inQuote === char) inQuote = null;
    }
    if (!inQuote) {
      if (char === '[' || char === '{' || char === '(') depth++;
      if (char === ']' || char === '}' || char === ')') depth--;
      if (char === ',' && depth === 0) {
        result += "; var";
        continue;
      }
    }
    result += char;
  }
  return "var " + result + ";";
}
function extractVarNames(inputStr) {
  const varNames = [];
  let depth = 0;
  let inQuote = null;
  let currentVar = "";
  let lookingForVar = true;
  
  for (let i = 0; i < inputStr.length; i++) {
    const char = inputStr[i];
    if (char === '"' || char === "'") {
      if (!inQuote) inQuote = char;
      else if (inQuote === char) inQuote = null;
    }
    if (!inQuote) {
      if (char === '[' || char === '{' || char === '(') depth++;
      if (char === ']' || char === '}' || char === ')') depth--;
      
      if (depth === 0) {
        if (lookingForVar) {
          if (char === '=') {
            varNames.push(currentVar.trim());
            currentVar = "";
            lookingForVar = false;
          } else {
            currentVar += char;
          }
        } else if (char === ',') {
          lookingForVar = true;
        }
      }
    }
  }
  return varNames;
}

for (let i = 0; i < testCases.length; i++) {
  const tc = testCases[i];
  let actual = null;
  let error = null;
  let logs = "";
  
  const originalLog = console.log;
  console.log = (...args) => {
    logs += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
  };
  
  try {
    const jsInputCode = formatInputToJs(tc.input);
    eval(jsInputCode);
    
    const varNames = extractVarNames(tc.input);
    let args = varNames.map(name => eval(name));
    
    if (false) {
      args = args.map((arg, idx) => {
        if (varNames[idx] === 'head' && Array.isArray(arg)) {
          return arrayToLinkedList(arg);
        }
        return arg;
      });
    }
    
    let result = merge(...args);
    
    if (false && result && typeof result === 'object' && 'val' in result) {
      result = linkedListToArray(result);
    }
    
    actual = result;
  } catch (err) {
    error = err.message || String(err);
  } finally {
    console.log = originalLog;
  }
  
  let passed = false;
  try {
    passed = error === null && JSON.stringify(actual) === JSON.stringify(JSON.parse(tc.expectedOutput));
  } catch {
    passed = error === null && String(actual) === String(tc.expectedOutput);
  }
  
  results.push({
    input: tc.input,
    expected: tc.expectedOutput,
    actual: actual !== null ? JSON.stringify(actual) : null,
    passed: passed,
    error,
    logs: logs.trim()
  });
}

console.log("===REPORT_START===" + JSON.stringify(results) + "===REPORT_END===");

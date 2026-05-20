import axios from "axios";

// C++ Linked List definition used in collaborative challenges
const LIST_NODE_DEF_CPP = `
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};
`;

// Simple parser to extract variable arguments from testcase inputs
function parseInputToArgs(inputStr) {
  try {
    let depth = 0;
    let inQuote = null;
    let assignment = "";
    const vars = [];
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
          vars.push(assignment.trim());
          assignment = "";
          continue;
        }
      }
      assignment += char;
    }
    if (assignment) {
      vars.push(assignment.trim());
    }
    
    const varNames = vars.map(v => v.split("=")[0].trim());
    const evalCode = "var " + vars.join(", ") + "; [" + varNames.join(", ") + "]";
    return eval(evalCode);
  } catch (err) {
    console.error("Failed to parse input string:", err);
    return [];
  }
}

const codeExecutionService = {
  execute: async (code, language, problem) => {
    const judge0Url = process.env.JUDGE0_API_URL || "https://ce.judge0.com";
    const firstTestCase = problem.testCases[0];
    const problemTitle = problem.title.toLowerCase();
    
    // Resolve problem key
    let problemKey = "twosum";
    if (problemTitle.includes("parentheses")) problemKey = "parentheses";
    else if (problemTitle.includes("merge")) problemKey = "merge";
    else if (problemTitle.includes("reverse")) problemKey = "reverse";
    else if (problemTitle.includes("longest substring")) problemKey = "longest";

    // Resolve function name
    let functionName = "twoSum";
    if (problemKey === "parentheses") functionName = "isValid";
    else if (problemKey === "merge") functionName = "merge";
    else if (problemKey === "reverse") functionName = "reverseList";
    else if (problemKey === "longest") functionName = "lengthOfLongestSubstring";

    // Parse input arguments for JS/Python
    // In the new static questions format, input is already an array of arguments.
    let args = firstTestCase.input;
    if (typeof args === "string") {
      args = parseInputToArgs(args);
    }

    let wrapperCode = "";
    let languageId = 63; // Node.js

    if (language === "javascript") {
      languageId = 63;
      wrapperCode = `
${code}
try {
  console.log(JSON.stringify(${functionName}(...${JSON.stringify(args)})));
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
`;
    } else if (language === "python") {
      languageId = 71;
      wrapperCode = `
import json
${code}
sol = Solution()
print(json.dumps(sol.${functionName}(*${JSON.stringify(args)})))
`;
    } else if (language === "cpp") {
      languageId = 54; // C++ (GCC 9.2.0)
      
      // Static C++ main drivers for each problem
      if (problemKey === "twosum") {
        wrapperCode = `
#include <iostream>
#include <vector>
#include <string>
using namespace std;

${code}

int main() {
    Solution sol;
    std::vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    auto res = sol.twoSum(nums, target);
    std::cout << "[" << res[0] << "," << res[1] << "]" << std::endl;
    return 0;
}
`;
      } else if (problemKey === "parentheses") {
        wrapperCode = `
#include <iostream>
#include <vector>
#include <string>
using namespace std;

${code}

int main() {
    Solution sol;
    std::string s = "()";
    auto res = sol.isValid(s);
    std::cout << (res ? "true" : "false") << std::endl;
    return 0;
}
`;
      } else if (problemKey === "merge") {
        wrapperCode = `
#include <iostream>
#include <vector>
#include <string>
using namespace std;

${code}

int main() {
    Solution sol;
    std::vector<std::vector<int>> intervals = {{1,3},{2,6},{8,10},{15,18}};
    auto res = sol.merge(intervals);
    std::cout << "[";
    for (size_t i = 0; i < res.size(); ++i) {
        std::cout << "[" << res[i][0] << "," << res[i][1] << "]" << (i + 1 < res.size() ? "," : "");
    }
    std::cout << "]" << std::endl;
    return 0;
}
`;
      } else if (problemKey === "reverse") {
        wrapperCode = `
#include <iostream>
#include <vector>
#include <string>
using namespace std;

${LIST_NODE_DEF_CPP}

${code}

int main() {
    Solution sol;
    ListNode* head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));
    auto res = sol.reverseList(head);
    std::cout << "[";
    while (res) {
        std::cout << res->val << (res->next ? "," : "");
        res = res->next;
    }
    std::cout << "]" << std::endl;
    return 0;
}
`;
      } else if (problemKey === "longest") {
        wrapperCode = `
#include <iostream>
#include <vector>
#include <string>
using namespace std;

${code}

int main() {
    Solution sol;
    std::string s = "abcabcbb";
    auto res = sol.lengthOfLongestSubstring(s);
    std::cout << res << std::endl;
    return 0;
}
`;
      }
    } else {
      return {
        success: false,
        stdout: "",
        stderr: `Language '${language}' is not supported.`,
        compile_output: "",
        status: "Unsupported Language",
        execution_time: "0"
      };
    }

    // Direct Judge0 synchronous POST request
    const url = `${judge0Url.replace(/\/$/, "")}/submissions?base64_encoded=false&wait=true`;
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (process.env.JUDGE0_API_KEY) {
      headers["x-rapidapi-key"] = process.env.JUDGE0_API_KEY;
    }
    if (process.env.JUDGE0_API_HOST) {
      headers["x-rapidapi-host"] = process.env.JUDGE0_API_HOST;
    }

    try {
      const res = await axios.post(url, {
        source_code: wrapperCode,
        language_id: languageId,
        cpu_time_limit: 2.5
      }, {
        headers
      });

      const data = res.data;
      const { status, stdout, stderr, compile_output, time } = data;

      // Extract expected output properly based on the new schema
      let expectedStr = "";
      if (firstTestCase.expected !== undefined) {
         expectedStr = typeof firstTestCase.expected === "string" ? firstTestCase.expected : JSON.stringify(firstTestCase.expected);
      } else if (firstTestCase.expectedOutput !== undefined) {
         expectedStr = String(firstTestCase.expectedOutput);
      }

      const expected = expectedStr.trim();
      const actual = stdout ? stdout.trim() : "";

      let statusDescription = status.description;
      let success = false;

      if (status.id === 3) { // Finished executing successfully
        if (actual === expected || actual.replace(/\s+/g, "") === expected.replace(/\s+/g, "")) {
          statusDescription = "Accepted";
          success = true;
        } else {
          statusDescription = "Wrong Answer";
          success = false;
        }
      }

      return {
        success,
        stdout: stdout || "",
        stderr: stderr || "",
        compile_output: compile_output || "",
        status: statusDescription || "Unknown",
        execution_time: time ? `${Math.round(parseFloat(time) * 1000)} ms` : "0 ms"
      };
    } catch (err) {
      console.error("Judge0 request failed:", err);
      const errMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      return {
        success: false,
        stdout: "",
        stderr: `Failed to connect to execution API: ${errMsg}`,
        compile_output: "",
        status: "Connection Failed",
        execution_time: "0"
      };
    }
  }
};

export default codeExecutionService;

import Problem from "../models/Problem.js";

const sampleProblems = [
  {
    title: "Two Sum",
    difficulty: "easy",
    topic: "arrays",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    boilerplate: [
      {
        language: "javascript",
        code: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your code here\n};"
      },
      {
        language: "python",
        code: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your code here\n        pass"
      },
      {
        language: "cpp",
        code: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n    }\n};"
      }
    ],
    testCases: [
      { input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]", isSample: true },
      { input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]", isSample: true },
      { input: "nums = [3,3], target = 6", expectedOutput: "[0,1]", isSample: false }
    ]
  },
  {
    title: "Valid Parentheses",
    difficulty: "easy",
    topic: "strings",
    description: "Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    boilerplate: [
      {
        language: "javascript",
        code: "/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    // Write your code here\n};"
      },
      {
        language: "python",
        code: "class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write your code here\n        pass"
      },
      {
        language: "cpp",
        code: "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n    }\n};"
      }
    ],
    testCases: [
      { input: 's = "()"', expectedOutput: "true", isSample: true },
      { input: 's = "()[]{}"', expectedOutput: "true", isSample: true },
      { input: 's = "(]"', expectedOutput: "false", isSample: false }
    ]
  },
  {
    title: "Merge Intervals",
    difficulty: "medium",
    topic: "arrays",
    description: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= start_i <= end_i <= 10^4"
    ],
    boilerplate: [
      {
        language: "javascript",
        code: "/**\n * @param {number[][]} intervals\n * @return {number[][]}\n */\nvar merge = function(intervals) {\n    // Write your code here\n};"
      },
      {
        language: "python",
        code: "class Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        # Write your code here\n        pass"
      },
      {
        language: "cpp",
        code: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Write your code here\n    }\n};"
      }
    ],
    testCases: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", expectedOutput: "[[1,6],[8,10],[15,18]]", isSample: true },
      { input: "intervals = [[1,4],[4,5]]", expectedOutput: "[[1,5]]", isSample: true }
    ]
  },
  {
    title: "Reverse Linked List",
    difficulty: "easy",
    topic: "linked-lists",
    description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    boilerplate: [
      {
        language: "javascript",
        code: "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} head\n * @return {ListNode}\n */\nvar reverseList = function(head) {\n    // Write your code here\n};"
      },
      {
        language: "python",
        code: "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your code here\n        pass"
      },
      {
        language: "cpp",
        code: "/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode() : val(0), next(nullptr) {}\n *     ListNode(int x) : val(x), next(nullptr) {}\n *     ListNode(int x, ListNode *next) : val(x), next(next) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        // Write your code here\n    }\n};"
      }
    ],
    testCases: [
      { input: "head = [1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]", isSample: true },
      { input: "head = [1,2]", expectedOutput: "[2,1]", isSample: true },
      { input: "head = []", expectedOutput: "[]", isSample: false }
    ]
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    topic: "strings",
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    boilerplate: [
      {
        language: "javascript",
        code: "/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    // Write your code here\n};"
      },
      {
        language: "python",
        code: "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Write your code here\n        pass"
      },
      {
        language: "cpp",
        code: "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your code here\n    }\n};"
      }
    ],
    testCases: [
      { input: 's = "abcabcbb"', expectedOutput: "3", isSample: true },
      { input: 's = "bbbbb"', expectedOutput: "1", isSample: true },
      { input: 's = "pwwkew"', expectedOutput: "3", isSample: false }
    ]
  }
];

export async function seedInitialProblems() {
  try {
    const count = await Problem.countDocuments();
    const hasCpp = await Problem.findOne({ "boilerplate.language": "cpp" });
    
    if (count === 0 || !hasCpp) {
      console.log("Problems collection empty or missing C++ templates. Re-seeding initial problems...");
      await Problem.deleteMany({});
      await Problem.insertMany(sampleProblems);
      console.log("Initial problems seeded successfully with C++ templates!");
    } else {
      console.log(`Database already has ${count} problems (including C++). Skipping seeding.`);
    }
  } catch (error) {
    console.error("Error seeding problems:", error);
  }
}

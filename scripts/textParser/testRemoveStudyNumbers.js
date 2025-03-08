// Test script for removeStudyNumbers function
const { parseTextToJSON, removeStudyNumbers } = require('./parser2');

// Test function to directly test removeStudyNumbers
function testRemoveStudyNumbers() {
  // Test cases
  const testCases = [
    {
      name: "Basic study numbers",
      input: [
        "this is a 1 sentence that 2 includes study 3 numbers.",
        "4 all the study 5 numbers should be 6 removed.",
        "numbers that 7 do not follow the pattern 8 like this 10, should not 9 be removed."
      ],
      expected: [
        "this is a sentence that includes study numbers.",
        "all the study numbers should be removed.",
        "numbers that do not follow the pattern like this 10, should not be removed."
      ]
    },
    {
      name: "Study numbers with periods",
      input: [
        "this is a .1 sentence with 2. study numbers.",
        ".3 some numbers 4. appear with periods.",
        "numbers that .5 do not follow 6. the pattern like 10. should not .7 be removed."
      ],
      expected: [
        "this is a . sentence with . study numbers.",
        ". some numbers . appear with periods.",
        "numbers that . do not follow . the pattern like 10. should not . be removed."
      ]
    },
    {
      name: "Mixed format study numbers",
      input: [
        "1 This sentence has .2 mixed 3. formats.",
        ".4 Another 5 sentence with 6. different formats.",
        "7. And .8 one 9 more with mixed formats."
      ],
      expected: [
        "This sentence has . mixed . formats.",
        ". Another sentence with . different formats.",
        ". And . one more with mixed formats."
      ]
    },
    {
      name: "Image references",
      input: [
        "1 This is Image 1 with some 2 study numbers.",
        "Image 2. is followed by 3 study numbers.",
        "4 Some study 5 numbers with Image 3 in the middle.",
        "Image 4 at the start and Image 5. at the end 6."
      ],
      expected: [
        "This is Image 1 with some study numbers.",
        "Image 2. is followed by study numbers.",
        "Some study numbers with Image 3 in the middle.",
        "Image 4 at the start and Image 5. at the end ."
      ]
    },
    {
      name: "Both period formats in same line",
      input: [
        "This line has .1 and 2. in the same sentence.",
        "Another line with .3 and 4. and .5 and 6.",
        "Line with 7. followed by .8 and then 9. again."
      ],
      expected: [
        "This line has . and . in the same sentence.",
        "Another line with . and . and . and .",
        "Line with . followed by . and then . again."
      ]
    },
    {
      name: "Study numbers after end of sentence",
      input: [
        "This is the end of a sentence.1 And this continues.",
        "Another example sentence.2 Followed by more text.",
        "Multiple cases in one line.3 Like this.4 And this.5"
      ],
      expected: [
        "This is the end of a sentence. And this continues.",
        "Another example sentence. Followed by more text.",
        "Multiple cases in one line. Like this. And this."
      ]
    }
  ];

  // Run all test cases
  testCases.forEach(testCase => {
    console.log(`\n=== Test Case: ${testCase.name} ===`);
    
    // Get the actual output
    const actualOutput = removeStudyNumbers(testCase.input);

    // Compare and log results
    console.log("Input:", JSON.stringify(testCase.input, null, 2));
    console.log("Expected:", JSON.stringify(testCase.expected, null, 2));
    console.log("Actual:", JSON.stringify(actualOutput, null, 2));
    
    const passed = JSON.stringify(actualOutput) === JSON.stringify(testCase.expected);
    console.log("Test Passed:", passed);
    
    if (!passed) {
      console.log("Differences found!");
    }
  });
}

// Run the test
testRemoveStudyNumbers();

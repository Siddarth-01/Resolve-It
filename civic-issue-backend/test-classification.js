const {
  classifyIssue,
  getCategories,
} = require("./utils/classificationService");

async function testClassification() {
  console.log("🧪 Testing Issue Classification Service\n");

  // Test cases
  const testCases = [
    {
      title: "Broken street light",
      description:
        "The street light on Main Street is not working and it's very dark at night",
    },
    {
      title: "Pothole on highway",
      description:
        "There's a large pothole on the highway that's damaging cars",
    },
    {
      title: "Water leak",
      description:
        "Water is leaking from the main pipe on the corner of 5th and Oak",
    },
    {
      title: "Garbage not collected",
      description:
        "The garbage truck didn't come this week and bins are overflowing",
    },
    {
      title: "Noise complaint",
      description:
        "Loud construction noise at 6 AM is disturbing the neighborhood",
    },
    {
      title: "Park equipment broken",
      description:
        "The swing set in the park is broken and unsafe for children",
    },
  ];

  console.log("📋 Available Categories:");
  const categories = getCategories();
  categories.forEach((category, index) => {
    console.log(`${index + 1}. ${category}`);
  });
  console.log("");

  // Test each case
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n🔍 Test Case ${i + 1}:`);
    console.log(`Title: "${testCase.title}"`);
    console.log(`Description: "${testCase.description}"`);

    try {
      const result = await classifyIssue(testCase.description, testCase.title);
      console.log(`✅ Predicted Category: ${result.category}`);
      console.log(`📊 Confidence: ${Math.round(result.confidence * 100)}%`);
      console.log(`🔧 Method: ${result.method}`);

      if (result.allScores) {
        console.log("📈 All Scores:");
        result.allScores.forEach((score) => {
          console.log(
            `   ${score.category}: ${Math.round(score.score * 100)}%`
          );
        });
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
}

// Run the test
testClassification().catch(console.error);

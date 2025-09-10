const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const fetch = require("node-fetch");

async function testImageUpload() {
  try {
    // Create a simple test image file (just for testing)
    const testImagePath = path.join(__dirname, "test-image.txt");
    fs.writeFileSync(testImagePath, "This is a test file content");

    const form = new FormData();
    form.append("title", "Test Issue with Image");
    form.append(
      "description",
      "This is a test issue to verify image upload functionality"
    );
    form.append("userId", "test-user-123");
    form.append("category", "Testing");
    form.append("location", JSON.stringify({ lat: 40.7128, lng: -74.006 }));

    // Add the test file as image
    const fileStream = fs.createReadStream(testImagePath);
    form.append("image", fileStream, {
      filename: "test-image.txt",
      contentType: "text/plain",
    });

    const response = await fetch("http://localhost:3001/api/issues", {
      method: "POST",
      body: form,
    });

    const result = await response.json();
    console.log("Response status:", response.status);
    console.log("Response data:", JSON.stringify(result, null, 2));

    // Clean up test file
    fs.unlinkSync(testImagePath);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testImageUpload();

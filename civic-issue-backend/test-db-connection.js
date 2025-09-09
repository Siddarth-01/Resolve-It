const mongoose = require("mongoose");
require("dotenv").config();

async function testConnection() {
  try {
    console.log("Testing MongoDB Atlas connection...");
    console.log("Connection string:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas connection successful!");

    // Test creating a simple document
    const testSchema = new mongoose.Schema({
      test: String,
      timestamp: { type: Date, default: Date.now },
    });

    const TestModel = mongoose.model("Test", testSchema);
    const testDoc = new TestModel({ test: "Connection test" });
    await testDoc.save();
    console.log("✅ Successfully created test document");

    // Clean up test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log("✅ Test document cleaned up");

    await mongoose.disconnect();
    console.log("✅ Connection test completed successfully");
  } catch (error) {
    console.error("❌ MongoDB Atlas connection failed:");
    console.error("Error:", error.message);

    if (error.message.includes("IP")) {
      console.log("\n💡 Troubleshooting tips:");
      console.log("1. Check if your IP is whitelisted in MongoDB Atlas");
      console.log("2. Go to Network Access in your Atlas dashboard");
      console.log(
        "3. Add your current IP or use 0.0.0.0/0 for all IPs (development only)"
      );
    }

    if (error.message.includes("authentication")) {
      console.log("\n💡 Authentication issue:");
      console.log("1. Check your username and password");
      console.log("2. Make sure the user has the correct permissions");
    }

    process.exit(1);
  }
}

testConnection();

import mongoose from "mongoose";

const uri = "mongodb://tamilthendralkp_db_user:Samy2007@ac-propfqp-shard-00-00.udypslp.mongodb.net:27017,ac-propfqp-shard-00-01.udypslp.mongodb.net:27017,ac-propfqp-shard-00-02.udypslp.mongodb.net:27017/?ssl=true&replicaSet=atlas-1o396k-shard-0&authSource=admin&appName=cluster0";

console.log("Testing connection to:", uri.replace(/[^:]+:[^@]+@/, "USER:PASS@"));

mongoose.connect(uri)
  .then(() => {
    console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ FAILURE:", err.message);
    process.exit(1);
  });

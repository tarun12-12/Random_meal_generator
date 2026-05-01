import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  searchedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for user-specific queries and aggregation
searchHistorySchema.index({ userId: 1, searchedAt: -1 });

export default mongoose.model("SearchHistory", searchHistorySchema);

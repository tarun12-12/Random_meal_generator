import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mealId: {
    type: String,
    required: true,
  },
  mealName: {
    type: String,
    required: true,
  },
  mealThumb: String,
  category: String,
  area: String,
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate favorites — one user can favorite a meal only once
favoriteSchema.index({ userId: 1, mealId: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);

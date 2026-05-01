import mongoose from "mongoose";

const cookedMealSchema = new mongoose.Schema({
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
  cookedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for fast user queries and aggregation
cookedMealSchema.index({ userId: 1, cookedAt: -1 });
cookedMealSchema.index({ userId: 1, mealId: 1 });

export default mongoose.model("CookedMeal", cookedMealSchema);

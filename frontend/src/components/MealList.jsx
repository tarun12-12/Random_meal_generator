import MealCard from "./MealCard";

export default function MealList({ meals, favoriteIds = [] }) {
  return (
    <div className="meal-list">
      {meals.length === 0 ? (
        <p>No meals found</p>
      ) : (
        meals.map((meal) => (
          <MealCard key={meal.idMeal} meal={meal} favoriteIds={favoriteIds} />
        ))
      )}
    </div>
  );
}
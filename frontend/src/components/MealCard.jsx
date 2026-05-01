import { useState, useContext, useEffect } from "react";
import MealModel from "../context/MealModel";
import { AuthContext } from "../context/AuthContext";
import "../styled/meal.css";

export default function MealCard({ meal, favoriteIds = [] }) {
  const { isAuthenticated, authFetch } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [fullMeal, setFullMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (favoriteIds.includes(meal.idMeal)) {
      setIsFav(true);
    }
  }, [favoriteIds, meal.idMeal]);

  const fetchFullMealDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
      );
      const data = await res.json();
      if (data.meals) {
        setFullMeal(data.meals[0]);
      }
    } catch (error) {
      console.error("Error fetching meal details:", error);
      setFullMeal(meal);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async () => {
    setOpen(true);
    await fetchFullMealDetails();
  };

  const handleHeartClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return;

    try {
      const res = await authFetch("/meals/favorite", {
        method: "POST",
        body: JSON.stringify({
          mealId: meal.idMeal,
          mealName: meal.strMeal,
          mealThumb: meal.strMealThumb || "",
          category: meal.strCategory || "",
          area: meal.strArea || "",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsFav(data.favorited);
      }
    } catch (err) {
      console.error("Favorite toggle error:", err);
    }
  };

  return (
    <>
      <div className="card" onClick={handleCardClick}>
        <div className="card-img-wrapper">
          <img src={meal.strMealThumb} alt={meal.strMeal} />
          {isAuthenticated && (
            <button
              className={`card-heart ${isFav ? "hearted" : ""}`}
              onClick={handleHeartClick}
              title={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              {isFav ? "❤️" : "🤍"}
            </button>
          )}
        </div>
        <h3>{meal.strMeal}</h3>
      </div>

      {open && (
        <MealModel meal={fullMeal || meal} onClose={() => {
          setOpen(false);
          setFullMeal(null);
        }} loading={loading} />
      )}
    </>
  );
}
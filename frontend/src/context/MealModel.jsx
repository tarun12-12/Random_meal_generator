import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import "../styled/model.css";

export default function MealModel({ meal, onClose, loading }) {
  const { isAuthenticated, authFetch } = useContext(AuthContext);
  const [cooked, setCooked] = useState(false);
  const [cookLoading, setCookLoading] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [favStatus, setFavStatus] = useState(null); // true = added, false = removed

  if (!meal) return null;

  // Extract ingredients and measures
  const ingredients = [];
  if (meal.strIngredient1) {
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : "",
        });
      }
    }
  }

  const handleCooked = async () => {
    if (cookLoading) return;
    setCookLoading(true);
    try {
      const res = await authFetch("/meals/cooked", {
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
        setCooked(true);
      }
    } catch (err) {
      console.error("Error marking cooked:", err);
    } finally {
      setCookLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (favLoading) return;
    setFavLoading(true);
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
        setFavStatus(data.favorited);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>✕</button>

        <img src={meal.strMealThumb} alt={meal.strMeal} />

        <h2>{meal.strMeal}</h2>

        {meal.strCategory && (
          <p className="meal-category">
            <strong>Category:</strong> {meal.strCategory}
            {meal.strArea && ` | ${meal.strArea}`}
          </p>
        )}

        {/* Auth-only action buttons */}
        {isAuthenticated && (
          <div className="modal-actions">
            <button
              className={`action-btn fav-btn ${favStatus === true ? "active" : ""}`}
              onClick={handleFavorite}
              disabled={favLoading}
            >
              {favLoading
                ? "..."
                : favStatus === true
                ? "❤️ Favorited"
                : favStatus === false
                ? "🤍 Removed"
                : "🤍 Favorite"}
            </button>

            <button
              className={`action-btn cook-btn ${cooked ? "active" : ""}`}
              onClick={handleCooked}
              disabled={cookLoading || cooked}
            >
              {cookLoading
                ? "..."
                : cooked
                ? "✅ Cooked!"
                : "🍳 I Cooked This!"}
            </button>
          </div>
        )}

        {ingredients.length > 0 && (
          <div className="ingredients-section">
            <h3>Ingredients:</h3>
            <ul className="ingredients-list">
              {ingredients.map((item, idx) => (
                <li key={idx}>
                  <span className="ingredient-name">{item.ingredient}</span>
                  <span className="ingredient-measure">{item.measure}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {meal.strInstructions && (
          <div className="instructions-section">
            <h3>Instructions:</h3>
            <p className="instructions-text">{meal.strInstructions}</p>
          </div>
        )}

        {meal.strYoutube && (
          <a
            href={meal.strYoutube}
            target="_blank"
            rel="noreferrer"
            className="video-link"
          >
            <button className="yt-btn">▶ Watch Recipe on YouTube</button>
          </a>
        )}
      </div>
    </div>
  );
}
import { useEffect, useState, useContext } from "react";
import MealList from "./MealList";
import ImagePreview from "./ImagePreview";
import { AuthContext } from "../context/AuthContext";
import "../styled/home.css";

export default function Home() {
  const [meals, setMeals] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favoriteIds, setFavoriteIds] = useState([]);

  const { isAuthenticated, authFetch } = useContext(AuthContext);

  // Fetch favorite IDs when logged in
  useEffect(() => {
    if (isAuthenticated) {
      authFetch("/meals/favorite-ids")
        .then((res) => res.json())
        .then((ids) => setFavoriteIds(ids))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const fetchMeals = async () => {
    setLoading(true);
    setError("");
    setIngredient("");

    try {
      const promises = Array(12)
        .fill(0)
        .map(() =>
          fetch("https://www.themealdb.com/api/json/v1/1/random.php").then(
            (res) => res.json()
          )
        );

      const results = await Promise.all(promises);
      const randomMeals = results.map((data) => data.meals[0]);
      setMeals(randomMeals);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch meals. Try again.");
    }

    setLoading(false);
  };

  const parseIngredients = (input) =>
    input
      .split(/[\s,]+/)
      .map((item) => item.trim())
      .filter(Boolean);

  const fetchMealsByIngredient = async (term) => {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${term}`
    );

    if (!res.ok) {
      throw new Error("API Failed");
    }

    const data = await res.json();
    return data.meals || [];
  };

  // Search meals by ingredient(s)
  const searchByIngredient = async (ingredientName) => {
    const terms = parseIngredients(ingredientName);
    if (terms.length === 0) {
      setError("Please enter an ingredient");
      return;
    }

    setLoading(true);
    setError("");

    // Log the search to backend if authenticated
    if (isAuthenticated) {
      authFetch("/meals/search-log", {
        method: "POST",
        body: JSON.stringify({ ingredients: terms }),
      }).catch(() => {}); // Fire-and-forget
    }

    try {
      const results = await Promise.all(
        terms.map((term) => fetchMealsByIngredient(term))
      );

      if (results.some((mealsForTerm) => mealsForTerm.length === 0)) {
        setError(`No meals found with ingredient(s): "${ingredientName}"`);
        setMeals([]);
        setLoading(false);
        return;
      }

      const intersection = results.reduce((sharedMeals, mealsForTerm) => {
        const ids = new Set(mealsForTerm.map((meal) => meal.idMeal));
        return sharedMeals.filter((meal) => ids.has(meal.idMeal));
      });

      if (intersection.length === 0) {
        setError(`No meals found with ingredient(s): "${ingredientName}"`);
        setMeals([]);
        setLoading(false);
        return;
      }

      setMeals(intersection.slice(0, 12));
    } catch (err) {
      console.log(err);
      setError("Failed to search by ingredient. Try again.");
      setMeals([]);
    }

    setLoading(false);
  };

  const handleSearch = () => {
    if (ingredient.trim()) {
      searchByIngredient(ingredient);
    } else {
      fetchMeals();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <div className="home">
      <h1>DishFlash</h1>

      <div className="controls">
        <input
          placeholder="Enter ingredient (e.g., chicken, garlic)..."
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={handleSearch}>
          {loading ? "Searching..." : "Search Meals"}
        </button>

        {ingredient && (
          <button onClick={fetchMeals} className="reset-btn">
            Get Random Meals
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      <ImagePreview />

      {/* LOADING SKELETON */}
      {loading ? (
        <div className="meal-list">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="skeleton-card"></div>
            ))}
        </div>
      ) : (
        <MealList meals={meals} favoriteIds={favoriteIds} />
      )}
    </div>
  );
}

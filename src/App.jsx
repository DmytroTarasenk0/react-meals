import { useEffect, useState } from "react";
import axios from "axios";
import Filters from "./Filters";
import "./style.css";

const App = ({ onSelectMeal }) => {
  const [areas, setAreas] = useState(["British"]);
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Fetch meals meals for each area and category, then find intersection
    if (areas.length > 0 && categories.length > 0) {
      Promise.all(
        areas.map((area) =>
          axios
            .get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
            .then((res) => res.data.meals || [])
        )
      ).then((areaResults) => {
        const areaMeals = [].concat(...areaResults);
        Promise.all(
          categories.map((category) =>
            axios
              .get(
                `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
              )
              .then((res) => res.data.meals || [])
          )
        ).then((categoryResults) => {
          const categoryMeals = [].concat(...categoryResults);
          const areaMealIds = new Set(areaMeals.map((m) => m.idMeal));
          const intersection = categoryMeals.filter((m) =>
            areaMealIds.has(m.idMeal)
          );

          Promise.all(
            intersection.map((meal) =>
              axios
                .get(
                  `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
                )
                .then((res) => (res.data.meals ? res.data.meals[0] : null))
            )
          ).then((details) => {
            setMeals(
              details.filter(Boolean).filter((m) => m.strArea !== "Russian")
            );
            setLoading(false);
          });
        });
      });
    } else {
      // One filter
      const promises = [];
      if (areas.length > 0) {
        promises.push(
          ...areas.map((area) =>
            axios
              .get(
                `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
              )
              .then((res) => res.data.meals || [])
          )
        );
      }
      if (categories.length > 0) {
        promises.push(
          ...categories.map((category) =>
            axios
              .get(
                `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
              )
              .then((res) => res.data.meals || [])
          )
        );
      }
      Promise.all(promises).then((results) => {
        const allMeals = [].concat(...results);
        const uniqueMeals = Object.values(
          allMeals.reduce((acc, meal) => {
            acc[meal.idMeal] = meal;
            return acc;
          }, {})
        );
        setMeals(uniqueMeals.filter((m) => m.strArea !== "Russian"));
        setLoading(false);
      });
    }
  }, [areas, categories]);

  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <Filters
        areaFilters={areas}
        setAreaFilters={setAreas}
        categoryFilters={categories}
        setCategoryFilters={setCategories}
      />
      <div className="container">
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Meals</h1>
        <div className="main-content">
          <div>
            <div className="recipe-grid">
              {meals.map((r) => (
                <div key={r.idMeal} className="card">
                  <img src={r.strMealThumb} alt={r.strMeal} />
                  <div className="card-content">
                    <h3>{r.strMeal}</h3>
                    {r.strArea && (
                      <p className="meal-area">
                        <strong>Area:</strong> {r.strArea}
                      </p>
                    )}
                    {r.strCategory && (
                      <p className="meal-category">
                        <strong>Category:</strong> {r.strCategory}
                      </p>
                    )}
                    <button
                      className="btn"
                      onClick={() => onSelectMeal(r.idMeal)}
                    >
                      View Recipe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

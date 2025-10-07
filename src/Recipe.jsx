import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

const Recipe = ({ idMeal, onBack }) => {
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    if (!idMeal) return;
    axios
      .get("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + idMeal)
      .then((res) => setRecipe(res.data.meals ? res.data.meals[0] : null))
      .catch((err) => console.error(err));
  }, [idMeal]);

  if (!recipe) return <div className="container">Loading</div>;

  return (
    <div className="recipe-root">
      <div className="recipe-root-img-box">
        <img className="recipe-root-img" src={recipe.strMealThumb + "/large"} />
        <div className="recipe-root-ingredients">
          Ingredients:
          <ul>
            {Array.from({ length: 40 }, (_, i) => {
              const ing = recipe[`strIngredient${i + 1}`];
              const measure = recipe[`strMeasure${i + 1}`];
              if (ing && ing.trim()) {
                return (
                  <li key={i}>
                    {ing} {measure ? measure : ""}
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
      </div>
      <div className="recipe-root-content">
        <div className="recipe-root-title">
          {recipe.strArea + " " + recipe.strMeal}
        </div>
        <div className="recipe-root-instructions">{recipe.strInstructions}</div>
        {onBack && (
          <button className="btn" onClick={onBack}>
            Back to Meals
          </button>
        )}
      </div>
    </div>
  );
};

export default Recipe;

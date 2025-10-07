import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Recipe from "./Recipe.jsx";

const Root = () => {
  const [selectedMealId, setSelectedMealId] = useState(null);

  return (
    <div>
      {selectedMealId ? (
        <Recipe
          idMeal={selectedMealId}
          onBack={() => setSelectedMealId(null)}
        />
      ) : (
        <App onSelectMeal={setSelectedMealId} />
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

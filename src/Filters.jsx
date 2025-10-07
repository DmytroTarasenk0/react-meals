import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

const Filters = ({
  areaFilters,
  setAreaFilters,
  categoryFilters,
  setCategoryFilters,
}) => {
  const [areas, setAreas] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
      .then((res) => {
        const list = res.data.meals.map((a) => a.strArea);
        setAreas(list.filter((area) => area !== "Russian"));
      })
      .catch(console.error);

    axios
      .get("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
      .then((res) => setCategories(res.data.meals.map((c) => c.strCategory)))
      .catch(console.error);
  }, []);

  const handleChangeArea = (area) => {
    setAreaFilters((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleChangeCategory = (category) => {
    setCategoryFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="filter-box">
      <h3>Filter Area</h3>
      <div className="filter-group">
        {areas.map((area) => (
          <label key={area}>
            <input
              type="checkbox"
              className="checkbox"
              checked={areaFilters.includes(area)}
              onChange={() => handleChangeArea(area)}
            />
            {area}
          </label>
        ))}
      </div>
      <h3>Filter Category</h3>
      <div className="filter-group">
        {categories.map((category) => (
          <label key={category}>
            <input
              type="checkbox"
              className="checkbox"
              checked={categoryFilters.includes(category)}
              onChange={() => handleChangeCategory(category)}
            />
            {category}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filters;

import { useState, useEffect } from "react";
import axios from "axios";

function AdvancedSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");

  useEffect(() => {
    axios
      .get("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
      .then((res) => {
        setCategories(res.data.meals);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
      .then((res) => {
        setAreas(res.data.meals);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSearch = () => {
    onSearch({ searchTerm, category, area });
  };

  return (
    <div className="advanced-search">
      <input
        type="text"
        placeholder="Search for a meal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select onChange={(e) => setCategory(e.target.value)} value={category}>
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.strCategory} value={cat.strCategory}>
            {cat.strCategory}
          </option>
        ))}
      </select>
      <select onChange={(e) => setArea(e.target.value)} value={area}>
        <option value="">All Areas</option>
        {areas.map((ar) => (
          <option key={ar.strArea} value={ar.strArea}>
            {ar.strArea}
          </option>
        ))}
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default AdvancedSearch;

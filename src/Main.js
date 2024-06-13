import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

function Main() {
  const [items, setItems] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    axios
      .get("https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood")
      .then((res) => {
        setItems(res.data.meals);
      })
      .catch((err) => {
        console.log(err);
      });

    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode"));
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode);
      document.body.classList.toggle("dark-mode", savedDarkMode);
    }

    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", JSON.stringify(!darkMode));
  };

  const toggleFavorite = (meal) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav.idMeal === meal.idMeal)) {
      updatedFavorites = favorites.filter((fav) => fav.idMeal !== meal.idMeal);
    } else {
      updatedFavorites = [...favorites, meal];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const itemslist = items.map((meal) => (
    <section className="card" key={meal.idMeal}>
      <img src={meal.strMealThumb} alt={meal.strMeal} />
      <section className="content">
        <p>{meal.strMeal}</p>
        <p>#{meal.idMeal}</p>
        <button onClick={() => toggleFavorite(meal)}>
          {favorites.some((fav) => fav.idMeal === meal.idMeal)
            ? "Unfavorite"
            : "Favorite"}
        </button>
      </section>
    </section>
  ));

  return (
    <div>
      <button onClick={toggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      <div className="items-container">{itemslist}</div>
    </div>
  );
}

export default Main;

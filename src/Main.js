import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

function MealDetails({ meal }) {
  return (
    <div className="meal-details">
      <h2>{meal.strMeal}</h2>
      <img src={meal.strMealThumb} alt={meal.strMeal} />
      <p>{meal.strInstructions}</p>
      {/* Add ingredients and other details */}
    </div>
  );
}

function Main() {
  const [items, setItems] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    axios
      .get("https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood")
      .then((res) => {
        setItems(res.data.meals);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleMealClick = (idMeal) => {
    axios
      .get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
      .then((res) => {
        setSelectedMeal(res.data.meals[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {selectedMeal ? (
        <MealDetails meal={selectedMeal} />
      ) : (
        <div className="items-container">
          {items.map(({ strMeal, strMealThumb, idMeal }) => (
            <section
              key={idMeal}
              className="card"
              onClick={() => handleMealClick(idMeal)}
            >
              <img src={strMealThumb} alt={strMeal} />
              <section className="content">
                <p>{strMeal}</p>
                <p>#{idMeal}</p>
              </section>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export default Main;

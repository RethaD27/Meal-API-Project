import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import AdvancedSearch from "./AdvancedSearch"; // Import AdvancedSearch component

function Main() {
  const [items, setItems] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get("https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood")
      .then((res) => {
        setItems(res.data.meals);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to fetch meals");
        setLoading(false);
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAdvancedSearch = ({ searchTerm, category, area }) => {
    setSearchTerm(searchTerm);
    setCategory(category);
    setArea(area);
  };

  const handleMealClick = (meal) => {
    setSelectedMeal(meal);
  };

  const closeModal = () => {
    setSelectedMeal(null);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredItems = items
    .filter((meal) =>
      meal.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((meal) => (category ? meal.strCategory === category : true))
    .filter((meal) => (area ? meal.strArea === area : true));

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOption === "name") {
      return a.strMeal.localeCompare(b.strMeal);
    } else if (sortOption === "id") {
      return a.idMeal - b.idMeal;
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <button onClick={toggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      <AdvancedSearch onSearch={handleAdvancedSearch} />
      <input
        type="text"
        placeholder="Search for a meal"
        value={searchTerm}
        onChange={handleSearch}
      />
      <select
        onChange={(e) => setSortOption(e.target.value)}
        value={sortOption}
      >
        <option value="name">Sort by Name</option>
        <option value="id">Sort by ID</option>
      </select>
      {selectedMeal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedMeal.strMeal}</h2>
            <img src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} />
            <p>ID: {selectedMeal.idMeal}</p>
            {/* Add more meal details here */}
          </div>
        </div>
      )}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="items-container">
          {currentItems.length > 0 ? (
            currentItems.map((meal) => (
              <section
                className="card"
                key={meal.idMeal}
                onClick={() => handleMealClick(meal)}
              >
                <img src={meal.strMealThumb} alt={meal.strMeal} />
                <section className="content">
                  <p>{meal.strMeal}</p>
                  <p>#{meal.idMeal}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(meal);
                    }}
                  >
                    {favorites.some((fav) => fav.idMeal === meal.idMeal)
                      ? "Unfavorite"
                      : "Favorite"}
                  </button>
                </section>
              </section>
            ))
          ) : (
            <p>No meals found.</p>
          )}
        </div>
      )}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={sortedItems.length}
        paginate={paginate}
      />
    </div>
  );
}

function Pagination({ itemsPerPage, totalItems, paginate }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a onClick={() => paginate(number)} href="#!" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Main;

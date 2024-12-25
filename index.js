const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

//Exercise 1: Get All Restaurants
app.get('/restaurants', async (req, res) => {
  try {
    let result = await fetchAllRestaurants();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurants Found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

//Exercise 2: Get Restaurant by ID
app.get('/restaurants/details/:id', async (req, res) => {
  const id = req.params.id;
  try {
    let result = await getRestaurantById(id);
    if (result.restaurant === undefined) {
      return res
        .status(404)
        .json({ message: 'No Restaurants Found by Id:' + id });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
async function getRestaurantById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [id]);
  return { restaurant: response[0] };
}

//Exercise 3: Get Restaurants by Cuisine
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  const cuisine = req.params.cuisine;
  try {
    let result = await getRestaurantByCuisine(cuisine);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No Restaurants Found by Cuisine:' + cuisine });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
async function getRestaurantByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

//Exercise 4: Get Restaurants by Filter
app.get('/restaurants/filter', async (req, res) => {
  const isVeg = req.query.isVeg;
  const outdoorSeating = req.query.hasOutdoorSeating;
  const luxury = req.query.isLuxury;
  try {
    let result = await getRestaurantByFilter(isVeg, outdoorSeating, luxury);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No Restaurants Found by this Filters' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
async function getRestaurantByFilter(isVeg, outdoorSeating, luxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [isVeg, outdoorSeating, luxury]);
  return { restaurants: response };
}

//Exercise 5: Get Restaurants Sorted by Rating
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await getRestaurantsSortedByRatings();
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No Restaurants Found by this Ratings' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
async function getRestaurantsSortedByRatings() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}

//Exercise 6: Get All Dishes
app.get('/dishes', async (req, res) => {
  try {
    let result = await fetchAllDishes();
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No Dishes Found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

//Exercise 7: Get Dish by ID
app.get('/dishes/details/:id', async (req, res) => {
  const id = req.params.id;
  try {
    let result = await getDishById(id);
    if (result.dish === undefined) {
      return res.status(404).json({ message: 'No Dishes Found by Id:' + id });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
async function getDishById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]);
  return { dish: response[0] };
}

//Exercise 8: Get Dishes by Filter
app.get('/dishes/filter', async (req, res) => {
  const isVeg = req.query.isVeg;
  try {
    let result = await getDishByFilter(isVeg);
    if (result.dishes.length === 0) {
      return res
        .status(404)
        .json({ message: 'No Dishes Found by this Filter' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
async function getDishByFilter(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

//Exercise 9: Get Dishes Sorted by Price
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await getDishesSortedByPrice();
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No Dishes Found' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
async function getDishesSortedByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

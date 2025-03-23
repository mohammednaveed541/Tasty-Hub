// Recipe Search Elements
const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const searchBtnIngredient = document.getElementById("search-btn-ingredient");
const searchInput = document.getElementById("search-input");

// Store recipes data
let recipesData = [];
let mealDbData = [];

// Load recipes from both APIs when page loads
async function loadAllRecipes() {
    try {
        // Show loading state
        mealList.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <h2>Loading delicious recipes...</h2>
            </div>
        `;

        // Fetch both APIs simultaneously
        const [dummyResponse, mealDbResponse] = await Promise.all([
            fetch('https://dummyjson.com/recipes'),
            fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
        ]);

        // Parse both responses
        const [dummyData, mealDbResult] = await Promise.all([
            dummyResponse.json(),
            mealDbResponse.json()
        ]);

        // Process DummyJSON data
        recipesData = dummyData.recipes || [];

        // Process MealDB data
        if (mealDbResult.meals) {
            mealDbData = mealDbResult.meals.map(meal => ({
                id: meal.idMeal,
                name: meal.strMeal,
                image: meal.strMealThumb,
                cuisine: meal.strArea || "International",
                source: "mealdb",
                ingredients: getIngredients(meal),
                instructions: meal.strInstructions.split('\n'),
                youtube: meal.strYoutube,
                category: meal.strCategory
            }));
        }

        // Display all recipes initially
        const allRecipes = [...recipesData, ...mealDbData];
        displayMeals(allRecipes);

    } catch (error) {
        console.error('Error loading recipes:', error);
        mealList.innerHTML = `
            <div class="error-container">
                <i class="fas fa-exclamation-circle"></i>
                <h2>Oops! Something went wrong.</h2>
                <p>Please try refreshing the page.</p>
                <button onclick="loadAllRecipes()" class="retry-button">Try Again</button>
            </div>
        `;
    }
}

// Add loading spinner and retry button styles
const style = document.createElement('style');
style.textContent = `
    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        min-height: 200px;
    }

    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #2ecc71;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .error-container {
        text-align: center;
        padding: 2rem;
        color: #e74c3c;
    }

    .error-container i {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .retry-button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background-color: #2ecc71;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s;
    }

    .retry-button:hover {
        background-color: #27ae60;
    }
`;
document.head.appendChild(style);

// Search functionality
async function searchMeals(searchType) {
    let searchInputTxt = document.getElementById("search-input").value.trim().toLowerCase();
    
    try {
        let results = [];
        
        if (searchInputTxt.length === 0) {
            // Show all recipes if search is empty
            results = [...recipesData, ...mealDbData];
        } else {
            // Search in DummyJSON recipes
            const dummyResults = recipesData.filter(recipe => {
                const nameMatch = recipe.name.toLowerCase().includes(searchInputTxt);
                const ingredientMatch = recipe.ingredients.some(ingredient => 
                    ingredient.toLowerCase().includes(searchInputTxt)
                );
                const cuisineMatch = recipe.cuisine && recipe.cuisine.toLowerCase().includes(searchInputTxt);
                
                if (searchType === "area") {
                    return cuisineMatch;
                } else if (searchType === "ingredients") {
                    return ingredientMatch;
                }
                return nameMatch || ingredientMatch || cuisineMatch;
            });

            // Search in MealDB recipes
            const mealDbResults = mealDbData.filter(recipe => {
                const nameMatch = recipe.name.toLowerCase().includes(searchInputTxt);
                const ingredientMatch = recipe.ingredients.some(ingredient => 
                    ingredient.toLowerCase().includes(searchInputTxt)
                );
                const cuisineMatch = recipe.cuisine && recipe.cuisine.toLowerCase().includes(searchInputTxt);
                const categoryMatch = recipe.category && recipe.category.toLowerCase().includes(searchInputTxt);
                
                if (searchType === "area") {
                    return cuisineMatch;
                } else if (searchType === "ingredients") {
                    return ingredientMatch;
                }
                return nameMatch || ingredientMatch || cuisineMatch || categoryMatch;
            });

            results = [...dummyResults, ...mealDbResults];
        }

        if (results.length > 0) {
            displayMeals(results);
            mealList.classList.remove("notFound");
        } else {
            mealList.innerHTML = `
                <div class="notFound">
                    <h2>No meals found for '${searchInputTxt}'</h2>
                    <p>Try searching for a different ingredient, recipe name, or cuisine.</p>
                </div>
            `;
            mealList.classList.add("notFound");
        }

    } catch (error) {
        console.error('Error searching recipes:', error);
        mealList.innerHTML = `
            <div class="error-container">
                <i class="fas fa-exclamation-circle"></i>
                <h2>Error searching recipes</h2>
                <p>Please try again later.</p>
            </div>
        `;
    }
}

// Helper function to extract ingredients from MealDB data
function getIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim()) {
            ingredients.push(`${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`);
        }
    }
    return ingredients;
}

// Add real-time search
searchInput.addEventListener('input', debounce(() => {
    searchMeals("all");
}, 300));

// Initialize the page
function initializePage() {
    loadAllRecipes();
    
    // Set up event listeners
    searchBtn.addEventListener("click", () => searchMeals("ingredients"));
    searchBtnIngredient.addEventListener("click", () => searchMeals("area"));
    mealList.addEventListener("click", getMealRecipe);
    recipeCloseBtn.addEventListener("click", () => {
        mealDetailsContent.parentElement.classList.remove("showRecipe");
    });
}

// Start the application
initializePage();

// Format MealDB data to match our structure
async function formatMealDbData(meals) {
    if (!meals) return [];
    
    try {
        const formattedMeals = await Promise.all(meals.map(async meal => {
            try {
                // Fetch full meal details
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
                const data = await response.json();
                const fullMealDetails = data.meals[0];
                
                return {
                    id: meal.idMeal,
                    name: meal.strMeal || fullMealDetails.strMeal,
                    image: meal.strMealThumb || fullMealDetails.strMealThumb,
                    cuisine: fullMealDetails.strArea || "International",
                    source: "mealdb",
                    ingredients: getIngredients(fullMealDetails),
                    instructions: fullMealDetails.strInstructions.split('\n'),
                    youtube: fullMealDetails.strYoutube
                };
            } catch (error) {
                console.error('Error formatting meal:', error);
                return null;
            }
        }));

        return formattedMeals.filter(meal => meal !== null);
    } catch (error) {
        console.error('Error formatting meals:', error);
        return [];
    }
}

// Modify the getYoutubeVideoUrl function to return embed URL
async function getYoutubeVideoUrl(recipeName) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${recipeName} recipe cooking&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            return `https://www.youtube.com/embed/${data.items[0].id.videoId}`;
        }
        return null;
    } catch (error) {
        console.error('Error fetching YouTube video:', error);
        return null;
    }
}

// Update showDummyJsonDetails to embed video
async function showDummyJsonDetails(meal) {
    const youtubeUrl = await getYoutubeVideoUrl(meal.name + ' recipe');
    
    let html = `
        <h2 class="recipe-title">${meal.name}</h2>
        <p class="recipe-category">${meal.cuisine}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.instructions.join('<br>')}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.image}" alt="${meal.name}">
        </div>
        <div class="recipe-details">
            <h3>Ingredients:</h3>
            <ul>
                ${meal.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <div class="additional-info">
                <p><strong>Difficulty:</strong> ${meal.difficulty}</p>
                <p><strong>Preparation Time:</strong> ${meal.prepTimeMinutes} minutes</p>
                <p><strong>Cooking Time:</strong> ${meal.cookTimeMinutes} minutes</p>
                <p><strong>Servings:</strong> ${meal.servings}</p>
                <p><strong>Rating:</strong> ${meal.rating} (${meal.reviewCount} reviews)</p>
            </div>
            <div class="recipe-video">
                <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(meal.name + ' recipe')}" 
                   target="_blank" 
                   class="video-btn">
                    <i class="fab fa-youtube"></i> Watch Recipe Videos
                </a>
            </div>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add("showRecipe");
}

// Modify getMealRecipe to handle async showDummyJsonDetails
async function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains("recipe-btn")) {
        let mealItem = e.target.parentElement.parentElement;
        const mealId = mealItem.dataset.id;

        try {
            if (mealItem.classList.contains('mealdb-recipe')) {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
                const data = await response.json();
                if (data.meals) {
                    showMealDbDetails(data.meals[0]);
                }
            } else {
                const meal = recipesData.find(m => m.id === parseInt(mealId));
                if (meal) {
                    await showDummyJsonDetails(meal);
                }
            }
        } catch (error) {
            console.error('Error fetching recipe details:', error);
        }
    }
}

function displayMeals(meals) {
    let html = "";
    if (meals && meals.length > 0) {
        meals.forEach(meal => {
            const isMealDb = meal.source === 'mealdb';
            html += `
                <div class="meal-item ${isMealDb ? 'mealdb-recipe' : ''}" data-id="${meal.id}">
                    <div class="meal-img">
                        <img src="${meal.image}" alt="${meal.name}">
                    </div>
                    <div class="meal-name">
                        <h3>${meal.name}</h3>
                        <p class="recipe-source">${meal.cuisine || 'International'}</p>
                        <a href="#" class="recipe-btn">Get Recipe</a>
                    </div>
                </div>
            `;
        });
        mealList.classList.remove("notFound");
    } else {
        html = `
            <div class="notFound">
                <h2>No recipes found</h2>
                <p>Try searching for something else.</p>
            </div>
        `;
        mealList.classList.add("notFound");
    }
    mealList.innerHTML = html;
}

// Update showMealDbDetails to embed video
function showMealDbDetails(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`);
        }
    }

    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory} (${meal.strArea})</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-details">
            <h3>Ingredients:</h3>
            <ul>
                ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <div class="recipe-video">
                ${meal.strYoutube ? 
                    `<a href="${meal.strYoutube}" target="_blank" class="video-btn">
                        <i class="fab fa-youtube"></i> Watch Recipe Video
                    </a>` : 
                    `<a href="https://www.youtube.com/results?search_query=${encodeURIComponent(meal.strMeal + ' recipe')}" 
                        target="_blank" 
                        class="video-btn">
                        <i class="fab fa-youtube"></i> Find Recipe Videos
                    </a>`
                }
            </div>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add("showRecipe");
}

// Chatbot Elements
const chatMessages = document.getElementById('chatbot-messages');
const messageInput = document.getElementById('chatbot-input');
const sendButton = document.getElementById('send-message');
const chatbotIcon = document.getElementById('chatbot-icon');
const chatbotPopup = document.getElementById('chatbot-popup');
const closeButton = document.getElementById('close-chatbot');

// Chatbot toggle functionality
chatbotIcon.addEventListener('click', () => {
    chatbotPopup.style.display = 'block';
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add welcome message if chat is empty
    if (chatMessages.children.length === 0) {
        addBotMessage("Hello! I'm your cooking assistant. Ask me about recipes, ingredients, or cooking techniques!");
    }
});

closeButton.addEventListener('click', () => {
    chatbotPopup.style.display = 'none';
});

// Close chatbot when clicking outside
document.addEventListener('click', (e) => {
    if (!chatbotPopup.contains(e.target) && !chatbotIcon.contains(e.target)) {
        chatbotPopup.style.display = 'none';
    }
});

// Prevent closing when clicking inside chatbot
chatbotPopup.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Debounce function to prevent too many API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Chat Implementation
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        addUserMessage(message);
        messageInput.value = '';
        await getGeminiResponse(message);
    }
}

function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user-message');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function getGeminiResponse(message) {
    try {
        const apiKey = 'AIzaSyDBc7turAabNmEwpGDerzDqzK2mrf4kkrE'; // Replace with your actual API key
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message,
                    }],
                }],
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;
        addBotMessage(botResponse);

    } catch (error) {
        console.error('Error fetching Gemini response:', error);
        addBotMessage("Sorry, I encountered an error. Please try again later.");
    }
}

function addBotMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'bot-message');
    messageElement.innerHTML = message; // Use innerHTML to allow for formatted responses
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Mobile menu toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add search icon click event for recipe name search
document.querySelector('.fa-search').addEventListener('click', () => searchMeals("all"));

// Add Enter key support for recipe name search
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchMeals("all");
    }
});

// Theme toggle functionality with localStorage
const themeToggle = document.getElementById('theme-toggle');
const icon = themeToggle.querySelector('i');

// Check localStorage on page load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    icon.className = 'fas fa-moon';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
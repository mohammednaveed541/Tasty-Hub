// Recipe Search Elements
const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const searchBtnIngredient = document.getElementById("search-btn-ingredient");

// Chatbot Elements
const chatbotIcon = document.getElementById('chatbot-icon');
const chatbotPopup = document.getElementById('chatbot-popup');
const closeButton = document.getElementById('close-chatbot');
const sendButton = document.getElementById('send-message');
const chatInput = document.getElementById('chatbot-input');
const messagesContainer = document.getElementById('chatbot-messages');

// Event Listeners
searchBtn.addEventListener("click", () => getMealList("i"));
searchBtnIngredient.addEventListener("click", () => getMealList("a"));
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
    mealDetailsContent.parentElement.classList.remove("showRecipe");
});

function getMealList(searchtype) {
    let searchInputTxt = document.getElementById("search-input").value.trim();
    fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?${searchtype}=${searchInputTxt}`
    )
        .then((response) => response.json())
        .then((data) => {
            let html = "";
            if (data.meals) {
                data.meals.forEach((meal) => {
                    html += `
                        <div class="meal-item" data-id="${meal.idMeal}">
                            <div class="meal-img">
                                <img src="${meal.strMealThumb}" alt="food">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.strMeal}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove("notFound");
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add("notFound");
            }
            mealList.innerHTML = html;
        });
}

function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains("recipe-btn")) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
        )
            .then((response) => response.json())
            .then((data) => mealRecipeModal(data.meals));
    }
}

function mealRecipeModal(meal) {
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions.replace(/\n/g, '<br>')}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add("showRecipe");
}

// Chatbot Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Toggle chatbot popup
    chatbotIcon.addEventListener('click', () => {
        chatbotPopup.style.display = 'block';
    });

    // Close chatbot
    closeButton.addEventListener('click', () => {
        chatbotPopup.style.display = 'none';
    });

    // Sample responses for demo
    const sampleResponses = {
        greetings: ["Hello!", "Hi there!", "How can I help you today?"],
        ingredients: [
            "I can suggest several recipes with those ingredients!",
            "Here are some recipes you might like:",
            "Let me find the perfect recipe for you!"
        ],
        default: [
            "I'm here to help you find the perfect recipe!",
            "Would you like to search for specific ingredients?",
            "I can help you discover new recipes!"
        ]
    };

    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, 'user-message');
            
            setTimeout(() => {
                let response;
                if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
                    response = sampleResponses.greetings[Math.floor(Math.random() * sampleResponses.greetings.length)];
                } else if (message.toLowerCase().includes('ingredient')) {
                    response = sampleResponses.ingredients[Math.floor(Math.random() * sampleResponses.ingredients.length)];
                } else {
                    response = sampleResponses.default[Math.floor(Math.random() * sampleResponses.default.length)];
                }
                addMessage(response, 'bot-message');
            }, 1000);

            chatInput.value = '';
        }
    }

    function addMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = className;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Chatbot event listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
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
document.querySelector('.fa-search').addEventListener('click', () => getMealList("s"));

// Add Enter key support for recipe name search
document.getElementById("search-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        getMealList("s");
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
// Recipe Search Elements
const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
const searchBtnIngredient = document.getElementById("search-btn-ingredient");

// Chatbot Elements
const chatbotIcon = document.getElementById('chatbot-icon');
const chatbotPopup = document.getElementById('chatbot-popup');
const closeChatbot = document.getElementById('close-chatbot');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const sendMessageBtn = document.getElementById('send-message');

// Chatbot responses database
const chatbotResponses = {
    greetings: ['hi', 'hello', 'hey', 'howdy'],
    farewell: ['bye', 'goodbye', 'see you', 'cya'],
    thanks: ['thank you', 'thanks', 'thx'],
    
    // Recipe-related keywords
    recipes: ['recipe', 'cook', 'make', 'prepare', 'how to'],
    ingredients: ['ingredient', 'what do i need', 'shopping list'],
    cuisines: ['cuisine', 'italian', 'indian', 'chinese', 'mexican', 'french'],
    
    // Common cooking terms
    temperature: ['temperature', 'degrees', 'celsius', 'fahrenheit'],
    time: ['how long', 'minutes', 'hours', 'time'],
    substitutes: ['substitute', 'replace', 'alternative', 'instead of']
};

// Response templates
const responseTemplates = {
    greetings: "Hello! How can I help you with your cooking today?",
    farewell: "Goodbye! Happy cooking!",
    thanks: "You're welcome! Let me know if you need anything else!",
    default: "I'm not sure about that. Try asking about recipes, ingredients, or cooking tips!",
    
    // Detailed responses for different categories
    temperature: {
        baking: "Common baking temperatures:\n- Cookies: 350°F (175°C)\n- Bread: 375°F (190°C)\n- Cakes: 350°F (175°C)",
        meat: "Common meat cooking temperatures:\n- Chicken: 165°F (74°C)\n- Beef Medium: 140°F (60°C)\n- Pork: 145°F (63°C)"
    },
    
    substitutes: {
        common: "Common substitutions:\n- Buttermilk: Milk + lemon juice\n- Egg: Banana or applesauce\n- Sugar: Honey or maple syrup"
    }
};

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

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'user-message' : 'bot-message';
    messageDiv.textContent = message;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function processUserInput(input) {
    const lowerInput = input.toLowerCase();
    
    // Check for greetings
    if (chatbotResponses.greetings.some(word => lowerInput.includes(word))) {
        return responseTemplates.greetings;
    }
    
    // Check for farewell
    if (chatbotResponses.farewell.some(word => lowerInput.includes(word))) {
        return responseTemplates.farewell;
    }
    
    // Check for thanks
    if (chatbotResponses.thanks.some(word => lowerInput.includes(word))) {
        return responseTemplates.thanks;
    }
    
    // Check for temperature-related questions
    if (lowerInput.includes('temperature')) {
        if (lowerInput.includes('bake') || lowerInput.includes('baking')) {
            return responseTemplates.temperature.baking;
        }
        if (lowerInput.includes('meat') || lowerInput.includes('chicken') || lowerInput.includes('beef')) {
            return responseTemplates.temperature.meat;
        }
    }
    
    // Check for substitution questions
    if (chatbotResponses.substitutes.some(word => lowerInput.includes(word))) {
        return responseTemplates.substitutes.common;
    }
    
    // Check for recipe questions
    if (chatbotResponses.recipes.some(word => lowerInput.includes(word))) {
        if (lowerInput.includes('chicken')) {
            return "Here are some chicken recipe ideas:\n- Grilled Chicken\n- Chicken Curry\n- Chicken Pasta\n- Baked Chicken";
        }
        if (lowerInput.includes('vegetarian')) {
            return "Here are some vegetarian recipe ideas:\n- Vegetable Stir Fry\n- Mushroom Risotto\n- Vegetable Curry\n- Eggplant Parmesan";
        }
    }
    
    // Check for cuisine-specific questions
    if (chatbotResponses.cuisines.some(word => lowerInput.includes(word))) {
        const cuisine = chatbotResponses.cuisines.find(word => lowerInput.includes(word));
        return `Popular ${cuisine} dishes include:\n- Dish 1\n- Dish 2\n- Dish 3\nWould you like a specific recipe?`;
    }
    
    return responseTemplates.default;
}

// Event Listeners
chatbotIcon.addEventListener('click', () => {
    chatbotPopup.style.display = 'block';
});

closeChatbot.addEventListener('click', () => {
    chatbotPopup.style.display = 'none';
});

function handleUserMessage() {
    const userInput = chatbotInput.value.trim();
    if (userInput) {
        addMessage(userInput, true);
        const botResponse = processUserInput(userInput);
        setTimeout(() => addMessage(botResponse), 500);
        chatbotInput.value = '';
    }
}

sendMessageBtn.addEventListener('click', handleUserMessage);

chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserMessage();
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
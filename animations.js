// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Meal cards animation
function initMealCardsAnimation() {
    const mealItems = gsap.utils.toArray('.meal-item');
    
    gsap.set(mealItems, { opacity: 0, y: 50 });
    
    gsap.to(mealItems, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: "#meal",
            start: "top 80%",
        }
    });

    // Hover animation
    mealItems.forEach(card => {
        const timeline = gsap.timeline({ paused: true });
        
        timeline
            .to(card, {
                scale: 1.05,
                y: -10,
                duration: 0.3,
                ease: "power2.out",
                boxShadow: "0 15px 30px rgba(46, 204, 113, 0.3)"
            })
            .to(card.querySelector('.meal-img'), {
                rotationX: 15,
                duration: 0.3,
                ease: "power2.out"
            }, 0);

        card.addEventListener('mouseenter', () => timeline.play());
        card.addEventListener('mouseleave', () => timeline.reverse());
    });
}

// Chatbot animation
function initChatbotAnimation() {
    const chatbot = document.querySelector('.chatbot-icon');
    
    gsap.to(chatbot, {
        y: 10,
        duration: 1.5,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
    });

    gsap.to(chatbot, {
        rotate: 360,
        duration: 0.5,
        ease: "power2.out",
        paused: true
    }).revert();
}

// Search bar animation
function initSearchAnimation() {
    const searchBox = document.querySelector('.meal-search-box');
    
    gsap.from(searchBox, {
        opacity: 0,
        y: -30,
        duration: 1,
        ease: "elastic.out(1, 0.8)",
        scrollTrigger: {
            trigger: searchBox,
            start: "top 80%"
        }
    });
}

// Recipe popup animation
function animateRecipePopup(popup) {
    gsap.fromTo(popup, 
        {
            opacity: 0,
            scale: 0.8,
            y: 50
        },
        {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        }
    );
}

// Hero Section Animations
function initHeroAnimations() {
    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroVideo = document.querySelector('.hero-video');
        heroVideo.style.transform = `translateY(${scrolled * 0.5}px)`;
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

// Enhanced navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initMealCardsAnimation();
    initChatbotAnimation();
    initSearchAnimation();
});

// Add this to your existing animations.js
gsap.from(".recipe-background", {
    opacity: 0,
    duration: 1.5,
    ease: "power2.out"
});

// Optional: Pause animation on hover
document.querySelector('.recipe-slider').addEventListener('mouseover', function() {
    this.style.animationPlayState = 'paused';
});

document.querySelector('.recipe-slider').addEventListener('mouseout', function() {
    this.style.animationPlayState = 'running';
});

// Add navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Update the recipe background animation
gsap.from(".slider-content", {
    opacity: 0,
    y: 50,
    duration: 1.5,
    ease: "power2.out"
});

gsap.from(".recipe-background", {
    opacity: 0,
    duration: 1.5,
    ease: "power2.out"
});

// Optional: Pause animation on hover
document.querySelector('.recipe-slider').addEventListener('mouseover', function() {
    this.style.animationPlayState = 'paused';
});

document.querySelector('.recipe-slider').addEventListener('mouseout', function() {
    this.style.animationPlayState = 'running';
}); 
/*
TaskFlow - Productivity App JavaScript
Description: Handles loading screen, scroll animations, and testimonial slider functionality
*/

// ========================================
// LOADING SCREEN FUNCTIONALITY
// Hides loading screen after page loads (2 seconds)
// ========================================
const loadingScreen = document.getElementById('loadingScreen');

// Hide loading screen after page loads
window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }, 2000); // Show loading screen for 2 seconds
});

// ========================================
// SCROLL REVEAL ANIMATION
// Uses Intersection Observer API to trigger animations on scroll
// ========================================
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      
      // Stop observing the element after animation completes
      observer.unobserve(entry.target);
    }
  });
}, { 
  threshold: 0.1, // Trigger when 10% of element is visible
  rootMargin: '0px 0px -50px 0px' // Offset from bottom
});

reveals.forEach(section => {
  observer.observe(section);
});

// ========================================
// TESTIMONIAL SLIDER FUNCTIONALITY
// Swipeable carousel with navigation buttons and dots
// ========================================
const track = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('sliderDots');
const testimonials = document.querySelectorAll('.testimonial-card');

let currentIndex = 0;
let visibleCards = 3; // Default for desktop

/**
 * Update visible cards count based on screen width
 * Responsive: Desktop (3), Tablet (2), Mobile (1)
 */
function updateVisibleCards() {
  if (window.innerWidth <= 480) {
    visibleCards = 1;
  } else if (window.innerWidth <= 768) {
    visibleCards = 2;
  } else {
    visibleCards = 3;
  }
}

/**
 * Create navigation dots based on number of slides
 * Each dot represents a group of visible cards
 */
function createDots() {
  dotsContainer.innerHTML = '';
  const totalDots = Math.ceil(testimonials.length / visibleCards);
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active'); // First dot active by default
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

/**
 * Update slider position and active dot
 * Calculates card width including gap
 */
function updateSlider() {
  if (!track || testimonials.length === 0) return;
  
  const cardWidth = testimonials[0].offsetWidth + 30; // Include 30px gap
  const maxScroll = (testimonials.length - visibleCards) * cardWidth;
  
  // Ensure we don't scroll beyond bounds
  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > testimonials.length - visibleCards) currentIndex = testimonials.length - visibleCards;
  
  // Move track horizontally
  track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  
  // Update dots
  const dots = document.querySelectorAll('.slider-dot');
  const activeDot = Math.floor(currentIndex / visibleCards);
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === activeDot);
  });
}

/**
 * Navigate to specific slide by index
 * @param {number} slideIndex - The slide group index to navigate to
 */
function goToSlide(slideIndex) {
  currentIndex = slideIndex * visibleCards;
  updateSlider();
}

/**
 * Next button click handler
 * Moves to next card or loops back to start
 */
nextBtn.addEventListener('click', () => {
  if (currentIndex < testimonials.length - visibleCards) {
    currentIndex++;
    updateSlider();
  } else {
    // Loop back to start
    currentIndex = 0;
    updateSlider();
  }
});

/**
 * Previous button click handler
 * Moves to previous card
 */
prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
});

/**
 * Handle window resize events
 * Debounced to prevent excessive recalculations
 */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    updateVisibleCards();
    createDots();
    currentIndex = 0; // Reset to first slide
    updateSlider();
  }, 250); // Wait 250ms after resize stops
});

// ========================================
// TOUCH/SWIPE SUPPORT FOR MOBILE
// Detects left and right swipe gestures
// ========================================
let touchStartX = 0;
let touchEndX = 0;

// Record touch start position
track.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

// Record touch end position and handle swipe
track.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

/**
 * Handle swipe gesture based on start and end positions
 * Swipe left (>50px) = Next card
 * Swipe right (>50px) = Previous card
 */
function handleSwipe() {
  if (touchStartX - touchEndX > 50) {
    // Swipe left - next
    if (currentIndex < testimonials.length - visibleCards) {
      currentIndex++;
      updateSlider();
    }
  }
  if (touchEndX - touchStartX > 50) {
    // Swipe right - previous
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  }
}

// Initialize slider on page load
updateVisibleCards();
createDots();


/*
AngelBlogzz - Blog Platform JavaScript
Functionality: Post filtering, search, pagination (3 posts/page), dark mode, scroll-to-top
*/

// ========================================
// DOM ELEMENTS
// ========================================
const cards = document.querySelectorAll(".card");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageNum = document.getElementById("pageNum");
const scrollTopBtn = document.getElementById("scrollTop");
const themeToggle = document.getElementById("themeToggle");
const ctaBtn = document.querySelector(".cta-btn");

// Pagination state - Show 3 posts per page (3 pages total for 9 posts)
let currentPage = 1;
const postsPerPage = 3;
const totalPages = Math.ceil(cards.length / postsPerPage); // = 3 pages

// ========================================
// DISPLAY POSTS FUNCTION
// Filters and shows posts based on search and category
// ========================================
function showPosts() {
  // Filter posts based on search query and category
  let filtered = Array.from(cards).filter(card => {
    let title = card.querySelector(".title").innerText.toLowerCase();
    let category = card.dataset.category;
    
    let searchMatch = title.includes(searchInput.value.toLowerCase());
    let categoryMatch = categoryFilter.value === "all" || category === categoryFilter.value;
    
    return searchMatch && categoryMatch;
  });

  // Hide all cards first
  cards.forEach(card => card.style.display = "none");

  // Calculate pagination - show only 3 posts per page
  let start = (currentPage - 1) * postsPerPage;
  let end = start + postsPerPage;

  // Show only posts for current page with fade-in animation
  filtered.slice(start, end).forEach(card => {
    card.style.display = "block";
    setTimeout(() => {
      card.style.opacity = "0";
      card.style.transition = "opacity 0.3s ease";
      setTimeout(() => card.style.opacity = "1", 50);
    }, 50);
  });

  // Update page number display (e.g., "1 / 3")
  pageNum.innerText = `${currentPage} / ${totalPages}`;

  // Update button states
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage >= totalPages || end >= filtered.length;
  
  // Change button appearance based on state
  if (currentPage === 1) {
    prevBtn.style.opacity = "0.5";
    prevBtn.style.cursor = "not-allowed";
  } else {
    prevBtn.style.opacity = "1";
    prevBtn.style.cursor = "pointer";
  }
  
  if (currentPage >= totalPages) {
    nextBtn.style.opacity = "0.5";
    nextBtn.style.cursor = "not-allowed";
  } else {
    nextBtn.style.opacity = "1";
    nextBtn.style.cursor = "pointer";
  }
}

// ========================================
// EVENT LISTENERS
// ========================================

// Search input - filter as you type
searchInput.addEventListener("input", () => {
  currentPage = 1; // Reset to first page when searching
  showPosts();
});

// Category filter - change category
categoryFilter.addEventListener("change", () => {
  currentPage = 1; // Reset to first page when filtering
  showPosts();
});

// Next button - go to next page
nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    showPosts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

// Previous button - go to previous page
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    showPosts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

// CTA Button in hero section
if (ctaBtn) {
  ctaBtn.addEventListener("click", () => {
    document.getElementById("posts").scrollIntoView({ behavior: "smooth" });
  });
}

// Initial load - show first 3 posts
showPosts();

// ========================================
// DARK MODE TOGGLE
// ========================================
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  
  // Toggle moon/sun icon
  if (document.body.classList.contains("dark")) {
    themeToggle.innerText = "☀️";
  } else {
    themeToggle.innerText = "🌙";
  }
});

// ========================================
// SCROLL TO TOP BUTTON
// ========================================
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ========================================
// ADD INTERACTIVE EFFECTS
// ========================================

// Add hover effect on cards
cards.forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.style.borderColor = "#4169E1";
  });
  
  card.addEventListener("mouseleave", () => {
    card.style.borderColor = "#E0E8F0";
  });
});

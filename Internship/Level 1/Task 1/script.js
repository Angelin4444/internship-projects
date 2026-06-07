/*
Responsive Sidebar JavaScript
Description: JavaScript for sidebar toggle functionality, mobile responsiveness,
and navigation item highlighting
*/

// DOM elements for sidebar, toggle button, and navigation items
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const navItems = document.querySelectorAll('.nav-item');

// Check if we're on mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Update icons based on sidebar state
function updateIcons() {
  const icon = toggleBtn.querySelector('i');
  
  if (isMobile()) {
    // On mobile: bars when collapsed (hidden), times when expanded (visible)
    if (sidebar.classList.contains('collapsed')) {
      icon.className = 'fas fa-bars';
    } else {
      icon.className = 'fas fa-times';
    }
  } else {
    // On desktop: bars when expanded, chevron-right when collapsed
    if (sidebar.classList.contains('collapsed')) {
      icon.className = 'fas fa-chevron-right';
    } else {
      icon.className = 'fas fa-bars';
    }
  }
}

// Initial icon setup
updateIcons();

// Toggle sidebar functionality - handles both mobile and desktop behavior
toggleBtn.addEventListener('click', () => {
  if (isMobile()) {
    // On mobile, show/hide the sidebar
    sidebar.classList.toggle('collapsed');
  } else {
    // On desktop, collapse/expand the sidebar
    sidebar.classList.toggle('collapsed');
  }
  
  updateIcons();
});

// Active state switching for navigation items
navItems.forEach(item => {
  item.addEventListener('click', () => {
    // Remove active class from all navigation items
    navItems.forEach(nav => nav.classList.remove('active'));
    // Add active class to clicked item
    item.classList.add('active');
    
    // Removed auto-closing sidebar on mobile after clicking items
  });
});

// Handle window resize - update icons when window size changes
window.addEventListener('resize', () => {
  updateIcons();
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (event) => {
  if (isMobile() && 
      !sidebar.contains(event.target) && 
      !toggleBtn.contains(event.target) &&
      !sidebar.classList.contains('collapsed') &&
      sidebar.getBoundingClientRect().top >= 0) {
    // Close sidebar and update icon when clicking outside
    sidebar.classList.add('collapsed');
    updateIcons();
  }
});
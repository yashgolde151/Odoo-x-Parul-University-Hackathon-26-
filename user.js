/**
 * Traveloop User Profile Utility
 * Handles persistent user session and profile display across all pages.
 */

const UserProfile = {
    // Save user data to localStorage
    login: (name, email) => {
        const existingData = UserProfile.get() || {};
        const userData = {
            ...existingData,
            name: name || 'Traveler',
            email: email || '',
            loginTime: new Date().getTime()
        };
        localStorage.setItem('traveloop_user', JSON.stringify(userData));
    },

    // Save extended profile data
    saveProfile: (profileData) => {
        const existingData = UserProfile.get() || {};
        const updatedData = { ...existingData, ...profileData };
        localStorage.setItem('traveloop_user', JSON.stringify(updatedData));
        UserProfile.updateUI();
    },

    // Remove user data
    logout: () => {
        localStorage.removeItem('traveloop_user');
        window.location.href = 'auth.html';
    },

    // Get current user data
    get: () => {
        const data = localStorage.getItem('traveloop_user');
        return data ? JSON.parse(data) : null;
    },

    // Calculate initials (e.g., "Aryan Sharma" -> "AS")
    getInitials: (name) => {
        if (!name) return 'TR';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    },

    // Update all profile elements on the page
    updateUI: () => {
        const user = UserProfile.get();
        if (!user) return;

        const initials = UserProfile.getInitials(user.name);

        // Update name displays
        document.querySelectorAll('.user-info-text h4, .user-profile-info h4, .welcome-text h1, .profile-name-display').forEach(el => {
            if (el.tagName === 'H1') {
                el.innerHTML = `👋 Welcome back, ${user.name.split(' ')[0]}!`;
            } else if (el.classList.contains('profile-name-display')) {
                el.textContent = user.name;
            } else {
                el.textContent = user.name;
            }
        });

        // Update initials circles / Profile images
        document.querySelectorAll('.avatar-circle').forEach(el => {
            if (user.profilePhoto) {
                el.innerHTML = `<img src="${user.profilePhoto}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                el.style.background = 'none';
                el.style.border = 'none';
            } else {
                el.textContent = initials;
                // Restore default styles if photo removed
                el.style.background = ''; 
                el.style.border = '';
            }
        });

        // Update extra info fields if they exist
        if (document.getElementById('profile-bio-display')) document.getElementById('profile-bio-display').textContent = user.bio || 'No bio added yet.';
        if (document.getElementById('profile-location-display')) document.getElementById('profile-location-display').textContent = user.location || 'Global Citizen';
        if (document.getElementById('profile-phone-display')) document.getElementById('profile-phone-display').textContent = user.phone || 'Not provided';

        // Attach logout logic to all logout links
        document.querySelectorAll('.logout-link').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                UserProfile.logout();
            });
        });
    }
};

// Auto-update UI on load if we have elements
window.addEventListener('DOMContentLoaded', () => {
    UserProfile.updateUI();
});

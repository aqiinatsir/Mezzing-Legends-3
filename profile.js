// ==================== USER DATA MANAGEMENT ====================

// Load user data from localStorage
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (!userData) {
        // Default guest data jika tidak login
        return {
            username: 'Guest',
            email: 'guest@example.com',
            avatar: 'default-avatar.png',
            role: 'Guest',
            joinDate: new Date().toLocaleDateString('id-ID')
        };
    }
    
    return userData;
}

// Save user data to localStorage
function saveUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Initialize user data on page load
let currentUser = loadUserData();

// Update UI with user data
function updateUserUI() {
    currentUser = loadUserData();
    
    const usernameEl = document.getElementById('username');
    const userAvatarEl = document.getElementById('userAvatar');
    const profileAvatarEl = document.getElementById('profileAvatar');
    
    if (usernameEl) usernameEl.textContent = currentUser.username;
    if (userAvatarEl) userAvatarEl.src = currentUser.avatar;
    if (profileAvatarEl) profileAvatarEl.src = currentUser.avatar;
}

// ==================== MODAL MANAGEMENT ====================

// Get modal elements
const profileModal = document.getElementById('profileModal');
const editProfileModal = document.getElementById('editProfileModal');
const closeProfileModal = document.getElementById('closeProfileModal');
const closeEditModal = document.getElementById('closeEditModal');

// Open profile modal
function openProfileModal() {
    updateProfileModalContent();
    profileModal.classList.add('show');
}

// Close profile modal
function closeProfile() {
    profileModal.classList.remove('show');
}

// Open edit profile modal
function openEditModal() {
    closeProfile();
    editProfileModal.classList.add('show');
    loadEditForm();
}

// Close edit profile modal
function closeEdit() {
    editProfileModal.classList.remove('show');
}

// Update profile modal content
function updateProfileModalContent() {
    document.getElementById('profileUsername').textContent = currentUser.username;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileRole').textContent = currentUser.role || 'Member';
    document.getElementById('profileJoinDate').textContent = currentUser.joinDate;
    document.getElementById('profileAvatar').src = currentUser.avatar;
}

// Load edit form with current data
function loadEditForm() {
    document.getElementById('editUsername').value = currentUser.username;
    document.getElementById('editEmail').value = currentUser.email;
    document.getElementById('editAvatar').value = currentUser.avatar;
}

// ==================== FILE UPLOAD HANDLING ====================

// Create hidden file input
function createFileInput() {
    const existingInput = document.getElementById('avatarFileInput');
    if (existingInput) {
        return existingInput;
    }
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'avatarFileInput';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('❌ Ukuran file terlalu besar! Maksimal 5MB');
                return;
            }
            
            // Check file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert('❌ Format file tidak didukung! Gunakan JPG, PNG, GIF, atau WebP');
                return;
            }
            
            // Convert to Base64
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Data = event.target.result;
                document.getElementById('editAvatar').value = base64Data;
                
                // Show preview
                const preview = document.querySelector('.avatar-preview');
                if (preview) {
                    preview.src = base64Data;
                }
                
                alert('✅ Foto berhasil dipilih! Klik "Simpan Perubahan" untuk menyimpan.');
            };
            reader.readAsDataURL(file);
        }
    });
    
    return fileInput;
}

// ==================== EVENT LISTENERS ====================

// Profile button
const profileBtn = document.getElementById('profileBtn');
if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openProfileModal();
    });
}

// Logout button
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}

// Close profile modal
if (closeProfileModal) {
    closeProfileModal.addEventListener('click', closeProfile);
}

// Close edit modal
if (closeEditModal) {
    closeEditModal.addEventListener('click', closeEdit);
}

// Edit profile button
const editProfileBtn = document.getElementById('editProfileBtn');
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', openEditModal);
}

// Cancel edit button
const cancelEditBtn = document.getElementById('cancelEditBtn');
if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', closeEdit);
}

// Change avatar button
const changeAvatarBtn = document.getElementById('changeAvatarBtn');
if (changeAvatarBtn) {
    changeAvatarBtn.addEventListener('click', () => {
        openEditModal();
        // Trigger file input
        const fileInput = createFileInput();
        fileInput.click();
    });
}

// Edit profile form submission
const editProfileForm = document.getElementById('editProfileForm');
if (editProfileForm) {
    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newUsername = document.getElementById('editUsername').value.trim();
        const newEmail = document.getElementById('editEmail').value.trim();
        const newAvatar = document.getElementById('editAvatar').value.trim();
        
        // Validation
        if (!newUsername || !newEmail) {
            alert('❌ Username dan Email tidak boleh kosong!');
            return;
        }
        
        if (newUsername.length < 3) {
            alert('❌ Username minimal 3 karakter!');
            return;
        }
        
        if (!isValidEmail(newEmail)) {
            alert('❌ Email tidak valid!');
            return;
        }
        
        // Update user data
        currentUser.username = newUsername;
        currentUser.email = newEmail;
        
        // Handle avatar
        if (newAvatar) {
            if (newAvatar.startsWith('data:image')) {
                // Base64 dari file upload
                currentUser.avatar = newAvatar;
            } else if (isValidImageUrl(newAvatar)) {
                // URL dari internet
                currentUser.avatar = newAvatar;
            } else {
                alert('❌ URL gambar tidak valid! Gunakan link gambar yang benar atau upload file.');
                return;
            }
        }
        
        // Save data to localStorage
        saveUserData(currentUser);
        updateUserUI();
        closeEdit();
        
        // Show success message
        alert('✅ Profil berhasil diperbarui! Foto Anda tersimpan secara permanen.');
    });
}

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === profileModal) {
        closeProfile();
    }
    if (event.target === editProfileModal) {
        closeEdit();
    }
});

// ==================== UTILITY FUNCTIONS ====================

// Validate email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validate image URL
function isValidImageUrl(url) {
    try {
        // Check if it's a valid URL
        new URL(url);
        
        // Check file extension
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const extension = url.split('/').pop().split('?')[0].split('#')[0].split('.').pop().toLowerCase();
        return validExtensions.includes(extension);
    } catch {
        return false;
    }
}

// ==================== LOGOUT FUNCTION ====================

function logout() {
    // Confirm logout
    if (confirm('Apakah Anda yakin ingin logout?')) {
        // Clear user data
        localStorage.removeItem('userData');
        localStorage.removeItem('rememberUsername');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

// ==================== INITIALIZE ====================

// Update UI on page load
window.addEventListener('load', () => {
    updateUserUI();
    createFileInput(); // Initialize file input
    
    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    if (!userData) {
        // Optional: uncomment if you want to force login
        // window.location.href = 'login.html';
    }
});

// ==================== KEYBOARD EVENTS ====================

document.addEventListener('keydown', (e) => {
    // Close modals on Escape
    if (e.key === 'Escape') {
        if (profileModal.classList.contains('show')) {
            closeProfile();
        }
        if (editProfileModal.classList.contains('show')) {
            closeEdit();
        }
    }
});

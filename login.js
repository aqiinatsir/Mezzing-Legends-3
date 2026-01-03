// Toggle between login and register forms
function toggleForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginForm.classList.toggle('active');
    registerForm.classList.toggle('active');
    
    // Clear messages when switching forms
    clearMessages();
    clearInputs();
}

// Show message function
function showMessage(elementId, message, type) {
    const messageEl = document.getElementById(elementId);
    messageEl.textContent = message;
    messageEl.className = `message show ${type}-message`;
    
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 5000);
}

// Clear all messages
function clearMessages() {
    document.getElementById('loginMessage').classList.remove('show');
    document.getElementById('registerMessage').classList.remove('show');
}

// Clear all inputs
function clearInputs() {
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
}

// Validate email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ==================== GENERATE DEFAULT AVATAR ====================
function generateDefaultAvatar(username) {
    // Generate avatar dari API like UI Avatars
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=CC0000&color=fff&size=200`;
}

// ==================== REGISTER NEW USER ====================
function registerNewUser(username, email, password) {
    const userData = {
        username: username,
        email: email,
        avatar: generateDefaultAvatar(username),
        role: 'Member',
        joinDate: new Date().toLocaleDateString('id-ID'),
        password: password // Note: Never store password in production! Use secure backend
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
}

// ==================== LOGIN FORM SUBMISSION ====================
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!username || !password) {
        showMessage('loginMessage', '❌ Username/Email dan kata sandi harus diisi!', 'error');
        return;
    }
    
    // Validate credentials (Replace with actual API call)
    if (username.length >= 3 && password.length >= 6) {
        // Prepare user data
        const userData = {
            username: username,
            email: username.includes('@') ? username : `${username}@game.com`,
            avatar: generateDefaultAvatar(username),
            role: 'Member',
            joinDate: new Date().toLocaleDateString('id-ID')
        };
        
        // Save user data to localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Remember username if checked
        if (rememberMe) {
            localStorage.setItem('rememberUsername', username);
        } else {
            localStorage.removeItem('rememberUsername');
        }
        
        showMessage('loginMessage', '✅ Login berhasil! Mengalihkan...', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showMessage('loginMessage', '❌ Username minimal 3 karakter dan password minimal 6 karakter!', 'error');
    }
});

// ==================== REGISTER FORM SUBMISSION ====================
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
        showMessage('registerMessage', '❌ Semua field harus diisi!', 'error');
        return;
    }
    
    if (username.length < 3) {
        showMessage('registerMessage', '❌ Username minimal 3 karakter!', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('registerMessage', '❌ Email tidak valid!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('registerMessage', '❌ Password minimal 6 karakter!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('registerMessage', '❌ Kata sandi tidak cocok!', 'error');
        return;
    }
    
    // Register the user
    registerNewUser(username, email, password);
    
    showMessage('registerMessage', '✅ Pendaftaran berhasil! Mengalihkan ke login...', 'success');
    
    setTimeout(() => {
        document.getElementById('loginUsername').value = username;
        document.getElementById('loginPassword').value = '';
        toggleForm();
        showMessage('loginMessage', '✅ Akun berhasil dibuat! Silakan login.', 'success');
    }, 1500);
});

// ==================== SOCIAL LOGIN BUTTONS ====================
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const type = btn.title.split('dengan ')[1];
        alert(`Login dengan ${type} - Fitur ini akan segera tersedia!`);
    });
});

// ==================== RESTORE USERNAME ON LOAD ====================
window.addEventListener('load', () => {
    const rememberUsername = localStorage.getItem('rememberUsername');
    if (rememberUsername) {
        document.getElementById('loginUsername').value = rememberUsername;
        document.getElementById('rememberMe').checked = true;
    }
    
    // Check if already logged in, redirect to home
    const userData = localStorage.getItem('userData');
    if (userData) {
        // Uncomment if you want to auto-redirect logged in users
        // window.location.href = 'index.html';
    }
});

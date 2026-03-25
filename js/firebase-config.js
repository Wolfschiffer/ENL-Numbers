// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCkEdRxvECKNmVcMfqDE4jTE_qoNXF7p5c",
    authDomain: "english-next-level-game.firebaseapp.com",
    projectId: "english-next-level-game",
    storageBucket: "english-next-level-game.firebasestorage.app",
    messagingSenderId: "422019063374",
    appId: "1:422019063374:web:b55130f33775f7e1b0ad1f"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ============================================
// VARIÁVEIS GLOBAIS
// ============================================

let currentUser = null;
let isGuest = false;
let currentUserName = "";

// ============================================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================

function showLoginScreen() {
    const authContainer = document.getElementById('auth-container');
    const menuContainer = document.getElementById('menu-container');
    const gameContainer = document.getElementById('game-container');
    
    if (authContainer) authContainer.style.display = 'block';
    if (menuContainer) menuContainer.style.display = 'none';
    if (gameContainer) gameContainer.style.display = 'none';
}

function showMenuScreen() {
    const authContainer = document.getElementById('auth-container');
    const menuContainer = document.getElementById('menu-container');
    const gameContainer = document.getElementById('game-container');
    
    if (authContainer) authContainer.style.display = 'none';
    if (menuContainer) menuContainer.style.display = 'block';
    if (gameContainer) gameContainer.style.display = 'none';
}

function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
}

function register(name, email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return db.collection('users').doc(userCredential.user.uid).set({
                name: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
}

function logout() {
    return auth.signOut();
}

// ============================================
// EVENTOS DE AUTENTICAÇÃO
// ============================================

auth.onAuthStateChanged((user) => {
    console.log("Auth state changed:", user ? "User logged in" : "No user");
    
    // Se estamos em modo guest, ignorar mudanças de estado
    if (isGuest) {
        console.log("Guest mode active, ignoring auth change");
        return;
    }
    
    if (user) {
        currentUser = user;
        isGuest = false;
        
        db.collection('users').doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                currentUserName = doc.data().name;
            } else {
                currentUserName = user.email.split('@')[0];
            }
            
            const userNameDisplay = document.getElementById('user-name-display');
            const userInfo = document.getElementById('user-info');
            
            if (userNameDisplay) userNameDisplay.textContent = currentUserName;
            if (userInfo) userInfo.style.display = 'flex';
            
            showMenuScreen();
        }).catch(() => {
            currentUserName = user.email.split('@')[0];
            showMenuScreen();
        });
    } else {
        // Só mostra tela de login se NÃO estiver em modo guest
        if (!isGuest) {
            currentUser = null;
            
            const userInfo = document.getElementById('user-info');
            if (userInfo) userInfo.style.display = 'none';
            
            showLoginScreen();
        }
    }
});

// ============================================
// INICIALIZAR EVENTOS DA TELA DE LOGIN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM carregado, configurando eventos de login...");
    
    // Tabs de login/registro
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const guestBtn = document.getElementById('guest-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    console.log("Elementos encontrados:", {
        tabs: tabs.length,
        loginBtn: !!loginBtn,
        registerBtn: !!registerBtn,
        guestBtn: !!guestBtn
    });
    
    // Tabs
    if (tabs.length) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                if (tab.dataset.tab === 'login') {
                    if (loginForm) loginForm.classList.add('active');
                    if (registerForm) registerForm.classList.remove('active');
                } else {
                    if (loginForm) loginForm.classList.remove('active');
                    if (registerForm) registerForm.classList.add('active');
                }
            });
        });
    }
    
    // Botão de Login
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');
            const email = emailInput?.value;
            const password = passwordInput?.value;
            
            // Remover mensagens de erro anteriores
            const oldError = document.querySelector('.error-message');
            if (oldError) oldError.remove();
            
            // Validar campos
            if (!email || !email.trim()) {
                showError(loginBtn, "Please enter your email");
                emailInput?.focus();
                return;
            }
            
            if (!password || !password.trim()) {
                showError(loginBtn, "Please enter your password");
                passwordInput?.focus();
                return;
            }
            
            loginBtn.disabled = true;
            loginBtn.textContent = "Logging in...";
            
            login(email, password)
                .then(() => {
                    console.log("Login successful");
                    emailInput.value = "";
                    passwordInput.value = "";
                })
                .catch((error) => {
                    let errorMsg = "Login failed";
                    if (error.code === 'auth/user-not-found') {
                        errorMsg = "No account found with this email";
                    } else if (error.code === 'auth/wrong-password') {
                        errorMsg = "Incorrect password";
                    } else if (error.code === 'auth/invalid-email') {
                        errorMsg = "Invalid email format";
                    } else {
                        errorMsg = error.message;
                    }
                    showError(loginBtn, errorMsg);
                })
                .finally(() => {
                    loginBtn.disabled = false;
                    loginBtn.textContent = "Login";
                });
        });
    }
    
    // Botão de Registro
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('register-name');
            const emailInput = document.getElementById('register-email');
            const passwordInput = document.getElementById('register-password');
            const name = nameInput?.value;
            const email = emailInput?.value;
            const password = passwordInput?.value;
            
            // Remover mensagens de erro anteriores
            const oldError = document.querySelector('.error-message');
            if (oldError) oldError.remove();
            
            // Validar campos
            if (!name || !name.trim()) {
                showError(registerBtn, "Please enter your name");
                nameInput?.focus();
                return;
            }
            
            if (!email || !email.trim()) {
                showError(registerBtn, "Please enter your email");
                emailInput?.focus();
                return;
            }
            
            if (!password || !password.trim()) {
                showError(registerBtn, "Please enter a password");
                passwordInput?.focus();
                return;
            }
            
            if (password.length < 6) {
                showError(registerBtn, "Password must be at least 6 characters");
                passwordInput?.focus();
                return;
            }
            
            registerBtn.disabled = true;
            registerBtn.textContent = "Registering...";
            
            register(name, email, password)
                .then(() => {
                    console.log("Registration successful");
                    showSuccess(registerBtn, "Account created! Logging in...");
                    nameInput.value = "";
                    emailInput.value = "";
                    passwordInput.value = "";
                })
                .catch((error) => {
                    let errorMsg = "Registration failed";
                    if (error.code === 'auth/email-already-in-use') {
                        errorMsg = "Email already registered";
                    } else if (error.code === 'auth/invalid-email') {
                        errorMsg = "Invalid email format";
                    } else if (error.code === 'auth/weak-password') {
                        errorMsg = "Password too weak (min 6 chars)";
                    } else {
                        errorMsg = error.message;
                    }
                    showError(registerBtn, errorMsg);
                })
                .finally(() => {
                    registerBtn.disabled = false;
                    registerBtn.textContent = "Register";
                });
        });
    }
    
    // Botão Guest
    if (guestBtn) {
        guestBtn.addEventListener('click', () => {
            console.log("Guest mode selected");
            isGuest = true;
            currentUserName = "Guest";
            currentUser = null;
            
            const userNameDisplay = document.getElementById('user-name-display');
            const userInfo = document.getElementById('user-info');
            
            if (userNameDisplay) userNameDisplay.textContent = "Guest";
            if (userInfo) userInfo.style.display = 'flex';
            
            showMenuScreen();
        });
    }
    
    // Botão Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log("Logout clicked");
            
            // Se for guest, apenas volta para tela de login
            if (isGuest) {
                isGuest = false;
                currentUser = null;
                currentUserName = "";
                
                const userInfo = document.getElementById('user-info');
                if (userInfo) userInfo.style.display = 'none';
                
                showLoginScreen();
                return;
            }
            
            // Se for usuário logado, faz logout do Firebase
            logout().then(() => {
                console.log("Logged out from Firebase");
                const userInfo = document.getElementById('user-info');
                if (userInfo) userInfo.style.display = 'none';
                showLoginScreen();
            }).catch((error) => {
                console.error("Logout error:", error);
                showLoginScreen();
            });
        });
    }
});

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function showError(button, message) {
    const oldError = document.querySelector('.error-message');
    if (oldError) oldError.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e53e3e';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '0.5rem';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.fontWeight = '500';
    
    button.parentNode.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function showSuccess(button, message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.color = '#22c55e';
    successDiv.style.fontSize = '0.85rem';
    successDiv.style.marginTop = '0.5rem';
    successDiv.style.textAlign = 'center';
    successDiv.style.fontWeight = '500';
    
    button.parentNode.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 2000);
}
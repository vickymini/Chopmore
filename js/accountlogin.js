/**
 * La-Hot Fast Food / Nwa Susan - Authentication Module
 * Modern, accessible, and robust form validation and tab controller.
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // DOM Element References
    // =========================================================================
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const panelLogin = document.getElementById('panelLogin');
    const panelRegister = document.getElementById('panelRegister');
    const authHeading = document.getElementById('authHeading');

    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    const formLogin = document.getElementById('formLogin');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginRemember = document.getElementById('loginRemember');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    const loginEmailError = document.getElementById('loginEmailError');
    const loginPasswordError = document.getElementById('loginPasswordError');

    const formRegister = document.getElementById('formRegister');
    const registerName = document.getElementById('registerName');
    const registerEmail = document.getElementById('registerEmail');
    const registerPassword = document.getElementById('registerPassword');
    const registerConfirmPassword = document.getElementById('registerConfirmPassword');
    const registerTerms = document.getElementById('registerTerms');
    const registerSubmitBtn = document.getElementById('registerSubmitBtn');
    const registerNameError = document.getElementById('registerNameError');
    const registerEmailError = document.getElementById('registerEmailError');
    const registerPasswordError = document.getElementById('registerPasswordError');
    const registerConfirmError = document.getElementById('registerConfirmError');
    const registerTermsError = document.getElementById('registerTermsError');

    // Modals
    const forgotModalBackdrop = document.getElementById('forgotModalBackdrop');
    const openForgotModalBtn = document.getElementById('openForgotModal');
    const closeForgotModalBtn = document.getElementById('closeForgotModal');
    const cancelForgotModalBtn = document.getElementById('cancelForgotModal');
    const formForgotPassword = document.getElementById('formForgotPassword');
    const forgotEmail = document.getElementById('forgotEmail');
    const forgotEmailError = document.getElementById('forgotEmailError');
    const sendResetBtn = document.getElementById('sendResetBtn');

    const termsModalBackdrop = document.getElementById('termsModalBackdrop');
    const openTermsLink = document.getElementById('openTermsLink');
    const closeTermsModalBtn = document.getElementById('closeTermsModal');
    const acceptTermsModalBtn = document.getElementById('acceptTermsModal');

    const toastContainer = document.getElementById('toastContainer');

    // =========================================================================
    // Tab Controller (ARIA-Compliant & Accessible)
    // =========================================================================
    function switchTab(target) {
        if (target === 'register') {
            tabRegister.classList.add('active');
            tabRegister.setAttribute('aria-selected', 'true');
            tabRegister.setAttribute('tabindex', '0');
            panelRegister.classList.add('active');
            panelRegister.removeAttribute('hidden');

            tabLogin.classList.remove('active');
            tabLogin.setAttribute('aria-selected', 'false');
            tabLogin.setAttribute('tabindex', '-1');
            panelLogin.classList.remove('active');
            panelLogin.setAttribute('hidden', '');

            if (authHeading) authHeading.textContent = 'Create an Account';
            registerName.focus();
        } else {
            tabLogin.classList.add('active');
            tabLogin.setAttribute('aria-selected', 'true');
            tabLogin.setAttribute('tabindex', '0');
            panelLogin.classList.add('active');
            panelLogin.removeAttribute('hidden');

            tabRegister.classList.remove('active');
            tabRegister.setAttribute('aria-selected', 'false');
            tabRegister.setAttribute('tabindex', '-1');
            panelRegister.classList.remove('active');
            panelRegister.setAttribute('hidden', '');

            if (authHeading) authHeading.textContent = 'Welcome to Chope More';
            loginEmail.focus();
        }
    }

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => switchTab('login'));
        tabRegister.addEventListener('click', () => switchTab('register'));

        // Keyboard navigation for tablist
        [tabLogin, tabRegister].forEach((tab) => {
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    if (tab === tabLogin) {
                        tabRegister.focus();
                        switchTab('register');
                    } else {
                        tabLogin.focus();
                        switchTab('login');
                    }
                }
            });
        });
    }

    if (switchToRegister) {
        switchToRegister.addEventListener('click', () => switchTab('register'));
    }
    if (switchToLogin) {
        switchToLogin.addEventListener('click', () => switchTab('login'));
    }

    // Check URL hash on page load (e.g. #register)
    if (window.location.hash === '#register') {
        switchTab('register');
    }

    // =========================================================================
    // Password Visibility Toggles
    // =========================================================================
    const passwordToggleButtons = document.querySelectorAll('.password-toggle-btn');
    passwordToggleButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            if (!targetInput) return;

            const isPassword = targetInput.type === 'password';
            targetInput.type = isPassword ? 'text' : 'password';

            const icon = btn.querySelector('i');
            if (icon) {
                if (isPassword) {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                    btn.setAttribute('aria-label', 'Hide password');
                } else {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                    btn.setAttribute('aria-label', 'Show password');
                }
            }
        });
    });

    // =========================================================================
    // Validation Helpers
    // =========================================================================
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setFieldError(input, errorElement, message) {
        if (!input || !errorElement) return;
        const wrapper = input.closest('.input-wrapper') || input.parentElement;
        if (message) {
            wrapper.classList.add('has-error');
            errorElement.textContent = message;
        } else {
            wrapper.classList.remove('has-error');
            errorElement.textContent = '';
        }
    }

    function clearFieldErrorOnInput(input, errorElement) {
        if (!input) return;
        input.addEventListener('input', () => {
            setFieldError(input, errorElement, '');
        });
    }

    clearFieldErrorOnInput(loginEmail, loginEmailError);
    clearFieldErrorOnInput(loginPassword, loginPasswordError);
    clearFieldErrorOnInput(registerName, registerNameError);
    clearFieldErrorOnInput(registerEmail, registerEmailError);
    clearFieldErrorOnInput(registerPassword, registerPasswordError);
    clearFieldErrorOnInput(registerConfirmPassword, registerConfirmError);
    if (registerTerms) {
        registerTerms.addEventListener('change', () => {
            if (registerTermsError) registerTermsError.textContent = '';
        });
    }
    clearFieldErrorOnInput(forgotEmail, forgotEmailError);

    // =========================================================================
    // Remember Me Persistence
    // =========================================================================
    const rememberedEmail = localStorage.getItem('laHotRememberedEmail');
    if (rememberedEmail && loginEmail && loginRemember) {
        loginEmail.value = rememberedEmail;
        loginRemember.checked = true;
    }

    // =========================================================================
    // Sign In Form Handling
    // =========================================================================
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const emailVal = loginEmail.value.trim();
            const passwordVal = loginPassword.value;

            // Email check
            if (!emailVal) {
                setFieldError(loginEmail, loginEmailError, 'Email address is required');
                isValid = false;
            } else if (!emailRegex.test(emailVal)) {
                setFieldError(loginEmail, loginEmailError, 'Please enter a valid email address');
                isValid = false;
            } else {
                setFieldError(loginEmail, loginEmailError, '');
            }

            // Password check
            if (!passwordVal) {
                setFieldError(loginPassword, loginPasswordError, 'Password is required');
                isValid = false;
            } else {
                setFieldError(loginPassword, loginPasswordError, '');
            }

            if (!isValid) return;

            // Handle Remember Me
            if (loginRemember && loginRemember.checked) {
                localStorage.setItem('laHotRememberedEmail', emailVal);
            } else {
                localStorage.removeItem('laHotRememberedEmail');
            }

            // Simulate Authentication Process
            loginSubmitBtn.classList.add('loading');

            setTimeout(() => {
                loginSubmitBtn.classList.remove('loading');

                // Determine display name (or fall back to username from email)
                const storedUserRaw = localStorage.getItem('laHotUserData');
                let displayName = emailVal.split('@')[0];
                if (storedUserRaw) {
                    try {
                        const parsed = JSON.parse(storedUserRaw);
                        if (parsed.email === emailVal && parsed.name) {
                            displayName = parsed.name;
                        }
                    } catch (err) {
                        // ignore json parse error
                    }
                }

                // Save active session
                const activeSession = {
                    name: displayName,
                    email: emailVal,
                    loggedIn: true,
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem('laHotActiveSession', JSON.stringify(activeSession));

                showToast(`Welcome back, ${displayName}! Redirecting to restaurant...`, 'success', 2500);

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1200);
            }, 800);
        });
    }

    // =========================================================================
    // Register Form Handling
    // =========================================================================
    if (formRegister) {
        formRegister.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const nameVal = registerName.value.trim();
            const emailVal = registerEmail.value.trim();
            const passwordVal = registerPassword.value;
            const confirmVal = registerConfirmPassword.value;
            const termsChecked = registerTerms ? registerTerms.checked : true;

            // Name check
            if (!nameVal) {
                setFieldError(registerName, registerNameError, 'Full name is required');
                isValid = false;
            } else if (nameVal.length < 2) {
                setFieldError(registerName, registerNameError, 'Name must be at least 2 characters');
                isValid = false;
            } else {
                setFieldError(registerName, registerNameError, '');
            }

            // Email check
            if (!emailVal) {
                setFieldError(registerEmail, registerEmailError, 'Email address is required');
                isValid = false;
            } else if (!emailRegex.test(emailVal)) {
                setFieldError(registerEmail, registerEmailError, 'Please enter a valid email address');
                isValid = false;
            } else {
                setFieldError(registerEmail, registerEmailError, '');
            }

            // Password check
            if (!passwordVal) {
                setFieldError(registerPassword, registerPasswordError, 'Password is required');
                isValid = false;
            } else if (passwordVal.length < 6) {
                setFieldError(registerPassword, registerPasswordError, 'Password must be at least 6 characters');
                isValid = false;
            } else {
                setFieldError(registerPassword, registerPasswordError, '');
            }

            // Confirm Password check
            if (!confirmVal) {
                setFieldError(registerConfirmPassword, registerConfirmError, 'Please confirm your password');
                isValid = false;
            } else if (confirmVal !== passwordVal) {
                setFieldError(registerConfirmPassword, registerConfirmError, 'Passwords do not match');
                isValid = false;
            } else {
                setFieldError(registerConfirmPassword, registerConfirmError, '');
            }

            // Terms check
            if (!termsChecked) {
                if (registerTermsError) {
                    registerTermsError.textContent = 'You must agree to the Terms of Service';
                }
                isValid = false;
            } else {
                if (registerTermsError) registerTermsError.textContent = '';
            }

            if (!isValid) return;

            // Simulate Account Creation Process
            registerSubmitBtn.classList.add('loading');

            setTimeout(() => {
                registerSubmitBtn.classList.remove('loading');

                const newUser = {
                    name: nameVal,
                    email: emailVal,
                    createdAt: new Date().toISOString()
                };
                localStorage.setItem('laHotUserData', JSON.stringify(newUser));

                // Also log in automatically
                localStorage.setItem('laHotActiveSession', JSON.stringify({
                    name: nameVal,
                    email: emailVal,
                    loggedIn: true,
                    timestamp: new Date().toISOString()
                }));

                showToast(`Welcome to Chope More, ${nameVal}! Your account is ready.`, 'success', 3000);

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }, 900);
        });
    }

    // =========================================================================
    // Forgot Password Modal
    // =========================================================================
    function openModal(modalBackdrop) {
        if (!modalBackdrop) return;
        modalBackdrop.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modalBackdrop) {
        if (!modalBackdrop) return;
        modalBackdrop.setAttribute('hidden', '');
        document.body.style.overflow = '';
    }

    if (openForgotModalBtn && forgotModalBackdrop) {
        openForgotModalBtn.addEventListener('click', () => {
            openModal(forgotModalBackdrop);
            if (forgotEmail) {
                if (loginEmail && loginEmail.value) {
                    forgotEmail.value = loginEmail.value;
                }
                setTimeout(() => forgotEmail.focus(), 100);
            }
        });
    }

    if (closeForgotModalBtn) {
        closeForgotModalBtn.addEventListener('click', () => closeModal(forgotModalBackdrop));
    }
    if (cancelForgotModalBtn) {
        cancelForgotModalBtn.addEventListener('click', () => closeModal(forgotModalBackdrop));
    }

    if (formForgotPassword) {
        formForgotPassword.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailVal = forgotEmail.value.trim();

            if (!emailVal) {
                setFieldError(forgotEmail, forgotEmailError, 'Email address is required');
                return;
            }
            if (!emailRegex.test(emailVal)) {
                setFieldError(forgotEmail, forgotEmailError, 'Please enter a valid email address');
                return;
            }

            setFieldError(forgotEmail, forgotEmailError, '');
            sendResetBtn.classList.add('loading');

            setTimeout(() => {
                sendResetBtn.classList.remove('loading');
                closeModal(forgotModalBackdrop);
                showToast(`Reset instructions have been sent to ${emailVal}`, 'info', 4000);
                formForgotPassword.reset();
            }, 800);
        });
    }

    // =========================================================================
    // Terms Modal
    // =========================================================================
    if (openTermsLink && termsModalBackdrop) {
        openTermsLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(termsModalBackdrop);
        });
    }

    if (closeTermsModalBtn) {
        closeTermsModalBtn.addEventListener('click', () => closeModal(termsModalBackdrop));
    }

    if (acceptTermsModalBtn) {
        acceptTermsModalBtn.addEventListener('click', () => {
            if (registerTerms) registerTerms.checked = true;
            if (registerTermsError) registerTermsError.textContent = '';
            closeModal(termsModalBackdrop);
        });
    }

    // Close modals on clicking background or Escape key
    [forgotModalBackdrop, termsModalBackdrop].forEach((modal) => {
        if (!modal) return;
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(forgotModalBackdrop);
            closeModal(termsModalBackdrop);
        }
    });

    // =========================================================================
    // Toast Notification System
    // =========================================================================
    function showToast(message, type = 'info', duration = 3500) {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let iconClass = 'fa-circle-info';
        if (type === 'success') iconClass = 'fa-circle-check';
        if (type === 'error') iconClass = 'fa-triangle-exclamation';

        toast.innerHTML = `
            <i class="fa-solid ${iconClass} toast-icon" aria-hidden="true"></i>
            <span class="toast-message">${escapeHtml(message)}</span>
            <button type="button" class="toast-close" aria-label="Dismiss message">
                <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
        `;

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => removeToast(toast));

        toastContainer.appendChild(toast);

        const autoDismiss = setTimeout(() => {
            removeToast(toast);
        }, duration);

        function removeToast(el) {
            clearTimeout(autoDismiss);
            el.style.opacity = '0';
            el.style.transform = 'translateX(40px)';
            setTimeout(() => {
                if (el.parentElement) el.parentElement.removeChild(el);
            }, 300);
        }
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});

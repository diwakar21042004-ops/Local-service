document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    // Dark Mode State
    const toggleButton = document.getElementById('darkModeToggle');
    const toggleIcon = toggleButton ? toggleButton.querySelector('i') : null;
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (toggleIcon) {
            toggleIcon.classList.remove('fa-moon');
            toggleIcon.classList.add('fa-sun');
        }
    }
    
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                toggleIcon.classList.remove('fa-sun');
                toggleIcon.classList.add('fa-moon');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                toggleIcon.classList.remove('fa-moon');
                toggleIcon.classList.add('fa-sun');
            }
        });
    }

    // Auth State
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authBtn = document.getElementById('authBtn');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    
    const profileName = document.getElementById('profileName');
    
    function updateAuthUI() {
        if (isLoggedIn) {
            if (profileName) profileName.innerText = 'My Account';
            if (authBtn) authBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Logout';
        } else {
            if (profileName) profileName.innerText = 'Profile';
            if (authBtn) authBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';
        }
    }
    
    updateAuthUI();

    if (authBtn) {
        authBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn) {
                isLoggedIn = false;
                localStorage.setItem('isLoggedIn', 'false');
                updateAuthUI();
                alert('Logged out successfully.');
            } else {
                if (loginModal) loginModal.classList.add('show');
            }
        });
    }

    if (loginModal) {
        const closeModal = loginModal.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                loginModal.classList.remove('show');
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('show');
            }
        });
    }

    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const registerFields = document.getElementById('registerFields');
    const modalTitle = document.getElementById('modalTitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const registerPincode = document.getElementById('registerPincode');
    let isRegisterMode = false;

    if (toggleAuthMode) {
        toggleAuthMode.addEventListener('click', (e) => {
            e.preventDefault();
            isRegisterMode = !isRegisterMode;
            if (isRegisterMode) {
                if(modalTitle) modalTitle.innerText = 'Create Account';
                if(registerFields) registerFields.style.display = 'block';
                if(authSubmitBtn) authSubmitBtn.innerText = 'Sign Up';
                toggleAuthMode.innerText = 'Login';
                toggleAuthMode.previousSibling.textContent = 'Already have an account? ';
            } else {
                if(modalTitle) modalTitle.innerText = 'Login';
                if(registerFields) registerFields.style.display = 'none';
                if(authSubmitBtn) authSubmitBtn.innerText = 'Send One Time Password';
                toggleAuthMode.innerText = 'Create account';
                toggleAuthMode.previousSibling.textContent = 'New to ProLocal? ';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true');
            
            if (isRegisterMode && registerPincode && registerPincode.value.trim() !== '') {
                localStorage.setItem('userPincode', registerPincode.value.trim());
                alert('Account created successfully! Location saved as ' + registerPincode.value.trim());
            } else {
                alert('Logged in successfully!');
            }
            
            loginModal.classList.remove('show');
            updateAuthUI();
            loginForm.reset();

            // Check if there was a pending booking attempt
            if (sessionStorage.getItem('pendingBooking') === 'true') {
                sessionStorage.removeItem('pendingBooking');
                const target = document.querySelector('#contact');
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                         top: offsetPosition,
                         behavior: "smooth"
                    });
                }
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Handle form submission
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!isLoggedIn) {
                alert('Please login first to book a service.');
                if (loginModal) loginModal.classList.add('show');
                return;
            }

            // Form submission logic (simulated)
            const btn = bookingForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            
            btn.innerText = 'Finding Pros...';
            btn.disabled = true;

            const selectEl = bookingForm.querySelector('select');
            const selectedService = selectEl ? selectEl.value : 'General';
            
            // Simulate API call
            setTimeout(() => {
                bookingForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
                window.location.href = 'service-providers.html?service=' + selectedService;
            }, 800);
        });
    }

    // Smooth scroll offset for fixed navbar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            // Authentication intercept for "Book Now" / Contact links
            if (targetId === '#contact' && !isLoggedIn) {
                if (loginModal) loginModal.classList.add('show');
                sessionStorage.setItem('pendingBooking', 'true');
                return;
            }
            
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

    // Slider Logic
    const serviceSlider = document.getElementById('serviceSlider');
    const prevBtn = document.getElementById('prevService');
    const nextBtn = document.getElementById('nextService');

    if (serviceSlider && prevBtn && nextBtn) {
        // Amount to scroll manually
        const manualScrollAmount = 380; 

        prevBtn.addEventListener('click', () => {
            serviceSlider.scrollBy({ left: -manualScrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            serviceSlider.scrollBy({ left: manualScrollAmount, behavior: 'smooth' });
        });

        // Infinite Continuous Auto Scroll
        let isPaused = false;
        
        // Clone original items to create a seamless infinite loop
        const originalCards = Array.from(serviceSlider.children);
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            serviceSlider.appendChild(clone);
        });

        const autoScroll = () => {
            if (!isPaused) {
                // If scrolled past the first set of items, loop back instantly without user noticing
                if (serviceSlider.scrollLeft >= serviceSlider.scrollWidth / 2) {
                    serviceSlider.scrollLeft = 0;
                }
                serviceSlider.scrollLeft += 1;
            }
            requestAnimationFrame(autoScroll);
        };

        // Start animation
        requestAnimationFrame(autoScroll);

        // Pause on hover
        serviceSlider.addEventListener('mouseenter', () => isPaused = true);
        serviceSlider.addEventListener('mouseleave', () => isPaused = false);
    }
});

// Live Location Geolocation API
window.detectLiveLocation = function(inputId) {
    const inputElement = document.getElementById(inputId);
    if (!inputElement) return;

    inputElement.value = "Detecting live location...";
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                try {
                    let postal = "";
                    let area = "";
                    let finalLocation = "";

                    try {
                        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`, {
                            headers: { 'Accept-Language': 'en' }
                        });
                        const data = await resp.json();
                        if (data && data.address) {
                            postal = data.address.postcode || "";
                            area = data.address.suburb || data.address.neighbourhood || data.address.city_district || data.address.town || data.address.city || data.address.state_district || "";
                        }
                    } catch (e) {
                        // Fallback API if Nominatim blocks fetch or errors
                        const resp2 = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
                        const data2 = await resp2.json();
                        if (data2) {
                            postal = data2.postcode || "";
                            area = data2.locality || data2.city || "";
                        }
                    }

                    if (postal) {
                        finalLocation = postal;
                        if (area) finalLocation += ` (${area})`;
                    } else if (area) {
                        finalLocation = area;
                    } else {
                        finalLocation = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
                    }
                    inputElement.value = finalLocation;
                } catch (err) {
                    inputElement.value = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
                }
            },
            (error) => {
                if (error.code === 1) {
                    inputElement.value = "GPS access denied.";
                } else {
                    inputElement.value = "GPS signal failed.";
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        inputElement.value = "Geolocation not supported.";
    }
};

/* ============================================
   Wedding Website - Main JavaScript
   ============================================ */

$(document).ready(function() {
    
    // ============================================
    // Set Active Navigation Link
    // ============================================
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        $('.navbar-nav .nav-link').each(function() {
            const linkHref = $(this).attr('href');
            if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    }
    
    setActiveNavLink();
    
    // ============================================
    // Smooth Scroll
    // ============================================
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000);
        }
    });
    
    // ============================================
    // Lazy Loading Images
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    img.classList.remove('lazy-load');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img.lazy-load').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ============================================
    // Form Validation & AJAX Submission
    // ============================================
    $('form').on('submit', function(e) {
        e.preventDefault();
        const form = $(this);
        const formData = form.serialize();
        const formAction = form.attr('action') || '#';
        const submitBtn = form.find('button[type="submit"]');
        const originalText = submitBtn.text();
        
        // Basic validation
        let isValid = true;
        form.find('input[required], textarea[required], select[required]').each(function() {
            if (!$(this).val().trim()) {
                isValid = false;
                $(this).addClass('is-invalid');
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        
        if (!isValid) {
            showAlert('Please fill in all required fields.', 'error');
            return;
        }
        
        // Email validation
        const emailInputs = form.find('input[type="email"]');
        emailInputs.each(function() {
            const email = $(this).val();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailRegex.test(email)) {
                isValid = false;
                $(this).addClass('is-invalid');
                showAlert('Please enter a valid email address.', 'error');
            }
        });
        
        if (!isValid) return;
        
        // Disable submit button
        submitBtn.prop('disabled', true).text('Sending...');
        
        // AJAX submission
        $.ajax({
            url: formAction,
            type: 'POST',
            data: formData,
            success: function(response) {
                showAlert('Thank you! Your message has been sent successfully.', 'success');
                form[0].reset();
                submitBtn.prop('disabled', false).text(originalText);
            },
            error: function() {
                showAlert('Sorry, there was an error sending your message. Please try again.', 'error');
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });
    
    // ============================================
    // Show Alert Messages
    // ============================================
    function showAlert(message, type) {
        const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
        const alertHtml = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        // Remove existing alerts
        $('.alert').remove();
        
        // Insert alert at the top of the form or page
        const form = $('form');
        if (form.length) {
            form.before(alertHtml);
        } else {
            $('.container').first().prepend(alertHtml);
        }
        
        // Auto-dismiss after 5 seconds
        setTimeout(function() {
            $('.alert').fadeOut(function() {
                $(this).remove();
            });
        }, 5000);
    }
    
    // ============================================
    // Navbar Scroll Effect
    // ============================================
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });
    
    // ============================================
    // Mobile Menu Close on Click
    // ============================================
    $('.navbar-nav .nav-link').on('click', function() {
        if ($(window).width() < 992) {
            $('.navbar-collapse').collapse('hide');
        }
    });
    
    // ============================================
    // Fade In Animation on Scroll
    // ============================================
    function animateOnScroll() {
        $('.fade-in').each(function() {
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('animated');
            }
        });
    }
    
    $(window).on('scroll', animateOnScroll);
    animateOnScroll();
    
    // ============================================
    // Gallery Lightbox (if needed)
    // ============================================
    $('.gallery-item').on('click', function(e) {
        e.preventDefault();
        const imgSrc = $(this).find('img').attr('src') || $(this).attr('href');
        // You can integrate a lightbox library here if needed
        console.log('Gallery item clicked:', imgSrc);
    });
    
    // ============================================
    // External Links - Open in New Tab
    // ============================================
    $('a[href^="http"]').not('[href*="' + window.location.host + '"]').attr('target', '_blank');
    
    // ============================================
    // Phone Number Formatting
    // ============================================
    $('.phone-number').each(function() {
        let phone = $(this).text();
        if (phone && !phone.startsWith('+')) {
            $(this).text('+' + phone);
        }
    });
    
    // ============================================
    // Initialize Tooltips (Bootstrap)
    // ============================================
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // ============================================
    // Dark Mode Toggle
    // ============================================
    function initDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const darkModeIcon = document.getElementById('darkModeIcon');
        
        if (!darkModeToggle || !darkModeIcon) return;
        
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        updateDarkModeIcon(theme, darkModeIcon);
        
        darkModeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateDarkModeIcon(newTheme, darkModeIcon);
        });
    }
    
    function updateDarkModeIcon(theme, icon) {
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
    
    initDarkMode();
    
});


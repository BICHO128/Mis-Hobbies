// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Ajustar el padding-top del main para compensar el header fijo
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    if (header && main) {
        main.style.paddingTop = (header.offsetHeight + 20) + 'px';
    }

    // Inicializar tooltips de Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Inicializar Lightbox para imágenes
    initializeLightbox();

    // Inicializar el modo oscuro
    initializeDarkMode();

    // Inicializar animaciones al hacer scroll
    initializeScrollAnimations();

    // Inicializar contador de visitas (simulado)
    updateVisitCounter();
    
    // Inicializar validación del formulario de contacto
    validateContactForm();
});

// Función para inicializar el lightbox para las imágenes
function initializeLightbox() {
    // Seleccionar todas las imágenes en cards y secciones (excepto carrusel y logos)
    const images = document.querySelectorAll('.card-img-top, .card-body img, section .img-fluid');
    
    images.forEach(img => {
        // No aplicar a imágenes muy pequeñas o iconos
        if (img.width < 100 || img.classList.contains('icon')) return;
        
        // Hacer que la imagen sea clickeable
        img.style.cursor = 'pointer';
        img.setAttribute('data-bs-toggle', 'modal');
        img.setAttribute('data-bs-target', '#imageModal');
        
        // Añadir evento de clic
        img.addEventListener('click', function() {
            const modalImg = document.querySelector('#imageModal .modal-img');
            const modalTitle = document.querySelector('#imageModal .modal-title');
            
            // Establecer la imagen y el título en el modal
            modalImg.src = this.src;
            modalTitle.textContent = this.alt || 'Imagen ampliada';
            
            // Mostrar el modal (Bootstrap se encarga de esto con data-bs-target)
        });
    });
}

// Función para inicializar el modo oscuro
function initializeDarkMode() {
    // Crear el botón de cambio de modo
    const darkModeBtn = document.createElement('button');
    darkModeBtn.classList.add('btn', 'position-fixed', 'bottom-0', 'end-0', 'm-3', 'rounded-circle');
    darkModeBtn.style.width = '60px';
    darkModeBtn.style.height = '60px';
    darkModeBtn.style.zIndex = '1000';
    darkModeBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    darkModeBtn.style.display = 'flex';
    darkModeBtn.style.alignItems = 'center';
    darkModeBtn.style.justifyContent = 'center';
    darkModeBtn.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
    // NOTA: El icono debe ir dentro del botón, en el centro, como se muestra a continuación
    darkModeBtn.innerHTML = '<i class="fas fa-moon" style="font-size: 1.5rem;"></i>';
    darkModeBtn.setAttribute('id', 'darkModeToggle');
    darkModeBtn.setAttribute('title', 'Cambiar modo claro/oscuro');
    darkModeBtn.setAttribute('data-bs-toggle', 'tooltip');
    darkModeBtn.setAttribute('data-bs-placement', 'left');
    
    // Añadir efecto de brillo al botón
    darkModeBtn.style.overflow = 'hidden';
    darkModeBtn.style.position = 'relative';
    
    // Crear efecto de onda al hacer clic
    const createRippleEffect = (e) => {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const rect = darkModeBtn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size * 2}px`;
        ripple.style.left = `${e.clientX - rect.left - size}px`;
        ripple.style.top = `${e.clientY - rect.top - size}px`;
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        
        darkModeBtn.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    };
    
    // Añadir estilo para la animación de onda
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        #darkModeToggle:hover {
            animation: pulse 1s infinite;
        }
    `;
    document.head.appendChild(style);
    
    // Verificar si hay preferencia guardada
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Aplicar modo según preferencia
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeBtn.classList.add('btn-light');
        darkModeBtn.innerHTML = '<i class="fas fa-sun" style="font-size: 1.5rem; color: #ff9800; filter: drop-shadow(0 0 5px rgba(255, 152, 0, 0.5));"></i>';
        darkModeBtn.style.boxShadow = '0 4px 12px rgba(255,255,255,0.3), 0 0 15px rgba(255, 152, 0, 0.5)';
    } else {
        darkModeBtn.classList.add('btn-dark');
        darkModeBtn.innerHTML = '<i class="fas fa-moon" style="font-size: 1.5rem; color: #c0c0c0; filter: drop-shadow(0 0 5px rgba(200, 200, 255, 0.5));"></i>';
        darkModeBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3), 0 0 15px rgba(100, 100, 255, 0.3)';
    }
    
    // Añadir evento de clic para cambiar el modo
    darkModeBtn.addEventListener('click', function(e) {
        // Crear efecto de onda
        createRippleEffect(e);
        
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        // Guardar preferencia
        localStorage.setItem('darkMode', isDark);
        
        // Cambiar apariencia del botón con animación
        if (isDark) {
            this.classList.remove('btn-dark');
            this.classList.add('btn-light');
            this.style.transform = 'rotate(360deg)';
            
            // Animación de transición para el icono
            this.innerHTML = '<i class="fas fa-sun" style="font-size: 1.5rem; color: #ff9800; filter: drop-shadow(0 0 5px rgba(255, 152, 0, 0.5)); animation: fadeIn 0.5s;"></i>';
            this.style.boxShadow = '0 4px 12px rgba(255,255,255,0.3), 0 0 15px rgba(255, 152, 0, 0.5)';
        } else {
            this.classList.remove('btn-light');
            this.classList.add('btn-dark');
            this.style.transform = 'rotate(0deg)';
            
            // Animación de transición para el icono
            this.innerHTML = '<i class="fas fa-moon" style="font-size: 1.5rem; color: #c0c0c0; filter: drop-shadow(0 0 5px rgba(200, 200, 255, 0.5)); animation: fadeIn 0.5s;"></i>';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3), 0 0 15px rgba(100, 100, 255, 0.3)';
        }
        
        // Añadir efecto de transición
        setTimeout(() => {
            this.style.transform = '';
        }, 500);
    });
    
    // Añadir el botón al body
    document.body.appendChild(darkModeBtn);
}

// Función para inicializar animaciones al hacer scroll
function initializeScrollAnimations() {
    // Seleccionar todos los elementos que queremos animar
    const elements = document.querySelectorAll('.card, section h2, .img-fluid');
    
    // Función para verificar si un elemento está visible en la ventana
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Función para animar elementos visibles
    function animateVisibleElements() {
        elements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated', 'fadeIn');
            }
        });
    }
    
    // Ejecutar al cargar la página
    animateVisibleElements();
    
    // Ejecutar al hacer scroll
    window.addEventListener('scroll', animateVisibleElements);
}

// Función para actualizar el contador de visitas (simulado)
function updateVisitCounter() {
    // Obtener contador actual o inicializar
    let visits = localStorage.getItem('visitCount') || 0;
    visits = parseInt(visits) + 1;
    
    // Guardar contador actualizado
    localStorage.setItem('visitCount', visits);
    
    // Mostrar contador si existe el elemento
    const counterElement = document.getElementById('visitCounter');
    if (counterElement) {
        counterElement.textContent = visits;
    }
}

// Función para marcar campo como inválido
function markInvalid(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    // Buscar o crear mensaje de error
    let feedback = field.nextElementSibling;
    if (!feedback || !feedback.classList.contains('invalid-feedback')) {
        feedback = document.createElement('div');
        feedback.classList.add('invalid-feedback');
        field.parentNode.insertBefore(feedback, field.nextSibling);
    }
    feedback.textContent = message;
}

// Función para marcar campo como válido
function markValid(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
}

// Función para validar el formulario de contacto
function validateContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validar campos
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        // Validar nombre
        if (!name.value.trim()) {
            markInvalid(name, 'Por favor, ingresa tu nombre');
            isValid = false;
        } else {
            markValid(name);
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value)) {
            markInvalid(email, 'Por favor, ingresa un email válido');
            isValid = false;
        } else {
            markValid(email);
        }
        
        // Validar mensaje
        if (!message.value.trim()) {
            markInvalid(message, 'Por favor, ingresa un mensaje');
            isValid = false;
        } else {
            markValid(message);
        }
        
        // Si todo es válido, mostrar mensaje de éxito
        if (isValid) {
            // Aquí normalmente enviarías los datos al servidor
            // Simulamos una respuesta exitosa
            const alert = document.createElement('div');
            alert.classList.add('alert', 'alert-success', 'mt-3');
            alert.textContent = '¡Mensaje enviado con éxito! Te responderemos pronto.';
            
            // Añadir el mensaje al formulario
            form.appendChild(alert);
            
            // Resetear el formulario después de 3 segundos
            setTimeout(() => {
                form.reset();
                // Eliminar clases de validación
                const formInputs = form.querySelectorAll('.form-control');
                formInputs.forEach(input => {
                    input.classList.remove('is-valid');
                });
                // Eliminar el mensaje de éxito
                if (form.contains(alert)) {
                    form.removeChild(alert);
                }
                // Cerrar el modal
                const contactModal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
                if (contactModal) {
                    contactModal.hide();
                }
            }, 3000);
        }
    });
}

// Inicializar reproductor de video personalizado
function initializeVideoPlayers() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Añadir controles personalizados si no existen
        if (!video.hasAttribute('controls')) {
            video.setAttribute('controls', 'true');
        }
        
        // Añadir clase para estilos
        video.classList.add('custom-video-player');
        
        // Añadir evento para reproducción automática al entrar en viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.6 });
        
        observer.observe(video);
    });
}
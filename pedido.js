/**
 * ===== ELÉCTRICOS RUITOCA - JAVASCRIPT PRINCIPAL =====
 * 
 * Sistema JavaScript completo para la página principal de Eléctricos Ruitoca
 * Funcionalidades incluidas:
 * - Loading screen animado
 * - Navegación responsiva y suave
 * - Animaciones de scroll y contadores
 * - Formulario de contacto con validación
 * - Efectos visuales y interactividad
 * - Modal de productos
 * - Optimizaciones de rendimiento
 * 
 * Desarrollado con mejores prácticas ES6+ para ser didáctico y mantenible

 * Empresa: Eléctricos Ruitoca - Barquisimeto, Lara
 */

// ===== CONFIGURACIÓN Y CONSTANTES GLOBALES =====
const CONFIG = {
    // Tiempos de animación
    LOADING_DURATION: 1000,
    SCROLL_THRESHOLD: 10,
    COUNTER_DURATION: 20,
    
    // Configuraciones de scroll
    SCROLL_OFFSET: 80,
    PARALLAX_SPEED: 0.5,
    
    // Selectores principales
    SELECTORS: {
        loadingScreen: '#loading-screen',
        navbar: '#navbar',
        mobileMenu: '#mobile-menu',
        mobileMenuBtn: '#mobile-menu-btn',
        backToTop: '#back-to-top',
        contactForm: '#contact-form',
        navLinks: '.nav-link',
        counters: '[data-count]'
    }
};

// ===== ESTADO GLOBAL DE LA APLICACIÓN =====
const AppState = {
    isLoaded: false,
    isMobileMenuOpen: false,
    currentScrollPosition: 0,
    isScrolling: false,
    countersAnimated: false
};

// ===== UTILIDADES Y HELPERS =====
/**
 * Utilitarios para operaciones comunes
 */
const Utils = {
    
    /**
     * Selector optimizado que retorna elemento o null
     * @param {string} selector - Selector CSS
     * @returns {Element|null}
     */
    $(selector) {
        return document.querySelector(selector);
    },
    
    /**
     * Selector múltiple optimizado
     * @param {string} selector - Selector CSS
     * @returns {NodeList}
     */
    $$(selector) {
        return document.querySelectorAll(selector);
    },
    
    /**
     * Throttle function para optimizar eventos de scroll
     * @param {Function} func - Función a ejecutar
     * @param {number} delay - Retraso en ms
     * @returns {Function}
     */
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    },
    
    /**
     * Debounce function para eventos que se disparan frecuentemente
     * @param {Function} func - Función a ejecutar
     * @param {number} delay - Retraso en ms
     * @returns {Function}
     */
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },
    
    /**
     * Easing function para animaciones suaves
     * @param {number} t - Tiempo normalizado (0-1)
     * @returns {number}
     */
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    },
    
    /**
     * Valida formato de email
     * @param {string} email - Email a validar
     * @returns {boolean}
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    /**
     * Genera un ID único
     * @returns {string}
     */
    generateId() {
        return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};

// ===== GESTIÓN DE EVENTOS Y DOM =====
/**
 * Maneja toda la funcionalidad relacionada con el DOM y eventos
 */
const DOMManager = {
    
    /**
     * Inicializa todos los elementos del DOM
     */
    init() {
        console.log('🔗 Inicializando elementos del DOM...');
        
        // Verificamos que los elementos críticos existan
        const criticalElements = [
            CONFIG.SELECTORS.loadingScreen,
            CONFIG.SELECTORS.navbar,
            CONFIG.SELECTORS.backToTop
        ];
        
        criticalElements.forEach(selector => {
            const element = Utils.$(selector);
            if (!element) {
                console.warn(`⚠️ Elemento crítico no encontrado: ${selector}`);
            }
        });
        
        console.log('✅ Elementos del DOM verificados');
    },
    
    /**
     * Configura todos los event listeners
     */
    setupEventListeners() {
        console.log('🎧 Configurando event listeners...');
        
        // Eventos de scroll con throttling
        window.addEventListener('scroll', Utils.throttle(ScrollManager.handleScroll.bind(ScrollManager), 16));
        
        // Eventos de resize
        window.addEventListener('resize', Utils.debounce(this.handleResize.bind(this), 250));
        
        // Navegación móvil
        const mobileMenuBtn = Utils.$(CONFIG.SELECTORS.mobileMenuBtn);
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', NavigationManager.toggleMobileMenu);
        }
        
        // Botón back to top
        const backToTop = Utils.$(CONFIG.SELECTORS.backToTop);
        if (backToTop) {
            backToTop.addEventListener('click', ScrollManager.scrollToTop);
        }
        
        // Enlaces de navegación suave
        const navLinks = Utils.$$(CONFIG.SELECTORS.navLinks);
        navLinks.forEach(link => {
            link.addEventListener('click', NavigationManager.handleNavClick);
        });
        
        // Formulario de contacto
        const contactForm = Utils.$(CONFIG.SELECTORS.contactForm);
        if (contactForm) {
            contactForm.addEventListener('submit', ContactManager.handleSubmit);
        }
        
        console.log('✅ Event listeners configurados correctamente');
    },
    
    /**
     * Maneja redimensionamiento de ventana
     */
    handleResize() {
        // Cierra menú móvil si está abierto
        if (AppState.isMobileMenuOpen) {
            NavigationManager.toggleMobileMenu();
        }
        
        // Reajusta elementos si es necesario
        console.log('📱 Ventana redimensionada');
    }
};

// ===== GESTIÓN DE LA PANTALLA DE CARGA =====
/**
 * Maneja la pantalla de carga inicial
 */
const LoadingManager = {
    
    /**
     * Inicia la pantalla de carga
     */
    init() {
        console.log('⏳ Inicializando loading screen...');
        this.showLoading();
        
        // Simula carga de recursos
        setTimeout(() => {
            this.hideLoading();
        }, CONFIG.LOADING_DURATION);
    },
    
    /**
     * Muestra la pantalla de carga
     */
    showLoading() {
        const loadingScreen = Utils.$(CONFIG.SELECTORS.loadingScreen);
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    },
    
    /**
     * Oculta la pantalla de carga con animación
     */
    hideLoading() {
        const loadingScreen = Utils.$(CONFIG.SELECTORS.loadingScreen);
        if (!loadingScreen) return;
        
        // Añade clase de fade out
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        
        // Remueve del DOM después de la transición
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            AppState.isLoaded = true;
            this.onLoadingComplete();
        }, 500);
        
        console.log('✅ Loading screen ocultado');
    },
    
    /**
     * Ejecuta acciones después de que la carga esté completa
     */
    onLoadingComplete() {
        // Inicia animaciones de entrada
        AnimationManager.initEntryAnimations();
        
        // Inicia contadores después de un pequeño delay
        setTimeout(() => {
            AnimationManager.startCounters();
        }, 800);
        
        console.log('🎉 Página completamente cargada');
    }
};

// ===== GESTIÓN DE NAVEGACIÓN =====
/**
 * Maneja toda la navegación del sitio
 */
const NavigationManager = {
    
    /**
     * Maneja clicks en enlaces de navegación
     * @param {Event} event - Evento de click
     */
    handleNavClick(event) {
        const link = event.currentTarget;
        const href = link.getAttribute('href');
        
        // Solo para enlaces internos (que empiecen con #)
        if (href && href.startsWith('#')) {
            event.preventDefault();
            
            const targetSection = Utils.$(href);
            if (targetSection) {
                ScrollManager.smoothScrollTo(targetSection.offsetTop - CONFIG.SCROLL_OFFSET);
                
                // Actualiza enlace activo
                NavigationManager.updateActiveLink(href);
                
                // Cierra menú móvil si está abierto
                if (AppState.isMobileMenuOpen) {
                    NavigationManager.toggleMobileMenu();
                }
            }
        }
    },
    
    /**
     * Toggle del menú móvil
     */
    toggleMobileMenu() {
        const mobileMenu = Utils.$(CONFIG.SELECTORS.mobileMenu);
        const mobileMenuBtn = Utils.$(CONFIG.SELECTORS.mobileMenuBtn);
        
        if (!mobileMenu || !mobileMenuBtn) return;
        
        AppState.isMobileMenuOpen = !AppState.isMobileMenuOpen;
        
        if (AppState.isMobileMenuOpen) {
            mobileMenu.classList.remove('hidden');
            mobileMenuBtn.innerHTML = '<i class="fas fa-times text-xl"></i>';
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
            document.body.style.overflow = '';
        }
        
        console.log(`📱 Menú móvil ${AppState.isMobileMenuOpen ? 'abierto' : 'cerrado'}`);
    },
    
    /**
     * Actualiza el enlace activo en la navegación
     * @param {string} activeHref - Href del enlace activo
     */
    updateActiveLink(activeHref) {
        const navLinks = Utils.$$(CONFIG.SELECTORS.navLinks);
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === activeHref) {
                link.classList.add('text-golden-500', 'font-bold');
            } else {
                link.classList.remove('text-golden-500', 'font-bold');
            }
        });
    }
};

// ===== GESTIÓN DE SCROLL =====
/**
 * Maneja todos los efectos relacionados con scroll
 */
const ScrollManager = {
    
    /**
     * Maneja eventos de scroll con optimizaciones
     */
    handleScroll() {
        if (AppState.isScrolling) return;
        
        AppState.isScrolling = true;
        AppState.currentScrollPosition = window.pageYOffset;
        
        requestAnimationFrame(() => {
            this.updateScrollEffects();
            AppState.isScrolling = false;
        });
    },
    
    /**
     * Actualiza todos los efectos de scroll
     */
    updateScrollEffects() {
        this.updateNavbar();
        this.updateBackToTop();
        this.updateActiveSection();
        this.updateParallaxElements();
        
        // Inicia contadores si no se han animado y están en viewport
        if (!AppState.countersAnimated && this.isElementInViewport(Utils.$('[data-count]'))) {
            AnimationManager.startCounters();
        }
    },
    
    /**
     * Actualiza estado del navbar según scroll
     */
    updateNavbar() {
        const navbar = Utils.$(CONFIG.SELECTORS.navbar);
        if (!navbar) return;
        
        if (AppState.currentScrollPosition > CONFIG.SCROLL_THRESHOLD) {
            navbar.classList.add('shadow-xl');
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.classList.remove('shadow-xl');
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        }
    },
    
    /**
     * Controla visibilidad del botón back to top
     */
    updateBackToTop() {
        const backToTop = Utils.$(CONFIG.SELECTORS.backToTop);
        if (!backToTop) return;
        
        if (AppState.currentScrollPosition > CONFIG.SCROLL_THRESHOLD * 3) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    },
    
    /**
     * Actualiza sección activa en navegación
     */
    updateActiveSection() {
        const sections = Utils.$$('section[id]');
        let currentSection = null;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - CONFIG.SCROLL_OFFSET - 50;
            const sectionHeight = section.offsetHeight;
            
            if (AppState.currentScrollPosition >= sectionTop && 
                AppState.currentScrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        if (currentSection) {
            NavigationManager.updateActiveLink(`#${currentSection}`);
        }
    },
    
    
    
    /**
     * Scroll suave a una posición específica
     * @param {number} targetPosition - Posición objetivo
     */
    smoothScrollTo(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;
        
        function animateScroll(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const easeProgress = Utils.easeOutCubic(progress);
            const currentPosition = startPosition + (distance * easeProgress);
            
            window.scrollTo(0, currentPosition);
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }
        
        requestAnimationFrame(animateScroll);
    },
    
    /**
     * Scroll hacia arriba
     */
    scrollToTop() {
        ScrollManager.smoothScrollTo(0);
    },
    
    /**
     * Verifica si un elemento está en el viewport
     * @param {Element} element - Elemento a verificar
     * @returns {boolean}
     */
    isElementInViewport(element) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// ===== GESTIÓN DE ANIMACIONES =====
/**
 * Maneja todas las animaciones del sitio
 */
const AnimationManager = {
    
    /**
     * Inicializa animaciones de entrada
     */
    initEntryAnimations() {
        // Animaciones con Intersection Observer para mejor performance
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        }
        
        console.log('✨ Animaciones de entrada inicializadas');
    },
    
    /**
     * Configura Intersection Observer para animaciones
     */
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observa elementos que necesitan animación
        const animatedElements = Utils.$$('.animate-fade-in, .animate-slide-up, .animate-slide-in-right');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s ease-out';
            observer.observe(el);
        });
    },
    
    /**
     * Inicia animación de contadores
     */
    startCounters() {
        if (AppState.countersAnimated) return;
        
        const counters = Utils.$$(CONFIG.SELECTORS.counters);
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = CONFIG.COUNTER_DURATION;
            let start = null;
            
            function animateCounter(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                
                const easeProgress = Utils.easeOutCubic(progress);
                const current = Math.floor(easeProgress * target);
                
                counter.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(animateCounter);
                }
            }
            
            requestAnimationFrame(animateCounter);
        });
        
        AppState.countersAnimated = true;
        console.log('🔢 Contadores animados');
    },
    
    /**
     * Crea efecto de pulso en un elemento
     * @param {Element} element - Elemento a animar
     */
    pulseEffect(element) {
        if (!element) return;
        
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }
};

// ===== GESTIÓN DE FORMULARIOS =====
/**
 * Maneja formularios y validaciones
 */
const ContactManager = {
    
    /**
     * Maneja envío del formulario de contacto
     * @param {Event} event - Evento de submit
     */
    async handleSubmit(event) {
        event.preventDefault();
        console.log('📧 Procesando formulario de contacto...');
        
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Deshabilita botón mientras procesa
        ContactManager.setSubmitButtonState(submitBtn, true);
        
        // Valida datos
        const validation = ContactManager.validateForm(data);
        if (!validation.isValid) {
            ContactManager.showMessage(validation.message, 'error');
            ContactManager.setSubmitButtonState(submitBtn, false);
            return;
        }
        
        try {
            // Simula envío de formulario
            await ContactManager.simulateFormSubmission(data);
            
            // Éxito
            ContactManager.showMessage('✅ ¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            form.reset();
            
        } catch (error) {
            console.error('❌ Error al enviar formulario:', error);
            ContactManager.showMessage('❌ Hubo un error al enviar el mensaje. Por favor intenta nuevamente.', 'error');
        } finally {
            ContactManager.setSubmitButtonState(submitBtn, false);
        }
    },
    
    /**
     * Valida los datos del formulario
     * @param {Object} data - Datos del formulario
     * @returns {Object} Resultado de validación
     */
    validateForm(data) {
        const errors = [];
        
        // Validación de nombre
        if (!data.name || data.name.trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }
        
        // Validación de email
        if (!data.email || !Utils.validateEmail(data.email)) {
            errors.push('Debe ingresar un email válido');
        }
        
        // Validación de teléfono
        if (!data.phone || data.phone.trim().length < 10) {
            errors.push('El teléfono debe tener al menos 10 dígitos');
        }
        
        // Validación de asunto
        if (!data.subject) {
            errors.push('Debe seleccionar un asunto');
        }
        
        // Validación de mensaje
        if (!data.message || data.message.trim().length < 10) {
            errors.push('El mensaje debe tener al menos 10 caracteres');
        }
        
        return {
            isValid: errors.length === 0,
            message: errors.length > 0 ? 'Errores en el formulario:\n• ' + errors.join('\n• ') : null
        };
    },
    
    /**
     * Simula el envío del formulario (en producción se conectaría al backend)
     * @param {Object} data - Datos a enviar
     * @returns {Promise}
     */
    simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            // Simula delay de red
            setTimeout(() => {
                // Simula éxito 95% de las veces
                if (Math.random() > 0.05) {
                    console.log('✅ Datos del formulario enviados:', data);
                    resolve();
                } else {
                    reject(new Error('Error simulado de red'));
                }
            }, 2000);
        });
    },
    
    /**
     * Controla el estado del botón de envío
     * @param {Element} button - Botón de submit
     * @param {boolean} isLoading - Estado de carga
     */
    setSubmitButtonState(button, isLoading) {
        if (!button) return;
        
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
            button.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
            button.disabled = false;
            button.innerHTML = 'Enviar Mensaje <i class="fas fa-paper-plane ml-2"></i>';
            button.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    },
    
    /**
     * Muestra mensajes al usuario
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de mensaje ('success', 'error', 'info')
     */
    showMessage(message, type = 'info') {
        // En producción se usaría una librería de notifications moderna
        // Por simplicidad usamos alert()
        const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
        alert(`${icon} ${message}`);
    }
};

// ===== GESTIÓN DE PRODUCTOS =====
/**
 * Maneja la funcionalidad relacionada con productos
 */
const ProductManager = {
    
    /**
     * Muestra detalles de un producto en modal
     * @param {string} productType - Tipo de producto
     */
    showDetails(productType) {
        console.log(`🔍 Mostrando detalles del producto: ${productType}`);
        
        const productInfo = this.getProductInfo(productType);
        if (productInfo) {
            this.createProductModal(productInfo);
        }
    },
    
    /**
     * Obtiene información detallada de un producto
     * @param {string} productType - Tipo de producto
     * @returns {Object|null} Información del producto
     */
    getProductInfo(productType) {
        const products = {
            cables: {
                title: 'Cables y Conductores Eléctricos',
                icon: 'fas fa-plug',
                color: 'from-red-400 to-red-600',
                description: 'Amplia variedad de cables y conductores para todas tus instalaciones eléctricas.',
                features: [
                    'Cable THW calibres 12, 14, 10, 8 AWG',
                    'Cable THHN para instalaciones industriales',
                    'Cable NYA residencial y comercial',
                    'Cable coaxial RG6 y RG59 para TV',
                    'Cable de red Cat5e, Cat6 certificado',
                    'Cables de baja tensión para automatización',
                    'Cable dúplex para acometidas',
                    'Cables especiales para piscinas'
                ],
                brands: ['Cabel', 'Centelsa', 'Procables', 'Conductores Monterrey'],
                applications: [
                    'Instalaciones residenciales',
                    'Proyectos comerciales',
                    'Instalaciones industriales',
                    'Sistemas de telecomunicaciones'
                ]
            },
            tuberia: {
                title: 'Tubería y Sistemas de Canalización',
                icon: 'fas fa-road',
                color: 'from-blue-400 to-blue-600',
                description: 'Sistemas completos de canalización para proteger y organizar tus instalaciones.',
                features: [
                    'Tubos PVC eléctricos ½", ¾", 1", 1¼", 2"',
                    'Tubo EMT galvanizado ligero',
                    'Tubo conduit pesado para exteriores',
                    'Canaletas plásticas y metálicas',
                    'Ductos cuadrados para cableado',
                    'Conectores y uniones de todos tipos',
                    'Cajas de conexión y registro',
                    'Accesorios de instalación'
                ],
                brands: ['Pavco', 'Tigre', 'Mexichem', 'Amanco'],
                applications: [
                    'Canalizaciones empotradas',
                    'Instalaciones a la vista',
                    'Sistemas subterráneos',
                    'Instalaciones industriales'
                ]
            },
            iluminacion: {
                title: 'Sistemas de Iluminación Avanzada',
                icon: 'fas fa-lightbulb',
                color: 'from-golden-400 to-golden-600',
                description: 'Soluciones de iluminación modernas y eficientes para cada ambiente.',
                features: [
                    'Luminarias LED residenciales y comerciales',
                    'Reflectores LED de alta potencia',
                    'Paneles LED 60x60 para oficinas',
                    'Tiras LED RGB y blanco cálido',
                    'Lámparas solares con panel integrado',
                    'Luminarias de emergencia',
                    'Sistemas de iluminación inteligente',
                    'Reflectores con sensor de movimiento'
                ],
                brands: ['Philips', 'Osram', 'Sylvania', 'LED Depot'],
                applications: [
                    'Iluminación residencial',
                    'Oficinas y comercios',
                    'Iluminación deportiva',
                    'Sistemas decorativos'
                ]
            },
            control: {
                title: 'Material de Control y Automatización',
                icon: 'fas fa-microchip',
                color: 'from-purple-400 to-purple-600',
                description: 'Equipos de control y automatización para instalaciones profesionales.',
                features: [
                    'Breakers monofásicos y trifásicos',
                    'Contactores AC/DC todas las capacidades',
                    'Relés temporizadores programables',
                    'Arrancadores suaves para motores',
                    'Variadores de frecuencia',
                    'PLCs para automatización',
                    'Sensores industriales',
                    'Tableros y gabinetes eléctricos'
                ],
                brands: ['Schneider Electric', 'ABB', 'Siemens', 'Allen Bradley'],
                applications: [
                    'Control de motores',
                    'Automatización industrial',
                    'Sistemas de seguridad',
                    'Control de procesos'
                ]
            }
        };
        
        return products[productType] || null;
    },
    
    /**
     * Crea y muestra modal de producto
     * @param {Object} productInfo - Información del producto
     */
    createProductModal(productInfo) {
        // Crea modal dinámicamente
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.id = 'product-modal';
        
        modal.innerHTML = `
            <div class="bg-white rounded-3xl max-w-4xl w-full max-h-screen overflow-y-auto">
                <div class="p-8">
                    <!-- Header -->
                    <div class="flex justify-between items-start mb-6">
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 bg-gradient-to-br ${productInfo.color} rounded-2xl flex items-center justify-center">
                                <i class="${productInfo.icon} text-white text-2xl"></i>
                            </div>
                            <div>
                                <h2 class="text-3xl font-bold text-navy-800">${productInfo.title}</h2>
                                <p class="text-gray-600 mt-2">${productInfo.description}</p>
                            </div>
                        </div>
                        <button onclick="closeProductModal()" class="text-gray-400 hover:text-gray-600 text-2xl">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <!-- Content Grid -->
                    <div class="grid md:grid-cols-2 gap-8">
                        <!-- Features -->
                        <div>
                            <h3 class="text-xl font-bold text-navy-800 mb-4">Productos Disponibles</h3>
                            <ul class="space-y-3">
                                ${productInfo.features.map(feature => `
                                    <li class="flex items-start space-x-3">
                                        <i class="fas fa-check text-green-500 mt-1"></i>
                                        <span class="text-gray-700">${feature}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        
                        <!-- Applications & Brands -->
                        <div class="space-y-6">
                            <div>
                                <h3 class="text-xl font-bold text-navy-800 mb-4">Aplicaciones</h3>
                                <div class="grid grid-cols-2 gap-2">
                                    ${productInfo.applications.map(app => `
                                        <div class="bg-gray-100 px-3 py-2 rounded-lg text-sm text-center text-gray-700">
                                            ${app}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div>
                                <h3 class="text-xl font-bold text-navy-800 mb-4">Marcas Disponibles</h3>
                                <div class="flex flex-wrap gap-2">
                                    ${productInfo.brands.map(brand => `
                                        <span class="bg-gradient-to-r ${productInfo.color} text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            ${brand}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="C:\Users\User\OneDrive\Escritorio\Pedidosproyecto\index.html" class="bg-gradient-to-r ${productInfo.color} text-white px-8 py-3 rounded-full font-bold text-center hover:shadow-lg transition-all duration-300">
                            <i class="fas fa-shopping-cart mr-2"></i>Hacer Pedido
                        </a>
                        <button onclick="ContactManager.showMessage('💬 Contáctanos al +58 424-5320538 para más información', 'info')" class="border-2 border-navy-600 text-navy-600 px-8 py-3 rounded-full font-bold hover:bg-navy-600 hover:text-white transition-all duration-300">
                            <i class="fas fa-phone mr-2"></i>Consultar Precio
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Agrega modal al DOM
        document.body.appendChild(modal);
        
        // Animación de entrada
        requestAnimationFrame(() => {
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s ease';
            requestAnimationFrame(() => {
                modal.style.opacity = '1';
            });
        });
        
        // Cierra modal al hacer click fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    },
    
    /**
     * Cierra el modal de producto
     */
    closeModal() {
        const modal = Utils.$('#product-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }
};

// ===== FUNCIONES GLOBALES PARA EL HTML =====
/**
 * Funciones que se llaman directamente desde el HTML
 */

/**
 * Muestra detalles de producto (llamada desde HTML)
 * @param {string} productType - Tipo de producto
 */
window.showProductDetails = function(productType) {
    ProductManager.showDetails(productType);
};

/**
 * Cierra modal de producto (llamada desde HTML)
 */
window.closeProductModal = function() {
    ProductManager.closeModal();
};

/**
 * Muestra información sobre el logo (llamada desde HTML)
 */
window.showLogoInfo = function() {
    ContactManager.showMessage(
        '🎨 Espacio reservado para tu logo empresarial.\n\n' +
        'Características recomendadas:\n' +
        '• Formato: PNG o SVG\n' +
        '• Tamaño: 120x80px (proporción 3:2)\n' +
        '• Fondo transparente\n' +
        '• Alta resolución para pantallas Retina\n\n' +
        'Reemplaza la clase "logo-placeholder" con tu imagen.',
        'info'
    );
};

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
/**
 * Clase principal que coordina toda la aplicación
 */
class ElectricosRuitocaApp {
    
    constructor() {
        this.version = '1.0.0';
        this.initialized = false;
    }
    
    /**
     * Inicializa toda la aplicación
     */
    init() {
        if (this.initialized) {
            console.warn('⚠️ La aplicación ya está inicializada');
            return;
        }
        
        console.log('🚀 Iniciando Eléctricos Ruitoca App v' + this.version);
        
        try {
            // Inicialización secuencial
            DOMManager.init();
            DOMManager.setupEventListeners();
            LoadingManager.init();
            
            this.initialized = true;
            console.log('✅ Eléctricos Ruitoca App inicializada correctamente');
            
            // Registro para debugging
            window.ElectricosRuitocaApp = this;
            window.AppState = AppState;
            window.CONFIG = CONFIG;
            
        } catch (error) {
            console.error('❌ Error al inicializar la aplicación:', error);
        }
    }
    
    /**
     * Información de la aplicación
     */
    getInfo() {
        return {
            name: 'Eléctricos Ruitoca',
            version: this.version,
            initialized: this.initialized,
            location: 'Barquisimeto, Lara, Venezuela',
            description: 'Sistema web moderno para tienda de materiales eléctricos'
        };
    }
}

// ===== INICIALIZACIÓN CUANDO EL DOM ESTÁ LISTO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM cargado completamente');
    
    // Crea e inicializa la aplicación
    const app = new ElectricosRuitocaApp();
    app.init();
});

// ===== LOGS DE DESARROLLO =====
console.log('📋 JavaScript principal de Eléctricos Ruitoca cargado');
console.log('🏢 Sistema desarrollado para Barquisimeto, Estado Lara');
console.log('⚡ Funcionalidades: Navegación, Animaciones, Formularios, Productos');
console.log('👨‍💻 Código desarrollado con mejores prácticas ES6+');
console.log('🎯 Optimizado para rendimiento y experiencia de usuario');

// ===== FIN DEL ARCHIVO =====
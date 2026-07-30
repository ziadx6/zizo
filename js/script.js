document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. نظام الترجمة (Localization)
    // ==========================================
    const translations = {
        en: {
            nav_home: "Home",
            nav_about: "About",
            nav_skills: "Skills",
            nav_edu: "Education",
            nav_contact: "Contact",
            hero_greeting: "Hello, I'm",
            hero_title: "Accountant",
            hero_desc: "I am an Accounting student at Cairo University with five years of experience in financial accounting. I am passionate about Artificial Intelligence and continuously learning how to integrate modern technology into accounting to improve productivity and efficiency.",
            btn_about: "About Me",
            btn_contact: "Contact Me",
            section_about: "About Me",
            about_text: "I am an Accounting student at Cairo University, majoring in Accounting. I live in New Valley, Egypt. I have five years of experience in Financial Accounting. I am passionate about Artificial Intelligence and continuously improving my accounting and technology skills. I am interested in using AI to enhance accounting workflows and productivity.",
            section_skills: "Skills",
            skill_acc_title: "Accounting",
            skill_acc_1: "Financial Accounting",
            skill_acc_2: "Bookkeeping",
            skill_acc_3: "Financial Analysis",
            skill_ms_title: "Microsoft Office",
            skill_tech_title: "Technology",
            skill_tech_1: "Artificial Intelligence Tools",
            skill_tech_2: "AI Productivity",
            skill_tech_3: "Continuous Learning",
            section_edu: "Education",
            edu_faculty: "Faculty of Commerce",
            edu_major: "Major: Accounting",
            section_lang: "Languages",
            lang_arabic: "Arabic",
            lang_arabic_lvl: "Native",
            lang_english: "English",
            lang_english_lvl: "Intermediate",
            section_contact: "Contact Me",
            form_name: "Your Name",
            form_email: "Your Email",
            form_subject: "Subject",
            form_msg: "Your Message",
            form_btn: "Send Message",
            footer_copy: "© Copyright © ZI. All Rights Reserved.",
            footer_top: "Back to Top"
        },
        ar: {
            nav_home: "الرئيسية",
            nav_about: "عني",
            nav_skills: "مهاراتي",
            nav_edu: "التعليم",
            nav_contact: "تواصل",
            hero_greeting: "أهلاً، أنا",
            hero_title: "محاسب",
            hero_desc: "أنا طالب محاسبة في جامعة القاهرة، ولدي خمس سنوات من الخبرة في المحاسبة المالية. لدي شغف بالذكاء الاصطناعي، وأسعى باستمرار إلى تطوير مهاراتي في دمج التقنيات الحديثة في المحاسبة لتحسين الإنتاجية والكفاءة.",
            btn_about: "معلومات عني",
            btn_contact: "تواصل معي",
            section_about: "عني",
            about_text: "أنا طالب محاسبة في جامعة القاهرة، تخصص محاسبة. أعيش في محافظةالوادي الجديد،. أمتلك خبرة خمس سنوات في المحاسبة المالية. لدي شغف بالذكاء الاصطناعي وأسعى باستمرار لتطوير مهاراتي المحاسبية والتكنولوجيا لتعزيز سير العمل والإنتاجية.",
            section_skills: "مهاراتي",
            skill_acc_title: "المحاسبة",
            skill_acc_1: "المحاسبة المالية",
            skill_acc_2: "إمساك الدفاتر",
            skill_acc_3: "التحليل المالي",
            skill_ms_title: "مايكروسوفت أوفيس",
            skill_tech_title: "التكنولوجيا",
            skill_tech_1: "أدوات الذكاء الاصطناعي",
            skill_tech_2: "الإنتاجية بالذكاء الاصطناعي",
            skill_tech_3: "التعلم المستمر",
            section_edu: "التعليم",
            edu_faculty: "كلية التجارة",
            edu_major: "التخصص: المحاسبة",
            section_lang: "اللغات",
            lang_arabic: "اللغة العربية",
            lang_arabic_lvl: "اللغة الأم",
            lang_english: "اللغة الإنجليزية",
            lang_english_lvl: "متوسط",
            section_contact: "تواصل معي",
            form_name: "اسمك",
            form_email: "بريدك الإلكتروني",
            form_subject: "الموضوع",
            form_msg: "رسالتك",
            form_btn: "إرسال الرسالة",
            footer_copy: "© حقوق النشر محفوظة لـ ZI. جميع الحقوق محفوظة.",
            footer_top: "العودة للأعلى"
        }
    };

    const langToggleBtn = document.getElementById('lang-toggle');
    const htmlElement = document.documentElement;
    let currentLang = 'en';

    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        
        htmlElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
        htmlElement.setAttribute('lang', currentLang);
        langToggleBtn.textContent = currentLang === 'en' ? 'عربي' : 'EN';

        // تحديث النصوص العادية
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                element.textContent = translations[currentLang][key];
            }
        });

        // تحديث حقول الـ Placeholder في النموذج
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[currentLang][key]) {
                element.setAttribute('placeholder', translations[currentLang][key]);
            }
        });
    });

    // ==========================================
    // 2. الوضع الليلي (Dark Mode)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        
        if (newTheme === 'light') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });

    // ==========================================
    // 3. القائمة الجانبية للموبايل (Mobile Nav)
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if(navLinks.classList.contains('active')){
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // ==========================================
    // 4. الأنيميشن عند السكرول (Scroll Animation)
    // ==========================================
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
});
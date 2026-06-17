/**
 * Ana Uygulama Mantığı ve Görünüm Yönetimi
 */

const App = {
    currentView: 'home',
    currentSlide: 0,
    isStudentMode: true,
    quizScore: 0,
    currentQuizQuestion: 0,

    init() {
        this.createStars();
        this.bindEvents();
        this.renderDictionary();
        this.renderSimList();
        this.renderProgList();
        
        // İlk slaytı hazırla
        this.showSlide(0);
        
        console.log("Quantum Future App Initialized");
    },

    bindEvents() {
        // Navigasyon
        document.querySelectorAll('[data-view]').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                this.switchView(e.target.dataset.view);
            };
        });

        // Başla Butonu
        document.getElementById('start-btn').onclick = () => {
            this.switchView('presentation');
            document.getElementById('main-nav').classList.remove('hidden');
        };

        // Slayt Kontrolleri
        document.getElementById('prev-slide').onclick = () => this.prevSlide();
        document.getElementById('next-slide').onclick = () => this.nextSlide();
        
        window.onkeydown = (e) => {
            if (this.currentView === 'presentation') {
                if (e.key === 'ArrowRight') this.nextSlide();
                if (e.key === 'ArrowLeft') this.prevSlide();
            }
        };

        // Mod Değiştirme
        document.getElementById('toggle-mode').onclick = (e) => {
            this.isStudentMode = !this.isStudentMode;
            e.target.innerText = this.isStudentMode ? "Öğrenci Modu" : "Sunucu Modu";
            document.getElementById('speaker-notes').classList.toggle('hidden', this.isStudentMode);
            this.showSlide(this.currentSlide); // Refresh current slide
        };

        // Quiz
        document.getElementById('start-quiz-btn').onclick = () => this.startQuiz();
        document.getElementById('retry-quiz-btn').onclick = () => this.startQuiz();

        // Sözlük Arama
        document.getElementById('dict-search').oninput = (e) => this.filterDictionary(e.target.value);

        // Lab Kod Kapatma
        document.querySelector('.close-code').onclick = () => {
            document.getElementById('code-logic-box').classList.add('hidden');
        };
    },

    switchView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(`view-${viewId}`).classList.add('active');
        
        // Update active link in nav
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.toggle('active', link.dataset.view === viewId);
        });

        this.currentView = viewId;
        
        if (viewId === 'lab') {
            Simulations.init('sim-canvas');
            if (!Simulations.activeSim) this.loadSim('blackbody');
        }
    },

    // --- SLAYT SİSTEMİ ---
    showSlide(index) {
        if (index < 0 || index >= SlidesData.length) return;
        this.currentSlide = index;
        const slide = SlidesData[index];
        const container = document.getElementById('slide-content');
        
        let html = `
            <h2 class="slide-title">${slide.title}</h2>
            <p class="slide-text">${slide.content}</p>
            <div class="slide-box">
                <strong>💡 Bunu Aklında Tut:</strong><br>
                ${slide.remember}
            </div>
        `;

        if (slide.question && this.isStudentMode) {
            html += `
                <div class="mini-quiz-box">
                    <p><strong>🤔 Mini Soru:</strong> ${slide.question}</p>
                    <div class="mini-options">
                        ${slide.options.map((opt, i) => `<button class="btn-secondary btn-sm" onclick="App.checkMiniAnswer(${i}, ${slide.answer}, this)">${opt}</button>`).join('')}
                    </div>
                </div>
            `;
        }

        if (slide.sim) {
            html += `<button class="btn-primary" style="margin-top:20px" onclick="App.goToSim('${slide.sim}')">Simülasyonu Dene →</button>`;
        }

        container.innerHTML = html;
        document.getElementById('slide-number').innerText = `${index + 1} / ${SlidesData.length}`;
        document.getElementById('notes-text').innerText = slide.note;
    },

    nextSlide() { if (this.currentSlide < SlidesData.length - 1) this.showSlide(this.currentSlide + 1); },
    prevSlide() { if (this.currentSlide > 0) this.showSlide(this.currentSlide - 1); },

    checkMiniAnswer(selected, correct, btn) {
        if (selected === correct) {
            btn.style.background = "var(--neon-green)";
            btn.style.color = "#000";
        } else {
            btn.style.background = "#ff3914";
        }
    },

    goToSim(simId) {
        this.switchView('lab');
        this.loadSim(simId);
    },

    toggleSlideMenu() {
        const menu = document.getElementById('slide-menu');
        menu.classList.toggle('hidden');
        if (!menu.classList.contains('hidden')) {
            this.renderSlideGrid();
        }
    },

    renderSlideGrid() {
        const grid = document.getElementById('slide-grid');
        grid.innerHTML = SlidesData.map((slide, i) => `
            <div class="slide-item ${i === this.currentSlide ? 'active' : ''}" onclick="App.jumpToSlide(${i})">
                <span>SLAYT ${i + 1}</span>
                <strong>${slide.title}</strong>
            </div>
        `).join('');
    },

    jumpToSlide(index) {
        this.showSlide(index);
        this.toggleSlideMenu();
    },

    jumpToInput() {
        const val = parseInt(document.getElementById('jump-input').value);
        if (!isNaN(val) && val >= 1 && val <= SlidesData.length) {
            this.showSlide(val - 1);
            document.getElementById('jump-input').value = '';
        } else {
            alert(`Lütfen 1 ile ${SlidesData.length} arasında bir sayı girin.`);
        }
    },

    // --- LABORATUVAR ---
    renderSimList() {
        const sims = [
            { id: 'blackbody', name: 'Planck & Kuantlaşma' },
            { id: 'photoelectric', name: 'Fotoelektrik Olay' },
            { id: 'doubleslit', name: 'Çift Yarık Deneyi' },
            { id: 'uncertainty', name: 'Belirsizlik İlkesi' },
            { id: 'superposition', name: 'Süperpozisyon' },
            { id: 'entanglement', name: 'Dolanıklık' },
            { id: 'qkd', name: 'QKD (Şifreleme)' },
            { id: 'mazeSim', name: 'Labirent Çözümü' },
            { id: 'tunneling', name: 'Kuantum Tünelleme' },
            { id: 'sterngerlach', name: 'Stern-Gerlach Deneyi' },
            { id: 'schrodinger', name: 'Schrödinger\'in Kedisi' },
            { id: 'machzehnder', name: 'Mach-Zehnder İnterferometresi' }
        ];
        const list = document.getElementById('sim-list');
        list.innerHTML = sims.map(s => `<li onclick="App.loadSim('${s.id}')" id="link-${s.id}">${s.name}</li>`).join('');
    },

    renderProgList() {
        const modules = [
            { id: 'complex', name: 'Karmaşık Sayılar' },
            { id: 'linear', name: 'Lineer Cebir' },
            { id: 'circuit', name: 'Devre Simülatörü' },
            { id: 'coinFlip', name: 'Kuantum Yazı-Tura' },
            { id: 'groverSearch', name: 'Grover Arama' },
            { id: 'quantumTeleportation', name: 'Kuantum Işınlama' },
            { id: 'shorAlgorithm', name: 'Shor Algoritması' },
            { id: 'qrng', name: 'Gerçek Rastgelelik (QRNG)' }
        ];
        const list = document.getElementById('prog-list');
        list.innerHTML = modules.map(m => `<li onclick="App.loadProg('${m.id}')">${m.name}</li>`).join('');
    },

    loadSim(id) {
        document.querySelectorAll('#sim-list li, #prog-list li').forEach(li => li.classList.remove('active'));
        document.getElementById(`link-${id}`)?.classList.add('active');
        Simulations.load(id);
    },

    loadProg(id) {
        // Programlama modülleri için özel simülasyonlar tetiklenecek
        if (id === 'complex') this.loadSim('complexSim');
        if (id === 'circuit') this.loadSim('circuitSim');
        if (id === 'coinFlip') this.loadSim('coinFlip');
        if (id === 'groverSearch') this.loadSim('groverSearch');
        if (id === 'quantumTeleportation') this.loadSim('quantumTeleportation');
        if (id === 'shorAlgorithm') this.loadSim('shorAlgorithm');
        if (id === 'qrng') this.loadSim('qrng');
    },

    // --- QUIZ ---
    startQuiz() {
        this.quizScore = 0;
        this.currentQuizQuestion = 0;
        document.getElementById('quiz-intro').classList.add('hidden');
        document.getElementById('quiz-result').classList.add('hidden');
        document.getElementById('quiz-content').classList.remove('hidden');
        this.showQuizQuestion();
    },

    showQuizQuestion() {
        const questions = SlidesData.filter(s => s.question).slice(0, 10);
        const q = questions[this.currentQuizQuestion];
        document.getElementById('quiz-question').innerText = q.question;
        document.getElementById('progress-bar').style.width = `${(this.currentQuizQuestion / 10) * 100}%`;
        
        const optionsDiv = document.getElementById('quiz-options');
        optionsDiv.innerHTML = q.options.map((opt, i) => `
            <button class="option-btn" onclick="App.handleQuizAnswer(${i}, ${q.answer})">${opt}</button>
        `).join('');
    },

    handleQuizAnswer(selected, correct) {
        if (selected === correct) this.quizScore++;
        
        this.currentQuizQuestion++;
        if (this.currentQuizQuestion < 10) {
            this.showQuizQuestion();
        } else {
            this.showQuizResult();
        }
    },

    showQuizResult() {
        document.getElementById('quiz-content').classList.add('hidden');
        document.getElementById('quiz-result').classList.remove('hidden');
        document.getElementById('score-text').innerText = `Skorun: ${this.quizScore} / 10`;
    },

    // --- SÖZLÜK ---
    renderDictionary() {
        const terms = [
            { t: "Kuantum", d: "Bir büyüklüğün mümkün olan en küçük birimi veya paketi." },
            { t: "Foton", d: "Işığı oluşturan kuantum parçacığı." },
            { t: "Qubit", d: "Kuantum bilgisayarların, hem 0 hem 1 durumunda olabilen temel bilgi birimi." },
            { t: "Süperpozisyon", d: "Bir kuantum sisteminin aynı anda birden fazla durumda bulunma yeteneği." },
            { t: "Dolanıklık", d: "İki parçacığın birbirine mesafeden bağımsız olarak kopmaz bir bağla bağlanması." },
            { t: "Dalga Fonksiyonu", d: "Bir parçacığın nerede bulunabileceğini gösteren olasılık haritası." }
        ];
        this.allTerms = terms;
        this.filterDictionary('');
    },

    filterDictionary(query) {
        const filtered = this.allTerms.filter(t => t.t.toLowerCase().includes(query.toLowerCase()));
        document.getElementById('dict-list').innerHTML = filtered.map(t => `
            <div class="dict-item">
                <h4>${t.t}</h4>
                <p>${t.d}</p>
            </div>
        `).join('');
    },

    // --- ARKA PLAN ---
    createStars() {
        const container = document.getElementById('stars-container');
        for (let i = 0; i < 150; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 3;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.setProperty('--duration', `${2 + Math.random() * 3}s`);
            container.appendChild(star);
        }
    }
};

window.onload = () => App.init();

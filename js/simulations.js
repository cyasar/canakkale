/**
 * Kuantum Simülasyonları Laboratuvarı
 */

const COLORS = {
    blue: '#00f2ff',
    purple: '#bc13fe',
    green: '#39ff14',
    red: '#ff3914'
};

const Simulations = {
    activeSim: null,
    canvas: null,
    ctx: null,
    animationId: null,
    params: {},
    state: {}, 

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        if (this.activeSim) this.load(this.activeSim);
    },

    clear() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        document.getElementById('sim-ui-overlay').innerHTML = '';
        document.getElementById('sim-controls').innerHTML = '';
        this.state = {}; // Durumu sıfırla
    },

    load(simId, isUpdate = false) {
        if (this.activeSim !== simId) {
            this.clear();
        } else {
            if (this.animationId) cancelAnimationFrame(this.animationId);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        const prevSim = this.activeSim;
        this.activeSim = simId;
        
        if (this[simId]) {
            this[simId](prevSim === simId);
        } else if (Simulations[simId]) {
             Simulations[simId].call(this, prevSim === simId);
        }
    },

    // --- SİMU-1: Siyah Cisim Işıması ---
    blackbody(isUpdate) {
        const title = "Siyah Cisim Işıması ve Ultraviyole Felaketi";
        const desc = "Sıcaklığı artırdıkça klasik fiziğin neden iflas ettiğini ve Planck'ın çözümünü görün.";
        this.updateUI(title, desc);

        if (!isUpdate) {
            this.params = { temperature: 3000 };
        }
        this.createControl("Sıcaklık (Kelvin)", "temperature", 500, 8000, 100);

        const animate = () => {
            this.ctx.fillStyle = '#05070a';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            const padding = 60;
            const graphWidth = this.canvas.width / 2;
            const graphHeight = this.canvas.height - padding * 2;
            const startX = 50;
            const startY = this.canvas.height - padding;

            // Isınan Cisim
            const objectX = graphWidth + 150;
            const objectY = this.canvas.height / 2;
            const tempRatio = (this.params.temperature - 500) / 7500;
            let hue = 30 - tempRatio * 60; if (hue < 0) hue += 360;
            const glowColor = `hsl(${hue}, 100%, ${50 + tempRatio * 30}%)`;

            this.ctx.shadowBlur = 30 + tempRatio * 40;
            this.ctx.shadowColor = glowColor;
            this.ctx.fillStyle = glowColor;
            this.ctx.beginPath(); this.ctx.arc(objectX, objectY, 60 + tempRatio * 20, 0, Math.PI*2); this.ctx.fill();
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '16px Space Grotesk';
            this.ctx.fillText(`Sıcaklık: ${this.params.temperature} K`, objectX - 50, objectY + 110);

            // Grafik
            this.ctx.strokeStyle = '#94a3b8';
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY); this.ctx.lineTo(startX + graphWidth, startY);
            this.ctx.moveTo(startX, startY); this.ctx.lineTo(startX, startY - graphHeight);
            this.ctx.stroke();

            // Klasik
            this.ctx.strokeStyle = '#ff3914'; this.ctx.setLineDash([5, 5]); this.ctx.beginPath();
            for(let x=1; x<graphWidth; x++) {
                const lambda = x / 40;
                const intensity = (this.params.temperature / 100) / Math.pow(lambda, 2);
                this.ctx.lineTo(startX + x, startY - Math.min(intensity, graphHeight));
            }
            this.ctx.stroke(); this.ctx.setLineDash([]);

            // Planck
            this.ctx.strokeStyle = '#00f2ff'; this.ctx.lineWidth = 3; this.ctx.beginPath();
            const T = this.params.temperature / 1000;
            for(let x=1; x<graphWidth; x++) {
                const lambda = x / 60;
                const intensity = (500 * Math.pow(T, 4)) / (Math.pow(lambda, 3) * (Math.exp(5 / (lambda * T)) - 1));
                this.ctx.lineTo(startX + x, startY - Math.min(intensity, graphHeight));
            }
            this.ctx.stroke();

            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    },

    // --- SİMU-2: Fotoelektrik Olay ---
    photoelectric(isUpdate) {
        const title = "Fotoelektrik Olay";
        const desc = "Sadece ışık şiddeti değil, ışığın rengi (frekansı) elektron koparmak için önemlidir.";
        this.updateUI(title, desc);

        if (!isUpdate) {
            this.params = { intensity: 5, frequency: 5 };
            this.state.electrons = [];
        }
        this.createControl("Işık Åiddeti", "intensity", 1, 10, 1);
        this.createControl("Işık Frekansı (Enerji)", "frequency", 1, 10, 1);

        const threshold = 6;
        const animate = () => {
            this.ctx.fillStyle = '#05070a';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Katot
            this.ctx.fillStyle = '#444';
            this.ctx.fillRect(this.canvas.width - 100, 50, 40, this.canvas.height - 100);
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(`Metal Eşik: ${threshold}`, this.canvas.width - 150, 40);

            // Işık
            const hue = (10 - this.params.frequency) * 25;
            this.ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
            this.ctx.lineWidth = 3;
            for(let i=0; i<this.params.intensity * 3; i++) {
                const y = 80 + i * (this.canvas.height / (this.params.intensity * 4));
                this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(this.canvas.width - 100, y); this.ctx.stroke();
            }

            // Durum
            this.ctx.fillStyle = this.params.frequency >= threshold ? '#39ff14' : '#ff3914';
            this.ctx.font = '20px Space Grotesk';
            this.ctx.fillText(this.params.frequency >= threshold ? "Elektronlar kopuyor!" : "Enerji yetersiz.", 50, 50);

            if (this.params.frequency >= threshold && Math.random() < this.params.intensity * 0.05) {
                this.state.electrons.push({
                    x: this.canvas.width - 100,
                    y: 80 + Math.random() * (this.canvas.height - 150),
                    vx: -(this.params.frequency - threshold + 2),
                    vy: (Math.random() - 0.5) * 2
                });
            }

            this.ctx.fillStyle = '#00f2ff';
            this.state.electrons.forEach((e, i) => {
                e.x += e.vx; e.y += e.vy;
                this.ctx.beginPath(); this.ctx.arc(e.x, e.y, 5, 0, Math.PI*2); this.ctx.fill();
                if (e.x < 0) this.state.electrons.splice(i, 1);
            });

            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    },

    doubleslit(isUpdate) {
        this.updateUI("Çift Yarık Deneyi", "Ölçüm yapıldığında dalga fonksiyonu çöker.");
        if (!isUpdate) {
            this.params = { measure: false };
            this.state.particles = [];
            this.state.pattern = new Array(100).fill(0);
        }
        this.createControl("Gözlemci (Ölçüm Yap)", "measure", null, null, null, "checkbox");

        const animate = () => {
            this.ctx.fillStyle = 'rgba(5, 7, 10, 0.2)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            const slitX = 200, screenX = this.canvas.width - 60, midY = this.canvas.height / 2;
            this.ctx.fillStyle = '#444';
            this.ctx.fillRect(slitX, 0, 15, midY - 60);
            this.ctx.fillRect(slitX, midY - 20, 15, 40);
            this.ctx.fillRect(slitX, midY + 60, 15, this.canvas.height);

            if (this.params.measure) {
                this.ctx.font = '40px Arial'; this.ctx.fillText('👁️', slitX - 60, midY - 80);
            }

            if (Math.random() < 0.15) {
                this.state.particles.push({ x: 0, y: midY + (Math.random() - 0.5) * 100, passed: false, angle: 0 });
            }

            this.state.particles.forEach((p, i) => {
                p.x += 4;
                if (!p.passed && p.x >= slitX) {
                    p.passed = true;
                    if (this.params.measure) {
                        p.y = Math.random() > 0.5 ? midY - 40 : midY + 40;
                        p.angle = (Math.random() - 0.5) * 0.15;
                    } else {
                        let rand = Math.random();
                        for(let a = -0.6; a <= 0.6; a += 0.01) {
                            if (rand < Math.pow(Math.cos(a * 10), 2) * 0.1) { p.angle = a; break; }
                        }
                    }
                }
                if (p.passed) p.y += Math.sin(p.angle) * 8;
                this.ctx.fillStyle = this.params.measure ? '#bc13fe' : '#00f2ff';
                this.ctx.beginPath(); this.ctx.arc(p.x, p.y, 3, 0, Math.PI*2); this.ctx.fill();
                if (p.x >= screenX) {
                    const idx = Math.floor((p.y / this.canvas.height) * 100);
                    if (idx >= 0 && idx < 100) this.state.pattern[idx]++;
                    this.state.particles.splice(i, 1);
                }
            });

            this.ctx.fillStyle = '#111'; this.ctx.fillRect(screenX, 0, 60, this.canvas.height);
            this.state.pattern.forEach((val, idx) => {
                const y = (idx / 100) * this.canvas.height;
                this.ctx.fillStyle = this.params.measure ? 'rgba(188, 19, 254, 0.6)' : 'rgba(0, 242, 255, 0.6)';
                this.ctx.fillRect(screenX + 2, y, Math.min(val * 1.5, 55), this.canvas.height/100);
            });

            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    },

    // --- SİMU-4: Qubit Görselleştirme ---
    qubit(isUpdate) {
        this.updateUI("Qubit ve Bloch Küresi", "Bir qubitin durumunu geometrik ve matrisel olarak görün.");
        if (!isUpdate) this.params = { theta: 0, phi: 0 };
        this.createControl("Kutup Açısı (Theta)", "theta", 0, Math.PI, 0.01);
        this.createControl("Faz Açısı (Phi)", "phi", 0, Math.PI * 2, 0.01);

        const animate = () => {
            this.ctx.fillStyle = '#05070a';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            const cx = this.canvas.width/2 - 150;
            const cy = this.canvas.height/2;
            const r = 120;

            // Küre Izgarası (3D Etkisi)
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            this.ctx.lineWidth = 1;
            
            // Meridyenler ve Paraleller
            for(let i=0; i<Math.PI; i+=Math.PI/6) {
                this.ctx.beginPath();
                this.ctx.ellipse(cx, cy, r * Math.sin(i), r, 0, 0, Math.PI*2);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.ellipse(cx, cy, r, r * Math.sin(i), 0, 0, Math.PI*2);
                this.ctx.stroke();
            }

            // Ana Küre ve Eksenler
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.beginPath(); this.ctx.arc(cx, cy, r, 0, Math.PI*2); this.ctx.stroke();
            this.ctx.beginPath(); this.ctx.moveTo(cx, cy - r - 20); this.ctx.lineTo(cx, cy + r + 20); this.ctx.stroke();
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 16px Space Grotesk';
            this.ctx.fillText('|0⟩', cx - 10, cy - r - 30);
            this.ctx.fillText('|1⟩', cx - 10, cy + r + 40);

            // Vektör Hesaplama
            const x = r * Math.sin(this.params.theta) * Math.cos(this.params.phi);
            const z = -r * Math.cos(this.params.theta);
            const y = r * Math.sin(this.params.theta) * Math.sin(this.params.phi) * 0.4;

            // Vektör Çizimi
            this.ctx.strokeStyle = '#00f2ff';
            this.ctx.lineWidth = 4;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#00f2ff';
            this.ctx.beginPath(); this.ctx.moveTo(cx, cy); this.ctx.lineTo(cx + x, cy + z + y); this.ctx.stroke();
            this.ctx.shadowBlur = 0;
            
            this.ctx.fillStyle = '#00f2ff';
            this.ctx.beginPath(); this.ctx.arc(cx + x, cy + z + y, 6, 0, Math.PI*2); this.ctx.fill();

            // --- MATEMATİKSEL GÖSTERİM ---
            const alpha = Math.cos(this.params.theta / 2);
            const beta = Math.sin(this.params.theta / 2);
            const phiDeg = (this.params.phi * 180 / Math.PI).toFixed(0);

            const startX = cx + r + 80;
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px Space Grotesk';
            this.ctx.fillText(`|ψ⟩ = ${alpha.toFixed(2)} |0⟩ + ${beta.toFixed(2)} e^(i${phiDeg}°) |1⟩`, startX, cy - 80);

            // Vektör/Matris Formu
            this.ctx.font = '16px Space Grotesk';
            this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
            this.ctx.fillText("Vektör (Matris) Formu:", startX, cy - 20);
            
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            // Sol Parantez
            this.ctx.beginPath();
            this.ctx.moveTo(startX + 20, cy); this.ctx.lineTo(startX + 10, cy);
            this.ctx.lineTo(startX + 10, cy + 90); this.ctx.lineTo(startX + 20, cy + 90);
            this.ctx.stroke();
            // Sağ Parantez
            this.ctx.beginPath();
            this.ctx.moveTo(startX + 120, cy); this.ctx.lineTo(startX + 130, cy);
            this.ctx.lineTo(startX + 130, cy + 90); this.ctx.lineTo(startX + 120, cy + 90);
            this.ctx.stroke();

            this.ctx.fillStyle = '#00f2ff';
            this.ctx.font = 'bold 20px Space Grotesk';
            this.ctx.fillText(alpha.toFixed(2), startX + 35, cy + 35);
            this.ctx.fillText(beta.toFixed(2), startX + 35, cy + 75);
            
            if (beta > 0.01) {
                this.ctx.font = '12px Space Grotesk';
                this.ctx.fillText(`e^(i${phiDeg}°)`, startX + 80, cy + 75);
            }

            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    },

    // Diğerleri...
    uncertainty(isUpdate) {
        this.updateUI("Heisenberg Belirsizlik İlkesi", "Konum (X) ve Momentum (P) arasındaki ilişki.");
        if (!isUpdate) this.params = { precisionX: 5 };
        this.createControl("Konum Hassasiyeti", "precisionX", 1, 10, 1);
        const animate = () => {
            this.ctx.fillStyle = '#05070a'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            const x = this.canvas.width/2, y = this.canvas.height/2, dx = 100/this.params.precisionX, dp = this.params.precisionX*15;
            const grad = this.ctx.createRadialGradient(x, y, 0, x, y, dx*3);
            grad.addColorStop(0, 'rgba(0, 242, 255, 0.5)'); grad.addColorStop(1, 'rgba(0, 242, 255, 0)');
            this.ctx.fillStyle = grad; this.ctx.beginPath(); this.ctx.arc(x, y, dx*3, 0, Math.PI*2); this.ctx.fill();
            this.ctx.strokeStyle = '#bc13fe';
            for(let i=0; i<15; i++) {
                const a = Math.random()*Math.PI*2, l = Math.random()*dp;
                this.ctx.beginPath(); this.ctx.moveTo(x, y); this.ctx.lineTo(x+Math.cos(a)*l, y+Math.sin(a)*l); this.ctx.stroke();
            }
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    },

    superposition(isUpdate) { Simulations.superposition.call(this, isUpdate); },
    entanglement(isUpdate) { Simulations.entanglement.call(this, isUpdate); },
    wavefunction(isUpdate) { Simulations.wavefunction.call(this, isUpdate); },
    qkd(isUpdate) { Simulations.qkd.call(this, isUpdate); },
    complexSim(isUpdate) { Simulations.complexSim.call(this, isUpdate); },
    circuitSim(isUpdate) { Simulations.circuitSim.call(this, isUpdate); },
    coinFlip(isUpdate) { Simulations.coinFlip.call(this, isUpdate); },
    groverSearch(isUpdate) { Simulations.groverSearch.call(this, isUpdate); },
    quantumTeleportation(isUpdate) { Simulations.quantumTeleportation.call(this, isUpdate); },

    updateUI(title, desc) {
        document.getElementById('sim-title').innerText = title;
        document.getElementById('sim-desc').innerText = desc;
    },

    createControl(label, param, min, max, step, type = "range") {
        if (document.getElementById(`control-${param}`)) return;
        const div = document.createElement('div');
        div.className = 'control-group'; div.id = `control-${param}`;
        const lbl = document.createElement('label'); lbl.innerText = label; div.appendChild(lbl);
        const input = document.createElement('input'); input.type = type;
        if (type === "range") { input.min = min; input.max = max; input.step = step; input.value = this.params[param]; }
        else if (type === "checkbox") { input.checked = this.params[param]; }
        input.oninput = (e) => {
            this.params[param] = type === "checkbox" ? e.target.checked : parseFloat(e.target.value);
            this.load(this.activeSim, true);
        };
        div.appendChild(input);
        document.getElementById('sim-controls').appendChild(div);
    },

    drawBlochSphere(cx, cy, r, theta, phi, color = COLORS.blue, label = "|ψ⟩") {
        // Küre Izgarası (3D Etkisi)
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        for(let i=0; i<Math.PI; i+=Math.PI/6) {
            this.ctx.beginPath();
            this.ctx.ellipse(cx, cy, r * Math.sin(i), r, 0, 0, Math.PI*2);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.ellipse(cx, cy, r, r * Math.sin(i), 0, 0, Math.PI*2);
            this.ctx.stroke();
        }

        // Ana Küre ve Eksenler
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.beginPath(); this.ctx.arc(cx, cy, r, 0, Math.PI*2); this.ctx.stroke();
        this.ctx.beginPath(); this.ctx.moveTo(cx, cy - r - 10); this.ctx.lineTo(cx, cy + r + 10); this.ctx.stroke();
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 14px Space Grotesk';
        this.ctx.fillText('|0⟩', cx - 8, cy - r - 20);
        this.ctx.fillText('|1⟩', cx - 8, cy + r + 25);

        // Vektör Hesaplama
        const x = r * Math.sin(theta) * Math.cos(phi);
        const z = -r * Math.cos(theta);
        const y = r * Math.sin(theta) * Math.sin(phi) * 0.4;

        // Vektör Çizimi
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 4;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = color;
        this.ctx.beginPath(); this.ctx.moveTo(cx, cy); this.ctx.lineTo(cx + x, cy + z + y); this.ctx.stroke();
        this.ctx.shadowBlur = 0;
        
        this.ctx.fillStyle = color;
        this.ctx.beginPath(); this.ctx.arc(cx + x, cy + z + y, 5, 0, Math.PI*2); this.ctx.fill();
        
        if (label) {
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(label, cx + x + 10, cy + z + y);
        }
    },

    showCode(code) {
        const box = document.getElementById('code-logic-box');
        box.classList.remove('hidden');
        document.getElementById('code-display').innerText = code;
    }
};

// Bağımsız Atamalar (Persist için)
Simulations.wavefunction = function(isUpdate) {
    this.updateUI("Dalga Fonksiyonu", "Parçacığın nerede bulunma olasılığı olduğunu görün.");
    if (!isUpdate) this.state.measuredX = null;
    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        const btn = document.createElement('button'); btn.innerText = "KONUMU ÖLÇ"; btn.className = "btn-primary";
        btn.onclick = () => { this.state.measuredX = this.canvas.width/2 + (Math.random() + Math.random() + Math.random() - 1.5) * 100; };
        controls.appendChild(btn);
    }
    const animate = () => {
        this.ctx.fillStyle = '#05070a'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const midY = this.canvas.height / 2;
        this.ctx.beginPath(); this.ctx.strokeStyle = '#00f2ff';
        for(let x=0; x<this.canvas.width; x++) {
            const prob = Math.exp(-Math.pow(x - this.canvas.width/2, 2) / 5000);
            const y = midY - prob * 150 * Math.sin(x*0.05 + Date.now()*0.005);
            if(x===0) this.ctx.moveTo(x, y); else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
        if (this.state.measuredX) {
            this.ctx.fillStyle = '#ff3914'; this.ctx.beginPath(); this.ctx.arc(this.state.measuredX, midY, 10, 0, Math.PI*2); this.ctx.fill();
            setTimeout(() => { this.state.measuredX = null; }, 1500);
        }
        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.superposition = function(isUpdate) {
    this.updateUI("Süperpozisyon", "Qubit hem 0 hem 1 durumundadır.");
    if (!isUpdate) { this.state.isMeasured = false; this.state.result = null; }
    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        const btn = document.createElement('button'); btn.innerText = "ÖLÇÜM YAP (ÇÖKTÜR)"; btn.className = "btn-primary";
        btn.onclick = () => { this.state.isMeasured = true; this.state.result = Math.random()>0.5?0:1; setTimeout(()=>{this.state.isMeasured=false; this.state.result=null;}, 3000); };
        controls.appendChild(btn);
    }
    const animate = () => {
        this.ctx.fillStyle = '#05070a'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const cx = this.canvas.width/2, cy = this.canvas.height/2, r = 120;
        
        if (!this.state.isMeasured) {
            const t = Date.now()/200;
            const theta = Math.PI/2 + Math.sin(t*0.5)*0.2; // Ekvator çevresinde salınım
            const phi = t;
            this.drawBlochSphere(cx, cy, r, theta, phi, COLORS.blue, "Süperpozisyon");
        } else {
            const theta = this.state.result === 0 ? 0 : Math.PI;
            this.drawBlochSphere(cx, cy, r, theta, 0, COLORS.purple, `Durum: |${this.state.result}⟩`);
        }
        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.entanglement = function(isUpdate) {
    this.updateUI("Kuantum Dolanıklık", "İki parçacık birbirine anında bağlıdır; birini ölçmek diğerini belirler.");
    
    if (!isUpdate) {
        this.state.isMeasured = false;
        this.state.result = null;
    }

    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        const btn = document.createElement('button');
        btn.innerText = "BİRİNCİ PARÇACIÄI ÖLÇ";
        btn.className = "btn-primary";
        btn.onclick = () => {
            if (this.state.isMeasured) return;
            this.state.isMeasured = true;
            this.state.result = Math.random() > 0.5 ? 0 : 1;
            // 3 saniye sonra sıfırla
            setTimeout(() => {
                this.state.isMeasured = false;
                this.state.result = null;
            }, 3000);
        };
        controls.appendChild(btn);
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const y = this.canvas.height / 2;
        const x1 = this.canvas.width / 4;
        const x2 = this.canvas.width * 0.75;
        const r = 100;

        // Dolanıklık Bağı (Neon Çizgi)
        this.ctx.strokeStyle = 'rgba(188, 19, 254, 0.3)';
        this.ctx.setLineDash([15, 10]);
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x1 + r, y);
        this.ctx.lineTo(x2 - r, y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        if (!this.state.isMeasured) {
            const t = Date.now() / 200;
            // İki parçacık senkronize şekilde süperpozisyonda
            this.drawBlochSphere(x1, y, r, Math.PI/2, t, COLORS.blue, "Qubit A");
            this.drawBlochSphere(x2, y, r, Math.PI/2, t, COLORS.blue, "Qubit B");
            
            this.ctx.fillStyle = COLORS.purple;
            this.ctx.font = '14px Space Grotesk';
            this.ctx.fillText("Dolanık Durum (Bell Çifti)", this.canvas.width/2 - 80, y - 20);
        } else {
            // Birincisi ölçüldü, ikincisi anında aynı (veya zıt) duruma çöktü
            const theta = this.state.result === 0 ? 0 : Math.PI;
            this.drawBlochSphere(x1, y, r, theta, 0, COLORS.purple, `Ölçüldü: |${this.state.result}⟩`);
            this.drawBlochSphere(x2, y, r, theta, 0, COLORS.purple, `Anında Çöktü: |${this.state.result}⟩`);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 18px Space Grotesk';
            this.ctx.fillText("SPUKY ACTION AT A DISTANCE!", this.canvas.width/2 - 120, y + 150);
        }

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.qkd = function(isUpdate) {
    this.updateUI("QKD (Kuantum Anahtar Dağıtımı)", "Araya giren (Eve) sistemi bozar ve yakalanır.");
    
    if (!isUpdate) {
        this.params = { eve: false };
        this.state.photons = [];
        this.state.aliceKey = [];
        this.state.bobKey = [];
        this.state.errors = 0;
        this.state.totalShared = 0;
        this.state.lastDetection = "";
    }
    
    this.createControl("Eve Dinliyor mu?", "eve", null, null, null, "checkbox");

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const midY = this.canvas.height / 2;
        const aliceX = 100;
        const bobX = this.canvas.width - 100;
        const eveX = this.canvas.width / 2;

        // --- İSTASYONLAR ---
        this.ctx.font = 'bold 20px Space Grotesk';
        this.ctx.fillStyle = COLORS.blue;
        this.ctx.fillText("ALICE", aliceX - 30, 60);
        this.ctx.fillStyle = COLORS.purple;
        this.ctx.fillText("BOB", bobX - 20, 60);

        if (this.params.eve) {
            this.ctx.fillStyle = COLORS.red;
            this.ctx.fillText("EVE (Dinleyici)", eveX - 60, 60);
            
            // Eve Icon/Glow
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = COLORS.red;
            this.ctx.strokeStyle = COLORS.red;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(eveX, midY, 40, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.font = '30px Arial';
            this.ctx.fillText("😈", eveX - 15, midY + 10);
            this.ctx.shadowBlur = 0;
        }

        // --- FOTON ÜRETİMİ ---
        if (Math.random() < 0.03) {
            const basis = Math.random() > 0.5 ? '+' : 'x';
            const bit = Math.random() > 0.5 ? 1 : 0;
            this.state.photons.push({
                x: aliceX,
                y: midY,
                aliceBasis: basis,
                aliceBit: bit,
                currentBasis: basis,
                currentBit: bit,
                intercepted: false,
                bobBasis: Math.random() > 0.5 ? '+' : 'x'
            });
        }

        // --- FOTON HAREKETİ VE MANTIK ---
        this.state.photons.forEach((p, i) => {
            p.x += 4;

            // Eve Müdahalesi (Dinleme)
            if (this.params.eve && !p.intercepted && Math.abs(p.x - eveX) < 10) {
                p.intercepted = true;
                const eveBasis = Math.random() > 0.5 ? '+' : 'x';
                // Eve ölçüm yapar: Eğer bazı yanlışsa, durumu rastgeleleştirir
                if (eveBasis !== p.currentBasis) {
                    p.currentBasis = eveBasis;
                    p.currentBit = Math.random() > 0.5 ? 1 : 0;
                }
            }

            // Bob'a Ulaşma
            if (p.x >= bobX) {
                // Bob kendi bazında ölçüm yapar
                let bobResultBit = p.currentBit;
                if (p.bobBasis !== p.currentBasis) {
                    bobResultBit = Math.random() > 0.5 ? 1 : 0;
                }
                
                // BB84 Protokolü: Alice ve Bob bazlarını karşılaştırır
                // Eğer bazlar uyuşuyorsa bu bit anahtarın bir parçası olur
                if (p.aliceBasis === p.bobBasis) {
                    this.state.aliceKey.push({ bit: p.aliceBit, basis: p.aliceBasis });
                    this.state.bobKey.push({ bit: bobResultBit, basis: p.bobBasis });
                    this.state.totalShared++;
                    
                    if (p.aliceBit !== bobResultBit) {
                        this.state.errors++;
                    }
                }
                
                if (this.state.aliceKey.length > 12) {
                    this.state.aliceKey.shift();
                    this.state.bobKey.shift();
                }
                
                this.state.photons.splice(i, 1);
                return;
            }

            // Çizim
            const color = p.currentBasis === '+' ? COLORS.blue : COLORS.purple;
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            if (p.currentBasis === '+') {
                this.ctx.moveTo(p.x - 10, p.y); this.ctx.lineTo(p.x + 10, p.y);
                this.ctx.moveTo(p.x, p.y - 10); this.ctx.lineTo(p.x, p.y + 10);
            } else {
                this.ctx.moveTo(p.x - 7, p.y - 7); this.ctx.lineTo(p.x + 7, p.y + 7);
                this.ctx.moveTo(p.x + 7, p.y - 7); this.ctx.lineTo(p.x - 7, p.y + 7);
            }
            this.ctx.stroke();
            
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = color;
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        });

        // --- ANAHTAR LOGU (GÖRSEL) ---
        const logY = this.canvas.height - 100;
        this.ctx.fillStyle = 'rgba(255,255,255,0.1)';
        this.ctx.fillRect(50, logY - 40, this.canvas.width - 100, 80);
        
        this.ctx.font = '14px Space Grotesk';
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText("Alice Anahtarı:", 60, logY - 10);
        this.ctx.fillText("Bob Anahtarı:", 60, logY + 20);

        this.state.aliceKey.forEach((k, idx) => {
            const x = 200 + idx * 30;
            const isMatch = this.state.bobKey[idx] && this.state.bobKey[idx].bit === k.bit;
            
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(k.bit, x, logY - 10);
            
            if (this.state.bobKey[idx]) {
                this.ctx.fillStyle = isMatch ? COLORS.green : COLORS.red;
                this.ctx.fillText(this.state.bobKey[idx].bit, x, logY + 20);
                
                if (!isMatch) {
                    this.ctx.strokeStyle = COLORS.red;
                    this.ctx.strokeRect(x - 5, logY - 25, 20, 55);
                }
            }
        });

        // --- DURUM PANELİ ---
        const errorRate = this.state.totalShared > 0 ? (this.state.errors / this.state.totalShared * 100).toFixed(1) : 0;
        this.ctx.fillStyle = errorRate > 5 ? COLORS.red : COLORS.green;
        this.ctx.font = 'bold 18px Space Grotesk';
        this.ctx.fillText(`Hata Oranı: %${errorRate}`, 50, this.canvas.height - 160);
        
        if (errorRate > 10) {
            this.ctx.fillStyle = COLORS.red;
            this.ctx.fillText("⚠️ GÜVENLİK İHLALİ: EVE DİNLİYOR!", 250, this.canvas.height - 160);
        } else {
            this.ctx.fillStyle = COLORS.green;
            this.ctx.fillText("✅ KANAL GÜVENLİ", 250, this.canvas.height - 160);
        }

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.complexSim = function(isUpdate) {
    this.updateUI("Karmaşık Sayılar", "Kuantum mekaniğinin dili.");
    if (!isUpdate) this.params = { re: 1, im: 1 };
    this.createControl("Gerçel (Re)", "re", -2, 2, 0.1); this.createControl("Sanal (Im)", "im", -2, 2, 0.1);
    const animate = () => {
        this.ctx.fillStyle = '#05070a'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const cx = this.canvas.width/2, cy = this.canvas.height/2, scale = 100;
        this.ctx.strokeStyle = '#333';
        this.ctx.beginPath(); this.ctx.moveTo(0, cy); this.ctx.lineTo(this.canvas.width, cy);
        this.ctx.moveTo(cx, 0); this.ctx.lineTo(cx, this.canvas.height); this.ctx.stroke();
        this.ctx.strokeStyle = '#00f2ff'; this.ctx.lineWidth = 3;
        this.ctx.beginPath(); this.ctx.moveTo(cx, cy); this.ctx.lineTo(cx + this.params.re*scale, cy - this.params.im*scale); this.ctx.stroke();
        this.ctx.fillStyle = '#fff'; this.ctx.fillText(`z = ${this.params.re.toFixed(1)} + ${this.params.im.toFixed(1)}i`, cx+20, cy-20);
        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.circuitSim = function(isUpdate) {
    this.updateUI("IBM Tarzı Kuantum Devre Kurucu", "Kapıları seçin ve sistemin olasılıklarının nasıl değiştiğini gerçek zamanlı izleyin.");
    
    if (!isUpdate) {
        this.state.circuit = new QuantumCircuit(2);
        this.state.history = [];
    }

    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = `
            <div class="circuit-composer">
                <div class="gate-palette">
                    <div class="gate-item" title="Hadamard" onclick="Simulations.applyComposerGate('H', 0)">H</div>
                    <div class="gate-item" title="Pauli-X" onclick="Simulations.applyComposerGate('X', 0)">X</div>
                    <div class="gate-item" title="Pauli-Y" onclick="Simulations.applyComposerGate('Y', 0)">Y</div>
                    <div class="gate-item" title="Pauli-Z" onclick="Simulations.applyComposerGate('Z', 0)">Z</div>
                    <div class="gate-item" style="background:#bc13fe" title="CNOT" onclick="Simulations.applyComposerGate('CN', 'link')">⊕</div>
                    <div class="gate-item" style="background:#ff3914; color:#fff" title="Reset" onclick="Simulations.applyComposerGate('RESET')">↺</div>
                </div>
            </div>
        `;
    }

    Simulations.applyComposerGate = (label, target) => {
        const sim = Simulations;
        if (label === 'RESET') {
            sim.state.circuit.reset();
            sim.state.history = [];
            return;
        }
        if (label === 'CN') {
            sim.state.circuit.applyCNOT(0, 1);
            sim.state.history.push({ label: "CN", target: "link" });
        } else {
            sim.state.circuit.applyGate(Gates[label], 0);
            sim.state.history.push({ label: label, target: 0 });
        }
        if (sim.state.history.length > 12) sim.state.history.shift();
    };

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const margin = 100;
        const spacing = 70;
        const startY = 100;

        // Teller (Wires)
        this.ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        this.ctx.lineWidth = 2;
        [0, 1].forEach(i => {
            const y = startY + i * spacing;
            this.ctx.beginPath();
            this.ctx.moveTo(margin, y);
            this.ctx.lineTo(this.canvas.width - margin, y);
            this.ctx.stroke();
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(`q${i}`, margin - 30, y + 5);
        });

        // Kapılar (Gates)
        this.state.history.forEach((h, i) => {
            const x = margin + 40 + i * 50;
            if (h.target === "link") {
                this.ctx.strokeStyle = COLORS.purple;
                this.ctx.beginPath();
                this.ctx.moveTo(x, startY); this.ctx.lineTo(x, startY + spacing);
                this.ctx.stroke();
                this.ctx.fillStyle = COLORS.purple;
                this.ctx.beginPath(); this.ctx.arc(x, startY, 5, 0, Math.PI*2); this.ctx.fill();
                this.ctx.beginPath(); this.ctx.arc(x, startY + spacing, 10, 0, Math.PI*2); this.ctx.stroke();
            } else {
                const y = startY + h.target * spacing;
                this.ctx.fillStyle = h.label === 'H' ? COLORS.blue : '#fff';
                this.ctx.fillRect(x - 18, y - 18, 36, 36);
                this.ctx.fillStyle = '#000';
                this.ctx.font = 'bold 16px Arial';
                this.ctx.fillText(h.label, x - 7, y + 6);
            }
        });

        // Olasılıklar (IBM Style Histogram)
        const probs = this.state.circuit.getProbabilities();
        const states = ["00", "01", "10", "11"];
        const histX = margin;
        const histY = startY + spacing * 3;

        this.ctx.fillStyle = 'rgba(255,255,255,0.03)';
        this.ctx.fillRect(histX - 20, histY - 30, 400, 150);

        probs.forEach((p, i) => {
            const barHeight = p * 100;
            const bx = histX + i * 80;
            const by = histY + 80;
            
            // Çubuklar
            const grad = this.ctx.createLinearGradient(bx, by, bx, by - barHeight);
            grad.addColorStop(0, COLORS.blue);
            grad.addColorStop(1, COLORS.purple);
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(bx, by - barHeight, 40, barHeight);

            // Etiketler
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '12px Space Grotesk';
            this.ctx.fillText(`|${states[i]}⟩`, bx + 5, by + 20);
            if (p > 0.01) {
                this.ctx.font = 'bold 12px Space Grotesk';
                this.ctx.fillText(`${(p*100).toFixed(0)}%`, bx + 5, by - barHeight - 10);
            }
        });

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};
Simulations.gates = function(isUpdate) {
    this.updateUI("Kuantum Kapıları", "X, Y, Z ve Hadamard (H) kapılarının etkisini Qubit üzerinde görün.");
    
    if (!isUpdate) {
        this.state.theta = 0; 
        this.state.phi = 0;
        this.state.history = [];
    }

    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        const addBtn = (label, cls, action) => {
            const btn = document.createElement('button');
            btn.innerText = label;
            btn.className = cls;
            btn.style.margin = "5px";
            btn.onclick = action;
            controls.appendChild(btn);
        };

        addBtn("X (NOT)", "btn-secondary btn-sm", () => {
            this.state.theta = Math.PI - this.state.theta;
            this.state.history.push("X");
            this.state.lastGate = { name: "X (Pauli-X)", matrix: Gates.X };
            if (this.state.history.length > 8) this.state.history.shift();
        });

        addBtn("Y (Rotation)", "btn-secondary btn-sm", () => {
            this.state.theta = Math.PI - this.state.theta;
            this.state.phi = (this.state.phi + Math.PI) % (Math.PI * 2);
            this.state.history.push("Y");
            this.state.lastGate = { name: "Y (Pauli-Y)", matrix: Gates.Y };
            if (this.state.history.length > 8) this.state.history.shift();
        });

        addBtn("Z (Phase)", "btn-secondary btn-sm", () => {
            this.state.phi = (this.state.phi + Math.PI) % (Math.PI * 2);
            this.state.history.push("Z");
            this.state.lastGate = { name: "Z (Pauli-Z)", matrix: Gates.Z };
            if (this.state.history.length > 8) this.state.history.shift();
        });

        addBtn("H (Hadamard)", "btn-secondary btn-sm", () => {
            if (Math.abs(this.state.theta - Math.PI/2) < 0.1) {
                this.state.theta = (this.state.phi === 0) ? 0 : Math.PI;
                this.state.phi = 0;
            } else {
                this.state.theta = Math.PI / 2;
                this.state.phi = 0;
            }
            this.state.history.push("H");
            this.state.lastGate = { name: "H (Hadamard)", matrix: Gates.H };
            if (this.state.history.length > 8) this.state.history.shift();
        });
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const cx = this.canvas.width / 2 - 100;
        const cy = this.canvas.height / 2;
        const r = 120;

        this.drawBlochSphere(cx, cy, r, this.state.theta, this.state.phi, COLORS.blue, "Durum");

        // Matris Gösterimi
        if (this.state.lastGate) {
            let mx = cx + r + 100;
            const my = cy - 60;
            const isHadamard = this.state.lastGate.name.includes("Hadamard");
            
            // Glow effect for matrix header
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = COLORS.blue;
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 18px Space Grotesk';
            this.ctx.fillText(this.state.lastGate.name + " Matrisi:", mx, my - 25);
            this.ctx.shadowBlur = 0;

            if (isHadamard) {
                this.ctx.font = '20px Space Grotesk';
                this.ctx.fillText("1/√2", mx, my + 45);
                mx += 45;
            }

            // Parantezler (Glow effect)
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 3;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = 'rgba(255,255,255,0.3)';
            this.ctx.beginPath();
            this.ctx.moveTo(mx + 5, my); this.ctx.lineTo(mx, my); this.ctx.lineTo(mx, my + 80); this.ctx.lineTo(mx + 5, my + 80);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(mx + 115, my); this.ctx.lineTo(mx + 120, my); this.ctx.lineTo(mx + 120, my + 80); this.ctx.lineTo(mx + 115, my + 80);
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;

            // Değerler
            this.ctx.font = 'bold 18px Courier New';
            this.state.lastGate.matrix.forEach((row, rowIndex) => {
                row.forEach((val, colIndex) => {
                    let txt = val.re.toFixed(1);
                    if (isHadamard) {
                        txt = val.re > 0 ? "1" : "-1";
                    } else {
                        if (Math.abs(val.im) > 0.01) txt = (val.im > 0 ? "" : "-") + "i";
                        else if (val.re === 0 && val.im === 0) txt = "0";
                        else if (Math.abs(val.re - Math.round(val.re)) < 0.01) txt = Math.round(val.re).toString();
                    }
                    this.ctx.fillStyle = txt === "0" ? 'rgba(255,255,255,0.3)' : '#fff';
                    this.ctx.fillText(txt, mx + 25 + colIndex * 55, my + 30 + rowIndex * 35);
                });
            });
        }

        // Tarihçe (Daha modern akış)
        const histX = 50;
        const histY = this.canvas.height - 40;
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Space Grotesk';
        this.ctx.fillText("İşlem Akışı:", histX, histY);
        
        if (this.state.history.length) {
            this.state.history.forEach((h, i) => {
                const bx = histX + 90 + i * 45;
                this.ctx.fillStyle = h === 'H' ? COLORS.blue : COLORS.purple;
                this.ctx.fillRect(bx, histY - 18, 35, 25);
                this.ctx.fillStyle = '#000';
                this.ctx.font = 'bold 14px Space Grotesk';
                this.ctx.fillText(h, bx + 12, histY);
                if (i < this.state.history.length - 1) {
                    this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
                    this.ctx.fillText("→", bx + 38, histY);
                }
            });
        } else {
            this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
            this.ctx.fillText("Henüz kapı uygulanmadı. Aşağıdaki butonlarla başlayın.", histX + 90, histY);
        }

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.mazeSim = function(isUpdate) {
    this.updateUI("Klasik vs Kuantum Labirent Çözümü", "Kuantum bilgisayarlar süperpozisyon sayesinde tüm yolları aynı anda tarar.");
    
    if (!isUpdate) {
        const rows = 12, cols = 20;
        this.state.grid = Array(rows).fill().map(() => Array(cols).fill(0));
        // Daha karmaşık bir labirent oluştur
        for(let i=0; i<65; i++) {
            let rx = Math.floor(Math.random()*cols), ry = Math.floor(Math.random()*rows);
            if((rx>1 || ry>1) && (rx < cols-2 || ry < rows-2)) this.state.grid[ry][rx] = 1;
        }
        
        this.state.classicVisited = new Set();
        this.state.quantumWave = 0;
        this.state.classicQueue = [{x:0, y:0}];
        this.state.foundClassic = false;
        this.state.foundQuantum = false;
        this.state.timer = 0;
        this.state.classicSteps = 0;
    }

    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        const btn = document.createElement('button');
        btn.innerText = "YENİ LABİRENT OLUŞTUR";
        btn.className = "btn-primary";
        btn.onclick = () => this.load('mazeSim');
        controls.appendChild(btn);
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const rows = 12, cols = 20;
        const cellSize = Math.min(this.canvas.width / (cols + 6), this.canvas.height / (rows + 4));
        const offsetX = (this.canvas.width - cols * cellSize) / 2 - 50;
        const offsetY = (this.canvas.height - rows * cellSize) / 2;

        // --- LABİRENT ÇİZİMİ ---
        for(let y=0; y<rows; y++) {
            for(let x=0; x<cols; x++) {
                this.ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                this.ctx.strokeRect(offsetX + x*cellSize, offsetY + y*cellSize, cellSize, cellSize);
                if (this.state.grid[y][x] === 1) {
                    this.ctx.fillStyle = '#1e293b';
                    this.ctx.fillRect(offsetX + x*cellSize, offsetY + y*cellSize, cellSize, cellSize);
                }
            }
        }

        // Başlangıç ve Bitiş
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = COLORS.green;
        this.ctx.shadowColor = COLORS.green;
        this.ctx.fillRect(offsetX + 5, offsetY + 5, cellSize-10, cellSize-10);
        this.ctx.fillStyle = COLORS.red;
        this.ctx.shadowColor = COLORS.red;
        this.ctx.fillRect(offsetX + (cols-1)*cellSize + 5, offsetY + (rows-1)*cellSize + 5, cellSize-10, cellSize-10);
        this.ctx.shadowBlur = 0;

        // --- KUANTUM ARAMA (Süperpozisyon Dalgası) ---
        if (!this.state.foundQuantum) this.state.quantumWave += 0.12;
        
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = COLORS.blue;
        for(let y=0; y<rows; y++) {
            for(let x=0; x<cols; x++) {
                const dist = Math.sqrt(x*x + y*y);
                if (dist < this.state.quantumWave && this.state.grid[y][x] === 0) {
                    this.ctx.fillStyle = 'rgba(0, 242, 255, 0.25)';
                    this.ctx.fillRect(offsetX + x*cellSize, offsetY + y*cellSize, cellSize, cellSize);
                    if (x === cols-1 && y === rows-1) this.state.foundQuantum = true;
                }
            }
        }
        this.ctx.shadowBlur = 0;

        // --- KLASİK ARAMA (BFS) ---
        this.state.timer++;
        if (this.state.timer % 5 === 0 && this.state.classicQueue.length > 0 && !this.state.foundClassic) {
            const current = this.state.classicQueue.shift();
            const key = `${current.x},${current.y}`;
            if (!this.state.classicVisited.has(key)) {
                this.state.classicVisited.add(key);
                this.state.classicSteps++;
                if (current.x === cols-1 && current.y === rows-1) {
                    this.state.foundClassic = true;
                }
                [[0,1],[1,0],[0,-1],[-1,0]].forEach(([dx, dy]) => {
                    const nx = current.x + dx, ny = current.y + dy;
                    if (nx>=0 && nx<cols && ny>=0 && ny<rows && this.state.grid[ny][nx] === 0) {
                        this.state.classicQueue.push({x:nx, y:ny});
                    }
                });
            }
        }

        // Klasik İzler
        this.ctx.fillStyle = 'rgba(255, 57, 20, 0.4)';
        this.state.classicVisited.forEach(v => {
            const [vx, vy] = v.split(',').map(Number);
            this.ctx.fillRect(offsetX + vx*cellSize + 4, offsetY + vy*cellSize + 4, cellSize - 8, cellSize - 8);
        });

        // --- AÇIKLAMA PANELİ (Sağ Taraf) ---
        const panelX = offsetX + cols * cellSize + 40;
        const panelY = offsetY;
        
        this.ctx.fillStyle = 'rgba(255,255,255,0.05)';
        this.ctx.fillRect(panelX - 10, panelY - 10, 250, 300);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px Space Grotesk';
        this.ctx.fillText("NEDEN FARKLI?", panelX, panelY + 20);
        
        this.ctx.font = '12px Space Grotesk';
        this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
        const lines = [
            "KLASİK: Bir yolu dener,",
            "çıkmaz sokağa girerse",
            "geri döner. Tek tek...",
            "",
            "KUANTUM: Süperpozisyon",
            "sayesinde labirentteki",
            "tüm yollara AYNI ANDA",
            "girer. Hedefe ulaşan ilk",
            "dalga çözümü verir."
        ];
        lines.forEach((line, i) => this.ctx.fillText(line, panelX, panelY + 50 + i * 20));

        // İstatistikler
        this.ctx.fillStyle = COLORS.blue;
        this.ctx.font = 'bold 14px Space Grotesk';
        this.ctx.fillText(`Kuantum: ${this.state.foundQuantum ? "TAMAMLANDI" : "Taranıyor..."}`, panelX, panelY + 240);
        
        this.ctx.fillStyle = COLORS.red;
        this.ctx.fillText(`Klasik Adım: ${this.state.classicSteps}`, panelX, panelY + 270);

        // Durum Mesajı
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 20px Space Grotesk';
        if (this.state.foundQuantum && !this.state.foundClassic) {
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = COLORS.blue;
            this.ctx.fillText("⚡ Kuantum hedefe ulaştı!", offsetX, offsetY - 30);
            this.ctx.shadowBlur = 0;
        }

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.generateMaze = function(w, h) {
    const grid = Array(h).fill().map(() => Array(w).fill(0));
    for(let i=0; i<30; i++) {
        const rx = Math.floor(Math.random()*w), ry = Math.floor(Math.random()*h);
        if ((rx!==0||ry!==0) && (rx!==w-1||ry!==h-1)) grid[ry][rx] = 1;
    }
    return grid;
};

Simulations.gateOperatorSim = function(isUpdate) {
    this.updateUI("Kapılar ve Operatör İlişkisi", "Operatörlerin (kapıların) baz durumları (|0⟩ ve |1⟩) nasıl dönüştürdüğünü inceleyin.");
    
    if (!isUpdate) {
        this.state.theta = 0; 
        this.state.phi = 0;
        this.state.currentGate = null;
        this.state.isAnimating = false;
        this.state.animationT = 0;
        this.state.startTheta = 0;
        this.state.startPhi = 0;
        this.state.targetTheta = 0;
        this.state.targetPhi = 0;
    }

    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        const addBtn = (label, gateKey) => {
            const btn = document.createElement('button');
            btn.innerText = label;
            btn.className = "btn-secondary btn-sm";
            btn.style.margin = "5px";
            btn.onclick = () => {
                const gate = Gates[gateKey];
                this.state.currentGate = { name: label, matrix: gate, key: gateKey };
                
                let nextTheta = this.state.theta;
                let nextPhi = this.state.phi;

                if (gateKey === 'X') {
                    nextTheta = Math.PI - this.state.theta;
                } else if (gateKey === 'H') {
                    if (Math.abs(this.state.theta) < 0.1) {
                        nextTheta = Math.PI / 2;
                        nextPhi = 0;
                    } else if (Math.abs(this.state.theta - Math.PI / 2) < 0.1) {
                        nextTheta = (this.state.phi === 0) ? 0 : Math.PI;
                        nextPhi = 0;
                    } else {
                        nextTheta = Math.PI / 2;
                        nextPhi = 0;
                    }
                } else if (gateKey === 'Z') {
                    nextPhi = (this.state.phi + Math.PI) % (Math.PI * 2);
                }

                this.state.startTheta = this.state.theta;
                this.state.startPhi = this.state.phi;
                this.state.targetTheta = nextTheta;
                this.state.targetPhi = nextPhi;
                this.state.isAnimating = true;
                this.state.animationT = 0;
            };
            controls.appendChild(btn);
        };

        addBtn("X Kapısı (NOT)", "X");
        addBtn("H Kapısı (Süperpozisyon)", "H");
        addBtn("Z Kapısı (Faz Değişimi)", "Z");
        
        const resetBtn = document.createElement('button');
        resetBtn.innerText = "|0⟩ Durumuna Dön";
        resetBtn.className = "btn-primary btn-sm";
        resetBtn.style.marginLeft = "20px";
        resetBtn.onclick = () => { 
            this.state.startTheta = this.state.theta;
            this.state.targetTheta = 0;
            this.state.startPhi = this.state.phi;
            this.state.targetPhi = 0;
            this.state.isAnimating = true;
            this.state.animationT = 0;
            this.state.currentGate = null; 
        };
        controls.appendChild(resetBtn);
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.state.isAnimating) {
            this.state.animationT += 0.03;
            if (this.state.animationT >= 1) {
                this.state.animationT = 1;
                this.state.isAnimating = false;
            }
            // Easing
            const t = this.state.animationT;
            const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            
            this.state.theta = this.state.startTheta + (this.state.targetTheta - this.state.startTheta) * ease;
            this.state.phi = this.state.startPhi + (this.state.targetPhi - this.state.startPhi) * ease;
        }

        const cx = this.canvas.width / 4;
        const cy = this.canvas.height / 2;
        const r = 100;

        this.drawBlochSphere(cx, cy, r, this.state.theta, this.state.phi, COLORS.blue, "Qubit");

        const mx = cx + r + 100;
        const my = cy;
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px Courier New';
        
        if (this.state.currentGate) {
            this.ctx.font = 'bold 20px Space Grotesk';
            this.ctx.fillStyle = COLORS.purple;
            this.ctx.fillText(this.state.currentGate.name, mx, my - 80);

            this.ctx.fillStyle = '#fff';
            this.ctx.font = '24px Courier New';
            this.ctx.fillText(this.state.currentGate.key, mx - 60, my + 5);
            this.ctx.fillText("×", mx - 25, my + 5);
            
            const drawMatrix = (x, y, vals, color, isVector = false, coeff = "") => {
                let currentX = x;
                if (coeff) {
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = '18px Space Grotesk';
                    this.ctx.fillText(coeff, currentX, y + 5);
                    currentX += 45;
                }

                this.ctx.strokeStyle = color || '#fff';
                this.ctx.lineWidth = 2;
                const w = isVector ? 45 : 85;
                this.ctx.beginPath();
                this.ctx.moveTo(currentX+5, y-40); this.ctx.lineTo(currentX, y-40); this.ctx.lineTo(currentX, y+40); this.ctx.lineTo(currentX+5, y+40);
                this.ctx.stroke();
                this.ctx.beginPath();
                this.ctx.moveTo(currentX+w-5, y-40); this.ctx.lineTo(currentX+w, y-40); this.ctx.lineTo(currentX+w, y+40); this.ctx.lineTo(currentX+w-5, y+40);
                this.ctx.stroke();
                
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '16px Courier New';
                if (isVector) {
                    this.ctx.fillText(vals[0], currentX+10, y-10);
                    this.ctx.fillText(vals[1], currentX+10, y+25);
                } else {
                    this.ctx.fillText(vals[0], currentX+10, y-10);
                    this.ctx.fillText(vals[1], currentX+10, y+25);
                    this.ctx.fillText(vals[2], currentX+45, y-10);
                    this.ctx.fillText(vals[3], currentX+45, y+25);
                }
                return currentX + w;
            };

            const g = this.state.currentGate.matrix;
            const isH = this.state.currentGate.key === 'H';
            const isY = this.state.currentGate.key === 'Y';
            
            const formatComplex = (c) => {
                if (Math.abs(c.im) > 0.01) return (c.im > 0 ? "" : "-") + "i";
                if (Math.abs(c.re) < 0.01) return "0";
                return Math.round(c.re).toString();
            };

            const gVals = isH ? ["1", "1", "1", "-1"] : [
                formatComplex(g[0][0]), formatComplex(g[1][0]),
                formatComplex(g[0][1]), formatComplex(g[1][1])
            ];
            
            const nextX = drawMatrix(mx, my, gVals, COLORS.purple, false, isH ? "1/√2" : "");
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '24px Courier New';
            this.ctx.fillText("×", nextX + 10, my + 5);
            
            const formatVector = (v) => Math.abs(v) < 0.01 ? "0" : v.toFixed(1);
            const alpha = Math.cos(this.state.startTheta/2);
            const beta = Math.sin(this.state.startTheta/2);
            const nextX2 = drawMatrix(nextX + 35, my, [formatVector(alpha), formatVector(beta)], COLORS.blue, true);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText("=", nextX2 + 10, my + 5);
            
            const resAlpha = Math.cos(this.state.theta/2);
            const resBeta = Math.sin(this.state.theta/2);
            drawMatrix(nextX2 + 45, my, [formatVector(resAlpha), formatVector(resBeta)], COLORS.green, true);

            this.ctx.fillStyle = COLORS.green;
            this.ctx.font = '14px Space Grotesk';
            this.ctx.fillText("Yeni Durum", nextX2 + 45, my + 60);
        } else {
            this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
            this.ctx.font = '18px Space Grotesk';
            this.ctx.fillText("Operatör etkisini görmek için bir kapı seçin.", mx, my);
        }

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

// --- YENİ SOMUT ÖRNEKLER (LİSE SEVİYESİ) ---

Simulations.coinFlip = function(isUpdate) {
    this.updateUI("Kuantum Yazı-Tura Oyunu", "Klasik bir bozuk para ile kuantum bozuk para (Hadamard kapısı) arasındaki farkı görün. Süperpozisyon sayesinde kuantum her zaman kazanır!");
    if (!isUpdate) {
        this.state.coinState = '0'; // 0: Tura (Heads), 1: Yazı (Tails)
        this.state.isQuantum = false;
        this.state.animating = false;
        this.state.rotation = 0;
    }
    
    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        const btnClassic = document.createElement('button');
        btnClassic.innerText = "Klasik At (X Kapısı)";
        btnClassic.className = "btn-secondary";
        btnClassic.onclick = () => {
            if (this.state.animating) return;
            this.state.animating = true;
            this.state.isQuantum = false;
            setTimeout(() => {
                this.state.coinState = this.state.coinState === '0' ? '1' : '0';
                this.state.animating = false;
            }, 1000);
        };
        const btnQuantum = document.createElement('button');
        btnQuantum.innerText = "Kuantum At (H Kapısı)";
        btnQuantum.className = "btn-primary";
        btnQuantum.onclick = () => {
            if (this.state.animating) return;
            this.state.animating = true;
            this.state.isQuantum = true;
            setTimeout(() => {
                this.state.coinState = 'Süperpozisyon';
                this.state.animating = false;
            }, 1000);
        };
        const btnMeasure = document.createElement('button');
        btnMeasure.innerText = "Ölç (Kutuya Bak)";
        btnMeasure.className = "btn-secondary";
        btnMeasure.style.background = "#bc13fe";
        btnMeasure.onclick = () => {
            if (this.state.animating || this.state.coinState !== 'Süperpozisyon') return;
            this.state.animating = true;
            setTimeout(() => {
                this.state.coinState = Math.random() > 0.5 ? '0' : '1';
                this.state.isQuantum = false;
                this.state.animating = false;
            }, 500);
        };
        controls.appendChild(btnClassic);
        controls.appendChild(btnQuantum);
        controls.appendChild(btnMeasure);
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2 - 20;

        if (this.state.animating) {
            this.state.rotation += 0.2;
        } else {
            this.state.rotation = 0;
        }

        // Draw Coin
        this.ctx.save();
        this.ctx.translate(cx, cy);
        
        if (this.state.animating) {
             this.ctx.scale(Math.cos(this.state.rotation), 1);
        }

        this.ctx.beginPath();
        this.ctx.arc(0, 0, 80, 0, Math.PI * 2);
        
        if (this.state.isQuantum || this.state.coinState === 'Süperpozisyon') {
            this.ctx.fillStyle = COLORS.blue;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = COLORS.blue;
        } else {
            this.ctx.fillStyle = '#ffd700'; // Gold color for classic
        }
        this.ctx.fill();
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 5;
        this.ctx.stroke();

        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 30px Space Grotesk';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        let text = "";
        if (this.state.coinState === '0') text = "TURA (0)";
        else if (this.state.coinState === '1') text = "YAZI (1)";
        else text = "0 + 1";
        
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();

        // Info Text
        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        this.ctx.font = '18px Space Grotesk';
        if (this.state.coinState === 'Süperpozisyon') {
             this.ctx.fillStyle = COLORS.blue;
             this.ctx.fillText("Para hem Yazı hem Tura! Sonucu görmek için ÖLÇÜM yapmalısın.", cx, cy + 130);
        } else {
             this.ctx.fillText("Paranın mevcut durumu net.", cx, cy + 130);
        }

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.groverSearch = function(isUpdate) {
    this.updateUI("Grover Arama Oyunu", "Kuantum bilgisayar 4 kapalı kutu içinden doğru olanı tüm kutulara aynı anda (süperpozisyon) bakarak nasıl hızlıca bulur?");
    
    if (!isUpdate) {
        this.state.target = Math.floor(Math.random() * 4);
        this.state.boxes = [0.25, 0.25, 0.25, 0.25]; // Olasılık genlikleri kareleri
        this.state.step = 0; // 0: Start, 1: Oracle, 2: Diffusion
    }

    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        const btnOracle = document.createElement('button');
        btnOracle.innerText = "1. Aşama (Oracle: İşaretle)";
        btnOracle.className = "btn-secondary";
        btnOracle.onclick = () => {
            if (this.state.step === 0) {
                // Hedef olanın fazı döner (görsel olarak işaretleriz)
                this.state.step = 1;
            }
        };
        const btnDiffusion = document.createElement('button');
        btnDiffusion.innerText = "2. Aşama (Grover Operatörü: Yükselt)";
        btnDiffusion.className = "btn-primary";
        btnDiffusion.onclick = () => {
            if (this.state.step === 1) {
                // Olasılık genliğini yükselt
                this.state.boxes = [0, 0, 0, 0];
                this.state.boxes[this.state.target] = 1.0;
                this.state.step = 2;
            }
        };
        const btnReset = document.createElement('button');
        btnReset.innerText = "Sıfırla";
        btnReset.className = "btn-secondary";
        btnReset.onclick = () => {
            this.state.target = Math.floor(Math.random() * 4);
            this.state.boxes = [0.25, 0.25, 0.25, 0.25];
            this.state.step = 0;
        };
        controls.appendChild(btnOracle);
        controls.appendChild(btnDiffusion);
        controls.appendChild(btnReset);
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const w = 100;
        const h = 100;
        const spacing = 150;
        const startX = this.canvas.width / 2 - (spacing * 1.5);
        const cy = this.canvas.height / 2;

        this.ctx.textAlign = 'center';

        for (let i = 0; i < 4; i++) {
            const x = startX + i * spacing;
            const prob = this.state.boxes[i];
            
            // Draw Box
            this.ctx.fillStyle = '#222';
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            
            if (this.state.step === 1 && i === this.state.target) {
                this.ctx.strokeStyle = COLORS.red; // İşaretlendi
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = COLORS.red;
            } else if (this.state.step === 2 && i === this.state.target) {
                this.ctx.strokeStyle = COLORS.green; // Bulundu
                this.ctx.shadowBlur = 30;
                this.ctx.shadowColor = COLORS.green;
            } else {
                this.ctx.shadowBlur = 0;
            }

            this.ctx.beginPath();
            this.ctx.rect(x - w/2, cy - h/2, w, h);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;

            // Draw Probability Bar
            const barH = prob * 150;
            this.ctx.fillStyle = COLORS.blue;
            this.ctx.fillRect(x - 30, cy + 80, 60, -barH);
            this.ctx.strokeStyle = '#fff';
            this.ctx.strokeRect(x - 30, cy + 80, 60, -150);

            this.ctx.fillStyle = '#fff';
            this.ctx.font = '16px Space Grotesk';
            this.ctx.fillText(`Kutu ${i}`, x, cy - 70);
            this.ctx.fillText(`%${Math.round(prob * 100)}`, x, cy + 100);

            if (this.state.step === 2 && i === this.state.target) {
                this.ctx.font = '30px Arial';
                this.ctx.fillText("💎", x, cy + 10);
            } else if (this.state.step === 2) {
                this.ctx.font = '30px Arial';
                this.ctx.fillText("❌", x, cy + 10);
            } else {
                this.ctx.font = '30px Arial';
                this.ctx.fillText("❓", x, cy + 10);
            }
        }

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Space Grotesk';
        if (this.state.step === 0) {
            this.ctx.fillText("Süperpozisyon: Ödül herhangi bir kutuda olabilir. (Her birinin olasılığı %25)", this.canvas.width/2, cy - 140);
        } else if (this.state.step === 1) {
             this.ctx.fillText("Oracle (Kahil) hedef kutuyu gizlice eksi faza geçirerek işaretledi.", this.canvas.width/2, cy - 140);
        } else if (this.state.step === 2) {
             this.ctx.fillText("Grover Operatörü işaretli kutunun olasılığını %100'e yükseltti. Bulundu!", this.canvas.width/2, cy - 140);
        }

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.quantumTeleportation = function(isUpdate) {
    this.updateUI("Kuantum Işınlama (Teleportasyon)", "Alice elindeki qubit durumunu, Bob'a aralarındaki dolanık qubitleri kullanarak iletir.");
    
    if (!isUpdate) {
        this.state.step = 0; // 0: Init, 1: Entangle, 2: Alice Measures, 3: Bob Corrects
        this.state.messageState = { theta: Math.PI / 3, phi: 0 }; // Random state to teleport
        this.state.aliceResult = { c1: 0, c2: 0 };
    }

    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        const btnNext = document.createElement('button');
        btnNext.innerText = "İleri / Sonraki Adım";
        btnNext.className = "btn-primary";
        btnNext.onclick = () => {
            if (this.state.step < 3) this.state.step++;
            else this.state.step = 0;
            
            if (this.state.step === 2) {
                this.state.aliceResult = {
                    c1: Math.random() > 0.5 ? 1 : 0,
                    c2: Math.random() > 0.5 ? 1 : 0
                };
            }
        };
        controls.appendChild(btnNext);
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const cy = this.canvas.height / 2;
        const aliceX = 200;
        const bobX = this.canvas.width - 200;
        const r = 60;

        // Draw Alice & Bob Text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 24px Space Grotesk';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("ALICE", aliceX, cy - 180);
        this.ctx.fillText("BOB", bobX, cy - 180);

        // State Message
        this.ctx.font = '18px Space Grotesk';
        let descText = "";
        if (this.state.step === 0) descText = "1. Alice, iletmek istediği bir 'Mesaj Qubit'ine sahip.";
        else if (this.state.step === 1) descText = "2. Alice ve Bob birer 'Dolanık Qubit' paylaşır.";
        else if (this.state.step === 2) descText = "3. Alice kendi qubitlerini ölçer ve 2 bit klasik bilgi elde eder.";
        else if (this.state.step === 3) descText = "4. Bob bu 2 biti (telefonla) alır ve kendi qubitine uygun kapıları (X, Z) uygulayarak mesajı yeniden oluşturur.";
        
        this.ctx.fillStyle = COLORS.blue;
        this.ctx.fillText(descText, this.canvas.width/2, cy + 180);

        // Draw Qubits
        // Alice Message Qubit
        if (this.state.step < 2) {
            this.drawBlochSphere(aliceX, cy - 80, r, this.state.messageState.theta, this.state.messageState.phi, COLORS.blue, "Mesaj |ψ⟩");
        } else {
             this.ctx.fillStyle = '#444';
             this.ctx.beginPath(); this.ctx.arc(aliceX, cy - 80, r, 0, Math.PI*2); this.ctx.fill();
             this.ctx.fillStyle = '#fff';
             this.ctx.fillText("Ölçüldü (Çöktü)", aliceX, cy - 75);
        }

        // Entanglement Link
        if (this.state.step >= 1 && this.state.step < 2) {
            this.ctx.strokeStyle = COLORS.purple;
            this.ctx.setLineDash([10, 10]);
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(aliceX + r, cy + 80);
            this.ctx.lineTo(bobX - r, cy + 80);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText("Dolanıklık Bağı (EPR Çifti)", this.canvas.width/2, cy + 70);
        }

        // Alice Entangled Qubit
        if (this.state.step < 2) {
            if (this.state.step === 0) {
                 this.drawBlochSphere(aliceX, cy + 80, r, 0, 0, '#666', "Boş");
            } else {
                 this.drawBlochSphere(aliceX, cy + 80, r, Math.PI/2, Date.now()/500, COLORS.purple, "Dolanık A");
            }
        } else {
             this.ctx.fillStyle = '#444';
             this.ctx.beginPath(); this.ctx.arc(aliceX, cy + 80, r, 0, Math.PI*2); this.ctx.fill();
             this.ctx.fillStyle = '#fff';
             this.ctx.fillText("Ölçüldü (Çöktü)", aliceX, cy + 85);
        }

        // Bob Entangled Qubit
        if (this.state.step < 3) {
             if (this.state.step === 0) {
                 this.drawBlochSphere(bobX, cy + 80, r, 0, 0, '#666', "Boş");
             } else {
                 this.drawBlochSphere(bobX, cy + 80, r, Math.PI/2, Date.now()/500, COLORS.purple, "Dolanık B");
             }
        } else {
            // Reconstructed Message
            this.drawBlochSphere(bobX, cy + 80, r, this.state.messageState.theta, this.state.messageState.phi, COLORS.blue, "Yeniden Oluşan |ψ⟩");
            
            // Classical bits sent
            this.ctx.strokeStyle = '#fff';
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(aliceX + r, cy);
            this.ctx.lineTo(bobX - r, cy);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(`Klasik Bilgi Gidiyor: [${this.state.aliceResult.c1}, ${this.state.aliceResult.c2}]`, this.canvas.width/2, cy - 10);
        }

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};
Simulations.tunneling = function(isUpdate) {
    this.updateUI("Kuantum Tünelleme", "Dalga paketinin potansiyel bariyerden geçme olasılığı.");
    if (!isUpdate) this.params = { barrierWidth: 20, barrierHeight: 50 };
    this.createControl("Bariyer Genişliği", "barrierWidth", 5, 50, 1);
    this.createControl("Bariyer Yüksekliği", "barrierHeight", 10, 100, 1);

    if (!isUpdate) {
        this.state.waveX = 0;
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const midY = this.canvas.height / 2;
        const barrierX = this.canvas.width / 2;
        const w = this.params.barrierWidth;
        const h = this.params.barrierHeight;

        // Draw Barrier
        this.ctx.fillStyle = `rgba(255, 57, 20, ${h / 100})`;
        this.ctx.fillRect(barrierX - w/2, midY - 100, w, 200);

        this.state.waveX = (this.state.waveX + 2) % this.canvas.width;
        let wx = this.state.waveX;

        this.ctx.strokeStyle = '#00f2ff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        for (let x = 0; x < this.canvas.width; x++) {
            let amplitude = 50 * Math.exp(-Math.pow(x - wx, 2) / 2000);
            
            // Adjust amplitude based on barrier
            if (x > barrierX + w/2) {
                // Tunneled part
                const damping = Math.exp(-w * h * 0.005);
                amplitude *= damping;
            } else if (x > barrierX - w/2 && x <= barrierX + w/2) {
                // Inside barrier
                const decay = (x - (barrierX - w/2)) / w;
                const damping = Math.exp(-decay * w * h * 0.005);
                amplitude *= damping;
            } else if (wx > barrierX - w/2) {
                 // Reflected part
                 const reflectX = (barrierX - w/2) - (wx - (barrierX - w/2));
                 amplitude += 40 * Math.exp(-Math.pow(x - reflectX, 2) / 2000);
            }

            const y = midY - amplitude * Math.sin((x - wx) * 0.1);
            if (x === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Space Grotesk';
        this.ctx.fillText("Potansiyel Bariyer", barrierX - 60, midY - 120);

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.sterngerlach = function(isUpdate) {
    this.updateUI("Stern-Gerlach Deneyi", "Gümüş atomları manyetik alanda spin-up ve spin-down olarak ayrılır.");
    if (!isUpdate) this.params = { fieldStrength: 50 };
    this.createControl("Manyetik Alan Şiddeti", "fieldStrength", 10, 100, 1);

    if (!isUpdate) {
        this.state.atoms = [];
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const midY = this.canvas.height / 2;
        const magnetX = this.canvas.width / 2;
        const magnetWidth = 100;

        // Draw Magnets
        this.ctx.fillStyle = '#bc13fe';
        this.ctx.fillRect(magnetX - magnetWidth/2, midY - 100, magnetWidth, 40); // North
        this.ctx.fillStyle = '#00f2ff';
        this.ctx.fillRect(magnetX - magnetWidth/2, midY + 60, magnetWidth, 40); // South
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Space Grotesk';
        this.ctx.fillText("N", magnetX - 5, midY - 75);
        this.ctx.fillText("S", magnetX - 5, midY + 85);

        // Fire atoms
        if (Math.random() < 0.1) {
            this.state.atoms.push({
                x: 0,
                y: midY + (Math.random() - 0.5) * 10,
                spin: Math.random() > 0.5 ? 1 : -1,
                passed: false
            });
        }

        this.ctx.fillStyle = '#fff';
        this.state.atoms.forEach((atom, i) => {
            atom.x += 4;
            
            if (atom.x > magnetX - magnetWidth/2 && atom.x < magnetX + magnetWidth/2) {
                // Apply force based on spin and field strength
                atom.y += atom.spin * (this.params.fieldStrength * 0.05);
            } else if (atom.x >= magnetX + magnetWidth/2) {
                // Continue in straight line after magnet
                atom.y += atom.spin * (this.params.fieldStrength * 0.05);
            }

            this.ctx.beginPath();
            this.ctx.arc(atom.x, atom.y, 3, 0, Math.PI * 2);
            this.ctx.fill();

            if (atom.x > this.canvas.width) {
                this.state.atoms.splice(i, 1);
            }
        });

        // Screen
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(this.canvas.width - 20, 0, 20, this.canvas.height);

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.schrodinger = function(isUpdate) {
    this.updateUI("Schrödinger'in Kedisi", "Kutu açılana kadar kedi hem canlı hem ölüdür.");
    
    if (!isUpdate) {
        this.state.isOpen = false;
        this.state.isAlive = null;
    }

    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        const btn = document.createElement('button');
        btn.innerText = "KUTUYU AÇ (ÖLÇÜM YAP)";
        btn.className = "btn-primary";
        btn.onclick = () => {
            if (this.state.isOpen) return;
            this.state.isOpen = true;
            this.state.isAlive = Math.random() > 0.5;
            setTimeout(() => {
                this.state.isOpen = false;
                this.state.isAlive = null;
            }, 3000);
        };
        controls.appendChild(btn);
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        if (!this.state.isOpen) {
            // Box Closed - Superposition
            this.ctx.strokeStyle = '#00f2ff';
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(cx - 100, cy - 100, 200, 200);
            
            this.ctx.fillStyle = 'rgba(0, 242, 255, 0.2)';
            this.ctx.fillRect(cx - 100, cy - 100, 200, 200);

            this.ctx.fillStyle = '#fff';
            this.ctx.font = '24px Space Grotesk';
            this.ctx.textAlign = 'center';
            this.ctx.fillText("? KUTU KAPALI ?", cx, cy);
            
            // Wave function symbol oscillating
            const s = 1 + Math.sin(Date.now() * 0.005) * 0.2;
            this.ctx.save();
            this.ctx.translate(cx, cy + 40);
            this.ctx.scale(s, s);
            this.ctx.fillStyle = '#bc13fe';
            this.ctx.fillText("|Canlı⟩ + |Ölü⟩", 0, 0);
            this.ctx.restore();
            
        } else {
            // Box Open - Collapsed
            this.ctx.strokeStyle = '#bc13fe';
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(cx - 100, cy - 100, 200, 200);

            this.ctx.font = '60px Arial';
            this.ctx.textAlign = 'center';
            
            if (this.state.isAlive) {
                this.ctx.fillText("😸", cx, cy + 20);
                this.ctx.fillStyle = '#39ff14';
                this.ctx.font = '24px Space Grotesk';
                this.ctx.fillText("DURUM: CANLI", cx, cy + 80);
            } else {
                this.ctx.fillText("💀", cx, cy + 20);
                this.ctx.fillStyle = '#ff3914';
                this.ctx.font = '24px Space Grotesk';
                this.ctx.fillText("DURUM: ÖLÜ", cx, cy + 80);
            }
        }

        this.ctx.textAlign = 'left'; // Reset
        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.shorAlgorithm = function(isUpdate) {
    this.updateUI("Shor Algoritması (Çarpanlara Ayırma)", "Kuantum periyot bulma ile şifre kırmanın temeli.");
    
    if (!isUpdate) {
        this.state.progressClass = 0;
        this.state.progressQuant = 0;
        this.state.running = false;
        this.state.found = false;
    }

    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        const btn = document.createElement('button');
        btn.innerText = "ALGORİTMAYI BAŞLAT";
        btn.className = "btn-primary";
        btn.onclick = () => {
            this.state.progressClass = 0;
            this.state.progressQuant = 0;
            this.state.running = true;
            this.state.found = false;
        };
        controls.appendChild(btn);
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const cx = this.canvas.width / 2;
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px Space Grotesk';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("Hedef: N = 15 sayısını çarpanlarına ayır (P x Q)", cx, 50);

        // Classic
        this.ctx.fillStyle = '#ff3914';
        this.ctx.font = '20px Space Grotesk';
        this.ctx.fillText("Klasik Bilgisayar (Brute-Force)", cx / 2, 120);
        this.ctx.fillRect(50, 150, (this.state.progressClass / 100) * (cx - 100), 30);
        
        // Quantum
        this.ctx.fillStyle = '#00f2ff';
        this.ctx.fillText("Kuantum Bilgisayar (Shor / QFT)", cx * 1.5, 120);
        this.ctx.fillRect(cx + 50, 150, (this.state.progressQuant / 100) * (cx - 100), 30);

        if (this.state.running) {
            this.state.progressClass += 0.2;
            this.state.progressQuant += 2; // Quantum is much faster conceptually here

            if (this.state.progressQuant >= 100 && !this.state.found) {
                this.state.progressQuant = 100;
                this.state.found = true;
            }
            if (this.state.progressClass >= 100) {
                this.state.progressClass = 100;
                this.state.running = false;
            }
        }

        if (this.state.found) {
            this.ctx.fillStyle = '#39ff14';
            this.ctx.font = 'bold 30px Space Grotesk';
            this.ctx.fillText("KUANTUM BULDU: 3 x 5", cx * 1.5, 230);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '16px Space Grotesk';
            this.ctx.fillText("Kuantum Fourier Dönüşümü ile periyot r=4 olarak anında bulundu.", cx * 1.5, 270);
        }

        if (this.state.progressClass >= 100) {
            this.ctx.fillStyle = '#ff3914';
            this.ctx.font = 'bold 30px Space Grotesk';
            this.ctx.fillText("KLASİK BULDU: 3 x 5", cx / 2, 230);
        }

        this.ctx.textAlign = 'left';
        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.qrng = function(isUpdate) {
    this.updateUI("Gerçek Kuantum Rastgelelik (QRNG)", "Kuantum ölçümü tahmin edilemezdir, klasik yazılımlar ise formül kullanır.");
    
    if (!isUpdate) {
        this.state.qBits = [];
        this.state.cBits = [];
        this.state.seed = 12345;
    }

    // Pseudo-random generator function (Linear Congruential Generator)
    const pseudoRandom = () => {
        this.state.seed = (this.state.seed * 9301 + 49297) % 233280;
        return (this.state.seed / 233280) > 0.5 ? 1 : 0;
    };

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (Math.random() < 0.1 && this.state.qBits.length < 20) {
            this.state.qBits.push(Math.random() > 0.5 ? 1 : 0);
            this.state.cBits.push(pseudoRandom());
        }
        
        // Quantum
        this.ctx.fillStyle = '#00f2ff';
        this.ctx.font = '24px Space Grotesk';
        this.ctx.fillText("Kuantum Zar (Gerçek Rastgele)", 50, 100);
        this.ctx.font = '30px Courier New';
        this.ctx.fillText(this.state.qBits.join(' '), 50, 160);
        
        this.ctx.fillStyle = 'rgba(0, 242, 255, 0.7)';
        this.ctx.font = '14px Space Grotesk';
        this.ctx.fillText("Fotonun yarı geçirgen aynadan yansıması. Önceden bilinemez.", 50, 200);

        // Classical
        this.ctx.fillStyle = '#bc13fe';
        this.ctx.font = '24px Space Grotesk';
        this.ctx.fillText("Klasik Zar (Pseudo-Random)", 50, 300);
        this.ctx.font = '30px Courier New';
        this.ctx.fillText(this.state.cBits.join(' '), 50, 360);
        
        this.ctx.fillStyle = 'rgba(188, 19, 254, 0.7)';
        this.ctx.font = '14px Space Grotesk';
        this.ctx.fillText("Matematiksel bir formül (örn. X = (A*X + C) % M). Formül bilinirse tahmin edilir.", 50, 400);

        if (this.state.qBits.length >= 20) {
            setTimeout(() => {
                this.state.qBits = [];
                this.state.cBits = [];
            }, 3000);
        }

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};


Simulations.complexSim = function(isUpdate) {
    this.updateUI("Karmaşık Sayılar", "Gerçel ve Sanal eksenlerde vektör gösterimi. z = a + bi");
    
    if (!isUpdate) {
        this.params = { real: 3, imag: 4 };
    }
    this.createControl("Gerçel Kısım (a)", "real", -10, 10, 1);
    this.createControl("Sanal Kısım (b)", "imag", -10, 10, 1);

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const scale = 20;

        // Draw axes
        this.ctx.strokeStyle = '#444';
        this.ctx.beginPath();
        this.ctx.moveTo(0, cy); this.ctx.lineTo(this.canvas.width, cy); // Real
        this.ctx.moveTo(cx, 0); this.ctx.lineTo(cx, this.canvas.height); // Imag
        this.ctx.stroke();

        this.ctx.fillStyle = '#888';
        this.ctx.font = '16px Space Grotesk';
        this.ctx.fillText("Gerçel Eksen (Re)", this.canvas.width - 150, cy - 10);
        this.ctx.fillText("Sanal Eksen (Im)", cx + 10, 20);

        const r = this.params.real;
        const i = this.params.imag;
        
        const vx = cx + r * scale;
        const vy = cy - i * scale;

        // Draw vector
        this.ctx.strokeStyle = '#00f2ff';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(vx, vy);
        this.ctx.stroke();
        
        this.ctx.fillStyle = '#00f2ff';
        this.ctx.beginPath();
        this.ctx.arc(vx, vy, 5, 0, Math.PI*2);
        this.ctx.fill();

        // Info
        const mag = Math.sqrt(r*r + i*i).toFixed(2);
        const phase = (Math.atan2(i, r) * 180 / Math.PI).toFixed(1);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Space Grotesk';
        this.ctx.fillText(`z = ${r} ${i >= 0 ? '+' : '-'} ${Math.abs(i)}i`, cx + 20, cy + 30);
        this.ctx.fillText(`|z| (Genlik) = ${mag}`, cx + 20, cy + 60);
        this.ctx.fillText(`θ (Faz) = ${phase}°`, cx + 20, cy + 90);

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.linearSim = function(isUpdate) {
    this.updateUI("Lineer Cebir (Kuantum Kapıları)", "Kuantum durumlarına matris (kapı) uygulanması (Örn: X Kapısı).");
    
    if (!isUpdate) {
        this.params = { state: '0' }; // '0', '1', '+', '-'
    }
    
    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        
        const btnX = document.createElement('button');
        btnX.innerText = "Pauli-X Uygula (NOT)";
        btnX.className = "btn-primary";
        btnX.style.marginRight = "10px";
        btnX.onclick = () => {
            if (this.params.state === '0') this.params.state = '1';
            else if (this.params.state === '1') this.params.state = '0';
        };
        controls.appendChild(btnX);

        const btnH = document.createElement('button');
        btnH.innerText = "Hadamard Uygula (H)";
        btnH.className = "btn-primary";
        btnH.onclick = () => {
            if (this.params.state === '0') this.params.state = '+';
            else if (this.params.state === '1') this.params.state = '-';
            else if (this.params.state === '+') this.params.state = '0';
            else if (this.params.state === '-') this.params.state = '1';
        };
        controls.appendChild(btnH);
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '30px Space Grotesk';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Mevcut Durum: |${this.params.state}⟩`, cx, cy - 100);

        // Draw Matrix representation
        this.ctx.font = '24px Courier New';
        this.ctx.fillStyle = '#00f2ff';
        if (this.params.state === '0') {
            this.ctx.fillText("[ 1 ]", cx, cy + 20);
            this.ctx.fillText("[ 0 ]", cx, cy + 50);
        } else if (this.params.state === '1') {
            this.ctx.fillText("[ 0 ]", cx, cy + 20);
            this.ctx.fillText("[ 1 ]", cx, cy + 50);
        } else if (this.params.state === '+') {
            this.ctx.fillText("[ 0.707 ]", cx, cy + 20);
            this.ctx.fillText("[ 0.707 ]", cx, cy + 50);
        } else if (this.params.state === '-') {
            this.ctx.fillText("[  0.707 ]", cx, cy + 20);
            this.ctx.fillText("[ -0.707 ]", cx, cy + 50);
        }

        this.ctx.fillStyle = '#888';
        this.ctx.font = '16px Space Grotesk';
        this.ctx.fillText("Lineer Cebirde kuantum kapıları matris, durumlar vektördür.", cx, cy + 120);

        this.ctx.textAlign = 'left';
        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.zeno = function(isUpdate) {
    this.updateUI("Kuantum Zeno Etkisi", "Sürekli ölçülen bir kuantum sistemi evrimleşemez. (İzlenen çaydanlık kaynamaz).");
    
    if (!isUpdate) {
        this.state.progress = 0; // 0 (Mavi) to 1 (Kırmızı)
    }

    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        const btn = document.createElement('button');
        btn.innerText = "GÖZLEMLE (ÖLÇÜM YAP)";
        btn.className = "btn-primary";
        btn.onmousedown = () => {
            // Collapse back to initial state 0
            this.state.progress = 0;
            this.state.isObserving = true;
        };
        btn.onmouseup = () => { this.state.isObserving = false; };
        btn.onmouseleave = () => { this.state.isObserving = false; };
        controls.appendChild(btn);
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        if (!this.state.isObserving && this.state.progress < 1) {
            this.state.progress += 0.005; // Natural evolution
        }

        if (this.state.progress >= 1) this.state.progress = 1;

        // Color interpolation: Blue (0, 242, 255) to Red (255, 57, 20)
        const r = Math.round(0 + this.state.progress * 255);
        const g = Math.round(242 - this.state.progress * 185);
        const b = Math.round(255 - this.state.progress * 235);
        const color = `rgb(${r}, ${g}, ${b})`;

        this.ctx.shadowBlur = 50;
        this.ctx.shadowColor = color;
        this.ctx.fillStyle = color;
        
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 100, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px Space Grotesk';
        this.ctx.textAlign = 'center';
        if (this.state.progress === 1) {
            this.ctx.fillText("DURUM: 1 (Tamamen Evrimleşti)", cx, cy + 150);
        } else if (this.state.progress === 0) {
            this.ctx.fillText("DURUM: 0 (Başlangıç)", cx, cy + 150);
        } else {
            this.ctx.fillText(`Süperpozisyon... %${Math.round(this.state.progress * 100)}`, cx, cy + 150);
        }

        this.ctx.font = '16px Space Grotesk';
        this.ctx.fillStyle = '#888';
        this.ctx.fillText("Durum 1'e dönüşmesini engellemek için sürekli 'Gözlemle'ye basın.", cx, cy + 190);

        this.ctx.textAlign = 'left';
        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.eraser = function(isUpdate) {
    this.updateUI("Kuantum Silgisi (Gecikmiş Seçim)", "Hangi yarıktan geçtiği bilgisini ölçerseniz dalga çöker. Bilgiyi silerseniz geri döner!");
    
    if (!isUpdate) {
        this.params = { mode: 'normal' }; // normal, measure, erase
        this.state.particles = [];
        this.state.pattern = new Array(100).fill(0);
    }
    
    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        const modes = [
            { id: 'normal', name: "1. Normal Çift Yarık" },
            { id: 'measure', name: "2. Dedektör ile Ölç" },
            { id: 'erase', name: "3. Kuantum Silgisi (Bilgiyi Sil)" }
        ];
        
        modes.forEach(m => {
            const btn = document.createElement('button');
            btn.innerText = m.name;
            btn.className = "btn-secondary";
            btn.style.margin = "5px";
            btn.onclick = () => {
                this.params.mode = m.id;
                this.state.pattern = new Array(100).fill(0); // Reset screen
            };
            controls.appendChild(btn);
        });
    }

    const animate = () => {
        this.ctx.fillStyle = 'rgba(5, 7, 10, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const slitX = 200, screenX = this.canvas.width - 100, midY = this.canvas.height / 2;
        
        // Draw slits
        this.ctx.fillStyle = '#444';
        this.ctx.fillRect(slitX, 0, 15, midY - 60);
        this.ctx.fillRect(slitX, midY - 20, 15, 40);
        this.ctx.fillRect(slitX, midY + 60, 15, this.canvas.height);

        if (this.params.mode === 'measure') {
            this.ctx.fillStyle = '#ff3914';
            this.ctx.fillText("👁️ Ölçüm Dedektörü AKTİF", slitX - 80, midY - 80);
        } else if (this.params.mode === 'erase') {
            this.ctx.fillStyle = '#39ff14';
            this.ctx.fillText("🧽 Dedektör Açık Ama Bilgi SİLİNDİ", slitX - 100, midY - 80);
        }

        if (Math.random() < 0.2) {
            this.state.particles.push({ x: 0, y: midY + (Math.random() - 0.5) * 100, passed: false, angle: 0 });
        }

        this.state.particles.forEach((p, i) => {
            p.x += 5;
            if (!p.passed && p.x >= slitX) {
                p.passed = true;
                if (this.params.mode === 'measure') {
                    // Particle behavior (two bands)
                    p.y = Math.random() > 0.5 ? midY - 40 : midY + 40;
                    p.angle = (Math.random() - 0.5) * 0.1;
                } else {
                    // Wave behavior (interference) for 'normal' and 'erase'
                    let rand = Math.random();
                    for(let a = -0.6; a <= 0.6; a += 0.01) {
                        if (rand < Math.pow(Math.cos(a * 10), 2) * 0.1) { p.angle = a; break; }
                    }
                }
            }
            
            if (p.passed) p.y += Math.sin(p.angle) * 10;
            
            this.ctx.fillStyle = this.params.mode === 'measure' ? '#ff3914' : '#00f2ff';
            this.ctx.beginPath(); this.ctx.arc(p.x, p.y, 3, 0, Math.PI*2); this.ctx.fill();
            
            if (p.x >= screenX) {
                const idx = Math.floor((p.y / this.canvas.height) * 100);
                if (idx >= 0 && idx < 100) this.state.pattern[idx]++;
                this.state.particles.splice(i, 1);
            }
        });

        // Screen
        this.ctx.fillStyle = '#111'; this.ctx.fillRect(screenX, 0, 60, this.canvas.height);
        this.state.pattern.forEach((val, idx) => {
            const y = (idx / 100) * this.canvas.height;
            this.ctx.fillStyle = this.params.mode === 'measure' ? 'rgba(255, 57, 20, 0.6)' : 'rgba(0, 242, 255, 0.6)';
            this.ctx.fillRect(screenX + 2, y, Math.min(val * 2, 55), this.canvas.height/100);
        });

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.chsh = function(isUpdate) {
    this.updateUI("CHSH Oyunu (Kuantum Üstünlüğü)", "Klasik fizik maksimum %75 kazanır. Kuantum dolanıklık %85 kazandırır!");
    
    if (!isUpdate) {
        this.state.round = 0;
        this.state.wins = 0;
        this.state.strategy = 'classical'; // classical or quantum
    }

    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        const btnC = document.createElement('button');
        btnC.innerText = "KLASİK STRATEJİ BAŞLAT";
        btnC.className = "btn-secondary";
        btnC.onclick = () => { this.state.round = 0; this.state.wins = 0; this.state.strategy = 'classical'; };
        
        const btnQ = document.createElement('button');
        btnQ.innerText = "KUANTUM (DOLANIK) STRATEJİ BAŞLAT";
        btnQ.className = "btn-primary";
        btnQ.onclick = () => { this.state.round = 0; this.state.wins = 0; this.state.strategy = 'quantum'; };
        
        controls.appendChild(btnC);
        controls.appendChild(btnQ);
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const cx = this.canvas.width / 2;
        
        if (this.state.round < 1000) {
            this.state.round += 5; // Fast play
            // In CHSH, win condition probability: Classical <= 0.75, Quantum <= cos^2(pi/8) ~ 0.853
            const winProb = this.state.strategy === 'classical' ? 0.75 : 0.853;
            for(let i=0; i<5; i++) {
                if (Math.random() < winProb) this.state.wins++;
            }
        }

        const winRate = this.state.round > 0 ? (this.state.wins / this.state.round * 100).toFixed(1) : 0;

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px Space Grotesk';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Oynanan Tur: ${this.state.round} / 1000`, cx, 100);
        
        this.ctx.font = '60px Space Grotesk';
        this.ctx.fillStyle = this.state.strategy === 'classical' ? '#ff3914' : '#39ff14';
        this.ctx.fillText(`Kazanma Oranı: %${winRate}`, cx, 200);

        this.ctx.font = '18px Space Grotesk';
        this.ctx.fillStyle = '#888';
        this.ctx.fillText("Klasik Fizik Sınırı (Bell Eşitsizliği): %75", cx, 300);
        this.ctx.fillText("Kuantum Sınırı (Tsirelson Sınırı): %85.3", cx, 340);

        // Bar chart
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(cx - 200, 400, 400, 40);
        this.ctx.fillStyle = this.state.strategy === 'classical' ? '#ff3914' : '#39ff14';
        this.ctx.fillRect(cx - 200, 400, (winRate / 100) * 400, 40);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(cx - 200 + 0.75 * 400, 390, 4, 60); // 75% limit line
        this.ctx.fillText("Klasik Limit", cx - 200 + 0.75 * 400, 470);

        this.ctx.textAlign = 'left';
        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};


Simulations.machzehnder = function(isUpdate) {
    this.updateUI("Mach-Zehnder İnterferometresi", "Girişim deseni ve parçacık/dalga ikiliği.");
    
    if (!isUpdate) {
        this.params = { blockPath: false };
        this.state.photons = [];
        this.state.countD1 = 0;
        this.state.countD2 = 0;
    }
    
    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        this.createControl("Alt Yola Engel Koy (Ölçüm Yap)", "blockPath", null, null, null, "checkbox");
        
        const resetBtn = document.createElement('button');
        resetBtn.innerText = "SAYAÇLARI SIFIRLA";
        resetBtn.className = "btn-secondary";
        resetBtn.style.marginTop = "10px";
        resetBtn.style.display = "block";
        resetBtn.onclick = () => {
            this.state.countD1 = 0;
            this.state.countD2 = 0;
        };
        controls.appendChild(resetBtn);
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        
        const bs1 = { x: cx - 200, y: cy }; // Beam splitter 1
        const bs2 = { x: cx + 200, y: cy - 150 }; // Beam splitter 2
        const m1 = { x: cx + 200, y: cy }; // Mirror 1
        const m2 = { x: cx - 200, y: cy - 150 }; // Mirror 2
        
        const det1 = { x: cx + 300, y: cy - 150 }; // D1
        const det2 = { x: cx + 200, y: cy - 250 }; // D2

        // Draw paths
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        // Path 1 (Lower)
        this.ctx.moveTo(cx - 300, cy);
        this.ctx.lineTo(m1.x, m1.y);
        this.ctx.lineTo(bs2.x, bs2.y);
        // Path 2 (Upper)
        this.ctx.moveTo(bs1.x, bs1.y);
        this.ctx.lineTo(m2.x, m2.y);
        this.ctx.lineTo(bs2.x, bs2.y);
        
        // To detectors
        this.ctx.moveTo(bs2.x, bs2.y);
        this.ctx.lineTo(det1.x, det1.y);
        this.ctx.moveTo(bs2.x, bs2.y);
        this.ctx.lineTo(det2.x, det2.y);
        this.ctx.stroke();

        // Draw components
        this.ctx.fillStyle = '#00f2ff'; // Beam splitters
        this.ctx.fillRect(bs1.x - 5, bs1.y - 40, 10, 80);
        this.ctx.fillRect(bs2.x - 5, bs2.y - 40, 10, 80);
        
        this.ctx.fillStyle = '#a200ff'; // Mirrors
        this.ctx.fillRect(m1.x - 5, m1.y - 40, 10, 80);
        this.ctx.fillRect(m2.x - 40, m2.y - 5, 80, 10);

        // Detectors
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(det1.x, det1.y - 15, 30, 30);
        this.ctx.fillText(`D1: ${this.state.countD1}`, det1.x + 35, det1.y + 5);
        this.ctx.fillRect(det2.x - 15, det2.y - 30, 30, 30);
        this.ctx.fillText(`D2: ${this.state.countD2}`, det2.x - 10, det2.y - 40);

        if (this.params.blockPath) {
            this.ctx.fillStyle = '#ff3914';
            this.ctx.fillRect(cx - 10, cy - 20, 20, 40);
        }

        if (Math.random() < 0.05) {
            this.state.photons.push({ x: cx - 300, y: cy, path: 'initial' });
        }

        const speed = 4;
        this.ctx.fillStyle = '#39ff14';

        for (let i = this.state.photons.length - 1; i >= 0; i--) {
            let p = this.state.photons[i];
            
            if (p.path === 'initial') {
                p.x += speed;
                this.ctx.beginPath(); this.ctx.arc(p.x, p.y, 4, 0, Math.PI*2); this.ctx.fill();
                if (p.x >= bs1.x) {
                    if (this.params.blockPath) {
                        p.path = Math.random() > 0.5 ? 'lower_collapsed' : 'upper_collapsed';
                    } else {
                        // Superposition
                        p.path = 'superposition';
                        p.x2 = p.x; p.y2 = p.y;
                    }
                }
            } else if (p.path === 'superposition') {
                p.x += speed; // lower path
                p.y2 -= speed; // upper path
                
                this.ctx.globalAlpha = 0.5;
                this.ctx.beginPath(); this.ctx.arc(p.x, p.y, 4, 0, Math.PI*2); this.ctx.fill();
                this.ctx.beginPath(); this.ctx.arc(p.x2, p.y2, 4, 0, Math.PI*2); this.ctx.fill();
                this.ctx.globalAlpha = 1.0;

                if (p.x >= m1.x) { p.y -= speed; p.x = m1.x; }
                if (p.y2 <= m2.y) { p.x2 += speed; p.y2 = m2.y; }

                if (p.y <= bs2.y || p.x2 >= bs2.x) {
                    p.path = 'recombine';
                    p.x = bs2.x; p.y = bs2.y;
                }
            } else if (p.path === 'lower_collapsed') {
                p.x += speed;
                this.ctx.beginPath(); this.ctx.arc(p.x, p.y, 4, 0, Math.PI*2); this.ctx.fill();
                if (p.x >= cx) {
                    // Blocked!
                    this.state.photons.splice(i, 1);
                    continue;
                }
            } else if (p.path === 'upper_collapsed') {
                if (p.y > m2.y) p.y -= speed;
                else p.x += speed;
                this.ctx.beginPath(); this.ctx.arc(p.x, p.y, 4, 0, Math.PI*2); this.ctx.fill();
                
                if (p.x >= bs2.x) {
                    p.path = 'recombine_collapsed';
                    p.finalDir = Math.random() > 0.5 ? 'D1' : 'D2';
                }
            } else if (p.path === 'recombine') {
                // Constructive interference to D1
                p.x += speed;
                this.ctx.beginPath(); this.ctx.arc(p.x, p.y, 4, 0, Math.PI*2); this.ctx.fill();
                if (p.x >= det1.x) {
                    this.state.countD1++;
                    this.state.photons.splice(i, 1);
                }
            } else if (p.path === 'recombine_collapsed') {
                if (p.finalDir === 'D1') p.x += speed;
                else p.y -= speed;
                
                this.ctx.beginPath(); this.ctx.arc(p.x, p.y, 4, 0, Math.PI*2); this.ctx.fill();
                if (p.x >= det1.x) {
                    this.state.countD1++;
                    this.state.photons.splice(i, 1);
                } else if (p.y <= det2.y) {
                    this.state.countD2++;
                    this.state.photons.splice(i, 1);
                }
            }
        }

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '18px Space Grotesk';
        if (this.params.blockPath) {
            this.ctx.fillText("Hangi yol ölçümü yapıldı. Dalga çöktü. D1 ve D2'ye %50-%50 gider.", cx - 200, cy + 150);
        } else {
            this.ctx.fillText("Dalga Girişimi Var. Foton DAİMA D1'e ulaşır.", cx - 200, cy + 150);
        }

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

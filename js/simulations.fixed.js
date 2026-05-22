/**
 * Kuantum SimÃ¼lasyonlarÄ± LaboratuvarÄ±
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
        this.state = {}; // Durumu sÄ±fÄ±rla
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

    // --- SÄ°MU-1: Siyah Cisim IÅŸÄ±masÄ± ---
    blackbody(isUpdate) {
        const title = "Siyah Cisim IÅŸÄ±masÄ± ve Ultraviyole Felaketi";
        const desc = "SÄ±caklÄ±ÄŸÄ± artÄ±rdÄ±kÃ§a klasik fiziÄŸin neden iflas ettiÄŸini ve Planck'Ä±n Ã§Ã¶zÃ¼mÃ¼nÃ¼ gÃ¶rÃ¼n.";
        this.updateUI(title, desc);

        if (!isUpdate) {
            this.params = { temperature: 3000 };
        }
        this.createControl("SÄ±caklÄ±k (Kelvin)", "temperature", 500, 8000, 100);

        const animate = () => {
            this.ctx.fillStyle = '#05070a';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            const padding = 60;
            const graphWidth = this.canvas.width / 2;
            const graphHeight = this.canvas.height - padding * 2;
            const startX = 50;
            const startY = this.canvas.height - padding;

            // IsÄ±nan Cisim
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
            this.ctx.fillText(`SÄ±caklÄ±k: ${this.params.temperature} K`, objectX - 50, objectY + 110);

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

    // --- SÄ°MU-2: Fotoelektrik Olay ---
    photoelectric(isUpdate) {
        const title = "Fotoelektrik Olay";
        const desc = "Sadece Ä±ÅŸÄ±k ÅŸiddeti deÄŸil, Ä±ÅŸÄ±ÄŸÄ±n rengi (frekansÄ±) elektron koparmak iÃ§in Ã¶nemlidir.";
        this.updateUI(title, desc);

        if (!isUpdate) {
            this.params = { intensity: 5, frequency: 5 };
            this.state.electrons = [];
        }
        this.createControl("IÅŸÄ±k Åiddeti", "intensity", 1, 10, 1);
        this.createControl("IÅŸÄ±k FrekansÄ± (Enerji)", "frequency", 1, 10, 1);

        const threshold = 6;
        const animate = () => {
            this.ctx.fillStyle = '#05070a';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Katot
            this.ctx.fillStyle = '#444';
            this.ctx.fillRect(this.canvas.width - 100, 50, 40, this.canvas.height - 100);
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(`Metal EÅŸik: ${threshold}`, this.canvas.width - 150, 40);

            // IÅŸÄ±k
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

    // --- SÄ°MU-3: Ã‡ift YarÄ±k ---
    doubleslit(isUpdate) {
        this.updateUI("Ã‡ift YarÄ±k Deneyi", "Ã–lÃ§Ã¼m yapÄ±ldÄ±ÄŸÄ±nda dalga fonksiyonu Ã§Ã¶ker.");
        if (!isUpdate) {
            this.params = { measure: false };
            this.state.particles = [];
            this.state.pattern = new Array(100).fill(0);
        }
        this.createControl("GÃ¶zlemci (Ã–lÃ§Ã¼m Yap)", "measure", null, null, null, "checkbox");

        const animate = () => {
            this.ctx.fillStyle = 'rgba(5, 7, 10, 0.2)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            const slitX = 200, screenX = this.canvas.width - 60, midY = this.canvas.height / 2;
            this.ctx.fillStyle = '#444';
            this.ctx.fillRect(slitX, 0, 15, midY - 60);
            this.ctx.fillRect(slitX, midY - 20, 15, 40);
            this.ctx.fillRect(slitX, midY + 60, 15, this.canvas.height);

            if (this.params.measure) {
                this.ctx.font = '40px Arial'; this.ctx.fillText('ğŸ‘ï¸', slitX - 60, midY - 80);
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

    // --- SÄ°MU-4: Qubit GÃ¶rselleÅŸtirme ---
    qubit(isUpdate) {
        this.updateUI("Qubit ve Bloch KÃ¼resi", "Bir qubitin durumunu geometrik ve matrisel olarak gÃ¶rÃ¼n.");
        if (!isUpdate) this.params = { theta: 0, phi: 0 };
        this.createControl("Kutup AÃ§Ä±sÄ± (Theta)", "theta", 0, Math.PI, 0.01);
        this.createControl("Faz AÃ§Ä±sÄ± (Phi)", "phi", 0, Math.PI * 2, 0.01);

        const animate = () => {
            this.ctx.fillStyle = '#05070a';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            const cx = this.canvas.width/2 - 150;
            const cy = this.canvas.height/2;
            const r = 120;

            // KÃ¼re IzgarasÄ± (3D Etkisi)
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

            // Ana KÃ¼re ve Eksenler
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.beginPath(); this.ctx.arc(cx, cy, r, 0, Math.PI*2); this.ctx.stroke();
            this.ctx.beginPath(); this.ctx.moveTo(cx, cy - r - 20); this.ctx.lineTo(cx, cy + r + 20); this.ctx.stroke();
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 16px Space Grotesk';
            this.ctx.fillText('|0âŸ©', cx - 10, cy - r - 30);
            this.ctx.fillText('|1âŸ©', cx - 10, cy + r + 40);

            // VektÃ¶r Hesaplama
            const x = r * Math.sin(this.params.theta) * Math.cos(this.params.phi);
            const z = -r * Math.cos(this.params.theta);
            const y = r * Math.sin(this.params.theta) * Math.sin(this.params.phi) * 0.4;

            // VektÃ¶r Ã‡izimi
            this.ctx.strokeStyle = '#00f2ff';
            this.ctx.lineWidth = 4;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#00f2ff';
            this.ctx.beginPath(); this.ctx.moveTo(cx, cy); this.ctx.lineTo(cx + x, cy + z + y); this.ctx.stroke();
            this.ctx.shadowBlur = 0;
            
            this.ctx.fillStyle = '#00f2ff';
            this.ctx.beginPath(); this.ctx.arc(cx + x, cy + z + y, 6, 0, Math.PI*2); this.ctx.fill();

            // --- MATEMATÄ°KSEL GÃ–STERÄ°M ---
            const alpha = Math.cos(this.params.theta / 2);
            const beta = Math.sin(this.params.theta / 2);
            const phiDeg = (this.params.phi * 180 / Math.PI).toFixed(0);

            const startX = cx + r + 80;
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px Space Grotesk';
            this.ctx.fillText(`|ÏˆâŸ© = ${alpha.toFixed(2)} |0âŸ© + ${beta.toFixed(2)} e^(i${phiDeg}Â°) |1âŸ©`, startX, cy - 80);

            // VektÃ¶r/Matris Formu
            this.ctx.font = '16px Space Grotesk';
            this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
            this.ctx.fillText("VektÃ¶r (Matris) Formu:", startX, cy - 20);
            
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            // Sol Parantez
            this.ctx.beginPath();
            this.ctx.moveTo(startX + 20, cy); this.ctx.lineTo(startX + 10, cy);
            this.ctx.lineTo(startX + 10, cy + 90); this.ctx.lineTo(startX + 20, cy + 90);
            this.ctx.stroke();
            // SaÄŸ Parantez
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
                this.ctx.fillText(`e^(i${phiDeg}Â°)`, startX + 80, cy + 75);
            }

            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    },

    // DiÄŸerleri...
    uncertainty(isUpdate) {
        this.updateUI("Heisenberg Belirsizlik Ä°lkesi", "Konum (X) ve Momentum (P) arasÄ±ndaki iliÅŸki.");
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

    drawBlochSphere(cx, cy, r, theta, phi, color = COLORS.blue, label = "|ÏˆâŸ©") {
        // KÃ¼re IzgarasÄ± (3D Etkisi)
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

        // Ana KÃ¼re ve Eksenler
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.beginPath(); this.ctx.arc(cx, cy, r, 0, Math.PI*2); this.ctx.stroke();
        this.ctx.beginPath(); this.ctx.moveTo(cx, cy - r - 10); this.ctx.lineTo(cx, cy + r + 10); this.ctx.stroke();
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 14px Space Grotesk';
        this.ctx.fillText('|0âŸ©', cx - 8, cy - r - 20);
        this.ctx.fillText('|1âŸ©', cx - 8, cy + r + 25);

        // VektÃ¶r Hesaplama
        const x = r * Math.sin(theta) * Math.cos(phi);
        const z = -r * Math.cos(theta);
        const y = r * Math.sin(theta) * Math.sin(phi) * 0.4;

        // VektÃ¶r Ã‡izimi
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

// BaÄŸÄ±msÄ±z Atamalar (Persist iÃ§in)
Simulations.wavefunction = function(isUpdate) {
    this.updateUI("Dalga Fonksiyonu", "ParÃ§acÄ±ÄŸÄ±n nerede bulunma olasÄ±lÄ±ÄŸÄ± olduÄŸunu gÃ¶rÃ¼n.");
    if (!isUpdate) this.state.measuredX = null;
    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        const btn = document.createElement('button'); btn.innerText = "KONUMU Ã–LÃ‡"; btn.className = "btn-primary";
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
    this.updateUI("SÃ¼perpozisyon", "Qubit hem 0 hem 1 durumundadÄ±r.");
    if (!isUpdate) { this.state.isMeasured = false; this.state.result = null; }
    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        const btn = document.createElement('button'); btn.innerText = "Ã–LÃ‡ÃœM YAP (Ã‡Ã–KTÃœR)"; btn.className = "btn-primary";
        btn.onclick = () => { this.state.isMeasured = true; this.state.result = Math.random()>0.5?0:1; setTimeout(()=>{this.state.isMeasured=false; this.state.result=null;}, 3000); };
        controls.appendChild(btn);
    }
    const animate = () => {
        this.ctx.fillStyle = '#05070a'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const cx = this.canvas.width/2, cy = this.canvas.height/2, r = 120;
        
        if (!this.state.isMeasured) {
            const t = Date.now()/200;
            const theta = Math.PI/2 + Math.sin(t*0.5)*0.2; // Ekvator Ã§evresinde salÄ±nÄ±m
            const phi = t;
            this.drawBlochSphere(cx, cy, r, theta, phi, COLORS.blue, "SÃ¼perpozisyon");
        } else {
            const theta = this.state.result === 0 ? 0 : Math.PI;
            this.drawBlochSphere(cx, cy, r, theta, 0, COLORS.purple, `Durum: |${this.state.result}âŸ©`);
        }
        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.entanglement = function(isUpdate) {
    this.updateUI("Kuantum DolanÄ±klÄ±k", "Ä°ki parÃ§acÄ±k birbirine anÄ±nda baÄŸlÄ±dÄ±r; birini Ã¶lÃ§mek diÄŸerini belirler.");
    
    if (!isUpdate) {
        this.state.isMeasured = false;
        this.state.result = null;
    }

    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        const btn = document.createElement('button');
        btn.innerText = "BÄ°RÄ°NCÄ° PARÃ‡ACIÄI Ã–LÃ‡";
        btn.className = "btn-primary";
        btn.onclick = () => {
            if (this.state.isMeasured) return;
            this.state.isMeasured = true;
            this.state.result = Math.random() > 0.5 ? 0 : 1;
            // 3 saniye sonra sÄ±fÄ±rla
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

        // DolanÄ±klÄ±k BaÄŸÄ± (Neon Ã‡izgi)
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
            // Ä°ki parÃ§acÄ±k senkronize ÅŸekilde sÃ¼perpozisyonda
            this.drawBlochSphere(x1, y, r, Math.PI/2, t, COLORS.blue, "Qubit A");
            this.drawBlochSphere(x2, y, r, Math.PI/2, t, COLORS.blue, "Qubit B");
            
            this.ctx.fillStyle = COLORS.purple;
            this.ctx.font = '14px Space Grotesk';
            this.ctx.fillText("DolanÄ±k Durum (Bell Ã‡ifti)", this.canvas.width/2 - 80, y - 20);
        } else {
            // Birincisi Ã¶lÃ§Ã¼ldÃ¼, ikincisi anÄ±nda aynÄ± (veya zÄ±t) duruma Ã§Ã¶ktÃ¼
            const theta = this.state.result === 0 ? 0 : Math.PI;
            this.drawBlochSphere(x1, y, r, theta, 0, COLORS.purple, `Ã–lÃ§Ã¼ldÃ¼: |${this.state.result}âŸ©`);
            this.drawBlochSphere(x2, y, r, theta, 0, COLORS.purple, `AnÄ±nda Ã‡Ã¶ktÃ¼: |${this.state.result}âŸ©`);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 18px Space Grotesk';
            this.ctx.fillText("SPUKY ACTION AT A DISTANCE!", this.canvas.width/2 - 120, y + 150);
        }

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.qkd = function(isUpdate) {
    this.updateUI("QKD (Kuantum Anahtar DaÄŸÄ±tÄ±mÄ±)", "Araya giren (Eve) sistemi bozar.");
    if (!isUpdate) { this.params = { eve: false }; this.state.photons = []; }
    this.createControl("Eve Dinliyor mu?", "eve", null, null, null, "checkbox");
    const animate = () => {
        this.ctx.fillStyle = '#05070a'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff'; this.ctx.fillText("ALICE", 50, 50); this.ctx.fillText("BOB", this.canvas.width-100, 50);
        if (Math.random() < 0.05) this.state.photons.push({ x: 100, y: this.canvas.height/2, basis: Math.random()>0.5?'+':'x' });
        this.state.photons.forEach((p, i) => {
            p.x += 5;
            if (this.params.eve && Math.abs(p.x - this.canvas.width/2) < 5) p.basis = Math.random()>0.5?'+':'x';
            this.ctx.strokeStyle = p.basis === '+' ? '#00f2ff' : '#bc13fe';
            this.ctx.beginPath(); this.ctx.moveTo(p.x-10, p.y); this.ctx.lineTo(p.x+10, p.y); this.ctx.moveTo(p.x, p.y-10); this.ctx.lineTo(p.x, p.y+10); this.ctx.stroke();
            if (p.x > this.canvas.width - 100) this.state.photons.splice(i, 1);
        });
        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.complexSim = function(isUpdate) {
    this.updateUI("KarmaÅŸÄ±k SayÄ±lar", "Kuantum mekaniÄŸinin dili.");
    if (!isUpdate) this.params = { re: 1, im: 1 };
    this.createControl("GerÃ§el (Re)", "re", -2, 2, 0.1); this.createControl("Sanal (Im)", "im", -2, 2, 0.1);
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
    this.updateUI("Kuantum Devreleri", "H, X, Y, Z ve CNOT kapÄ±larÄ±nÄ± kullanarak kendi devrenizi kurun.");
    
    if (!isUpdate) {
        this.state.circuit = new QuantumCircuit(2); // 2 Qubitlik sistem
        this.state.history = [];
    }

    const controls = document.getElementById('sim-controls');
    if (!isUpdate) {
        controls.innerHTML = '';
        
        const addGateBtn = (label, gate, target) => {
            const btn = document.createElement('button');
            btn.innerText = `${label}${target}`;
            btn.className = "btn-secondary btn-sm";
            btn.style.margin = "2px";
            btn.style.minWidth = "45px";
            btn.onclick = () => {
                this.state.circuit.applyGate(gate, target);
                this.state.history.push({ label: label, target: target });
                if (this.state.history.length > 10) this.state.history.shift();
            };
            controls.appendChild(btn);
        };

        // Tek Qubit KapÄ±larÄ± (Q0 ve Q1 iÃ§in)
        ['H', 'X', 'Y', 'Z'].forEach(g => {
            addGateBtn(g, Gates[g], 0);
        });
        const br = document.createElement('br'); controls.appendChild(br);
        ['H', 'X', 'Y', 'Z'].forEach(g => {
            addGateBtn(g, Gates[g], 1);
        });

        const br2 = document.createElement('br'); controls.appendChild(br2);

        // CNOT KapÄ±sÄ±
        const btnCNOT = document.createElement('button');
        btnCNOT.innerText = "CNOT (0â†’1)";
        btnCNOT.className = "btn-primary btn-sm";
        btnCNOT.style.margin = "5px";
        btnCNOT.onclick = () => {
            this.state.circuit.applyCNOT(0, 1);
            this.state.history.push({ label: "CN", target: "link" });
            if (this.state.history.length > 10) this.state.history.shift();
        };
        controls.appendChild(btnCNOT);

        // SÄ±fÄ±rla Butonu
        const btnReset = document.createElement('button');
        btnReset.innerText = "TEMÄ°ZLE";
        btnReset.className = "btn-secondary btn-sm";
        btnReset.style.background = "#ff3914";
        btnReset.onclick = () => {
            this.state.circuit.reset();
            this.state.history = [];
        };
        controls.appendChild(btnReset);
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const margin = 80;
        const spacing = 80;

        // Devre Ã‡izgileri
        this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(margin, spacing); this.ctx.lineTo(this.canvas.width - margin, spacing);
        this.ctx.moveTo(margin, spacing * 2); this.ctx.lineTo(this.canvas.width - margin, spacing * 2);
        this.ctx.stroke();

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px Space Grotesk';
        this.ctx.fillText("q0", margin - 30, spacing + 5);
        this.ctx.fillText("q1", margin - 30, spacing * 2 + 5);

        // KapÄ±larÄ± Ã‡iz
        this.state.history.forEach((h, i) => {
            const x = margin + 40 + i * 60;
            if (h.target === "link") {
                // CNOT GÃ¶rseli
                this.ctx.strokeStyle = COLORS.purple;
                this.ctx.beginPath();
                this.ctx.moveTo(x, spacing); this.ctx.lineTo(x, spacing * 2);
                this.ctx.stroke();
                this.ctx.fillStyle = COLORS.purple;
                this.ctx.beginPath(); this.ctx.arc(x, spacing, 6, 0, Math.PI*2); this.ctx.fill();
                this.ctx.beginPath(); this.ctx.arc(x, spacing * 2, 12, 0, Math.PI*2); this.ctx.stroke();
            } else {
                const y = (h.target === 0) ? spacing : spacing * 2;
                this.ctx.fillStyle = COLORS.blue;
                this.ctx.fillRect(x - 20, y - 20, 40, 40);
                this.ctx.fillStyle = '#000';
                this.ctx.font = 'bold 18px Space Grotesk';
                this.ctx.fillText(h.label, x - 8, y + 7);
            }
        });

        // OlasÄ±lÄ±klar (Histogram)
        const probs = this.state.circuit.getProbabilities();
        const states = ["|00âŸ©", "|01âŸ©", "|10âŸ©", "|11âŸ©"];
        
        this.ctx.font = '14px Space Grotesk';
        probs.forEach((p, i) => {
            const barY = spacing * 3 + i * 35;
            this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
            this.ctx.fillText(states[i], margin, barY + 15);
            
            const barWidth = p * 300;
            if (barWidth > 0) {
                const grad = this.ctx.createLinearGradient(margin + 50, 0, margin + 50 + barWidth, 0);
                grad.addColorStop(0, COLORS.blue);
                grad.addColorStop(1, COLORS.purple);
                this.ctx.fillStyle = grad;
                this.ctx.fillRect(margin + 50, barY, barWidth, 20);
                
                this.ctx.fillStyle = '#fff';
                this.ctx.fillText(`${(p*100).toFixed(0)}%`, margin + 60 + barWidth, barY + 15);
            }
        });

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};
Simulations.gates = function(isUpdate) {
    this.updateUI("Kuantum KapÄ±larÄ±", "X, Y, Z ve Hadamard (H) kapÄ±larÄ±nÄ±n etkisini Qubit Ã¼zerinde gÃ¶rÃ¼n.");
    
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

        // Matris GÃ¶sterimi
        if (this.state.lastGate) {
            const mx = cx + r + 100;
            const my = cy - 60;
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 16px Space Grotesk';
            this.ctx.fillText(this.state.lastGate.name + " Matrisi:", mx, my - 20);

            // Parantezler
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(mx + 5, my); this.ctx.lineTo(mx, my); this.ctx.lineTo(mx, my + 80); this.ctx.lineTo(mx + 5, my + 80);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(mx + 115, my); this.ctx.lineTo(mx + 120, my); this.ctx.lineTo(mx + 120, my + 80); this.ctx.lineTo(mx + 115, my + 80);
            this.ctx.stroke();

            // DeÄŸerler
            this.ctx.font = '14px Courier New';
            this.state.lastGate.matrix.forEach((row, rowIndex) => {
                row.forEach((val, colIndex) => {
                    let txt = val.re.toFixed(1);
                    if (Math.abs(val.im) > 0.01) txt = (val.im > 0 ? "" : "-") + "i";
                    if (val.re === 0 && val.im === 0) txt = "0";
                    this.ctx.fillText(txt, mx + 25 + colIndex * 50, my + 30 + rowIndex * 35);
                });
            });
        }

        // TarihÃ§e
        this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
        this.ctx.font = '14px Space Grotesk';
        this.ctx.fillText("Ä°ÅŸlem AkÄ±ÅŸÄ±: " + (this.state.history.length ? this.state.history.join(" â†’ ") : "HenÃ¼z kapÄ± uygulanmadÄ±"), 50, this.canvas.height - 30);

        this.animationId = requestAnimationFrame(animate);
    };
    animate();
};

Simulations.mazeSim = function(isUpdate) {
    this.updateUI('Klasik vs Kuantum Arama', 'Klasik bilgisayar labirenti adım adım gezerken, kuantum bilgisayar tüm yolları aynı anda dener.');
    
    if (!isUpdate) {
        this.state.grid = this.generateMaze(15, 10);
        this.state.classicPos = { x: 0, y: 0 };
        this.state.classicPath = [{x:0, y:0}];
        this.state.quantumSpread = 0;
        this.state.found = false;
        this.state.classicStep = 0;
    }

    const animate = () => {
        this.ctx.fillStyle = '#05070a'; this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const cellSize = 30;
        const offsetX = (this.canvas.width - 15 * cellSize) / 2;
        const offsetY = (this.canvas.height - 10 * cellSize) / 2;

        // Labirenti Çiz
        for(let y=0; y<10; y++) {
            for(let x=0; x<15; x++) {
                this.ctx.strokeStyle = '#333';
                this.ctx.strokeRect(offsetX + x*cellSize, offsetY + y*cellSize, cellSize, cellSize);
                if (this.state.grid[y][x] === 1) {
                    this.ctx.fillStyle = '#1a1a1a';
                    this.ctx.fillRect(offsetX + x*cellSize, offsetY + y*cellSize, cellSize, cellSize);
                }
            }
        } 

        // Hedef
        this.ctx.fillStyle = '#ff3914';
        this.ctx.fillRect(offsetX + 14*cellSize + 5, offsetY + 9*cellSize + 5, cellSize-10, cellSize-10);

        // Kuantum Arama (Mavi Yayılım)
        if (!this.state.found) this.state.quantumSpread += 0.05;
        this.ctx.fillStyle = 'rgba(0, 242, 255, 0.2)';
        for(let y=0; y<10; y++) {
            for(let x=0; x<15; x++) {
                const dist = Math.sqrt(x*x + y*y);
                if (dist < this.state.quantumSpread && this.state.grid[y][x] === 0) {
                    this.ctx.fillRect(offsetX + x*cellSize, offsetY + y*cellSize, cellSize, cellSize);
                }
            }
        }

        // Klasik Arama (Kırmızı İz)
        if (this.state.classicStep < 100 && !this.state.found) {
            this.state.classicStep++;
            // Basit bir gezinti simülasyonu
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


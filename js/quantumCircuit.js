/**
 * Kuantum Devre Simülatörü Mantığı
 */
class QuantumCircuit {
    constructor(numQubits) {
        this.numQubits = numQubits;
        this.stateSize = Math.pow(2, numQubits);
        this.reset();
    }

    reset() {
        // Başlangıç durumu |00...0>
        this.state = new Array(this.stateSize).fill(new Complex(0, 0));
        this.state[0] = new Complex(1, 0);
        this.gates = [];
    }

    // Tek qubitlik kapı uygula
    applyGate(gateMatrix, targetQubit) {
        let fullMatrix;
        
        // Kapıyı tüm sistem matrisine genişlet (Tensor Product)
        // I ⊗ I ⊗ ... ⊗ Gate ⊗ ... ⊗ I
        let currentMatrix = [[new Complex(1,0)]];
        
        for (let i = 0; i < this.numQubits; i++) {
            const m = (i === targetQubit) ? gateMatrix : Gates.I;
            
            // Eğer currentMatrix 1x1 ise sadece m'yi ata
            if (currentMatrix.length === 1 && currentMatrix[0].length === 1) {
                currentMatrix = m;
            } else {
                currentMatrix = LinearAlgebra.tensorProduct(currentMatrix, m);
            }
        }
        
        fullMatrix = currentMatrix;
        this.state = LinearAlgebra.multiplyMatrixVector(fullMatrix, this.state);
        this.state = LinearAlgebra.normalize(this.state);
    }

    // CNOT Kapısı (Kontrol ve Hedef)
    applyCNOT(control, target) {
        if (this.numQubits !== 2) return; // Basitleştirme: Sadece 2 qubit modunda
        this.state = LinearAlgebra.multiplyMatrixVector(Gates.CNOT, this.state);
        this.state = LinearAlgebra.normalize(this.state);
    }

    getProbabilities() {
        return this.state.map(s => s.magnitudeSquared());
    }

    measure() {
        const probs = this.getProbabilities();
        const rand = Math.random();
        let cumulative = 0;
        for (let i = 0; i < probs.length; i++) {
            cumulative += probs[i];
            if (rand <= cumulative) {
                return i; // Ölçülen durumun indexi (0, 1, 2, 3...)
            }
        }
        return probs.length - 1;
    }
}

// Global devre örneği
let activeCircuit = new QuantumCircuit(1);

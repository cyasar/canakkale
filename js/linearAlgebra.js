/**
 * Kuantum Durumları ve Kapıları için Lineer Cebir Kütüphanesi
 */
const LinearAlgebra = {
    // Vektör-Vektör İç Çarpımı (Bra-Ket: <ψ|φ>)
    innerProduct(v1, v2) {
        let result = new Complex(0, 0);
        for (let i = 0; i < v1.length; i++) {
            // İlk vektörün eşleniği alınır (Bra kısmı)
            const conj = v1[i].conjugate();
            result = result.add(conj.mul(v2[i]));
        }
        return result;
    },

    // Matris-Vektör Çarpımı (Gate uygulaması: U|ψ>)
    multiplyMatrixVector(matrix, vector) {
        const result = [];
        for (let i = 0; i < matrix.length; i++) {
            let sum = new Complex(0, 0);
            for (let j = 0; j < vector.length; j++) {
                sum = sum.add(matrix[i][j].mul(vector[j]));
            }
            result.push(sum);
        }
        return result;
    },

    // Matris-Matris Çarpımı (Kapı birleştirme: U2 * U1)
    multiplyMatrices(m1, m2) {
        const result = Array(m1.length).fill(0).map(() => Array(m2[0].length).fill(new Complex(0, 0)));
        for (let i = 0; i < m1.length; i++) {
            for (let j = 0; j < m2[0].length; j++) {
                let sum = new Complex(0, 0);
                for (let k = 0; k < m1[0].length; k++) {
                    sum = sum.add(m1[i][k].mul(m2[k][j]));
                }
                result[i][j] = sum;
            }
        }
        return result;
    },

    // Kronecker Çarpımı (Tensor Product: |ψ> ⊗ |φ>)
    // Çok qubitli sistemler oluşturmak için kullanılır
    tensorProduct(a, b) {
        // Eğer a ve b vektörse
        if (!Array.isArray(a[0])) {
            const result = [];
            for (let i = 0; i < a.length; i++) {
                for (let j = 0; j < b.length; j++) {
                    result.push(a[i].mul(b[j]));
                }
            }
            return result;
        }
        // Eğer a ve b matrisse
        const rows = a.length * b.length;
        const cols = a[0].length * b[0].length;
        const result = Array(rows).fill(0).map(() => Array(cols));
        
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < a[0].length; j++) {
                for (let k = 0; k < b.length; k++) {
                    for (let l = 0; l < b[0].length; l++) {
                        result[i * b.length + k][j * b[0].length + l] = a[i][j].mul(b[k][l]);
                    }
                }
            }
        }
        return result;
    },

    // Normalize etme
    normalize(vector) {
        let normSq = 0;
        for (let val of vector) {
            normSq += val.magnitudeSquared();
        }
        const norm = Math.sqrt(normSq);
        return vector.map(val => val.mulScalar(1 / norm));
    }
};

/**
 * Temel Kuantum Kapıları (Matrix tanımları)
 */
const Gates = {
    // Identity (I)
    I: [
        [new Complex(1, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(1, 0)]
    ],

    // Pauli-X (NOT)
    X: [
        [new Complex(0, 0), new Complex(1, 0)],
        [new Complex(1, 0), new Complex(0, 0)]
    ],

    // Pauli-Y
    Y: [
        [new Complex(0, 0), new Complex(0, -1)],
        [new Complex(0, 1), new Complex(0, 0)]
    ],

    // Pauli-Z
    Z: [
        [new Complex(1, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(-1, 0)]
    ],

    // Hadamard (H)
    H: [
        [new Complex(1 / Math.sqrt(2), 0), new Complex(1 / Math.sqrt(2), 0)],
        [new Complex(1 / Math.sqrt(2), 0), new Complex(-1 / Math.sqrt(2), 0)]
    ],

    // CNOT (Controlled-NOT) - 2 Qubit
    CNOT: [
        [new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
        [new Complex(0, 1), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(1, 0)],
        [new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0)]
    ],

    // SWAP - 2 Qubit
    SWAP: [
        [new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(1, 0)]
    ]
};

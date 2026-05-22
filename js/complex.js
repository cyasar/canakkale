/**
 * Kuantum Programlama için Karmaşık Sayı Sınıfı
 * z = a + bi
 */
class Complex {
    constructor(re, im) {
        this.re = re;
        this.im = im;
    }

    // Toplama: (a + bi) + (c + di) = (a+c) + (b+d)i
    add(other) {
        return new Complex(this.re + other.re, this.im + other.im);
    }

    // Çıkarma
    sub(other) {
        return new Complex(this.re - other.re, this.im - other.im);
    }

    // Çarpma: (a + bi)(c + di) = (ac - bd) + (ad + bc)i
    mul(other) {
        return new Complex(
            this.re * other.re - this.im * other.im,
            this.re * other.im + this.im * other.re
        );
    }

    // Skaler Çarpma
    mulScalar(s) {
        return new Complex(this.re * s, this.im * s);
    }

    // Eşlenik: a + bi -> a - bi
    conjugate() {
        return new Complex(this.re, -this.im);
    }

    // Mutlak değerin karesi: |z|^2 = a^2 + b^2
    magnitudeSquared() {
        return this.re * this.re + this.im * this.im;
    }

    // Mutlak değer (genlik)
    magnitude() {
        return Math.sqrt(this.magnitudeSquared());
    }

    // Faz açısı (argument)
    phase() {
        return Math.atan2(this.im, this.re);
    }

    // String gösterimi
    toString(precision = 2) {
        const re = this.re.toFixed(precision);
        const im = Math.abs(this.im).toFixed(precision);
        const sign = this.im >= 0 ? "+" : "-";
        return `${re} ${sign} ${im}i`;
    }

    static fromPolar(r, theta) {
        return new Complex(r * Math.cos(theta), r * Math.sin(theta));
    }
}

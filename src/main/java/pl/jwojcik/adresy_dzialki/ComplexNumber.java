package pl.jwojcik.adresy_dzialki;

import lombok.Data;

@Data
public class ComplexNumber {
    private final double real;
    private final double imaginary;

    public ComplexNumber add(ComplexNumber c) {
        return new ComplexNumber(this.real + c.real, this.imaginary + c.imaginary);
    }

    public ComplexNumber substract(ComplexNumber c) {
        return new ComplexNumber(this.real - c.real, this.imaginary - c.imaginary);
    }

    public ComplexNumber multiply(ComplexNumber c) {
        double realPart = this.real * c.real - this.imaginary * c.imaginary;
        double imaginaryPart = this.real * c.imaginary + this.imaginary * c.real;
        return new ComplexNumber(realPart, imaginaryPart);
    }

    public ComplexNumber addReal(double r) {
        return new ComplexNumber(this.real + r, this.imaginary);
    }

    public ComplexNumber multiplyReal(double r) {
        return new ComplexNumber(r * this.real, r * this.imaginary);
    }
}

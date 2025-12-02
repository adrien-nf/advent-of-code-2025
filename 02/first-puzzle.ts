import fs from "fs";

const input = fs.readFileSync("./02/input.txt").toString();

class Chunk {
  constructor(protected min: number, protected max: number) {
    //
  }

  public getSumOfInvalidIds(): number {
    return this.getInvalidIds().reduce((acc, curr) => {
      return acc + curr;
    }, 0);
  }

  public getInvalidIds(): number[] {
    const buffer = [];

    for (let i = this.min; i <= this.max; i++) {
      if (this.isInvalid(i)) {
        buffer.push(i);
      }
    }

    return buffer;
  }

  protected isInvalid(n: number): boolean {
    const halfDigits = this.getNumberOfDigits(n) / 2;

    const left = n.toString().slice(0, halfDigits);
    const right = n.toString().slice(halfDigits);

    return left === right;
  }

  protected getNumberOfDigits(n: number): number {
    const digits = n.toString().split("");

    return digits.length;
  }
}

class Range {
  constructor(protected min: number, protected max: number) {
    //
  }

  public getSumOfInvalidIds(): number {
    return this.getChunks().reduce((acc, curr) => {
      return acc + curr.getSumOfInvalidIds();
    }, 0);
  }

  public hasPotentialInvalidIds(): boolean {
    const numberOfDigitsOfMin = this.getNumberOfDigits(this.min);
    const numberOfDigitsOfMax = this.getNumberOfDigits(this.max);

    const isMinNumberOdd = numberOfDigitsOfMin % 2;
    const isMaxNumberOdd = numberOfDigitsOfMax % 2;

    if (isMinNumberOdd && isMaxNumberOdd) {
      return numberOfDigitsOfMin + 2 <= numberOfDigitsOfMax;
    }

    return true;
  }

  protected getChunks(): Chunk[] {
    const numberOfDigitsOfMin = this.getNumberOfDigits(this.min);
    const numberOfDigitsOfMax = this.getNumberOfDigits(this.max);

    if (numberOfDigitsOfMin === numberOfDigitsOfMax) {
      return [new Chunk(this.min, this.max)];
    }

    const buffer: Chunk[] = [];

    for (let i = numberOfDigitsOfMin; i <= numberOfDigitsOfMax; i++) {
      const isOdd = i % 2;

      if (isOdd) {
        continue;
      }

      const minimumNumberForDigits = this.generateMinimumNumberForDigits(i);
      const maximumNumberForDigits = this.generateMaximumNumberForDigits(i);

      buffer.push(
        new Chunk(
          minimumNumberForDigits < this.min ? this.min : minimumNumberForDigits,
          maximumNumberForDigits > this.max ? this.max : maximumNumberForDigits
        )
      );
    }

    return buffer;
  }

  protected getNumberOfDigits(n: number): number {
    const digits = n.toString().split("");

    return digits.length;
  }

  protected generateMinimumNumberForDigits(digits: number): number {
    return Number("1" + "0".repeat(digits - 1));
  }

  protected generateMaximumNumberForDigits(digits: number): number {
    return Number("9" + "9".repeat(digits - 1));
  }
}

class Solver {
  protected ranges: Range[];

  constructor(input: string) {
    this.ranges = this.createRanges(input);
  }

  public solve(): number {
    return this.getAmountOfInvalidIds();
  }

  protected createRanges(input: string): Range[] {
    return input
      .split(",")
      .map((str) => {
        const [min, max] = str.split("-");

        return new Range(Number(min), Number(max));
      })
      .filter((e) => e.hasPotentialInvalidIds());
  }

  protected getAmountOfInvalidIds(): number {
    return this.ranges.reduce((acc, curr) => {
      return acc + curr.getSumOfInvalidIds();
    }, 0);
  }
}

const solver = new Solver(input);

console.log(solver.solve());

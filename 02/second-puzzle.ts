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
    const fullDigits = this.getNumberOfDigits(n);
    const halfDigits = Math.floor(fullDigits / 2);

    const digits = n.toString().split("");

    for (let i = halfDigits + 1; i-- >= 1; ) {
      if (fullDigits % i !== 0) {
        continue;
      }

      const pattern = digits.slice(0, i).join("");
      const repeated = pattern.repeat(fullDigits / i);

      if (repeated === n.toString()) {
        return true;
      }
    }
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

  protected getChunks(): Chunk[] {
    return [new Chunk(this.min, this.max)];
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
    return input.split(",").map((str) => {
      const [min, max] = str.split("-");

      return new Range(Number(min), Number(max));
    });
  }

  protected getAmountOfInvalidIds(): number {
    return this.ranges.reduce((acc, curr) => {
      return acc + curr.getSumOfInvalidIds();
    }, 0);
  }
}

const solver = new Solver(input);

console.log(solver.solve());

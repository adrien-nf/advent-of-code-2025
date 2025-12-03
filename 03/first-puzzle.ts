import fs from "fs";

const input = fs.readFileSync("./03/input.txt").toString();

const lines = input.split(/\r?\n/);

class InvestigatedLine {
  constructor(protected line: number[]) {
    //
  }

  public getValues(): [number, number] {
    const max = Math.max(...this.line);
    const index = this.line.findIndex((value) => value === max);

    return [max, index];
  }
}

class Bank {
  protected line: number[];
  protected startIndex = 0;

  constructor(line: string) {
    this.line = line.split("").map(Number);
  }

  public getHighestValue(): number {
    const tenth = this.findBiggest(1);
    const unit = this.findBiggest();

    return Number(`${tenth}${unit}`);
  }

  protected findBiggest(backOffset: number = 0): number {
    const [value, index] = new InvestigatedLine(
      this.line.slice(this.startIndex, this.line.length - backOffset)
    ).getValues();

    this.startIndex = index + 1;

    return value;
  }
}

class Solver {
  protected banks: Bank[];

  constructor(lines: string[]) {
    this.banks = lines.map((line) => new Bank(line));
  }

  public solve(): number {
    return this.banks.reduce((acc, curr) => {
      return acc + curr.getHighestValue();
    }, 0);
  }
}

const solver = new Solver(lines);

console.log(solver.solve());

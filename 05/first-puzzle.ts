import fs from "fs";

const input = fs.readFileSync("./05/input.txt").toString();

const lines = input.split(/\r?\n/);

class Range {
  constructor(protected start: number, protected end: number) {
    //
  }

  public includes(value: number): boolean {
    return value >= this.start && value <= this.end;
  }
}

class Fridge {
  protected freshRanges: Range[] = [];

  protected products: number[] = [];

  constructor(protected lines: string[]) {
    this.initializeRanges();
    this.initializeProducts();
  }

  protected initializeRanges(): void {
    let line;

    do {
      line = this.lines.shift();

      const [start, end] = line.split("-");

      this.freshRanges.push(new Range(Number(start), Number(end)));
    } while (line !== "");
  }

  protected initializeProducts(): void {
    this.products = this.lines.map((e) => Number(e));
  }

  public getFreshProducts(): number[] {
    return this.products.filter((product) =>
      this.freshRanges.some((range) => range.includes(product))
    );
  }
}

class Solver {
  protected fridge: Fridge;

  constructor(lines: string[]) {
    this.fridge = new Fridge(lines);
  }

  public solve(): number {
    return this.fridge.getFreshProducts().length;
  }
}

const solver = new Solver(lines);

console.log(solver.solve());

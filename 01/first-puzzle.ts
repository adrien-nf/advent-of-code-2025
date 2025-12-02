import fs from "fs";

const input = fs.readFileSync("./01/input.txt").toString();

type Direction = "L" | "R";

const MAX_BOUNDS = 100;

class Solver {
  protected count: number;
  protected index = 50;
  protected lines: string[];

  constructor(input: string) {
    this.lines = input.split("\n");
    this.count = 0;
  }

  public solve(): number {
    this.lines.forEach((e) => {
      this.applyLine(e);
    });

    return this.count;
  }

  protected applyLine(e: string): void {
    const [direction, amount] = this.getLineInfos(e);

    this.applyDirection(direction, amount);

    this.correctIndexIfOutOfBounds();

    this.addToCountIfPossible();
  }

  protected getLineInfos(e: string): [Direction, number] {
    const direction = e.slice(0, 1) as Direction;

    const amount = e.slice(1);

    return [direction, Number(amount)];
  }

  protected applyDirection(direction: Direction, amount: number) {
    this.index += direction === "L" ? -amount : amount;
  }

  protected correctIndexIfOutOfBounds(): void {
    this.index = this.index % MAX_BOUNDS;

    if (this.index < 0) {
      this.index = MAX_BOUNDS + this.index;
    }

    if (this.index >= MAX_BOUNDS) {
      this.index = this.index - MAX_BOUNDS;
    }
  }

  protected addToCountIfPossible() {
    this.count += this.index === 0 ? 1 : 0;
  }
}

const solver = new Solver(input);

console.log(solver.solve());

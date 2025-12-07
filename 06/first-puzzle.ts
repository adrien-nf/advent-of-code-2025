import fs from "fs";

const input = fs.readFileSync("./06/input.txt").toString();

const lines = input.split(/\r?\n/);

declare global {
  interface Array<T> {
    column<K extends keyof T>(key: K): T[K][];
  }
}

Array.prototype.column = function (key: any) {
  return this.map((i: any) => i[key]);
};

enum Operator {
  Add = "+",
  Multiply = "*",
}

class Operation {
  constructor(protected numbers: number[], protected operator: Operator) {
    //
  }

  public solve(): number {
    if (this.operator === Operator.Add) {
      return this.numbers.reduce((acc, curr) => acc + curr, 0);
    } else {
      return this.numbers.reduce((acc, curr) => acc * curr, 1);
    }
  }
}

class Solver {
  protected operations: Operation[];

  constructor(protected lines: string[]) {
    this.operations = this.generateOperations();
  }

  protected generateOperations(): Operation[] {
    const verticalValues = this.lines.map((line) =>
      line.split(" ").filter(Boolean)
    );

    return verticalValues
      .at(0)
      .map((_, index) => verticalValues.column(index))
      .map((values) => {
        return new Operation(
          values.slice(0, values.length - 1).map(Number),
          values[values.length - 1] as Operator
        );
      });
  }

  public solve(): number {
    return this.operations.reduce((acc, curr) => acc + curr.solve(), 0);
  }
}

const solver = new Solver(lines);

console.log(solver.solve());

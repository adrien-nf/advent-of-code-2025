import fs from "fs";

const input = fs.readFileSync("./06/input.txt").toString();

const lines = input.split(/\r?\n/);

declare global {
  interface Array<T> {
    column<K extends keyof T>(key: K): T[K][];
    columnRange(start: number, end: number): T[];
  }
}

Array.prototype.column = function (key: any) {
  return this.map((i: any) => i[key]);
};

Array.prototype.columnRange = function (start: number, end: number) {
  return this.map((row: any[]) => row.slice(start, end));
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

    const longest = verticalValues
      .at(0)
      .map((_, index) =>
        Math.max(...verticalValues.column(index).map((e) => e.length))
      );

    let index = 0;

    const valuesWithSpaces = longest.map((value) => {
      const values = this.lines.columnRange(index, index + value);
      index += value + 1;
      return values;
    });

    return valuesWithSpaces.map((values) => {
      const operator = values.pop().trim() as Operator;

      const numbers = this.generateNumbers(values);

      return new Operation(numbers, operator);
    });
  }

  protected generateNumbers(values: string[]): number[] {
    const maxSize = Math.max(...values.map((e) => e.trim().length));

    return Array.from({ length: maxSize })
      .map((_, index) => values.map((e) => e[index]))
      .map((e) => Number(e.join("").trim()));
  }

  public solve(): number {
    return this.operations.reduce((acc, curr) => acc + curr.solve(), 0);
  }
}

const solver = new Solver(lines);

console.log(solver.solve());

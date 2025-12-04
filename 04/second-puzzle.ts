import fs from "fs";

const input = fs.readFileSync("./04/input.txt").toString();

const lines = input.split(/\r?\n/);

class Solver {
  constructor(lines: string[]) {
    //
  }

  public solve(): number {
    return 0;
  }
}

const solver = new Solver(lines);

console.log(solver.solve());

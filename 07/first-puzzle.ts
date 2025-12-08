import fs from "fs";

const input = fs.readFileSync("./07/input.txt").toString();

const lines = input.split(/\r?\n/);

class Manifold {
  protected splits = 0;

  protected gridSize: number;

  protected beams: Set<number> = new Set();

  constructor(protected lines: string[]) {
    this.gridSize = lines.at(0).length;

    this.calculateSplits();
  }

  public getAmountOfSplits() {
    return this.splits;
  }

  protected calculateSplits(): void {
    const startingPosition = this.findStartingPosition(this.lines.shift());

    this.beams = new Set([startingPosition]);

    while (this.exploreLine(this.lines.shift()));
  }

  protected findStartingPosition(line: string): number {
    return line.indexOf("S");
  }

  protected exploreLine(line: string | undefined): boolean {
    if (typeof line === "undefined") {
      return false;
    }

    const splittersIndexes = line.split("").reduce((acc, curr, index) => {
      return curr === "^" ? [...acc, index] : acc;
    }, []);

    this.tryForSplits(splittersIndexes);

    return true;
  }

  protected tryForSplits(splittersIndexes: number[]) {
    const newBeams = new Set(this.beams);

    this.beams.forEach((beamIndex) => {
      if (splittersIndexes.includes(beamIndex)) {
        newBeams.delete(beamIndex);

        this.splits++;

        if (beamIndex > 0) {
          newBeams.add(beamIndex - 1);
        }

        if (beamIndex < this.gridSize) {
          newBeams.add(beamIndex + 1);
        }
      }
    });

    this.beams = newBeams;
  }
}

class Solver {
  protected manifold: Manifold;

  constructor(lines: string[]) {
    this.manifold = new Manifold(lines);
  }

  public solve(): number {
    return this.manifold.getAmountOfSplits();
  }
}

const solver = new Solver(lines);

console.log(solver.solve());

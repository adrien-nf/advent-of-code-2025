import fs from "fs";

const input = fs.readFileSync("./07/input.txt").toString();

const lines = input.split(/\r?\n/);

declare global {
  interface Array<T> {
    column<K extends keyof T>(key: K): T[K][];
  }
}

Array.prototype.column = function (key: any) {
  return this.map((i: any) => i[key]);
};

class Splitter {
  protected children: Splitter[];

  protected calculatedValue;

  public setChildren(splitters: Splitter[]): void {
    this.children = splitters;
  }

  public getAmountPossibleOfPaths(): number {
    if (this.calculatedValue) return this.calculatedValue;

    return (this.calculatedValue = this.calculateValue());
  }

  protected calculateValue(): number {
    if (this.children.length === 0) return 2;

    if (this.children.length === 1)
      return this.children.at(0).getAmountPossibleOfPaths() + 1;

    return this.children.reduce((acc, curr) => {
      return acc + curr.getAmountPossibleOfPaths();
    }, 0);
  }
}

const positionToKey = ({ x, y }: { x: number; y: number }): string => {
  return `${x}.${y}`;
};

class Manifold {
  protected index = 0;

  protected gridSize: number;

  protected splitters = new Map<string, Splitter>();

  constructor(protected lines: string[]) {
    this.gridSize = lines.at(0).length;

    this.calculateAllPossibleSplits();
  }

  public getAmountOfSplits() {
    const topSplitter = this.splitters.get(
      this.splitters.keys().toArray().at(0)
    );

    const v = topSplitter.getAmountPossibleOfPaths();

    return v;
  }

  protected calculateAllPossibleSplits(): void {
    const startingPosition = this.findStartingPosition(this.lines.shift());

    while (this.exploreLine(this.lines.shift()));
  }

  protected findStartingPosition(line: string): number {
    return line.indexOf("S");
  }

  protected exploreLine(line: string | undefined): boolean {
    this.index++;

    if (typeof line === "undefined") {
      return false;
    }

    const splittersIndexes = line.split("").reduce((acc, curr, index) => {
      return curr === "^" ? [...acc, index] : acc;
    }, []);

    splittersIndexes.forEach((splitterXIndex) => {
      this.generateSplitter(splitterXIndex);
    });

    return true;
  }

  protected generateSplitter(splitterXIndex: number): void {
    const splitter = this.getSplitter({ x: splitterXIndex, y: this.index });

    splitter.setChildren(
      this.getChildren({ x: splitterXIndex, y: this.index })
    );
  }

  protected getSplitter({ x, y }: { x: number; y: number }): Splitter {
    const key = positionToKey({ x, y });

    if (this.splitters.has(key)) {
      return this.splitters.get(key);
    }

    const splitter = new Splitter();

    this.splitters.set(key, splitter);

    return splitter;
  }

  protected getChildren({ x, y }: { x: number; y: number }): Splitter[] {
    return [
      this.getChild({ x: x - 1, y }),
      this.getChild({ x: x + 1, y }),
    ].filter(Boolean);
  }

  protected getChild({ x, y }: { x: number; y: number }): Splitter | null {
    if (x < 0) {
      return null;
    }

    if (x >= this.gridSize) {
      return null;
    }

    const yIndex = this.lines.column(x).indexOf("^");

    if (yIndex === -1) {
      return null;
    }

    return this.getSplitter({
      x,
      y: y + yIndex + 1,
    });
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

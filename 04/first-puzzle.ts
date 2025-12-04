import fs from "fs";

const input = fs.readFileSync("./04/input.txt").toString();

const lines = input.split(/\r?\n/);

enum CellType {
  Roll = "@",
}

type Point = {
  x: number;
  y: number;
};

class Cell {
  protected score = 0;

  protected type: CellType | undefined;

  public getScore(): number {
    return this.score;
  }

  public addToScore(value = 1): void {
    this.score += value;
  }

  public isMovable(): boolean {
    return this.score < 4;
  }

  public setType(type: CellType): void {
    this.type = type;
  }

  public getType(): CellType {
    return this.type;
  }

  public static generateKey({ x, y }: Point): string {
    return `${x}.${y}`;
  }
}

class Grid {
  protected width: number;
  protected height: number;

  protected map = new Map<string, Cell>();

  constructor(lines: string[]) {
    this.width = lines[0].length;
    this.height = lines.length;

    this.generateMap(lines);

    console.log(this.getCell({ x: 0, y: 0 }));
  }

  public getNumberOfFreeForklifts(): number {
    return this.map
      .values()
      .filter((e) => e.isMovable() && e.getType() === CellType.Roll)
      .toArray().length;
  }

  protected generateMap(lines: string[]): void {
    lines.forEach((line, y) => {
      line.split("").forEach((cell, x) => {
        this.getCell({ x, y }).setType(cell as CellType);

        if (cell === CellType.Roll) {
          this.incrementNeighbors({ x, y });
        }
      });
    });
  }

  protected getCell({ x, y }: Point): Cell {
    const key = Cell.generateKey({ x, y });

    if (this.map.has(key)) {
      return this.map.get(key);
    }

    const c = new Cell();

    this.map.set(key, c);

    return c;
  }

  protected incrementNeighbors({ x, y }: Point): void {
    const neighbors = this.generateNeighbors({ x, y });

    neighbors.forEach((e) => e.addToScore());
  }

  protected generateNeighbors({ x, y }: Point): Cell[] {
    const points: Point[] = [
      { x: x - 1, y: y - 1 },
      { x: x, y: y - 1 },
      { x: x + 1, y: y - 1 },
      { x: x - 1, y: y },
      { x: x + 1, y: y },
      { x: x - 1, y: y + 1 },
      { x: x, y: y + 1 },
      { x: x + 1, y: y + 1 },
    ];

    return points
      .filter(
        (point) =>
          point.x >= 0 &&
          point.y >= 0 &&
          point.x < this.width &&
          point.y < this.height
      )
      .map((p) => this.getCell(p));
  }
}

class Solver {
  protected grid: Grid;

  constructor(lines: string[]) {
    this.grid = new Grid(lines);
  }

  public solve(): number {
    return this.grid.getNumberOfFreeForklifts();
  }
}

const solver = new Solver(lines);

console.log(solver.solve());

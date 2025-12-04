import fs from "fs";

const input = fs.readFileSync("./04/input.txt").toString();

const lines = input.split(/\r?\n/);

enum CellType {
  Roll = "@",
  Empty = ".",
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
    return this.score < 4 && this.type === CellType.Roll;
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
  }

  public getNewGrid(): Grid {
    const lines: string[][] = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => "")
    );

    this.map.entries().forEach(([key, cell]) => {
      const [xString, yString] = key.split(".");
      const [x, y] = [Number(xString), Number(yString)];

      lines[y][x] = cell.isMovable() ? CellType.Empty : cell.getType();
    });

    return new Grid(lines.map((e) => e.join("")));
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
    let buffer = 0;

    let newAmount = this.grid.getNumberOfFreeForklifts();

    while (newAmount !== 0) {
      buffer += newAmount;

      this.grid = this.grid.getNewGrid();

      newAmount = this.grid.getNumberOfFreeForklifts();
    }

    return buffer;
  }
}

const solver = new Solver(lines);

console.log(solver.solve());

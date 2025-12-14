import fs from "fs";

const input = fs.readFileSync("./09/input.txt").toString();

const lines = input.split(/\r?\n/);

class Point {
  constructor(protected x: number, protected y: number) {
    //
  }

  public getX() {
    return this.x;
  }

  public getY() {
    return this.y;
  }
}

class Shape {
  protected area: number;

  constructor(protected from: Point, protected to: Point) {
    this.area = this.calculateArea();
  }

  protected calculateArea(): number {
    const xSide = Math.abs(this.from.getX() - this.to.getX()) + 1;
    const ySide = Math.abs(this.from.getY() - this.to.getY()) + 1;

    return xSide * ySide;
  }

  public getArea(): number {
    return this.area;
  }
}

class Solver {
  protected shapes: Shape[] = [];

  constructor(lines: string[]) {
    this.shapes = this.createShapes(lines);
  }

  protected createShapes(lines: string[]) {
    const points: Point[] = lines.map((line) => {
      const [x, y] = line.split(",");

      return new Point(Number(x), Number(y));
    });

    const shapes: Shape[] = [];

    while (points.length > 0) {
      let from = points.shift();

      points.forEach((to) => {
        shapes.push(new Shape(from, to));
      });
    }

    return shapes.toSorted((a, b) => b.getArea() - a.getArea());
  }

  public solve(): number {
    return this.shapes.at(0).getArea();
  }
}

const solver = new Solver(lines);

console.log(solver.solve());

import fs from "fs";

const input = fs.readFileSync("./08/input.txt").toString();

const lines = input.split(/\r?\n/);

class Circuit {
  protected junctionBoxes: Set<JunctionBox>;

  constructor(...junctionBoxes: JunctionBox[]) {
    this.junctionBoxes = new Set(junctionBoxes);

    this.junctionBoxes.forEach((e) => e.setCircuit(this));
  }

  public mergeWith(circuit: Circuit): Circuit {
    const allJunctionBoxes = [
      ...this.junctionBoxes.values().toArray(),
      ...circuit.junctionBoxes.values().toArray(),
    ];

    return new Circuit(...allJunctionBoxes);
  }

  public getSize(): number {
    return this.junctionBoxes.size;
  }

  public attach(junctionBox: JunctionBox) {
    this.junctionBoxes.add(junctionBox);
    junctionBox.setCircuit(this);
  }
}

class Distance {
  protected distance: number;

  constructor(protected from: JunctionBox, protected to: JunctionBox) {
    this.distance = from.distanceTo(to);
  }

  public getDistance(): number {
    return this.distance;
  }

  public getFrom(): JunctionBox {
    return this.from;
  }

  public getTo(): JunctionBox {
    return this.to;
  }
}

class Point {
  constructor(protected x: number, protected y: number, protected z: number) {
    //
  }

  public distanceTo(point: Point): number {
    return Math.hypot(this.x - point.x, this.y - point.y, this.z - point.z);
  }
}

class JunctionBox {
  protected circuit: Circuit | null;

  constructor(protected point: Point) {
    //
  }

  public distanceTo(junctionBox: JunctionBox): number {
    return this.point.distanceTo(junctionBox.point);
  }

  public setCircuit(circuit: Circuit) {
    this.circuit = circuit;
  }

  public getCircuit(): Circuit {
    return this.circuit;
  }
}

class ElectricalGrid {
  protected junctionBoxes: JunctionBox[];

  protected distances: Distance[];

  protected circuits: Circuit[];

  constructor(lines: string[]) {
    this.junctionBoxes = this.generateBoxes(lines);

    this.distances = this.generateDistances();

    this.circuits = this.generateCircuits();
  }

  public getCircuits(): Circuit[] {
    return this.circuits;
  }

  protected generateBoxes(lines: string[]): JunctionBox[] {
    return lines.map((line) => {
      const [x, y, z] = line.split(",").map(Number);

      return new JunctionBox(new Point(x, y, z));
    });
  }

  protected generateDistances(): Distance[] {
    const junctionBoxesToConnect = [...this.junctionBoxes];

    const distances: Distance[] = [];

    while (junctionBoxesToConnect.length > 0) {
      const newBox = junctionBoxesToConnect.shift();

      distances.push(
        ...junctionBoxesToConnect.map((e) => new Distance(newBox, e))
      );
    }

    return distances.toSorted((a, b) => a.getDistance() - b.getDistance());
  }

  protected generateCircuits(): Circuit[] {
    const toAttachToCircuit = this.distances.slice(0, 1000);

    const circuits: Circuit[] = [];

    toAttachToCircuit.forEach((distance) => {
      const fromCircuit = distance.getFrom().getCircuit();
      const toCircuit = distance.getTo().getCircuit();

      if (!fromCircuit && !toCircuit) {
        const circuit = new Circuit(distance.getFrom(), distance.getTo());

        circuits.push(circuit);
      } else if (fromCircuit && !toCircuit) {
        fromCircuit.attach(distance.getTo());
      } else if (toCircuit && !fromCircuit) {
        toCircuit.attach(distance.getFrom());
      } else if (fromCircuit && toCircuit) {
        if (fromCircuit === toCircuit) return;

        const [oldFromCircuit] = circuits.splice(
          circuits.indexOf(fromCircuit),
          1
        );

        const [oldToCircuit] = circuits.splice(circuits.indexOf(toCircuit), 1);

        const newCircuit = oldFromCircuit.mergeWith(oldToCircuit);

        circuits.push(newCircuit);
      }
    });

    return circuits.toSorted((a, b) => b.getSize() - a.getSize());
  }
}

class Solver {
  protected electricalGrid: ElectricalGrid;

  constructor(lines: string[]) {
    this.electricalGrid = new ElectricalGrid(lines);
  }

  public solve(): number {
    return this.electricalGrid
      .getCircuits()
      .slice(0, 3)
      .reduce((acc, curr) => acc * curr.getSize(), 1);
  }
}

const solver = new Solver(lines);

console.log(solver.solve());

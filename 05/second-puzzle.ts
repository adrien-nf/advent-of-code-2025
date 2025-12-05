import fs from "fs";

const input = fs.readFileSync("./05/input.txt").toString();

const lines = input.split(/\r?\n/);

class Range {
  constructor(protected start: number, protected end: number) {
    //
  }

  public includes(value: number): boolean {
    return value >= this.start && value <= this.end;
  }

  public includesFullRange(range: Range): boolean {
    return this.includesStart(range) && this.includesEnd(range);
  }

  public partiallyIncludes(range: Range) {
    return this.includesStart(range) || this.includesEnd(range);
  }

  public includesStart(range: Range) {
    return this.includes(range.start);
  }

  public includesEnd(range: Range) {
    return this.includes(range.end);
  }

  public getSize(): number {
    return this.end - this.start + 1;
  }

  public getStart(): number {
    return this.start;
  }

  public getEnd(): number {
    return this.end;
  }

  public setEarliestStart(range: Range) {
    this.start = Math.min(this.start, range.start);
  }

  public setLatestEnd(range: Range) {
    this.end = Math.max(this.end, range.end);
  }
}

class Fridge {
  protected freshRanges: Range[] = [];

  protected numberOfFreshProducts = 0;

  constructor(protected lines: string[]) {
    this.initializeRanges();
  }

  protected initializeRanges(): void {
    let line;

    do {
      line = this.lines.shift();

      if (!line) return;

      const [start, end] = line.split("-");

      const normalizedRange = this.createNormalizedRange(
        Number(start),
        Number(end)
      );

      if (normalizedRange) {
        this.freshRanges.push(normalizedRange);
      }
    } while (line !== "");
  }

  protected createNormalizedRange(start: number, end: number): Range | null {
    const range = new Range(start, end);

    const isAlreadyIncluded = this.freshRanges.some((e) =>
      e.includesFullRange(range)
    );

    if (isAlreadyIncluded) {
      return null;
    }

    // Get rid of ranges fully included in this range
    this.freshRanges = this.freshRanges.filter(
      (e) => !range.includesFullRange(e)
    );

    const partiallyIncludedIndex = this.freshRanges.findIndex((e) =>
      range.includesStart(e)
    );

    if (partiallyIncludedIndex !== -1) {
      const partiallyIncluded = this.freshRanges.at(partiallyIncludedIndex);

      this.freshRanges.splice(partiallyIncludedIndex, 1);

      range.setLatestEnd(partiallyIncluded);
    }

    const partiallyIncludedIndexEnd = this.freshRanges.findIndex((e) =>
      range.includesEnd(e)
    );

    if (partiallyIncludedIndexEnd !== -1) {
      const partiallyIncluded = this.freshRanges.at(partiallyIncludedIndexEnd);

      this.freshRanges.splice(partiallyIncludedIndexEnd, 1);

      range.setEarliestStart(partiallyIncluded);
    }

    return range;
  }

  public getNumberOfFreshProducts(): number {
    return this.freshRanges
      .map((e) => e.getSize())
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);
  }
}

class Solver {
  protected fridge: Fridge;

  constructor(lines: string[]) {
    this.fridge = new Fridge(lines);
  }

  public solve(): number {
    return this.fridge.getNumberOfFreshProducts();
  }
}

const solver = new Solver(lines);

console.log(solver.solve());

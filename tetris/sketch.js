const SIZE = 40;

const ROW_COUNT = 15;
const COLUMN_COUNT = 10;

const COLORS = ["lightblue", "red", "green", "yellow", "purple"];

// prettier-ignore
const TILES = [
  [
    0, 1, 0,
    1, 1, 1,
    0, 0, 0
  ],
  [
    1, 1,
    1, 1
  ],
  [
    1, 0, 0, 0,
    1, 0, 0, 0,
    1, 0, 0, 0,
    1, 0, 0, 0
  ],
  [
    1, 0, 0,
    1, 0, 0,
    1, 1, 0
  ],
];

let board;
let level;
let paused = false;
let highscore = 0;
let score = 0;

function setup() {
  createCanvas(400, 600);
  board = new TetrisBoard();
  level = 1;

  frameRate(1);
  board.draw();
}

function draw() {
  background(0);

  if (!paused) {
    board.update();
    score++;
  }

  board.draw();

  frameRate(Math.log2(level + 1));
}

function keyPressed() {
  if (!paused) {
    board.keyPressed();
  }

  if (keyCode == 32) {
    paused = !paused;
  }
}

class TetrisBoard {
  constructor() {
    this.reset();
  }

  reset() {
    this.board = Array.from({ length: ROW_COUNT }).map(() =>
      Array.from({ length: COLUMN_COUNT }).map(() => null),
    );
    this.tileIndex = Math.floor(Math.random() * TILES.length);
    this.nextTileIndex = Math.floor(Math.random() * TILES.length);
    this.tile = TILES[this.tileIndex];
    const size = Math.sqrt(this.tile.length);
    this.tilePosition = {
      x: Math.floor(Math.random() * (COLUMN_COUNT - size)),
      y: 0,
    };
    this.tileColorIndex = 0;
    level = 1;
    if (score > highscore) {
      highscore = score;
    }
    score = 0;
  }

  draw() {
    this.board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== null) {
          fill(COLORS[cell.color]);
          rect(x * SIZE, y * SIZE, SIZE, SIZE);
        } else {
          fill("black");
          rect(x * SIZE, y * SIZE, SIZE, SIZE);
        }
      });
    });

    // draw current tile
    const size = Math.sqrt(this.tile.length);
    for (let i = 0; i < this.tile.length; i++) {
      let cube = this.tile[i];
      if (cube) {
        fill(COLORS[this.tileColorIndex]);
        rect(
          ((i % size) + this.tilePosition.x) * SIZE,
          (Math.floor(i / size) + this.tilePosition.y) * SIZE,
          SIZE,
          SIZE,
        );
      }
    }

    this.drawScore();

    // draw next tile
    {
      const size = Math.sqrt(TILES[this.nextTileIndex].length);
      for (let i = 0; i < TILES[this.nextTileIndex].length; i++) {
        let cube = TILES[this.nextTileIndex][i];
        if (cube) {
          fill("white");
          rect(
            ((i % size) * SIZE) / 4 + 5,
            (Math.floor(i / size) * SIZE) / 4 + 5,
            SIZE / 4,
            SIZE / 4,
          );
        }
      }
    }
  }

  drawScore() {
    fill(255);
    text(highscore + "", 100, 20);
    text(score + "", 100, 40);
  }

  update() {
    if (this.tileCanMoveDown(this.tile, this.tilePosition)) {
      this.tilePosition.y++;
    } else {
      // save current tile

      const size = Math.sqrt(this.tile.length);

      for (let i = 0; i < this.tile.length; i++) {
        let cube = this.tile[i];
        if (cube) {
          if (
            this.board[Math.floor(i / size) + this.tilePosition.y] !==
              undefined &&
            this.board[Math.floor(i / size) + this.tilePosition.y][
              (i % size) + this.tilePosition.x
            ] !== undefined
          ) {
            this.board[Math.floor(i / size) + this.tilePosition.y][
              (i % size) + this.tilePosition.x
            ] = { color: this.tileColorIndex };
          }
        }
      }

      // new tile
      this.newTile();
    }

    let i = 0;
    while (i < this.board.length) {
      if (this.board[i].every((x) => x)) {
        this.board.splice(i, 1);
        this.board.unshift(
          Array.from({ length: COLUMN_COUNT }).map(() => null),
        );
        level++;
        score += 100;
      }
      i++;
    }

    if (this.board[0].some((x) => x)) {
      // lost
      // reset
      this.reset();
    }
  }

  keyPressed() {
    switch (keyCode) {
      case 37:
        {
          if (this.tileCanMoveLeft(this.tile, this.tilePosition)) {
            this.tilePosition.x--;
          }
        }
        break;
      case 39:
        {
          if (this.tileCanMoveRight(this.tile, this.tilePosition)) {
            this.tilePosition.x++;
          }
        }
        break;
      case 38:
        {
          const nextTile = this.rotateTile();
          this.tile = nextTile;
        }
        break;
      case 40:
        {
          if (this.tileCanMoveDown(this.tile, this.tilePosition)) {
            this.tilePosition.y++;
            score++;
          }
        }
        break;
    }

    this.draw();
  }

  tileCanMoveDown(tile, tilePosition) {
    const size = Math.sqrt(tile.length);
    const tileHeight =
      tile.reduceRight(
        (acc, next, index) => acc || (next && Math.floor(index / size)),
        undefined,
      ) + 1;

    if (tilePosition.y + tileHeight >= ROW_COUNT) {
      return false;
    }

    for (let cellIndex = 0; cellIndex < tile.length; cellIndex++) {
      const x = (cellIndex % size) + tilePosition.x;
      const y = Math.floor(cellIndex / size) + tilePosition.y;
      if (tile[cellIndex]) {
        if (this.board[y + 1][x]) {
          return false;
        }
      }
    }

    return true;
  }

  tileCanMoveRight(tile, tilePosition) {
    const size = Math.sqrt(tile.length);
    const tileHeight =
      tile.reduceRight(
        (acc, next, index) => acc || (next && Math.floor(index / size)),
        undefined,
      ) + 1;
    const tileEnd =
      tile.reduce((acc, next, index) => {
        if (acc === undefined || index % size > acc) {
          if (next) {
            return index % size;
          }
        }
        return acc;
      }, undefined) + 1;

    if (tilePosition.x + tileEnd >= COLUMN_COUNT) {
      return false;
    }

    for (let cellIndex = 0; cellIndex < tile.length; cellIndex++) {
      const x = (cellIndex % size) + tilePosition.x;
      const y = Math.floor(cellIndex / size) + tilePosition.y;
      if (tile[cellIndex]) {
        if (this.board[y][x + 1]) {
          return false;
        }
      }
    }

    return true;
  }

  tileCanMoveLeft(tile, tilePosition) {
    const size = Math.sqrt(tile.length);
    const tileHeight =
      tile.reduceRight(
        (acc, next, index) => acc || (next && Math.floor(index / size)),
        undefined,
      ) + 1;

    const leftStart = tile.reduce((acc, next, index) => {
      if (acc === undefined || index % size < acc) {
        if (next) {
          return index % size;
        }
      }
      return acc;
    }, undefined);

    if (tilePosition.x + leftStart <= 0) {
      return false;
    }

    for (let cellIndex = 0; cellIndex < tile.length; cellIndex++) {
      const x = (cellIndex % size) + tilePosition.x;
      const y = Math.floor(cellIndex / size) + tilePosition.y;
      if (tile[cellIndex]) {
        if (this.board[y][x - 1]) {
          return false;
        }
      }
    }

    return true;
  }

  rotateTile() {
    const size = Math.sqrt(this.tile.length);
    const nextTile = Array.from({ length: size }).map(() =>
      Array.from({ length: size }).map(() => 0),
    );

    for (let cellIndex = 0; cellIndex < this.tile.length; cellIndex++) {
      const x = cellIndex % size;
      const y = Math.floor(cellIndex / size);
      if (this.tile[cellIndex]) {
        nextTile[x][size - 1 - y] = 1;
      }
    }

    return nextTile.flatMap((a) => a);
  }

  newTile() {
    this.tileIndex = this.nextTileIndex;
    this.nextTileIndex = Math.floor(Math.random() * TILES.length);
    this.tile = TILES[this.tileIndex];
    const size = Math.sqrt(this.tile.length);
    this.tilePosition = {
      x: Math.floor(Math.random() * (COLUMN_COUNT - size)),
      y: 0,
    };
    this.tileColorIndex = (this.tileColorIndex + 1) % COLORS.length;
  }
}

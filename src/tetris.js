import { key2pos, pos2key, getShape, unrotateShape, rotateShape, shapeToPosMap, randomShapeKey } from './util';

import * as util from './util';

function now() { return Date.now(); }

function addPos(pos1, pos2) {
  return [pos1[0] + pos2[0],
          pos1[1] + pos2[1]];
}

function outOfBounds(pos, cols, rows) {
  return pos[0] < 0 || pos[0] >= cols || pos[1] >= rows;
}

function outOfBottom(pos, cols, rows) {
  // return pos[0] < 0 || pos[1] < 0 ||
  //   pos[0] >= cols || pos[1] >= rows;
  return pos[0] >= cols || pos[1] >= rows;
}

function outOfTop(pos) {
  return pos[1] < 0;
}

export const Moves = {
  rotate: 'rotate',
  down: 'down',
  left: 'left',
  right: 'right'
};

export default function Controller({ 
  cols,
  rows,
  level = 1,
  speed
}) {

  let score,
      addScore;

  let gameover = 0,
      shouldResetGame,
      userMove;

  let removeRows = [],
      animProgress;

  let tiles = {},
      current,
      next = getShape(randomShapeKey());

  let tmpCommitBlock,
      commitBlock;

  this.tiles = () => tiles;
  this.current = () => current;

  const blockTiles = (shape, x, y) => {
    return shapeToPosMap(shape).map(pos => {
      pos = addPos(pos, [x, y]);
      const key = pos2key(pos);
      if(outOfTop(pos)) {
        return null;
      }
      return {
        key,
        color: shape.color
      };      
    }).filter(_ => !!_);
  };

  const placeBlock = () => {
    if (current) {
      current.tiles = blockTiles(
        current.shape,
        current.x + current.rotateX,
        current.y + current.rotateY);
    }
  };

  this.nextBlock = () => {
    const top = -2;
    const middle = cols / 2 - 2;
    const shape = next;

    next = getShape(randomShapeKey());

    current = {
      shape,
      x: middle,
      y: top,
      rotateX: 0,
      rotateY: 0
    };
    placeBlock();
  };

  const ensureDelay = (start, fn, delay = 1000) => {
    if (now() - start > delay) {
      fn();
    }
  };

  this.move = (move) => {
    if (gameover > 0) {
      ensureDelay(gameover, () => {
        shouldResetGame = true;
      });
    } else {
      userMove = move;
    }
  };

  this.resetGame = () => {
    this.data.tiles = {};
    this.data.level = 1;
    this.data.score = 0;
    this.data.current = undefined;
    this.data.next = getShape(randomShapeKey());
    this.data.gameover = 0;
  };

  this.getSpeed = () => {
    const levelFactor = 1;

    return speed / (level * levelFactor);
  };

  const checkCollision = () => {
    function overlapCurrent(key) {
      if (tiles[key]) {
        return true;
      }
      return false;
    }

    for (var key of Object.keys(current.tiles)) {
      var tile = current.tiles[key];
      var pos = key2pos(tile.key);
      if (outOfBounds(pos, cols, rows)) {
        return true;
      }
      if (overlapCurrent(tile.key)) {
        return true;
      }
    }
    return false;
  };

  const fallBlockBase = () => {
    current.y++;
  };

  const undoFallBlockBase = () => {
    current.y--;
  };

  const fallBlock = () => {
    fallBlockBase();
    placeBlock();
    if (checkCollision()) {
      undoFallBlockBase();
      placeBlock();
      commitBlock = true;
    }
  };

  const rotateBlockBase = () => {
    current.shape = rotateShape(current.shape);
    tmpCommitBlock = commitBlock;
    commitBlock = false;
  };

  const undoRotateBlockBase = () => {
    current.shape = unrotateShape(current.shape);
    commitBlock = tmpCommitBlock;
  };

  const rotateBlock = () => {
    if (!current)
      return;
    rotateBlockBase();
    current.rotateY = 0;
    current.rotateX = 0;
    placeBlock();
    if (checkCollision()) {
      let fixed = false;
      
      for (var y = 0; y <= 2; y++) {
        current.rotateX = 0;
        current.rotateY = -y;
        if (!fixed) {
          placeBlock();
          if ((fixed = !checkCollision())) {
            break;
          }
        }

        if (!fixed) {
          placeBlock();

          for (var i = 0; i < 2; i++) {
            current.rotateX++;
            placeBlock();
            if ((fixed = !checkCollision())) {
              break;
            }
          }
        }
        if (!fixed) {
          current.rotateX = 0;
          placeBlock();
          for (i = 0; i < 2; i++) {
            current.rotateX--;
            placeBlock();
            if ((fixed = !checkCollision())) {
              break;
            }
          }
        }
        if (fixed) break;
      }

      // if (!fixed) {
      //   throw new Error("invalid rotate collision");
      // }
      if (!fixed) {
        console.log('here');
        current.rotateY = 0;
        current.rotateX = 0;
        undoRotateBlockBase();
        placeBlock();
      }
    }
  };

  const moveBlockBase = (v) => {
    current.x += v[0];
    current.y += v[1];
    tmpCommitBlock = commitBlock;
    commitBlock = false;
  };

  const undoMoveBlockBase = (v) => {
    current.x -= v[0];
    current.y -= v[1];
    commitBlock = tmpCommitBlock;
  };

  const moveBlock = (v) => {
    if (!current)
      return;

    moveBlockBase(v);
    placeBlock();
    if (checkCollision()) {
      undoMoveBlockBase(v);
      placeBlock();
    }
  };

  const fastCommit = () => {
    if (!current)
      return;

    moveBlockBase([0, 1]);
    placeBlock();
    if (checkCollision()) {
      tmpCommitBlock = true;
    }
    undoMoveBlockBase([0, 1]);
    placeBlock();
  };

  const doCommitBlock = () => {
    if (current.tiles.length === 0) {
      gameover = now();
    }

    for (var tile of current.tiles) {
      tiles[tile.key] = tile;
    }

    current = undefined;
    commitBlock = false;
  };

  const removeBlocks = () => {
    for (var row of util.allRows()) {
      const cols = util.allCols(row);

      const isFull = cols.every(pos => {
        var key = pos2key(pos);
        return !!tiles[key];
      });

      if (isFull) {
        removeRows.push(row);
      }
    }

    while(removeRows.length > 0) {

      const fallenRow = removeRows[removeRows.length - 1];
      const fallTo = fallenRow;
      const fallAmount = 1;
      
      removeRows.pop();
      for (var i in removeRows) {
        removeRows[i]++;
      }

      const cols = util.allCols(fallenRow);
      for (var pos of cols) {
        const key = pos2key(pos);
        delete tiles[key];
      }

      const sortedTiles = Object.keys(tiles)
            .sort((k1, k2) => {
              const p1 = key2pos(k1),
                    p2 = key2pos(k2);
              return p2[1] - p1[1];
            });

      for (var key of sortedTiles) {
        const pos = key2pos(key);
        if (pos[1] < fallenRow) {
          const toPos = addPos(pos, [0, fallAmount]);
          const toKey = pos2key(toPos);
          tiles[toKey] = {
            key: toKey,
            color: tiles[key].color,
            anim: key
          };
          tiles[key] = undefined;
          delete tiles[key];
        }
      }
    }
  };


  const withDelay = (fn, delay, updateFn) => {
    let lastUpdate = 0;

    return (delta) => {
      lastUpdate += delta;
      if (lastUpdate >= (delay / 16)) {
        fn();
        lastUpdate = 0;
      } else {
        if (updateFn)
          updateFn(lastUpdate / (delay / 16));
      }
    };
  };

  const maybeFallBlock = (() => {
    let lastSpeed = this.getSpeed();
    let delayFn;
    return (delta) => {
      if (!delayFn || lastSpeed !== this.getSpeed()) {
        lastSpeed = this.getSpeed();
        delayFn = withDelay(fallBlock,
                            1000 * lastSpeed);
      }
      delayFn(delta);
    };
  })();

  const maybeCommitBlock = (() => {
    let commitFn;
    
    return (delta) => {
      if (commitBlock) {
        if (!commitFn) {
          commitFn = withDelay(doCommitBlock, 500);
        }
        return commitFn(delta);
      } else {
        commitFn = undefined;
        return (() => {})();
      }
    };
  })();

  const maybeNextBlock = () => {
    if (current) {
    } else {
      addScore += 5;
      this.nextBlock();
    }
  };

  const maybeUsermove = () => {
    switch (userMove) {
    case Moves.rotate:
      rotateBlock();
      break;
    case Moves.left:
      moveBlock([-1, 0]);
      break;
    case Moves.right:
      moveBlock([1, 0]);
      break;
    case Moves.down:
      moveBlock([0, 1]);
      fastCommit();
      break;
    default:
    }
    userMove = undefined;
  };

  const maybeRemoveBlocks = () => {
    if (!current) {
      removeBlocks();
    }
  };

  const maybeClearRemovedBlocks = (() => {
    let delayFn;
    
    return (delta) => {
      if (removeRows.length > 0) {
        if (!delayFn) {
          delayFn = withDelay(() => {
            for (var key of Object.keys(tiles)) {
              delete tiles[key].anim;
            }
 
            addScore += removeRows.length * 10;
            removeRows = [];
          }, 300, (progress) => {
            animProgress = progress;
          });
        }
        delayFn(delta);
      }
    };
  })();

  const maybeUpdateScore = withDelay(() => {
    score += addScore;
    addScore = 0;
  }, 500);

  const maybeUpdateLevel = withDelay(() => {
    level++;
  }, 5000);

  const maybeEndGame = () => {
    if (gameover > 0) {
      console.log('game over');
    }
  };

  const maybeResetGame = () => {
    if (shouldResetGame) {
      shouldResetGame = false;
      this.resetGame();
    }
  };

  const maybePlayGame = (delta) => {
    maybeNextBlock();
    maybeFallBlock(delta);
    maybeCommitBlock(delta);
    maybeRemoveBlocks();
    maybeClearRemovedBlocks(delta);
    maybeUpdateLevel(delta);
    maybeUpdateScore(delta);
    maybeEndGame();
    maybeUsermove();
  };

  this.update = (delta) => {
    if (gameover > 0) {
      maybeResetGame(delta);
    } else {
      maybePlayGame(delta);
    }
  };
}

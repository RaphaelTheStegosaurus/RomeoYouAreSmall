"use strict";
//[c] CONSTANTS
const STILT_HEIGHT_MIN = 0.01;
const STILT_STAR_HEIGTH = 5;
const STILT_GROW_UP = 2;
const GAME_STATE = {
  START_MENU: 0,
  PLAYING: 1,
  PAUSED: 2,
  GAME_OVER: 3,
  YOU_WIN: 4,
  ANIMATION_INTRO: 5,
};
//[c] VARIABLES
let gameState = GAME_STATE.START_MENU;
let gameObjects = [];
let current_stilt_height;
let velocity_time = 6;
let velocity_unity = 0.1;
let bg;
//[c] FUNCIONS
class Player extends EngineObject {
  constructor(pos, stilt) {
    super(pos, vec2(4, 3));
    this.setCollision();
    this.stiltObject = new Stilt(this.pos, this);
    this.JumpSound = new Sound([, , 1e3, , , 0.5, , , , , 99, 0.01, 0.03]);
    this.tileInfo = new TileInfo(vec2(0, 0), vec2(500, 500), 1);
  }
  update() {
    cameraPos = this.pos;
    this.input();
  }
  destroy() {
    if (this.stiltObject) {
      this.stiltObject.destroy();
    }
    super.destroy();
  }
  input() {
    let move;
    let jump;
    if (isTouchDevice) {
      touchGamepadEnable = true;
      move = gamepadStick(0);
      jump = gamepadIsDown(0);
    } else {
      move = keyDirection();
      jump = keyIsDown("Space");
    }
    this.move(move.x);
    this.jump(jump);
  }
  move(vectorX) {
    this.velocity.x += vectorX * (this.groundObject ? 0.1 : 0.01);
    if (vectorX < 0) {
      this.mirror = true;
      this.tileInfo = new TileInfo(vec2(0, 0), vec2(500, 500), 1);
    } else if (vectorX > 0) {
      this.mirror = false;
      this.tileInfo = new TileInfo(vec2(0, 0), vec2(500, 500), 1);
    }
  }
  jump(isJump) {
    if (this.groundObject && isJump) {
      // this.JumpSound.play();
      this.velocity.y = 0.75;
      this.tileInfo = new TileInfo(vec2(0, 0), vec2(500, 500), 7);
    }
  }
  activateStilts() {
    this.stiltObject.grow();
  }
}
class Stilt extends EngineObject {
  constructor(pos, player) {
    super(pos, vec2(1, STILT_STAR_HEIGTH), null, 0, ORANGE);
    this.setCollision();
    this.player = player;
    this.respawnPos = pos;
    this.Cloud = new CloudParticles(this.pos.x);
    this.sound = new Sound([
      ,
      ,
      418,
      0,
      0.02,
      0.2,
      4,
      1.15,
      -8.5,
      ,
      ,
      ,
      ,
      0.7,
      ,
      0.1,
    ]);
    this.shrinkTimer = velocity_time;
    this.tileInfo = new TileInfo(vec2(0, 0), vec2(32, 32), 5);
  }
  update() {
    // if (gameState !== GAME_STATE.PLAYING) {
    //   return;
    // }
    this.pos.x = this.player.pos.x;
    this.Cloud.pos.x = this.pos.x;
    current_stilt_height = this.size.y;
    this.reduceY();
  }
  destroy() {
    if (this.Cloud) {
      this.Cloud.destroy();
    }
    super.destroy();
  }
  reduceY() {
    if (this.size.y > 0.2) {
      if (time % velocity_time === 0) {
        this.size.y = this.size.y - velocity_unity;
      }
    } else {
      if (gameState === GAME_STATE.PLAYING) {
        endGame();
      }
      this.size.y = 0.1;
    }
  }
  grow() {
    this.size.y = this.size.y + STILT_GROW_UP;
    this.pos.y = this.pos.y + STILT_GROW_UP;
    this.player.pos.y += this.player.size.y + STILT_GROW_UP;
    this.sound.play();
  }
}
class CloudParticles extends ParticleEmitter {
  constructor(posX) {
    super(
      vec2(posX, 1),
      0,
      3,
      0,
      200,
      PI,
      new TileInfo(vec2(0, 0), vec2(400, 400), 11),
      hsl(0, 0, 0, 0.5),
      hsl(0, 0, 1, 0.5),
      hsl(0, 0, 0, 0),
      hsl(0, 0, 1, 0),
      1,
      1,
      2,
      0.3,
      0.01,
      0.85,
      1,
      -0.075,
      PI,
      0.3,
      0.5,
      0,
      0,
      1
    );
  }
}
class Level extends EngineObject {
  constructor() {
    super();
    this.createGround();
  }
  createGround() {
    const pos = vec2();
    const levelSize = vec2(100, 2);
    const tileLayer = new TileCollisionLayer(
      vec2(0, -1),
      levelSize,
      new TileInfo(vec2(0, 0), vec2(40, 40), 0)
    );
    const groundLevelY = 5;
    for (pos.x = 0; pos.x < levelSize.x; pos.x++) {
      for (pos.y = 0; pos.y < groundLevelY; pos.y++) {
        tileLayer.setData(pos, new TileLayerData(1));
        tileLayer.setCollisionData(pos);
      }
    }
    tileLayer.redraw();
  }
}
class Boundary extends EngineObject {
  constructor(pos, size) {
    super(pos, size, new TileInfo(vec2(0, 0), vec2(16, 16), 0));
    this.setCollision();
    this.mass = 0;
  }
}
function gameInit() {
  new UISystemPlugin();
  gravity.y = -0.05;
  bg = tile(vec2(0, 0), vec2(585, 427), 2);
  const player = new Player(vec2(5, 6));
  new Level();
  new Boundary(vec2(0.5, 20), vec2(1, 40));
  new Boundary(vec2(100 - 0.5, 20), vec2(1, 40));
}
function gameUpdate() {}
function gameUpdatePost() {}
function gameRender() {
  drawTile(vec2(50, 20), vec2(100, 40), bg, new Color(1, 1, 1, 0.75));
}
function gameRenderPost() {}
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [
  "./tiles/tile_ground.png",
  "./tiles/player-use-stilt.png",
  "./tiles/bg.png",
  "./tiles/dog.png",
  "./tiles/tools.png",
  "./tiles/stick_stilt.png",
  "./tiles/balcony.png",
  "./tiles/player-jump.png",
  "./tiles/start.png",
  "./tiles/game_over.jpg",
  "./tiles/win_screen.png",
  "./tiles/circle_masking.svg",
]);

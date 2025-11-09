"use strict";
class Menus extends EngineObject {
  constructor() {
    super(vec2(0, 0));
    // this.container = new UIObject(vec2(500, 500), vec2(100, 100));
    // this.container.color = new Color(1, 1, 1, 0.9);
  }
  update() {
    // const MainCanvasSize = vec2(mainCanvas.width, mainCanvas.height);
    // debugText(`size ${MainCanvasSize}`, vec2(0, 0), 1, WHITE);
    // if (isTouchDevice) {
    //   touchGamepadEnable = true;
    //   cameraPos = gamepadStick(0);
    // }
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
class Player extends EngineObject {
  constructor(pos) {
    super(pos, vec2(4, 3));
    this.setCollision();
  }
  update() {
    cameraPos = vec2(
      this.getCameraPosX(this.pos.x),
      this.getCameraPosY(this.pos.y)
    );
    this.input();
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
      //   this.tileInfo = new TileInfo(vec2(0, 0), vec2(500, 500), 1);
    } else if (vectorX > 0) {
      this.mirror = false;
      //   this.tileInfo = new TileInfo(vec2(0, 0), vec2(500, 500), 1);
    }
  }
  jump(isJump) {
    if (this.groundObject && isJump) {
      //   this.JumpSound.play();
      this.velocity.y = 0.75;
      //   this.tileInfo = new TileInfo(vec2(0, 0), vec2(500, 500), 7);
    }
  }
  getCameraPosX(_posX) {
    if (_posX < 20) {
      return 19;
    } else if (_posX > 80) {
      return 81;
    } else {
      return _posX;
    }
  }
  getCameraPosY(_posY) {
    if (isTouchDevice) {
      if (_posY < 5) {
        return 5;
      } else {
        return _posY;
      }
    } else {
      if (_posY < 9) {
        return 9;
      }
      return _posY;
    }
  }
}
///////////////////////////////////////////////////////////////////////////////
function gameInit() {
  gravity.y = -0.05;
  new Level();
  new Player(vec2(2, 5));
  // called once after the engine starts up
  // setup the game
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
  // called every frame at 60 frames per second
  // handle input and update the game state
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {
  // called after physics and objects are updated
  // setup camera and prepare for render
}

///////////////////////////////////////////////////////////////////////////////
function gameRender() {
  // called before objects are rendered
  // draw any background effects that appear behind objects
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {
  // called after objects are rendered
  // draw effects or hud that appear above all objects
  //   drawTextScreen("Hello World!", mainCanvasSize.scale(0.1), 80);
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [
  "./tiles/tile_ground.png",
  "./tiles/player-idle.png",
]);

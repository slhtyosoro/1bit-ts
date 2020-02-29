import { BowUnit } from "../entity/BowUnit";
import { Unit } from "../entity/Unit";

var controls;
var marker;
var map;
var shiftKey;
var selectedTile;

export class Boot extends Phaser.Scene {
  constructor() {
      super("boot");
  }

  preload() {
      this.load.image("tiles", "assets/colored.png");
      this.load.tilemapTiledJSON("map", "assets/map.json");
      this.load.multiatlas("atlas", "assets/pack.json", "assets/");
      this.load.image("grid3", "assets/grid3.png");
  }

  create() {
      this.scene.start("main");
  }
}

export class Main extends Phaser.Scene {
  unitGroup: any[];
  constructor() {
      super("main");
  }

  preload() {}
  create() {

      this.registry.set("updateUnits", []);

      map = this.make.tilemap({ key: "map" });
      // The first parameter is the name of the tileset in Tiled and the second parameter is the key
      // of the tileset image used when loading the file in preload.
      var tiles = map.addTilesetImage("colored", "tiles");

      // You can load a layer from the map using the layer name from Tiled ('Ground' in this case), or
      // by using the layer index. Since we are going to be manipulating the map, this needs to be a
      // dynamic tilemap layer, not a static one.
      var layer = map.createDynamicLayer("bg", tiles, 0, 0);

      selectedTile = map.getTileAt(2, 3);

      marker = this.add.graphics();
      marker.lineStyle(2, 0x000000, 1);
      marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);

      this.cameras.main.setBounds(
          0,
          0,
          map.widthInPixels,
          map.heightInPixels
      );

      var cursors = this.input.keyboard.createCursorKeys();
      var controlConfig = {
          camera: this.cameras.main,
          left: cursors.left,
          right: cursors.right,
          up: cursors.up,
          down: cursors.down,
          speed: 0.5
      };
      controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

      shiftKey = this.input.keyboard.addKey(
          Phaser.Input.Keyboard.KeyCodes.SHIFT
      );

      // var help = this.add.text(16, 16, 'Left-click to paint.\nShift + Left-click to select tile.\nArrows to scroll.', {
      //     fontSize: '18px',
      //     padding: { x: 10, y: 5 },
      //     backgroundColor: '#000000',
      //     fill: '#ffffff'
      // });
      // help.setScrollFactor(0);

      // Hero
      let a = this.add.image(100, 100, "atlas", "colored_transparent-59.png");

      // create unit group
      this.unitGroup = [];

      // //Debug B
      // var b = new Unit(
      //     1,
      //     9,
      //     10,
      //     300,
      //     this.add.image(100, 100, "atlas", "colored_transparent-221.png")
      // );
      // useGui(b);
      // this.unitGroup.push(b);
      // b.setParent(this.unitGroup);
      // b.update();

      for (let i = 0; i < 8; i++) {
          let unit = new BowUnit(
              5  + i,
              15,
              10,
              200 + i * 100,
              this.add.image(100, 100, "atlas", "colored_transparent-61.png")
          );
          this.unitGroup.push(unit);
          unit.setParent(this.unitGroup);
          unit.setCamp(1);
          unit.update();
      }

      for (let i = 0; i < 8; i++) {
          let unit = new BowUnit(
              5  + i,
              25,
              10,
              200 + i * 100,
              this.add.image(100, 100, "atlas", "colored_transparent-61.png")
          );
          this.unitGroup.push(unit);
          unit.setParent(this.unitGroup);
          unit.setCamp(2);
          unit.update();
      }
      this.createUnit();
      

      this.scene.launch("tiles");
  }


  createUnit() {
      for (let i = 0; i < 5; i++) {
          let unit = new Unit(
              5  + i,
              16,
              10,
              200 + i * 100,
              this.add.image(100, 100, "atlas", "colored_transparent-28.png")
          );
          this.unitGroup.push(unit);
          unit.setParent(this.unitGroup);
          unit.setCamp(1);
          unit.update();
      }

      for (let i = 0; i < 5; i++) {
          let unit = new Unit(
              5  + i,
              24,
              10,
              200 + i * 100,
              this.add.image(100, 100, "atlas", "colored_transparent-28.png")
          );
          this.unitGroup.push(unit);
          unit.setParent(this.unitGroup);
          unit.setCamp(2);
          unit.update();
      }
  }

  update(time, delta) {
      // 更新所有需要更新的物品
      let updateUnits = this.registry.get("updateUnits");
      
      for(let i = 0; i < updateUnits.length; i++) {
          let unit = updateUnits[i];
          if(unit.isDestory) {
              updateUnits.splice(i, 1);
              i--;
          } else {
              unit.update(time, delta);
          }
      }

      // 更新控制器 
      controls.update(delta);
      var worldPoint = <Phaser.Math.Vector2>this.input.activePointer.positionToCamera(
          this.cameras.main 
      );

      // Rounds down to nearest tile
      var pointerTileX = map.worldToTileX(worldPoint.x);
      var pointerTileY = map.worldToTileY(worldPoint.y);

      // Snap to tile coordinates, but in world space
      marker.x = map.tileToWorldX(pointerTileX);
      marker.y = map.tileToWorldY(pointerTileY);

      if (this.input.manager.activePointer.isDown) {
          if (shiftKey.isDown) {
              selectedTile = map.getTileAt(pointerTileX, pointerTileY);
          } else {
              map.putTileAt(selectedTile, pointerTileX, pointerTileY);
          }
      }
  }
}

export class Tiles extends Phaser.Scene {
  markHero: any;
  graphics: Phaser.GameObjects.Graphics;
  constructor() {
      super("tiles");
  }

  create() {
      const mainScene = this.scene.get("main");
      const camera = this.cameras.main;
      this.add.rectangle(0, 0, 700, 32, 0x000000).setOrigin(0);
      this.markHero = null;
      this.graphics = this.add.graphics();
      var r3 = this.add.rectangle(-10, -10, 20, 20);
      r3.setStrokeStyle(1, 0x00ff00);
      this.graphics.lineStyle(1, 0x00ff00, 1);

      let pngIndex = [
          218,
          219,
          220,
          221,
          222,
          184,
          185,
          186,
          151,
          152,
          153,
          154,
          155,
          156,
          157,
          158,
          87,
          88,
          89,
          90,
          27,
          28,
          29,
          55,
          56,
          57,
          58,
          59,
          6
      ];
      let pngs = [];

      pngIndex.forEach((v, i) => {
          let img = this.add
              .image(16 + 24 * i, 16, "atlas", `colored_transparent-${v}.png`)
              .setInteractive();
          // key标记 image 的图像数字
          //@ts-ignore
          img.key = v;
          img.on("pointerup", () => {
              // this.graphics.strokeRect(img.x - 10, img.y - 10, img.getBounds().width + 4, img.getBounds().height + 4);
              r3.setPosition(img.x, img.y);
              this.markHero = img;
          });
          pngs.push(img);
      });

      // 增加一个点击事件
      this.input.on("pointerdown", (x, y) => {
          this.add
              .image(
                  marker.x,
                  marker.y,
                  "atlas",
                  `colored_transparent-${this.markHero.key}.png`
              )
              .setOrigin(0);
      });
  }

  update() {}
}

// 侦查范围。
// 移动冷却。

function useGui(hero) {
  //@ts-ignore
  var gui = new dat.GUI({ width: 600 });
  var folder = gui.addFolder("英雄位置");
  folder.add(hero, "x", 0, 20, 1);
  folder.add(hero, "y", 0, 20, 1);
  folder = gui.addFolder("英雄状态");
  // gui.add(hero, 'tint')
  folder = gui.addFolder("英雄属性");
  gui.add(hero, "mvTime", {
      E: 3000,
      D: 2000,
      C: 1000,
      B: 800,
      A: 600,
      S: 500,
      SS: 300,
      SSS: 200
  });
  folder = gui.addFolder("英雄介绍");
  folder.add(hero, "note");
}


// 英雄积累
// Tile 基础的 x 和 y;
export class Unit {
    
    mvTime: any;
    canMove: boolean;
    image: any;
    _x: any;
    _y: any;
    note: string;
    parent: any;
    camp: number;
    canRandom: boolean;
    hp: any;
    mp: number;
    name: string;
    view: number;
    chaos: number;
    DEX: any;
    STR: any;
    ATS: any;
    ADF: any;
    SDF: any;
    AGL: any;
    MOV: any;
    RNG: number;
    isOpenDebug: boolean;
    viewDraw: any;

    constructor(x, y, hp, mv, image) {
        this.mvTime = mv;
        this.canMove = true;
        this.image = image;
        this._x = x;
        this._y = y;
        this.x = x;
        this.y = y;
        this.note = "这是英雄简介";
        this.parent = null;
        this.camp = 0;

        // flag 
        this.canRandom = true;
        //
        this.hp = hp;
        this.mp = 0;
        this.name = "";

        this.view = 6;
        
        // 混乱度, 当随机数小于混乱度时， 发生混乱
        this.chaos = 0.2
        this.DEX;
        this.STR;
        this.ATS;
        this.ADF;
        this.SDF;
        this.DEX;
        this.AGL;
        this.MOV;
        this.RNG = 5;

        // debug
        this.isOpenDebug = true;
    }

    _debug() {
        // 创建视野debug图
        if(!this.viewDraw) {
            this.viewDraw  = this.image.scene.add.rectangle(this.image.x, this.image.y, this.view * 16 * 2, this.view * 16 * 2); 
            if(this.camp == 1) {
                this.viewDraw.setStrokeStyle(1, 0x1a65ac);
            } else if (this.camp == 2) {
                this.viewDraw.setStrokeStyle(1, 0x1a334c);
            }
        }
        // 同步位置
        this.viewDraw.setPosition(this.image.x, this.image.y);
        
    }

    setParent(parent) {
        this.parent = parent;
    }
    setCamp(camp) {
        if(camp == 2) {
            this.image.setTint(0xA0522D) 
        }
        this.camp = camp; 
    }

    _canAttakc(enemy) {
        return Math.abs(enemy.x - this.x) <= this.RNG;
    }

    attack(enemy) {

    }

    update() {
        // 记录当前位置
        this._x = this.x;
        this._y = this.y;

        // 检查是否发现了某些东西
        if(this.chaos < Math.random()) {
            // 得到东西
            let thing = this.getSomeThingInView();

            if(thing) {
                // console.log(thing);
                if(this._canAttakc(thing)) {
                    this.attack(thing);
                } else {
                    this.moveToPoint(thing.x, thing.y);
                }
                this.canRandom = false;
            } else {
                this.canRandom = true;
            }
        } else {
            this.canRandom = true;
        }
        

        // 随机移动
        if(this.canRandom) {
            this.randomMove();
        }
        
        setTimeout(() => {
            this.update();
        }, this.mvTime);

        // 防止与其他角色位置相同
        if (this._isCollideWithOtherUnit()) {
            this.x = this._x;
            this.y = this._y;
        }

        if(this.isOpenDebug) {
            this._debug();
        }
    }

    set x(value) {
        this.image.x = value * 16;
    }

    set y(value) {
        this.image.y = value * 16;
    }

    get x() {
        return this.image.x / 16;
    }
    get y() {
        return this.image.y / 16;
    }

    randomMove() {
        let rnd = Math.random();
        let width = 50;
        let height = 50;
        
        
        if (rnd > 0 && rnd < 0.25) {
            if (!this._isXOutRange(this.x + 1, 0, width)) {
                this.x += 1;
            }
        } else if (rnd > 0.25 && rnd < 0.5) {
            if (!this._isXOutRange(this.x - 1, 0, width)) {
                this.x -= 1;
            }
        } else if (rnd > 0.5 && rnd < 0.75) {
            if (!this._isYOutRange(this.y + 1, 0, height)) {
                this.y += 1;
            }
        } else if (rnd > 0.75 && rnd < 1) {
            if (!this._isYOutRange(this.y + 1, 0, height)) {
                this.y -= 1;
            }
        }
    }

    _isXOutRange(x, min, max) {
        return x < min || x > max;
    }
    _isYOutRange(y, min, max) {
        return y < min || y > max;
    }

    _isCollideWithOtherUnit() {
        for (let i = 0; i < this.parent.length; i++) {
            let unit = this.parent[i];
            if (unit != this && unit.x == this.x && unit.y == this.y) {
                return true;
            }
        }
        return false;
    }

    getSomeThingInView() {
        for(let i = 0; i < this.parent.length; i++) {
            let thing = this.parent[i];
            if(this!=thing && this.camp != thing.camp && !this._isXOutRange(thing.x, this.x - this.view, this.x + this.view) && !this._isYOutRange(thing.y, this.y - this.view, this.y + this.view)) {
                return thing;
            }
        }
        return null;
    }

    moveToPoint(x, y) {
        // rnd防止固定在一条线上
        let rnd = Math.random();
        if(rnd > 0.5) {
            if(this.x < x) {
                this.x += 1;
            } else if (this.x > x) {
                this.x -= 1;
            } else if (this.y < y) {
                this.y += 1;
            } else if (this.y > y) {
                this.y -= 1;
            }
        } else {
            if (this.y < y) {
                this.y += 1;
            } else if (this.y > y) {
                this.y -= 1;
            } else if(this.x < x) {
                this.x += 1;
            } else if (this.x > x) {
                this.x -= 1;
            } 
        }   
    }
}


export class Arrow {
    scene: any;
    form: any;
    to: any;
    fromUnit: any;
    toUnit: any;
    arrow: any;
    speed: number;
    direction: number;
    isDestory: boolean;
    xSpeed: number;
    ySpeed: number;
    outTimeEvent: NodeJS.Timeout;
    // from to 是图像坐标，  用于像素级的判断，
    constructor(from, to, fromUnit, toUnit) {
        this.scene = fromUnit.image.scene;
        this.form = from;
        this.to = to;
        this.fromUnit = fromUnit;
        this.toUnit = toUnit;
        if(fromUnit.camp == 1) {
            this.arrow = this.scene.add.rectangle(from.x, from.y, 4,4, 0x9966ff);
        } else {
            this.arrow = this.scene.add.rectangle(from.x, from.y, 4,4, 0xFF7FF00);
        }
        
        this.speed = 0.05;
        this.direction = Math.atan( (to.x-from.x) / (to.y-from.y));
        this.isDestory = false;

        if (to.y >= from.y) {
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else {
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }

        this.outTimeEvent = setTimeout(() => {
            this.destroy();
        }, 5000);
        
    }

    update(time, delta) {
        
        this.arrow.x += this.xSpeed * delta;
        this.arrow.y += this.ySpeed * delta;
        if(this.isAOnB(this.arrow, this.to)) {
            //  判断是否箭射到了
            if(this.isAOnB(this.arrow, this.toUnit.image)) {
                // 让to的生命值降低
                
            }
            this.destroy(); 
        }
        
    }

    destroy() {
        this.form = null;
        this.to = null;
        this.fromUnit = null;
        this.toUnit = null;
        this.scene = null;
        this.arrow.destroy();
        this.isDestory = true;
        clearTimeout(this.outTimeEvent);
    }

    isAOnB(A,B) {
        return Math.abs(A.x - B.x) < 8 && Math.abs(A.y - B.y) < 8
    }
}
import { Unit } from './Unit';
import { Arrow } from './Arrow';


export class BowUnit extends Unit {
    image: any;
    constructor(x, y, hp, mv, image) {
        super(x,y,hp, mv, image);
    }
    attack(enemy) {
        
        let bow = new Arrow({x: this.image.x, y: this.image.y}, {x: enemy.image.x, y: enemy.image.y}, this, enemy);
        
        this.image.scene.registry.get("updateUnits").push(bow);
        
    }
}

import GameNode from "../../Wolfie2D/Nodes/GameNode";
import BattlerAI from "../AI/BattlerAI";
import Weapon from "./items/Weapon";

export default class BattleManager {
    players: Array<BattlerAI>;

    enemies: Array<BattlerAI>;

    handleInteraction(attackerType: string, weapon: Weapon) {
        //may be unneeded since we are controlling the player - 
        //we determine enemy collision there
        
        if (attackerType === "player") {
            // Check for collisions with enemies
            if(this.enemies.length != 0){
                for (let enemy of this.enemies) {
                    if (weapon.hits(enemy.owner)) {
                        enemy.damage(weapon.type.damage);
                        
                        //console.log("enemy took dmg");
                    }
                }
            }
        } else {
            // Check for collision with player
            for (let player of this.players) {
                if (weapon.hits(player.owner)) {
                    player.damage(weapon.type.damage);
                }
            }
        }
        

    }

    setPlayers(player: Array<BattlerAI>): void {
        this.players = player;
    }

    setEnemies(enemies: Array<BattlerAI>): void {
        this.enemies = enemies;
    }

    addEnemy(enemy : BattlerAI){
        this.enemies.push(enemy);
    }

    removeEnemy(enemy : BattlerAI){
       
        
        this.enemies = this.enemies.filter(item => item !== enemy)
        if(this.enemies.length == 0){
            this.enemies = new Array();
        }
        return this.enemies;
          
    }
}
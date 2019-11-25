/* tslint:disable */

import {
    Sprite,
    Container,
    Application,
    Rectangle,
    Graphics,
    DisplayObject,
    Text,
} from "pixi.js";

const app: Application = new Application(1000, 512);
document.body.appendChild(app.view);

const speed: number = 1;

// Sets up background
let background: Sprite = Sprite.fromImage("./background.jpg");
background.scale.x = 2.75;
background.scale.y = 3.5;
app.stage.addChild(background);

// Sets up player properties

let player: Sprite = Sprite.fromImage("./player.png");
player.scale.x = 0.12;
player.scale.y = 0.12;
player.x = 40;
player.y = 350;
let playerHealth = 100;
app.stage.addChild(player);

// Sets up sword properties

let sword: Sprite = Sprite.fromImage("./sword.png")
sword.scale.x = .3;
sword.scale.y = .3;
sword.x = 180;
sword.y = 400;
app.stage.addChild(sword);


// Sets up villain properties

let villain: Sprite = Sprite.fromImage("./Boss.png");
villain.scale.x = 1;
villain.scale.y = .8;
villain.x = 600;
villain.y = 150;
let villainHealth = 500;
app.stage.addChild(villain);

// Globally-used variables

let velocity = 0;
let isAlive = true;
let jumping = false;
let count = 0;
let rushState = false;
let jumpState = false;
let bulletState = false;
let villainStop = false;
let left = false;
let right = false;

// Controls for movement
const LEFT: number = 37;
const UP: number = 38;
const RIGHT: number = 39;
const STEP: number = 7;

let leftPressed = false;
let rightPressed = false;
let upPressed = false;


window.onkeydown = (e: KeyboardEvent): void => {
    if (e.keyCode === LEFT) {
        leftPressed = true;
    }
    if (e.keyCode === UP && !jumping) {
        upPressed = true;
    }
    if (e.keyCode === RIGHT) {
        rightPressed = true;
    }
};

window.addEventListener('keyup', (e: KeyboardEvent): void => {
    if (e.keyCode === LEFT) {
        leftPressed = false;
    } else if (e.keyCode === UP) {
        upPressed = false;
    } else if (e.keyCode === RIGHT) {
        rightPressed = false;
    }
},                      false);

// Creates health bar (Player)

let greenBar: Sprite = Sprite.fromImage("./healthBar.png")
greenBar.y = 0;
greenBar.x = 0;
greenBar.width = 500;
greenBar.height = 20;

// Creates health bar (Boss)

let redBar: Sprite = Sprite.fromImage("./redBar.png")
redBar.anchor.set(1,0);
redBar.y = 0;
redBar.x = 1000;
redBar.width = 500;
redBar.height = 20;

app.stage.addChild(greenBar);
app.stage.addChild(redBar);

// Determines if 2 objects are colliding

let isColliding = (a: DisplayObject, b: DisplayObject): boolean => {
    let ab: Rectangle = a.getBounds();
    let bb: Rectangle = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
};

// Determines if player is jumping

let onGround = (): boolean => {
    if (player.y <= 350) {
        return false;
    } else {
        return true;
    }
};

// Changes player health for damage taken

let playerDamaged = (): void => {
    playerHealth -= 25;
    greenBar.width -= 125;
};

// Changes boss health for damage taken

let bossDamaged = (): void => {
    villainHealth -= 10;
    redBar.width -= 10;
}

// Creates Bullet class for Bullet Hell attack

class Bullet {
    sprite: Sprite;
    direction: number = 1;
    constructor(sprite: Sprite) {
        this.sprite = sprite;
    }
}

// Below are the boss attacks

let bossAttack = (input : number): void => {
    if (input >= 0 && input <= 0.33) {
        bulletState = true;
    } else if (input >= 0.34 && input <= 0.66) {
        rushState = true;
    } else {
        jumpState = true;
    }
};

// Bullet Hell Attack Function

let bullets : Bullet [] = [];
    for (let i = 0; i < 4; i++) {
        let sprite = Sprite.fromImage("./blast.png");
        sprite.scale.x = 0.2;
        sprite.scale.y = 0.2;
        sprite.x = 1000;
        sprite.y = 350;
        let bullet = new Bullet(sprite);
        bullets.push(bullet);
        app.stage.addChild(bullet.sprite)
    }

// Controls winner screen

let message: Text = new Text("You won!!! Reload the Browser Page to play again!");
let messageBox: Graphics = new Graphics();

// Function for winner protocols

let handleWin = (): void => {
    message.x = 216;
    message.y = 236;
    message.style.fill = 0xffffff;
    messageBox.beginFill(0x4444aa, 0.4);
    messageBox.drawRect(0, 0, 600, 50);
    messageBox.x = 256 - 45;
    messageBox.y = 256 - 25;
    app.stage.addChild(messageBox);
    app.stage.addChild(message);
};

// Controls loser screen

let loser: Text = new Text("Game Over! Reload the Browser Page to play again!");
let loserBox: Graphics = new Graphics();

// Function for loser protocols

let handleLoss = (): void => {
    loser.x = 216;
    loser.y = 236;
    loser.style.fill = 0xffffff;
    loserBox.beginFill(0x4444aa, 0.4);
    loserBox.drawRect(0, 0, 625, 50);
    loserBox.x = 256 - 45;
    loserBox.y = 256 - 25;
    app.stage.addChild(loserBox);
    app.stage.addChild(loser);
};

// Ticker

app.ticker.add((delta: number): void => {

    // Controls DPS of boss and player

        if (count % 30 === 0) {
            if (isColliding(sword, villain)) {
                bossDamaged();
                villain.alpha = 0.8;
            } else if (!isColliding(sword, villain)) {
                villain.alpha = 1;
            }
            if (isColliding(player, villain)) {
                playerDamaged();
                player.alpha = 0.8;
            } else if (!isColliding(player, villain)) {
                player.alpha = 1;
            }
            
        }

    if (count % 15 === 0) {
        if (isColliding(bullets[0].sprite, player) || isColliding(bullets[1].sprite, player) || isColliding(bullets[2].sprite, player) || isColliding(bullets[3].sprite, player)) {
            playerDamaged();
            player.alpha = 0.8;
        }
    }

        if (count % 300 === 100) {
            bossAttack(Math.random());
        }
        
    // Sets window boundaries

        if (player.x <= 0) {
            player.x = 0;
            sword.x = 140;
        } else if (player.x >= 900) {
            player.x = 900;
            sword.x = 1040;
        }
        if (player.y <= 0) {
            player.y = 0;
            sword.y = 50;
        }

        count++;
    
    // Creates gravity and controls

    if (isAlive) {
    if (leftPressed === true) {
        player.x -= STEP;
        sword.x -= STEP;
    }
    if (rightPressed === true) {
        player.x += STEP;
        sword.x += STEP;
       
    }
    if (upPressed === true) {
        player.y -= STEP;
        sword.y -= STEP;
        jumping = true;
        velocity = -5;
    }
}
    if (jumping === true && !onGround()) {
        velocity += 1;
    } else if (onGround()) {
        jumping = false;
        velocity = 0;
    }
        player.y += velocity;
        sword.y += velocity;

    // Controls win/loss conditions

    if (villainHealth <= 0) {
            handleWin();
        } else if (playerHealth <= 0) {
            isAlive = false;
            handleLoss();
        }

})


app.ticker.add((delta: number): void => {

    if (rushState) {

        right = true;

            if (villain.x < 1100 && right) {
                villain.x += 10;
            }

            if (villain.x === 1100) {
                right = false;
                left = true;
            }

            if (villain.x > -500 && left) {
                villain.x -= 20;
            }
             
            if (villain.x === -500) {
            villain.x = 1200;
            villainStop = true;
            }

            if (villain.x > 600 && villainStop) {
                villain.x -= 5;
            }
            
            if (villain.x === 600 && villainStop) {
            villainStop = false;
            left = false;
            rushState = false;
            }
    
        } else if (jumpState) {
            
            left = true;

            if (villain.y > -600 && left) {
                villain.y -= 10;
            }
    
            if (villain.y === -600 && left) {
                left = false;
                villainStop = true;
                villain.x = 40;
            }

            if (villain.y < 150 && villainStop) {
                villain.y += 20;
            }

            if (villain.y === 150 && villainStop) {
                villainStop = false;
                right = true;
            }
    
            if (villain.x < 600 && right) {
                villain.x += 10;
                villain.y -= 10;
            }

            if (villain.x === 600 && right) {
                right = false;
                villainStop = true;
            }
    
            if (villain.y < 150 && villainStop) {
                villain.y += 10;
            }

            if (villain.y === 150 && villain.x === 600) {
                villainStop = false;
                jumpState = false;
                right = false; 
                left = false;
            }
    
        } else if (bulletState) {

            left = true;
    
            if (left && bullets[1].sprite.x > -100) {
                bullets[1].sprite.x -= 20;
            }
            if (left && bullets[1].sprite.x === -100) {
                bullets[1].sprite.x = 1000;
                left = false;
                right = true;
            }
            if (right && bullets[2].sprite.x > -100) {
                bullets[2].sprite.x -= 20;
            }
            if (right && bullets[2].sprite.x === -100) {
                bullets[2].sprite.x = 1000;
                left = true;
                right = false;
                villainStop = true;
            }

        if (villainStop && !right) {
            left = false;
            villainStop = false;
            bulletState = false;
            right = false;
        }
        }
})
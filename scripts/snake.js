class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this._init();
    }

    _init() {
        this.snake = [];
        this.box = 32;
        this.background = new Image();
        this.foodImg = new Image();
        this.food = {};
        this.speed = 100;
        this.direction = "RIGHT";
        this.score = 0;
        this.interval;
        this.canvas.width = 608;
        this.canvas.height = 608;
        this.background.src = './images/ground.png';
        this.foodImg.src  = './images/food.png';
        this.food = {
            x: (Math.floor(Math.random() * 17 + 1)) * this.box,
            y: Math.floor((Math.random() * 15 + 3)) * this.box,
        };
        this.snake[0] = {
            x: 9*this.box,
            y:9*this.box
        };
        this.snake[1] = {
            x: 8*this.box,
            y:9*this.box
        };
        this.background.addEventListener('load',() => {
            this.ctx.drawImage(this.background,0,0);
        });
        document.addEventListener('keydown', event => {
            switch (true) {
                case (event.key === 'ArrowUp' && this.direction !== 'BOTTOM') : this.direction = 'TOP'; break;
                case (event.key === 'ArrowDown' && this.direction !== 'TOP') : this.direction = 'BOTTOM'; break;
                case (event.key === 'ArrowLeft' && this.direction !== 'RIGHT') : this.direction = 'LEFT'; break;
                case (event.key === 'ArrowRight' && this.direction !== 'LEFT') : this.direction = 'RIGHT'; break;
            }
        });
    }

    _draw() {
        this.ctx.drawImage(this.background,0,0);
        this.ctx.drawImage(this.foodImg,this.food.x, this.food.y);
        this.ctx.fillText(this.score,3*this.box,1.6* this.box);
        this.ctx.font = "45px Changa one";
        this.snake.forEach((item, index) => {
            this.ctx.fillStyle = index === 0 ? 'WHITE' : "BLACK";
            this.ctx.fillRect(item.x,item.y,this.box,this.box);
            this.ctx.strokeStyle = index === 0 ? 'RED' : "GREEN";
            this.ctx.strokeRect(item.x, item.y, this.box,this.box);
        });
        const newHead = {
            x: this.snake[0].x,
            y: this.snake[0].y
        };
        switch (this.direction) {
            case "RIGHT": newHead.x += this.box; break;
            case "LEFT": newHead.x -= this.box; break;
            case "TOP": newHead.y -= this.box; break;
            case "BOTTOM": newHead.y += this.box; break;
        }
        this._collision(newHead);
        if (newHead.x !== this.food.x || newHead.y !== this.food.y) {
            this.snake.pop();
        } else  {
            this.food = {
                x: (Math.floor(Math.random() * 17 + 1)) * this.box,
                y: Math.floor((Math.random() * 15 + 3)) * this.box,
            }
            this.score++;
        }
        this.snake.unshift(newHead);
    }

    _collision(newHead) {
        this.snake.forEach((item, index) => {
            if (index !== 0) {
                if ((newHead.x === item.x && newHead.y === item.y)
                    || newHead.x < this.box || newHead.x >= 18*this.box
                    || newHead.y < 3*this.box || newHead.y >= 18*this.box) {
                    if (this.interval) clearInterval(this.interval);
                }
            }
        });
    }

    reset() {
        if (this.interval) clearInterval(this.interval);
        this._init();
        this.start();
    }

    start() {
       this.interval =  setInterval(() => {
           this._draw();
       },this.speed);
    }
}


const canvas = document.getElementById('snakeGame');
const game = new Game(canvas);
document.getElementById('reset').addEventListener('click', () => {
   game.reset();
});
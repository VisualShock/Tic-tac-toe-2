//(function () {
const Init = {
    crossImg: document.getElementById('crossImg'),
    zeroImg: document.getElementById('zeroImg'),
    canvas: document.getElementById('canvas'),
    marks: document.getElementById('marks'),
    buttonName: document.getElementById('buttonName'),
    preloader: document.getElementById('preloader'),
    ctx: this.canvas.getContext('2d'),
    buttonStart: document.getElementById('start'),
    name: "",
    mark: '',
    sessionId: '',
    canWeMove: false,
    url: "https://ttt-practice.azurewebsites.net/",
    headers: new Headers(),
    positions: {
        0: {
            pos: [10, 10],
            mark: false,
        },
        1: {
            pos: [120, 10],
            mark: false,
        },
        2: {
            pos: [230, 10],
            mark: false,
        },
        3: {
            pos: [10, 120],
            mark: false,
        },
        4: {
            pos: [120, 120],
            mark: false,
        },
        5: {
            pos: [230, 120],
            mark: false,
        },
        6: {
            pos: [10, 230],
            mark: false,
        },
        7: {
            pos: [120, 230],
            mark: false,
        },
        8: {
            pos: [230, 230],
            mark: false,
        },

    },

}

class Game {
    constructor() {
        this.init = Init;
        this.init.canvas.addEventListener('click', this.clickOnCanvas.bind(this));
    }

    startGame() {

        let promis = new Promise((resolve) => {

            this.init.buttonStart.addEventListener('click', function start() {
                document.getElementById('start').style.display = 'none';
                document.getElementById('name').style.visibility = 'visible';
            });
            resolve(this);
        });
        promis.then(
            this.setName.bind(this),
            error => alert("Rejected: " + error.message)
        ).then(name => {
            console.log('befor=', name);
            this.saveName(name);
        }).then(() => {

            this.showСhoice();
            this.setMark();
        }).then(() => {

            return this.getId();
        }).then((json) => {
                this.init.sessionId = json.data.id;
                //console.log(json.data.id, ' ', json.data.canMove);
                //console.log(json);
                if (json.data.canMove != true) {
                    this.init.canWeMove = false;
                    this.waitMove();
                } else {
                    this.init.canWeMove = true;

                }

            },
            error => {
                alert("Ошибка: " + json.status);
                return error.json();
            }
        )

    }

    saveName(name) {
        this.init.name = name;
    }

    makeMove(NOS) {

        return fetch(this.init.url + "makeMove", {
            method: "POST",
            body: JSON.stringify({move: +NOS, id: this.init.sessionId, name: this.init.name}),
            headers: this.init.headers

        });
    }

    waitMove() {
        console.log('в waitMove sessionId=', this.init.sessionId);
        return fetch(this.init.url + "waitMove", {
            method: "POST",
            body: JSON.stringify({name: this.init.name, id: this.init.sessionId}),
            headers: this.init.headers
        })
    }

    setName() {
        let playerName = this.init.name;
        //console.log('playerName=',playerName);
        let promis = new Promise((resolve) => {
            document.getElementById('buttonName').addEventListener('click', function getName() {
                let name = document.getElementById('inputName').value;
                if (name != '') {
                    document.getElementById('name').style.display = 'none';
                    resolve(name);
                }

            });

            if (playerName != '') {
                document.getElementById('name').style.display = 'none';
                resolve(playerName);
            }
        }, () => console.log('ups'));
        return promis;
    }

    getId() {
        this.init.headers.append("Content-type", "application/json");
        return fetch(this.init.url + "start" + `?name=${this.init.name}`)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
            })
            .catch(() => {
                alert("Ошибка d getId:");
            });

    }

    showСhoice() {
        this.init.marks.style.visibility = 'visible';
    }

    setMark(e) {
        function mark(e) {

            if (this.init.mark === '') {
                if (e.target.id === 'crossImg') {
                    this.init.mark = 'cross';
                    e.target.src = "./img/crossSelected.PNG";
                } else {
                    this.init.mark = 'zero';
                    e.target.src = "./img/zeroSelected.PNG";
                }

                setTimeout(() => {
                    this.init.marks.style.display = 'none';
                    this.drowField.call(this);
                    this.init.canvas.style.visibility = 'visible';
                }, 500);
            }
        }

        let promis = new Promise((resolve) => {
            document.getElementById('crossImg').addEventListener('click', mark.bind(this));
            document.getElementById('zeroImg').addEventListener('click', mark.bind(this));
            if (this.init.mark != '') {
                resolve();
            }

        });
        return promis;
    }

    drowField() {
        let positions = this.init.positions;
        this.init.ctx.fillStyle = '#AFEEEE';
        for (let prop in this.init.positions) {
            this.init.ctx.fillRect(positions[prop]['pos'][0], positions[prop]['pos'][1], 100, 100);
        }
    }

    gameOver(n) {
        let onceMore;
        setTimeout(() => {
            switch (n) {
                case 1:
                    alert('Вы выиграли');
                    break;
                case 2:
                    alert('Ничья');
                    break;
                case 0:
                    alert('Вы проиграли');
            }
            onceMore = confirm('Играем еще?');
            if (onceMore) {
                this.newGame();
            }
        }, 550);
    }

    newGame() {
        let pos = this.init.positions;

        this.init.canWeMove = false;
        this.init.canvas.style.visibility = "hidden";
        this.init.mark = '';
        this.init.marks.style.display = 'flex';
        this.init.marks.style.visibility = 'hidden';


        document.getElementById('crossImg').src = "./img/cross.PNG";
        document.getElementById('zeroImg').src = "./img/zero.PNG";

        for (let item in pos) {
            pos[item]['mark'] = false;
        }
        this.startGame();
        // this.setMark();

        //this.showСhoice();

    }

    clickOnCanvas(e) {
        function drawCross(numberOfSquare) {
            this.init.ctx.strokeStyle = '#BB8FCE';
            this.init.ctx.beginPath();
            this.init.ctx.moveTo(positions[numberOfSquare]['pos'][0] + 25, positions [numberOfSquare]['pos'][1] + 25);
            this.init.ctx.lineTo(positions[numberOfSquare]['pos'][0] + 75, positions [numberOfSquare]['pos'][1] + 75);
            this.init.ctx.moveTo(positions[numberOfSquare]['pos'][0] + 25, positions [numberOfSquare]['pos'][1] + 75);
            this.init.ctx.lineTo(positions[numberOfSquare]['pos'][0] + 75, positions [numberOfSquare]['pos'][1] + 25);
            this.init.ctx.stroke();
            this.init.positions[numberOfSquare]['mark'] = true;
        }

        function drawZero(numberOfSquare) {
            this.init.ctx.strokeStyle = "#4682B4";
            this.init.ctx.beginPath();
            this.init.ctx.arc(positions[numberOfSquare]['pos'][0] + 50, positions [numberOfSquare]['pos'][1] + 50, 30, 0, Math.PI * 2, true);
            this.init.ctx.stroke();
            this.init.positions[numberOfSquare]['mark'] = true;
        }

        let positions = this.init.positions;
        let x = Math.ceil(e.offsetX / 110);
        let y = Math.ceil(e.offsetY / 110);
        let numberOfSquare = x - 1 + 3 * (y - 1);

        this.init.ctx.lineWidth = 5;
        if (this.init.canWeMove === true && this.init.positions[numberOfSquare]['mark'] === false) {
            this.init.canWeMove = false;
            console.log(this.init.sessionId, ' ', 'numberOfSquare=', numberOfSquare);
            this.makeMove(numberOfSquare).then((response) => {
                    console.log('makeMove=', response);
                    return response.json()
                }, error => {
                    alert("Ошибка: " + json.status);
                }
            )
                .then((json) => {
                    console.log('json=', json);
                    if (json.data) {
                        console.log('json.data=', json.data);
                        if (this.init.positions[json.data.move]['mark'] === false) {
                            if (this.init.mark === 'cross') {
                                drawCross.call(this, numberOfSquare);
                            } else {
                                drawZero.call(this, numberOfSquare);
                            }
                        }
                        if ('win' in json.data) {
                            this.gameOver(json.data.win);
                        }
                    }
                })
                .then(() => {
                    this.init.preloader.classList.toggle('active');
                    return this.waitMove();
                }).then((resp) => {
                this.init.preloader.classList.toggle('active');

                return resp.json()
            }, error => {
                alert("Ошибка: " + error.status);
            }).then((json) => {
                console.log(json);
                if (json.data) {
                    this.init.canWeMove = true;
                    if (this.init.positions[json.data.move]['mark'] === false) {
                        if (this.init.mark === 'cross') {
                            drawZero.call(this, json.data.move);
                        } else {
                            drawCross.call(this, json.data.move);
                        }
                    }
                    if ('win' in json.data) {
                        this.gameOver(json.data.win);
                    }

                }
            })
        }
    };
}

let game = new Game();
game.startGame();


//}());
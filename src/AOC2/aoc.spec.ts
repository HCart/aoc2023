import {describe, expect, it} from "vitest";
import * as fs from 'fs';

function readGames(fileName: string): Game[] {
    const stringGames = fs.readFileSync('src/AOC2/' + fileName, 'utf8').toString().split('\n');
    let games: Game[] = [];

    for(const stringGame of stringGames) {
        games.push(new Game(stringGame));
    }

    return games;
}

enum Color {
    red = 'red',
    green = 'green',
    blue = 'blue',
}

class Game {
    id!: number;
    cubesDraw: CubesDraw[] = [];
    minRed: number = 0;
    minBlue: number = 0;
    minGreen: number = 0;

    constructor(stringGame: string) {
        const gameInfo = stringGame.split(': ');
        // @ts-ignore
        this.id = parseInt(gameInfo[0].match(/\d+/));

        const stringDraws = gameInfo[1].split('; ');
        for(const stringDraw of stringDraws) {
            const cubesDraw = new CubesDraw(stringDraw);
            this.cubesDraw.push(cubesDraw);
            this.initMinColors(cubesDraw);
        }
    }

    isGamePossible(redMax: number, greenMax: number, blueMax: number) {
        for(const cubeDraw of this.cubesDraw){
            if(this.isImpossibleDraw(cubeDraw, blueMax, greenMax, redMax)) {
                return 0;
            }
        }

        return this.id;
    }

    private isImpossibleDraw(cubeDraw: CubesDraw, blueMax: number, greenMax: number, redMax: number) {
        return cubeDraw.blueCubes > blueMax || cubeDraw.greenCubes > greenMax || cubeDraw.redCubes > redMax;
    }

    private initMinColors(cubesDraw: CubesDraw) {
        if(cubesDraw.redCubes > this.minRed) {
            this.minRed = cubesDraw.redCubes;
        }
        if(cubesDraw.greenCubes > this.minGreen) {
            this.minGreen = cubesDraw.greenCubes;
        }
        if(cubesDraw.blueCubes > this.minBlue) {
            this.minBlue = cubesDraw.blueCubes;
        }
    }

    getMinimalPower() {
        return this.minBlue * this.minGreen * this.minRed;
    }
}

/*class Cubes {
    color: Color
    quantity: number;

    constructor(cubeInput: string) {
        this.quantity = parseInt(cubeInput.substring(0, cubeInput.indexOf(' ')));
        // @ts-ignore
        this.color = Color[cubeInput.substring(cubeInput.indexOf(' ') + 1)];
    }
}*/

class CubesDraw {
    redCubes: number = 0;
    greenCubes: number= 0;
    blueCubes: number = 0;

    constructor(stringDraws: string) {
        const draws = stringDraws.split(', ');
        for(const stringCubes of draws) {
            const quantity = parseInt(stringCubes.substring(0, stringCubes.indexOf(' ')));
            // @ts-ignore
            const color = Color[stringCubes.substring(stringCubes.indexOf(' ') + 1)];

            this.setQuantity(color, quantity);
        }
    }

    private setQuantity(color: Color, quantity: number) {
        if (color.valueOf() === Color.red) {
            this.redCubes = quantity;
        } else if (color.valueOf() === Color.green) {
            this.greenCubes = quantity;
        } else {
            this.blueCubes = quantity;
        }
    }

    /*getNumberByColor(color: Color){
        return this.cubes.find(cubes => cubes.color.valueOf() === color).quantity;
    }*/
}

describe('Cube conundrum', () => {
    it("Should read a cube draw", () => {
        const cubesDraw = new CubesDraw('15 red, 1 blue, 2 green')        

        expect(cubesDraw.redCubes).toEqual(15);
        expect(cubesDraw.greenCubes).toEqual(2);
        expect(cubesDraw.blueCubes).toEqual(1);
    });

    it("Should read a game", () => {
        const game = new Game('Game 10: 7 blue, 9 red, 1 green; 8 green; 10 green, 5 blue, 3 red; 11 blue, 5 red, 1 green');

        expect(game.id).toEqual(10);
        expect(game.cubesDraw[0].redCubes).toEqual(9);
        expect(game.cubesDraw[0].greenCubes).toEqual(1);
        expect(game.cubesDraw[0].blueCubes).toEqual(7);
        expect(game.cubesDraw[3].redCubes).toEqual(5);
        expect(game.cubesDraw[3].greenCubes).toEqual(1);
        expect(game.cubesDraw[3].blueCubes).toEqual(11);
    });

    it("Should be impossible draw", () => {
        const game = new Game('Game 10: 7 blue, 9 red, 1 green');
        expect(game.isGamePossible(1, 1 ,1)).toBeFalsy();
    });

    it("Should be possible draw", () => {
        const game = new Game('Game 10: 7 blue, 9 red, 1 green; 8 green; 10 green, 5 blue, 3 red; 11 blue, 5 red, 1 green');
        expect(game.isGamePossible(9, 10 ,11)).toBeTruthy();
    });

    it("should get correct total", () => {
        const games = readGames('input2.txt');
        let sum = 0;
        games.forEach(game => {
            sum += game.isGamePossible(12, 13, 14);
        });
        expect(sum).toEqual(8);
    });

    it("should get correct minimal power for one game", () => {
        const game = new Game('Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green');
        expect(game.getMinimalPower()).toEqual(48);
    });

    it("should get correct minimal power for multiple games", () => {
        const games = readGames('input2.txt');
        let sum = 0;
        games.forEach(game => {
            sum += game.getMinimalPower();
        });
        expect(sum).toEqual(2286);
    });

    it("exec input", () => {
        const games = readGames('input.txt');
        let sum = 0;
        let sumMinPower = 0;
        games.forEach(game => {
            sum += game.isGamePossible(12, 13, 14);
            sumMinPower += game.getMinimalPower();
        });
        console.log("sum id: " + sum);
        console.log("min power: " + sumMinPower);
    });
});
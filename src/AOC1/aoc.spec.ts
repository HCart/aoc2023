import {describe, expect, expectTypeOf, it} from "vitest";
import * as fs from 'fs';

function readFirstAndLastNumber(code: String): number {
    const stringNumber = code.replace(/\D/g, "");
    return +(stringNumber.charAt(0) + stringNumber.charAt(stringNumber.length - 1));
}

function readFile(fileName: string): string[] {

    return fs.readFileSync(fileName, 'utf8').toString().split('\n');
}

function readLiteralNumbers(code: string): string {
    Object.keys(Numbers).filter((item) => {
        if(isNaN(Number(item))) {
            // @ts-ignore
            code = code.replace(new RegExp(item, 'g'), Numbers[item]);
        }
    });
    return code;
}

function trebuchet(fileName: string) {
    const stringList = readFile('src/AOC1/' + fileName);

    return stringList
        .map(code => readLiteralNumbers(code))
        .map(codeWithoutLiterals => readFirstAndLastNumber(codeWithoutLiterals))
        .reduce((sum, current) => sum + current, 0);
}

enum Numbers {
    oneight=18,
    twone=21,
    eightwo=82,
    nineeight=98,
    one = 1,
    two = 2,
    three= 3,
    four= 4,
    five= 5,
    six= 6,
    seven= 7,
    eight= 8,
    nine= 9,
}
describe('Trebuchet', () => {
    it("should read number String", () => {
        expect(readFirstAndLastNumber("23")).toEqual(23);
    });

    it("should read number String with letters", () => {
        expect(readFirstAndLastNumber("a2b3c")).toEqual(23);
    });

    it("should read empty number as 0", () => {
        expect(readFirstAndLastNumber("")).toEqual(0);
    });

    it("should decode the total", () => {
        const sum = trebuchet('input.txt');
        expectTypeOf(sum).toMatchTypeOf<number>()
        console.log(sum)
    });

    it("should turns literal numbers to real numbers", () => {
        expect(readLiteralNumbers('onetwoab2one')).toEqual('12ab21');
    });

    it("should read number String with letters and literal number", () => {
        expect(readFirstAndLastNumber(readLiteralNumbers("oneaaa2bbtwob35c"))).toEqual(15);
    });

    it("should read number String with letters and literal number 2", () => {
        expect(readFirstAndLastNumber(readLiteralNumbers("eightbpsqrkzhqbhjlrxmzsixvvmgtrseventwo7oneightjbx"))).toEqual(88);
    });

    it("should read number String with letters and literal number", () => {
        expect(readFirstAndLastNumber(readLiteralNumbers("oneaaa2bbtwob35c"))).toEqual(15);
    });

    it("should decode the total of a smaller file", () => {
        const sum = trebuchet('input2.txt');
        expect(sum).toEqual(352);
    });

    it("should decode the total of a smaller file 2", () => {
        const sum = trebuchet('input3.txt');
        expect(sum).toEqual(281);
    });
});


import { Direction } from '../enums/direction.enum';
import { Position } from '../interfaces/position.interface';
import { Step } from '../interfaces/step.interface';
import { ERRORS } from './errors';
import {
    CORNER_CHARACTER,
    END_CHARACTER,
    HORIZONTAL_CHARACTER,
    NO_PATH_CHARACTER,
    START_CHARACTER,
    VERTICAL_CHARACTER,
} from './constants';

export function findCharacterPosition(matrix: string[][], char: string): Position | null {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] === char) return { x, y };
        }
    }
    return null;
}

export function hasMultipleOccurrences(matrix: string[][], char: string): boolean {
    let count = 0;
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            if (matrix[x][y] === char) {
                count++;
                if (count > 1) return true;
            }
        }
    }
    return false;
}

export function getCharacterAtPosition(matrix: string[][], pos: Position): string {
    return matrix[pos.y]?.[pos.x] ?? ' ';
}

export function move(position: Position, direction: Direction): Position {
    switch (direction) {
        case Direction.UP:
            return { x: position.x, y: position.y - 1 };
        case Direction.DOWN:
            return { x: position.x, y: position.y + 1 };
        case Direction.LEFT:
            return { x: position.x - 1, y: position.y };
        case Direction.RIGHT:
            return { x: position.x + 1, y: position.y };
    }
}

export function areCharAndDirectionSynced(char: string, direction: Direction): boolean {
    switch (direction) {
        case Direction.DOWN:
        case Direction.UP:
            return char !== HORIZONTAL_CHARACTER;
        case Direction.LEFT:
        case Direction.RIGHT:
            return char !== VERTICAL_CHARACTER;
    }
}

export function isValidPathChar(char: string): boolean {
    const validCharacterRegex: RegExp = new RegExp('^[A-Z\\-|+@x]$');
    return validCharacterRegex.test(char);
}

export function isValidLetter(char: string): boolean {
    const validLetterRegex: RegExp = new RegExp('^[A-Z]$');
    return validLetterRegex.test(char);
}

export function findDirection(matrix: string[][], position: Position): Direction {
    let direction: Direction | null = null;
    const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
    let count = 0;
    for (const d of directions) {
        const nextPosition = move(position, d);
        const nextCharacter = getCharacterAtPosition(matrix, nextPosition);
        if (isValidPathChar(nextCharacter)) {
            count++;
            direction = d;
            if (count > 1) {
                throw new Error(ERRORS.MULTIPLE_START_PATHS).message;
            }
        }
    }
    if (direction === null) {
        throw new Error(ERRORS.BROKEN_PATH).message;
    }
    return direction;
}

export function getStartPositionIfStartAndEndPositionsAreValid(matrix: string[][]): Position {
    const startPosition: Position | null = findCharacterPosition(matrix, START_CHARACTER);
    const endPosition: Position | null = findCharacterPosition(matrix, END_CHARACTER);

    if (!startPosition) {
        throw new Error(ERRORS.MISSING_START).message;
    }

    if (!endPosition) {
        throw new Error(ERRORS.MISSING_END).message;
    }

    if (hasMultipleOccurrences(matrix, START_CHARACTER)) {
        throw new Error(ERRORS.MULTIPLE_STARTS).message;
    }

    if (hasMultipleOccurrences(matrix, END_CHARACTER)) {
        throw new Error(ERRORS.MULTIPLE_ENDS).message;
    }

    return startPosition;
}

export function includesPosition(position: Position, positions: Position[]): boolean {
    return positions.some((p) => p.x === position.x && p.y === position.y);
}

export function changeDirection(
    matrix: string[][],
    direction: Direction,
    position: Position,
    steps: Step[],
): Direction {
    const possibleTurns: Direction[] =
        direction === Direction.LEFT || direction === Direction.RIGHT
            ? [Direction.UP, Direction.DOWN]
            : [Direction.LEFT, Direction.RIGHT];
    let count = 0;
    for (const newDirection of possibleTurns) {
        const testPosition = move(position, newDirection);
        const testCharacter = getCharacterAtPosition(matrix, testPosition);
        const previousPosition = steps[steps.length - 2].position;
        if (isValidPathChar(testCharacter) && testPosition !== previousPosition) {
            count++;
            direction = newDirection;
            if (count > 1) {
                throw new Error(ERRORS.FORK_IN_PATH).message;
            }
        }
    }

    return direction;
}

export function isFakeTurn(
    matrix: string[][],
    direction: Direction,
    position: Position,
    visitedPositions: Position[],
): boolean {
    const char = getCharacterAtPosition(matrix, position);
    const nextPosition = move(position, direction);
    const nextCharacter = getCharacterAtPosition(matrix, nextPosition);
    return (
        char === CORNER_CHARACTER &&
        nextCharacter !== NO_PATH_CHARACTER &&
        !includesPosition(nextPosition, visitedPositions)
    );
}

import { Direction } from '../enums/direction.enum';
import { ERRORS } from '../utils/errors';
import {
    areCharAndDirectionSynced,
    changeDirection,
    findCharacterPosition,
    findDirection,
    getCharacterAtPosition,
    validateAndGetStartPosition,
    hasMultipleOccurrences,
    includesPosition,
    isFakeTurn,
    isValidLetter,
    isValidPathChar,
    move,
} from '../utils/helpers';
import {
    CORNER_CHARACTER,
    END_CHARACTER,
    HORIZONTAL_CHARACTER,
    NO_PATH_CHARACTER,
    START_CHARACTER,
    VERTICAL_CHARACTER,
} from '../utils/constants';

const validLetter = 'A';
const invalidLetter = 'a';
const number = '1';
const specialCharacter = '?';

const validMap = [
    ['@', '-', '-', '+'],
    [' ', ' ', ' ', '|'],
    [' ', 'x', '-', '+'],
];
const cornerWithLetterMap = [
    ['@', 'A'],
    ['x', '+'],
];
const brokenPathMap = [['@', ' ', '-', 'x']];
const multipleStartsMap = [['@', '-', '@', '-', 'A', '-', 'x']];
const multipleEndsMap = [['@', '-', 'C', '-', 'x', '-', 'x']];
const forkInPathMap = [
    [' ', ' ', ' ', ' ', 'x', '-', 'B'],
    [' ', '@', '-', '-', 'A', '-', '+'],
    [' ', ' ', ' ', ' ', ' ', ' ', '|'],
    [' ', ' ', 'X', '-', '-', '-', '+'],
];
const multipleStartPathsMap = [['x', '-', '@', '-', 'A', '-', 'x']];
const fakeTurnMap = [['@', '-', '-', '+', '-', 'B', 'x']];
const missingStartMap = [['-', 'S', '-', 'x']];
const missingEndMap = [['@', '-', 'S', '-']];

describe('Helper utility functions', () => {
    describe('Position utilities', () => {
        test('findCharacterPosition returns correct position or null when not found', () => {
            expect(findCharacterPosition(validMap, START_CHARACTER)).toEqual({ x: 0, y: 0 });
            expect(findCharacterPosition(validMap, END_CHARACTER)).toEqual({ x: 1, y: 2 });
            expect(findCharacterPosition(validMap, validLetter)).toBeNull();
        });

        test('hasMultipleOccurrences returns true for multiple characters, false otherwise', () => {
            expect(hasMultipleOccurrences(multipleStartsMap, START_CHARACTER)).toBe(true);
            expect(hasMultipleOccurrences(validMap, START_CHARACTER)).toBe(false);
        });

        test('getCharacterAtPosition returns the correct character or space for empty positions', () => {
            expect(getCharacterAtPosition(validMap, { x: 0, y: 0 })).toBe(START_CHARACTER);
            expect(getCharacterAtPosition(validMap, { x: 0, y: 1 })).toBe(NO_PATH_CHARACTER);
        });

        test('move returns the correct position based on direction', () => {
            const position = { x: 1, y: 1 };
            expect(move(position, Direction.UP)).toEqual({ x: 1, y: 0 });
            expect(move(position, Direction.DOWN)).toEqual({ x: 1, y: 2 });
            expect(move(position, Direction.LEFT)).toEqual({ x: 0, y: 1 });
            expect(move(position, Direction.RIGHT)).toEqual({ x: 2, y: 1 });
        });

        test('includesPosition returns true when position is in list, false otherwise', () => {
            const positions = [
                { x: 1, y: 2 },
                { x: 3, y: 4 },
            ];
            expect(includesPosition({ x: 1, y: 2 }, positions)).toBe(true);
            expect(includesPosition({ x: 2, y: 3 }, positions)).toBe(false);
        });
    });

    describe('Character validation', () => {
        test('isValidPathChar identifies valid path characters and excludes invalid ones', () => {
            expect(isValidPathChar(START_CHARACTER)).toBe(true);
            expect(isValidPathChar(HORIZONTAL_CHARACTER)).toBe(true);
            expect(isValidPathChar(VERTICAL_CHARACTER)).toBe(true);
            expect(isValidPathChar(CORNER_CHARACTER)).toBe(true);
            expect(isValidPathChar(validLetter)).toBe(true);
            expect(isValidPathChar(END_CHARACTER)).toBe(true);
            expect(isValidPathChar(invalidLetter)).toBe(false);
            expect(isValidPathChar(number)).toBe(false);
            expect(isValidPathChar(NO_PATH_CHARACTER)).toBe(false);
            expect(isValidPathChar(specialCharacter)).toBe(false);
        });

        test('isValidLetter returns true only for uppercase single letters', () => {
            expect(isValidLetter(validLetter)).toBe(true);
            expect(isValidLetter(invalidLetter)).toBe(false);
            expect(isValidLetter(START_CHARACTER)).toBe(false);
            expect(isValidLetter(HORIZONTAL_CHARACTER)).toBe(false);
        });

        test('areCharAndDirectionSynced correctly validates character vs movement direction', () => {
            expect(areCharAndDirectionSynced(VERTICAL_CHARACTER, Direction.UP)).toBe(true);
            expect(areCharAndDirectionSynced(HORIZONTAL_CHARACTER, Direction.UP)).toBe(false);
            expect(areCharAndDirectionSynced(HORIZONTAL_CHARACTER, Direction.RIGHT)).toBe(true);
            expect(areCharAndDirectionSynced(VERTICAL_CHARACTER, Direction.RIGHT)).toBe(false);
            expect(areCharAndDirectionSynced(HORIZONTAL_CHARACTER, Direction.LEFT)).toBe(true);
            expect(areCharAndDirectionSynced(VERTICAL_CHARACTER, Direction.LEFT)).toBe(false);
            expect(areCharAndDirectionSynced(VERTICAL_CHARACTER, Direction.DOWN)).toBe(true);
            expect(areCharAndDirectionSynced(HORIZONTAL_CHARACTER, Direction.DOWN)).toBe(false);
        });
    });

    describe('Direction logic', () => {
        test('findDirection returns correct direction or throws errors for invalid paths', () => {
            expect(findDirection(validMap, { x: 0, y: 0 })).toBe(Direction.RIGHT);
            expect(() => findDirection(multipleStartPathsMap, { x: 2, y: 0 })).toThrow(
                ERRORS.MULTIPLE_START_PATHS,
            );
            expect(() => findDirection(brokenPathMap, { x: 0, y: 0 })).toThrow(ERRORS.BROKEN_PATH);
        });

        test('changeDirection correctly determines valid turns or throws on forks', () => {
            const stepsValidMap = [
                { char: START_CHARACTER, position: { x: 0, y: 0 }, direction: null },
                {
                    char: HORIZONTAL_CHARACTER,
                    position: { x: 1, y: 0 },
                    direction: Direction.RIGHT,
                },
                {
                    char: HORIZONTAL_CHARACTER,
                    position: { x: 2, y: 0 },
                    direction: Direction.RIGHT,
                },
                { char: CORNER_CHARACTER, position: { x: 3, y: 0 }, direction: Direction.RIGHT },
            ];
            expect(changeDirection(validMap, Direction.RIGHT, { x: 3, y: 0 }, stepsValidMap)).toBe(
                Direction.DOWN,
            );

            const stepsForCornerWithLetterMap = [
                { char: START_CHARACTER, position: { x: 0, y: 0 }, direction: null },
                { char: validLetter, position: { x: 1, y: 0 }, direction: Direction.RIGHT },
            ];
            expect(
                changeDirection(
                    cornerWithLetterMap,
                    Direction.RIGHT,
                    { x: 1, y: 0 },
                    stepsForCornerWithLetterMap,
                ),
            ).toBe(Direction.DOWN);

            const stepsInvalidMap = [
                { char: START_CHARACTER, position: { x: 1, y: 1 }, direction: null },
                {
                    char: HORIZONTAL_CHARACTER,
                    position: { x: 2, y: 1 },
                    direction: Direction.RIGHT,
                },
                {
                    char: HORIZONTAL_CHARACTER,
                    position: { x: 3, y: 1 },
                    direction: Direction.RIGHT,
                },
                { char: validLetter, position: { x: 4, y: 1 }, direction: Direction.RIGHT },
                {
                    char: HORIZONTAL_CHARACTER,
                    position: { x: 5, y: 1 },
                    direction: Direction.RIGHT,
                },
                { char: CORNER_CHARACTER, position: { x: 6, y: 1 }, direction: Direction.RIGHT },
            ];
            expect(() =>
                changeDirection(forkInPathMap, Direction.RIGHT, { x: 6, y: 1 }, stepsInvalidMap),
            ).toThrow(ERRORS.FORK_IN_PATH);
        });

        test('isFakeTurn returns true for misleading corner, false otherwise', () => {
            const visited = [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 3, y: 0 },
            ];
            expect(isFakeTurn(validMap, Direction.RIGHT, { x: 3, y: 0 }, visited)).toBe(false);
            expect(isFakeTurn(fakeTurnMap, Direction.RIGHT, { x: 3, y: 0 }, visited)).toBe(true);
        });
    });

    describe('Start and end position handling', () => {
        test('getStartPositionIfStartAndEndPositionsAreValid returns start position or throws appropriate errors', () => {
            expect(validateAndGetStartPosition(validMap)).toEqual({
                x: 0,
                y: 0,
            });
            expect(() => validateAndGetStartPosition(missingStartMap)).toThrow(
                ERRORS.MISSING_START,
            );
            expect(() => validateAndGetStartPosition(missingEndMap)).toThrow(
                ERRORS.MISSING_END,
            );
            expect(() => validateAndGetStartPosition(multipleStartsMap)).toThrow(
                ERRORS.MULTIPLE_STARTS,
            );
            expect(() => validateAndGetStartPosition(multipleEndsMap)).toThrow(
                ERRORS.MULTIPLE_ENDS,
            );
        });
    });
});

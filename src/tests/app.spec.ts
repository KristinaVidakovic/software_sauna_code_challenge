import code_challenge from '../app';
import { FinalPath } from '../interfaces/final-path.interface';
import { ERRORS } from '../utils/errors';
import { Direction } from '../enums/direction.enum';

describe('App tests', () => {
    describe('Valid map tests', () => {
        it('traces a simple path from start to end collecting letters', () => {
            const matrix = [
                ['@', '-', 'A', '+'],
                [' ', ' ', ' ', '|'],
                [' ', 'x', '-', '+'],
            ];
            const result: FinalPath = code_challenge(matrix);

            expect(result).toEqual({
                letters: 'A',
                path: '@-A+|+-x',
            });
        });

        it('traces a valid path without collecting any letters', () => {
            const matrix = [
                ['@', '-', '+'],
                [' ', 'x', '+'],
            ];
            const result: FinalPath = code_challenge(matrix);

            expect(result).toEqual({
                letters: '',
                path: '@-++x',
            });
        });

        it('traces a vertical path collecting letters', () => {
            const matrix = [['@'], ['|'], ['A'], ['|'], ['x']];
            const result = code_challenge(matrix);

            expect(result).toEqual({
                letters: 'A',
                path: '@|A|x',
            });
        });

        it('traces a path through multiple corners', () => {
            const matrix = [
                ['@', '+'],
                [' ', '|'],
                ['+', '+'],
                ['|', ' '],
                ['x', ' '],
            ];
            const result: FinalPath = code_challenge(matrix);

            expect(result).toEqual({
                letters: '',
                path: '@+|++|x',
            });
        });

        it('handles a path with backtracking', () => {
            const matrix = [
                [' ', '+', 'x'],
                [' ', '|', ' '],
                ['@', 'V', '+'],
                [' ', '+', 'P'],
            ];
            const result: FinalPath = code_challenge(matrix);

            expect(result).toEqual({
                letters: 'VP',
                path: '@V+P+V|+x',
            });
        });

        it('traces a horizontal line collecting letters', () => {
            const matrix = [['@', '-', '-', '-', 'X', '-', 'x']];
            const result: FinalPath = code_challenge(matrix);

            expect(result).toEqual({
                letters: 'X',
                path: '@---X-x',
            });
        });

        it('traces a path consisting only of letters', () => {
            const matrix = [['@', 'A', 'C', 'O', 'X', 'P', 'x']];
            const result: FinalPath = code_challenge(matrix);

            expect(result).toEqual({
                letters: 'ACOXP',
                path: '@ACOXPx',
            });
        });

        it('traces a path with reprocessing already visited connectors when the path overlaps itself', () => {
            const matrix = [
                ['@', ' ', '+', 'C', 'x'],
                ['|', ' ', '|', ' ', ' '],
                ['+', '-', '-', 'A', '+'],
                [' ', ' ', '|', ' ', '|'],
                [' ', ' ', '+', 'B', '+'],
            ];
            const result: FinalPath = code_challenge(matrix);

            expect(result).toEqual({
                letters: 'ABC',
                path: '@|+--A+|+B+|-|+Cx',
            });
        });

        it('traces a path with letter as corner', () => {
            const matrix = [
                ['@', '-', '-', 'C'],
                [' ', ' ', ' ', '|'],
                [' ', 'x', '-', 'P'],
            ];
            const result: FinalPath = code_challenge(matrix);

            expect(result).toEqual({
                letters: 'CP',
                path: '@--C|P-x',
            });
        });

        it('traces a path upon reaching x', () => {
            const matrix = [
                ['@', '-', 'K', 'V'],
                [' ', 'F', 'x', '+'],
            ];
            const result: FinalPath = code_challenge(matrix);

            expect(result).toEqual({
                letters: 'KV',
                path: '@-KV+x',
            });
        });
    });

    describe('Start and end validation', () => {
        it(`throws an error on an empty matrix`, () => {
            const matrix = [[]];

            expect(() => code_challenge(matrix)).toThrow(ERRORS.MISSING_START);
        });

        it('throws an error if the start character is missing', () => {
            const matrix = [[' ', ' ', '-', 'A', '-', 'x']];

            expect(() => code_challenge(matrix)).toThrow(ERRORS.MISSING_START);
        });

        it('throws an error if the end character is missing', () => {
            const matrix = [[' ', '@', '-', 'A', '-', ' ']];

            expect(() => code_challenge(matrix)).toThrow(ERRORS.MISSING_END);
        });

        it('throws an error if only the start character exists in a 1x1 matrix', () => {
            const matrix = [['@']];

            expect(() => code_challenge(matrix)).toThrow(ERRORS.MISSING_END);
        });

        it('throws an error if multiple start characters exist', () => {
            const matrix = [[' ', '@', '-', 'A', '-', '@', 'x']];

            expect(() => code_challenge(matrix)).toThrow(ERRORS.MULTIPLE_STARTS);
        });

        it('throws an error if multiple end characters exist', () => {
            const matrix = [['@', '-', 'x', 'A', '-', 'x']];

            expect(() => code_challenge(matrix)).toThrow(ERRORS.MULTIPLE_ENDS);
        });
    });

    describe('Path structure validation', () => {
        it('throws an error if multiple path options exist from the start', () => {
            const matrix = [['x', '-', '@', 'A', '-', 'B']];

            expect(() => code_challenge(matrix)).toThrow(ERRORS.MULTIPLE_START_PATHS);
        });

        it('throws an error on invalid path character', () => {
            const matrix = [[' ', '@', '-', '#', '-', 'x']];

            expect(() => code_challenge(matrix)).toThrow(ERRORS.INVALID_CHARACTER);
        });

        it('throws an error when the path is broken', () => {
            const matrix = [[' ', '@', '-', '-', ' ', 'x']];

            expect(() => code_challenge(matrix)).toThrow(ERRORS.BROKEN_PATH);
        });

        it('throws an error if the path forks into multiple directions', () => {
            const matrix = [
                [' ', ' ', 'x'],
                [' ', ' ', '|'],
                ['@', '-', '+'],
                [' ', ' ', 'P'],
            ];

            expect(() => code_challenge(matrix)).toThrow(ERRORS.FORK_IN_PATH);
        });

        it('throws an error on invalid direction character', () => {
            const matrix = [
                ['@', '-', 'A', '-', '+'],
                [' ', 'x', '-', 'C', '-'],
            ];

            expect(() => code_challenge(matrix)).toThrow(ERRORS.INVALID_DIRECTION(Direction.DOWN));
        });

        it('throws an error if a fake turn exists in the path', () => {
            const matrix = [['@', '-', 'A', '+', '-', '-', 'x']];

            expect(() => code_challenge(matrix)).toThrow(ERRORS.FAKE_TURN);
        });
    });
});

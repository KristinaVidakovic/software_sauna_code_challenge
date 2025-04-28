import { Position } from './interfaces/position.interface';
import { Step } from './interfaces/step.interface';
import {
    areCharAndDirectionSynced,
    changeDirection,
    validateAndGetStartPosition,
    includesPosition,
    findDirection,
    getCharacterAtPosition,
    isFakeTurn,
    isValidLetter,
    isValidPathChar,
    move,
} from './utils/helpers';
import { FinalPath } from './interfaces/final-path.interface';
import { ERRORS } from './utils/errors';
import {
    CORNER_CHARACTER,
    END_CHARACTER,
    NO_PATH_CHARACTER,
    START_CHARACTER,
} from './utils/constants';

function code_challenge(matrix: string[][]): FinalPath {
    const steps: Step[] = [];
    const letters: string[] = [];
    const visitedPositions: Position[] = [];

    let position = validateAndGetStartPosition(matrix);
    let direction = findDirection(matrix, position);

    steps.push({ char: START_CHARACTER, position: { ...position }, direction: null });
    visitedPositions.push(position);

    while (direction) {
        const nextPosition = move(position, direction);
        const nextCharacter = getCharacterAtPosition(matrix, nextPosition);
        if (nextCharacter === NO_PATH_CHARACTER) {
            throw ERRORS.BROKEN_PATH;
        }

        if (!isValidPathChar(nextCharacter)) {
            throw ERRORS.INVALID_CHARACTER;
        }

        if (
            !areCharAndDirectionSynced(nextCharacter, direction) &&
            !includesPosition(nextPosition, visitedPositions)
        ) {
            throw ERRORS.INVALID_DIRECTION(direction);
        }

        position = nextPosition;
        steps.push({ char: nextCharacter, position: { ...position }, direction });
        if (!includesPosition(position, visitedPositions)) {
            if (isValidLetter(nextCharacter)) {
                letters.push(nextCharacter);
            }
            visitedPositions.push(position);
        }

        if (nextCharacter === END_CHARACTER) break;

        if (isFakeTurn(matrix, direction, position, visitedPositions)) {
            throw ERRORS.FAKE_TURN;
        }

        if (
            nextCharacter === CORNER_CHARACTER ||
            (isValidLetter(nextCharacter) &&
                getCharacterAtPosition(matrix, move(position, direction)) === NO_PATH_CHARACTER)
        ) {
            direction = changeDirection(matrix, direction, position, steps);
        }
    }

    const finalLetters = letters.join('');
    const path = steps.map((step) => step.char).join('');

    return { letters: finalLetters, path };
}

export default code_challenge;

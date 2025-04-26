export const ERRORS = Object.freeze({
    BROKEN_PATH: 'Error - Broken path.',
    INVALID_CHARACTER: 'Error - Invalid path character.',
    INVALID_DIRECTION: (direction: string) =>
        `Error - Invalid character for direction ${direction}.`,
    MISSING_START: 'Error - Missing start character.',
    MISSING_END: 'Error - Missing end character.',
    MULTIPLE_STARTS: 'Error - Multiple start characters found.',
    MULTIPLE_ENDS: 'Error - Multiple end characters found.',
    FAKE_TURN: 'Error - Fake turn.',
    FORK_IN_PATH: 'Error - Fork in path.',
    MULTIPLE_START_PATHS: 'Error - Multiple starting paths.',
});

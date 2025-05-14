import type { Direction } from '../enums/direction.enum';
import type { Position } from './position.interface';

export interface Step {
    char: string;
    position: Position;
    direction: Direction;
}

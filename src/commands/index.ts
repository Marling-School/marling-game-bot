import draw from './draw';
import fightMonster from './fightMonster';
import guessNumber from './guessNumber';
import addition from './addition';
import profile from './profile';
import { MessageHandlers } from './types';

export default {
    draw, profile, addition, fightMonster, guessNumber
} as MessageHandlers;
import draw from './draw';
import createPlayer from './createPlayer';
import fightMonster from './fightMonster';
import guessNumber from './guessNumber';
import addition from './addition';
import profile from './profile';
import { MessageHandlers } from './types';

export default {
    draw, profile, addition, createPlayer, fightMonster, guessNumber
} as MessageHandlers;
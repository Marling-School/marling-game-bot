import draw from './draw';
import createPlayer from './createPlayer';
import fightMonster from './fightMonster';
import addition from './addition';
import profile from './profile';
import { MessageHandlers } from './types';

export default {
    draw, profile, addition, createPlayer, fightMonster
} as MessageHandlers;
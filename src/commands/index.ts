import draw from './draw';
import createPlayer from './createPlayer';
import huntMonster from './huntMonster';
import addition from './addition';
import { MessageHandlers } from './types';

export default {
    draw, addition, createPlayer, huntMonster
} as MessageHandlers;
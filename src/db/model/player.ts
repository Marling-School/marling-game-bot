import { model, Schema, Document } from "mongoose";

export interface IPlayer {
  _id: string;
  name: string;
  health: number;
  xp: number;
  fightsWon: number;
  fightsLost: number;
  fleeTotal: number;
}

export type IPlayerDoc = Document & IPlayer;

const PlayerSchema: Schema = new Schema(
  {
    _id: {
      type: String,
    },
    name: {
      type: String,
    },
    health: {
      type: Number
    },
    xp: {
      type: Number
    },
    fightsWon: {
      type: Number
    },
    fightsLost: {
      type: Number
    },
    fleeTotal: {
      type: Number
    }
  },
  { _id: false }
);

export const Player = model<IPlayerDoc>(
  "player",
  PlayerSchema
);

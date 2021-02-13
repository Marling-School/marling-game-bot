import { model, Schema, Document } from "mongoose";

export interface IPlayer {
  _id: string;
  name: string;
  health: number;
  xp: number;
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
    }
  },
  { _id: false }
);

export const Player = model<IPlayerDoc>(
  "player",
  PlayerSchema
);

import { connect, set } from "mongoose";
import * as logger from 'winston';

set("useFindAndModify", false);

export function connectDb() {
  if (!process.env.DB_URL) {
    logger.error('No Database URL set')
    return;
  }
  connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
}

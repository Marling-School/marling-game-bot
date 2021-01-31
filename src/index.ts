import * as logger from 'winston'

// Configure the logger
logger.configure({
    level: "debug",
    transports: [new logger.transports.Console()],
});


function helloWorld() {
    logger.info('Hello World')
}

helloWorld()
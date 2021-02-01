import * as logger from 'winston'
import { Client, Message, MessageAttachment } from 'discord.js';
import dotenv from 'dotenv'
import { createCanvas, CanvasRenderingContext2D } from 'canvas'

// Load environment variables
dotenv.config();

// Configure the logger
logger.configure({
    level: "debug",
    transports: [new logger.transports.Console()],
});

const client = new Client()

client.on('ready', () => {
    logger.info(`Logged in as ${client.user && client.user.tag}!`);
});

const SIGNAL = '>'

const colorArray = [
    '#046975',
    '#2EA1D4',
    '#3BCC2A',
    '#FFDF59',
    '#FF1D47'
]

class Circle {
    x: number;
    y: number; dx: number; dy: number; radius: number;
    minRadius: number;
    color: string;

    constructor(x: number, y: number, dx: number, dy: number, radius: number) {
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.radius = radius
        this.minRadius = radius
        this.color = colorArray[Math.floor(Math.random() * colorArray.length)]
    }

    draw(c: CanvasRenderingContext2D) {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.strokeStyle = 'black'
        c.stroke()
        c.fillStyle = this.color
        c.fill()
    }
}

client.on('message', msg => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(SIGNAL)) return;

    const message = msg.content.slice(1);
    const parts = message.split(' ');

    if (parts.length > 0) {
        switch (parts[0]) {
            case 'draw': {

                const width = 400
                const height = 400
                const canvas = createCanvas(width, height)
                const c = canvas.getContext('2d')

                for (let i = 0; i < 60; i++) {
                    for (let j = 0; j < 60; j++) {
                        c.fillStyle = `rgb(${i * 5}, ${j * 5}, ${(i + j) * 50})`
                        c.fillRect(j * 10, i * 10, 5, 5)
                    }
                }

                for (let i = 0; i < 200; i++) {
                    const radius = Math.random() * 20 + 1
                    const x = Math.random() * (canvas.width - radius * 2) + radius
                    const y = Math.random() * (canvas.height - radius * 2) + radius
                    const dx = (Math.random() - 0.5) * 2
                    const dy = (Math.random() - 0.5) * 2

                    const circle = new Circle(x, y, dx, dy, radius)
                    circle.draw(c)
                }

                const attachment = new MessageAttachment(canvas.toBuffer());

                msg.channel.send('This should be an image', attachment);
                break;
            }
            case 'play':
                msg.channel.send('Welcome to Maths Game')

                const a = 1 + Math.floor(Math.random() * 10);
                const b = 1 + Math.floor(Math.random() * 10);
                const question = `${msg.author.username} - What is ${a} * ${b}?`
                const answer = (a * b).toString();

                const filter = (m: Message) => m.author.id === msg.author.id;
                const collector = msg.channel.createMessageCollector(filter, { max: 1 });
                collector.on('collect', (m: Message) => {
                    if (m.content === answer) {
                        m.channel.send(`${m.author.username} is Correct!`)
                    } else {
                        m.channel.send(`${m.author.username} is Incorrect!`)
                    }

                    return true;
                });
                collector.on('end', collected => {
                    logger.info(`Collected ${collected.size} items`);
                });
                msg.channel.send(question);
                break;
        }

    } else {
        msg.channel.send('Error - Not enough parts when split on space');
    }
});

client.login(process.env.DISCORD_SECRET);

import Discord from 'discord.js';

import { createCanvas, CanvasRenderingContext2D } from 'canvas'

import { MessageHandler } from "./types";

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

const draw: MessageHandler = (msg: Discord.Message, content: string, splitOnSpace: string[]) => {
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

    const attachment = new Discord.MessageAttachment(canvas.toBuffer());

    msg.channel.send('This should be an image', attachment);
}

export default draw;
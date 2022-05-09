import express from 'express';
import nodemailer from 'nodemailer';
import { prisma } from './prisma';

const app = express()

app.use(express.json());

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "67e66b72219d58",
      pass: "268682756f4d88"
    }
  });

app.post('/feedbacks', async (req, res) => {
    const { comment, type, screenshot } = req.body
    const feedback = await prisma.feedback.create({
        data: {
            type,
            comment,
            screenshot,
        }
    });

    await transport.sendMail({
        from: 'Equipe Feedget <oi@feedget.com>',
        to: 'Johnatan Dos Santos <john.dss.npm@gmail.com>',
        subject: 'Novo feedback',
        html: [
            `<div style="font-family:sans-serif, font-size:16px, color:#111;">`,
            `<p>Tipo de feedback: ${type}</p>`,
            `<p>´Comentário: ${comment}</p>`,
            `</div>`
        ].join('\n')

    })

    return res.status(201).json({ data: feedback });
})

app.listen(3333, () => {
    console.log('HTTP server running!');
});


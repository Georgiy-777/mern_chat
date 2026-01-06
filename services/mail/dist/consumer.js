import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
export const startSendOtpConsumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.REBBITMQ_HOST,
            port: +(process.env.REBBITMQ_PORT ?? 5672),
            username: process.env.REBBITMQ_USER,
            password: process.env.REBBIT_PASSWORD
        });
        const channel = await connection.createChannel();
        const queueName = "sent-otp";
        await channel.assertQueue(queueName, { durable: true });
        console.log('Mail service consumer start');
        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    const { to, subject, body } = JSON.parse(msg.content.toString());
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        auth: {
                            user: process.env.USER,
                            pass: process.env.PASSWORD
                        }
                    });
                    await transporter.sendMail({
                        from: "Chat app",
                        to,
                        subject,
                        text: body
                    });
                    channel.ack(msg);
                }
                catch (error) {
                    console.error('Failed to start rebbitmq consumer-mail', error);
                }
            }
        });
    }
    catch (error) {
        console.error('Failed to start rebbitmq consumer-mail', error);
    }
};
//# sourceMappingURL=consumer.js.map
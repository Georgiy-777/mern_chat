import amqplib from 'amqplib';
let channel;
export const connectRabbitMq = async () => {
    try {
        const connection = await amqplib.connect({
            protocol: "amqp",
            hostname: process.env.REBBITMQ_HOST,
            port: +(process.env.REBBITMQ_PORT ?? 5672),
            username: process.env.REBBITMQ_USER,
            password: process.env.REBBIT_PASSWORD
        });
        channel = await connection.createChannel();
        console.log("Rebbit connected");
    }
    catch (error) {
        console.error("Failed to connect to rebbitmq", error);
    }
};
export const publishToQueue = async (queueName, message) => {
    if (!channel) {
        console.log('Rabbitmq  channel is not init');
        return;
    }
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent: true
    });
};
//# sourceMappingURL=rebbitmq.js.map
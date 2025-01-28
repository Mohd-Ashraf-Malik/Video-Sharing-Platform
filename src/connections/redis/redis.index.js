import redis from "redis"

// i am not using redis beacause for 15 billion data user to find it will take only millisecond for mongodb indexing
// redis is very much good but i will use it when the data set is very much big

const connectRedis = async ()=>{
    const redisClient = redis.createClient();
    redisClient.on("connect",()=>{
        console.log("Connected to redis!");
    })
    redisClient.on("error", (err) => {
        console.error("Redis error:", err);
    });

    await redisClient.connect();
}

export {connectRedis}
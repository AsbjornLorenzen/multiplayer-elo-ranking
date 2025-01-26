import {client} from '../../lib/connect'

export default async function handler(req,res) {
    const { query } = req;
    const gameMode = query.game;
    console.log('connecting .... ')
    client.connect()
    const db = client.db('WebAppDev')
    const matches = await db.collection("matches").find({game:gameMode}).toArray()
    console.log('Accessing env vars gave ', process.env.AUTH0_CLIENT_ID)

    res.send(matches)
}
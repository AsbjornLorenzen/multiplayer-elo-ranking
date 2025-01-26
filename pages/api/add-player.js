import {client} from '../../lib/connect'

export default async function handler(req,res) {
    const db = client.db('WebAppDev')
    let bodyObject = req.body;
    console.log('body obj is ', bodyObject)
    let myPost = await db.collection("players").insertOne(bodyObject);
    res.json(myPost);
}
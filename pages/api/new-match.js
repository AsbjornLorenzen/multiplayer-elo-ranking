import {client} from '../../lib/connect'

export default async function handler(req,res) {
    try {
        const db = client.db('WebAppDev')
        let bodyObject = req.body;
        let myPost = await db.collection("matches").insertOne(bodyObject);
        res.status(200).json(myPost);
    } catch (err) {
        console.error('Error: ',err)
        res.status(500).json({ error: 'Something went wrong when adding the new match'}) 
    }
}   
import {client} from '../../lib/connect'
import { ObjectId } from "mongodb";

export default async function handler(req,res) {
    try {
        if (req.method !== 'POST') {
            res.status(405).json({error: 'Method not allowed. This endpoint accepts only POST.'})
        }

        const db = client.db('WebAppDev')
        let bodyObject = req.body;
        
        if (!bodyObject._id || !ObjectId.isValid(bodyObject._id)) {
            res.status(400).json({error: 'Invalid match id'})   
        }

        // Necessary to match mongo stored id
        bodyObject._id = new ObjectId(bodyObject._id)
        
        let DbResponse = await db.collection("matches").replaceOne({_id: bodyObject._id},bodyObject);
        
        if (DbResponse.matchedCount === 0) {
            res.status(400).json( {error: 'No match found with this id'})
        }

        console.log('response from update to mongo is ,',DbResponse)
        res.send(DbResponse);
    } catch (err) {
        console.error('Error while making update to match: ',err)
        res.status(500).json({error: 'Internal server error'})
    }
}
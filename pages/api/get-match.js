import {client} from '../../lib/connect'
import { ObjectId } from "mongodb";

export default async function handler(req,res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { _id } = req.body;

    if (!_id) {
        return res.status(400).json({ error: 'Missing _id in request body' });
    }

    try {
        const db = client.db('WebAppDev');
        const match = await db.collection('matches').findOne({ _id: new ObjectId(_id) });

        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        console.log('Match returned by ID query', match);
        console.log('Accessing env vars gave ', process.env.AUTH0_CLIENT_ID)
        return res.status(200).json(match);
    } catch (error) {
        console.error('Error finding match:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
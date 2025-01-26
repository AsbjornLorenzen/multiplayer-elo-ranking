import {client} from '../../lib/connect'

export default async function handler(req,res) {
    const { query } = req;
    const gameMode = query.game;
    
    if (!gameMode) {
        return res.status(400).json({ error: 'Missing game as query string' });
    }
    
    try {
        const db = client.db('WebAppDev')
        const players = await db.collection("players").find({'game': gameMode}).toArray()
        
        if (!players) {
            console.log('FOUND NO PLAYERS, ERROR')
            return res.status(404).json({ error: 'Players not found' });
        }
        console.log('Sending ',players)
        res.send(players)
    } catch (err) {
        console.error('Error finding match:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
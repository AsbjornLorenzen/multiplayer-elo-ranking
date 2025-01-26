import {client} from '../../lib/connect'
import { ObjectId } from "mongodb";

export default async function handler(req,res) {
    const id = req.body._id
    console.log(' Deleting with ', id)
    const db = client.db('WebAppDev')
    const response = await db.collection("matches").deleteOne( {_id: new ObjectId(id)} )
    console.log('response from delete', response)
    res.send(response)
}
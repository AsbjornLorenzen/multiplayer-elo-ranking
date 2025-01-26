const { MongoClient, ServerApiVersion } = require('mongodb');

//const uri = "mongodb+srv://elo-user:NmocbNHi3NHLpNnG@webappdev.7jlob4z.mongodb.net/?retryWrites=true&w=majority&appName=WebAppDev";

const certPath = "./X509-cert-8539436279610304145.pem"
const x509uri = 'mongodb+srv://webappdev.7jlob4z.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=WebAppDev'
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(x509uri, {
  tlsCertificateKeyFile: certPath,
  serverApi: ServerApiVersion.v1
});

export default client;
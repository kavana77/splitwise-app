import admin from 'firebase-admin'
import env from '../utils/validation'

const serviceAccount = JSON.parse(
 env.FIREBASE_SERVICE_ACCOUNT as string
);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: env.FIREBASE_DATABASE_URL
})

const db = admin.database()


export default db
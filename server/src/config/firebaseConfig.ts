import admin from 'firebase-admin'
import env from '../utils/validation'
import serviceAccount from './firebase-admin.json'
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: env.FIREBASE_DATABASE_URL
})

const db = admin.database()


export default db
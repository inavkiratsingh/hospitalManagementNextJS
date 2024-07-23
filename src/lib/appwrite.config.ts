import * as sdk from 'node-appwrite';

export const {
    APPWRITE_PROJECT_ID: PROJECT_ID, 
    APPWRITE_API_KEY, 
    APPWRITE_DATABASE_ID:DATABASE_ID, 
    PATIENT_COLLECTION_ID: PATIENT, 
    DOCTOR_COLLECTION_ID: DOCTOR, 
    APPOINTMENTS_COLLECTION_ID: APPOINTMENTS, 
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID, 
    NEXT_PUBLIC_ENDPOINT: ENDPOINT
} =  process.env

const client = new sdk.Client();

client
    .setEndpoint(ENDPOINT!)
    .setProject(PROJECT_ID!)
    .setKey(APPWRITE_API_KEY!)

export const databases = new sdk.Databases(client)
export const storage = new sdk.Storage(client)
export const messaging = new sdk.Messaging(client)
export const users = new sdk.Users(client)
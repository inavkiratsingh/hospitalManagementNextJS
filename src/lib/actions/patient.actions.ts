"use server";

import { ID, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file"


export const createUser = async(user: CreateUserParams) => {
    
    try {
        const newUser = await users.create(
            ID.unique(),
            user.email, 
            user.phone, 
            undefined, 
            user.name
        )
        console.log("created user");
        return parseStringify(newUser);
        
    } catch (error: any) {
        if(error && error?.code === 409) {
            const documents = await users.list([
                Query.equal('email', [user.email])
            ])

            return documents.users[0]
        }
    }
}

export const getUser = async (userId: string) => {
    try {

        const user = await users.get(userId);
        return parseStringify(user);
        
    } catch (error) {
        console.log(error);
        
    }
}

export const registerPatient = async({ identificationDocument, ...patient}: RegisterUserParams) => {
    try {
        // console.log("register");
        
        let file;
        console.log({patient});
        console.log(identificationDocument);
        
        

        if(identificationDocument) {

            console.log("document");
            

            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('filename') as string,
            )

            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile) 
            
            console.log("submit file : ",file);
            
        }

        console.log("document submitted.");
        

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentURL: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...patient
            }

        )

        console.log("patient",newPatient);
        

        return parseStringify(newPatient);

    } catch (error) {
        console.log(error);        
    }
}
"use server"
import { ID } from "node-appwrite";
import { APPOINTMENTS, DATABASE_ID, databases } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createAppointment = async (appointmentData: CreateAppointmentParams) => {
    console.log('data');
    
    try 
    {
        console.log(appointmentData);
        
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENTS!,
            ID.unique(),
            appointmentData

        )

        console.log("patient",newAppointment);
        

        return parseStringify(newAppointment);
    } catch (error) {
        console.log(error);
        
    }
}
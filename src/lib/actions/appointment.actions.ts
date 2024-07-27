"use server"
import { ID } from "node-appwrite";
import { APPOINTMENTS, DATABASE_ID, databases } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    console.log('data');
    
    try 
    {
        console.log(appointment);
        
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENTS!,
            ID.unique(),
            appointment

        )

        console.log("patient",newAppointment);
        

        return parseStringify(newAppointment);
    } catch (error) {
        console.log(error);
        
    }
}

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENTS!,
            appointmentId
        )
        return parseStringify(appointment)
    } catch (error) {
        console.log(error);        
    }
}
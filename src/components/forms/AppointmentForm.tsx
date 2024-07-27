"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomField from "../ui/CustomField"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
import { getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { stat } from "fs"
import { createAppointment } from "@/lib/actions/appointment.actions"


 
const AppointmentForm = ({
    userId, patientId, type
}: {
    userId: string,
    patientId: string,
    type: "create" | "cancel" | "schedule";
}) => {
    const router=useRouter()

    const [isLoading, setisLoading] = useState(false)

    const AppointmentFormValidation = getAppointmentSchema(type);

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
        primaryPhysician: "",
        schedule: new Date(),
        reason: "",
        note:"",
        cancellationReason: "",
        },
    })
 

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setisLoading(true);

    console.log("im");
    

    let status;
    switch(type){
        case 'schedule':
            status = 'scheduled';
            break;
        case 'cancel':
            status = 'cancelled';
            break;
        default:
            status = 'pending';
            break;
    }

    console.log(type);
    

    try {
        console.log(patientId);
        
        if(type=== 'create' && patientId) {
            const appointmentData = {
                userid: userId,
                patient: patientId,
                primaryPhysician: values.primaryPhysician,
                schedule: new Date(values.schedule),
                reason: values.reason!,
                note: values.note,
                status: status as Status
            }
            const appointment = await createAppointment(appointmentData)

            console.log(appointment);
            

            if(appointment){
                form.reset();
                router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
            }
        }

    } catch (error) {
        console.log(error);
        
    }

    setisLoading(false);
}

    let buttonLabel;

    switch(type) {
        case 'cancel':
            buttonLabel = 'Cancel Appointment'
            break;
        case 'create':
            buttonLabel = 'Create Appointment'
            break;
        case 'schedule':
            buttonLabel = 'Schedule Appointment'
            break;
        default:
            break;
    }


  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
            <section className="mb-12 space-y-4">
                <h1 className="header">New Appointment</h1>
                <p className="text-dark-700">Request a new appointment in 10 seconds.</p>
            </section>

            {type !== "cancel" && (
                <>
                    <CustomField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="primaryPhysician"
                        label="Doctor"
                        placeholder="Select a doctor"
                    >
                        {Doctors.map((doctor, i) => (
                        <SelectItem key={doctor.name + i} value={doctor.name}>
                            <div className="flex cursor-pointer items-center gap-2">
                            <Image
                                src={doctor.image}
                                width={32}
                                height={32}
                                alt="doctor"
                                className="rounded-full border border-dark-500"
                            />
                            <p>{doctor.name}</p>
                            </div>
                        </SelectItem>
                        ))}
                    </CustomField>

                    <CustomField 
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="schedule"
                    label="Expected appointment date"
                    showTimeSelect
                    dateFormat="MM/dd/yyyy - h:mm aa"
                    />

                    <div className="flex flex-col gap-6 xl:flex-row">
                        <CustomField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="reason"
                        label="Reason for appointment"
                        placeholder="Enter reason for appointment"
                        />

                        <CustomField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="note"
                        label="Notes"
                        placeholder="Enter notes"
                        />
                    </div>

                </>
            )}

            {type === "cancel" && (
                <CustomField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="cancellationReason"
                label="Reason for cancellation"
                placeholder="Enter reason for cancellation"
                />
            )}

        <SubmitButton 
        isLoading={isLoading}
        className={`${type === 'cancel' ? 
            'shad-danger-btn' : 'shad-primary-btn'} w-full
        }`}
        >
            {buttonLabel}
        </SubmitButton>
        </form>
    </Form>
  )
}

export default AppointmentForm
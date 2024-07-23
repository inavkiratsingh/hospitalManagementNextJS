"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomField from "../ui/CustomField"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
import { userformSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"

export enum FormFieldType {
    INPUT= 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton'
}


 
const PatientForm = () => {
    const router=useRouter()

    const [isLoading, setisLoading] = useState(false)

    const form = useForm<z.infer<typeof userformSchema>>({
        resolver: zodResolver(userformSchema),
        defaultValues: {
        name: "",
        email: "",
        phone: "",
        },
    })
 

  async function onSubmit({ name,email,phone }: z.infer<typeof userformSchema>) {
    setisLoading(true);
    try {
        const userData= { name, email, phone };
        console.log(userData);
        
        const user = await createUser(userData);
        console.log(user);
        
        if(user) router.push(`/patients/${user}/register`);
    } catch (error) {
        console.log(error);
        
    }
}


  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
            <section className="mb-12 space-y-4">
                <h1 className="header">Hi there 👋</h1>
                <p className="text-dark-700">Schedule your first appointment.</p>
            </section>

            <CustomField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
            />
            <CustomField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="Johndow@email.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
            />
            <CustomField 
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="9876543210"
            />

        <SubmitButton 
        isLoading={isLoading}
        >
            Get Started
        </SubmitButton>
        </form>
    </Form>
  )
}

export default PatientForm
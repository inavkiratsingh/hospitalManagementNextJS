'use client'
import React, { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
  
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { decryptKey, encryptKey } from '@/lib/utils'
  

const PasskeyModal = () => {

    const router = useRouter();
    const path = usePathname();
    const [Open, setOpen] = useState(true)
    const [passKey, setpassKey] = useState('')
    const [error, seterror] = useState('')


    const encryptedkey = typeof window !== 'undefined' ? window.localStorage.getItem('accessKey') : null;

    useEffect(() => {
        const accessKey = encryptedkey && decryptKey(encryptedkey);
        if(path) {
            if(accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {

                setOpen(false);
                router.push('/admin')
    
            } else {
                setOpen(true)
            }
        }
    }, [encryptedkey])
    

    const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if(passKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedkey = encryptKey(passKey)
            localStorage.setItem('accessKey', encryptedkey);

            setOpen(false);

        } else {
            seterror('Invalid passkey. Please try again.')
        }

    }

    const closeModal = () => {
        setOpen(false)
        router.push('/')
    }

  return (
    <AlertDialog open={Open} onOpenChange={setOpen}>
        <AlertDialogContent className='shad-alert-dialog'>
            <AlertDialogHeader>
            <AlertDialogTitle className='flex justify-between items-start'>
                Admin Access Verification
                <Image
                    src="/assets/icons/close.svg"
                    alt='close'
                    height={20}
                    width={20}
                    onClick={() => closeModal()}
                    className='cursor-pointer'
                />
            </AlertDialogTitle>
            <AlertDialogDescription>
                To access the admin page, please enter the passkey.
            </AlertDialogDescription>
            </AlertDialogHeader>

            <div>
                <InputOTP maxLength={6} value={passKey} onChange={(value) => setpassKey(value)}>
                    <InputOTPGroup className='shad-otp'>
                        <InputOTPSlot className='shad-otp-slot' index={0} />
                        <InputOTPSlot className='shad-otp-slot' index={1} />
                        <InputOTPSlot className='shad-otp-slot' index={2} />
                        <InputOTPSlot className='shad-otp-slot' index={3} />
                        <InputOTPSlot className='shad-otp-slot' index={4} />
                        <InputOTPSlot className='shad-otp-slot' index={5} />
                    </InputOTPGroup>
                </InputOTP>

                {error && <p className='shad-error text-14-regular mt-4 flex justify-center'>{error}</p>}

            </div>

            <AlertDialogFooter>
            <AlertDialogAction className="shad-primary-btn w-full" onClick={(e) => validatePasskey(e)}>
                Enter Admin Passkey
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

  )
}

export default PasskeyModal
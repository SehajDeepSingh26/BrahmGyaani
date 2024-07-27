import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { apiConnector } from '../../services/apiConnector';
import { contactusEndpoint } from '../../services/apis';
import CountryCode from "../../data/countrycode.json"
import toast from 'react-hot-toast';

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful }
    } = useForm();

    const submitContactForm = async (data) => {
        // console.log("Form data aggregated by UseForm hook", data)
        const toastId = toast.loading("Loading...")
        try {
            setLoading(true)

            const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data)
            // console.log(response)
            toast.success("Message sent")

        } catch (error) {
            console.log("Error while sending req for ContactUs Form", error)
            toast.error("Error while sending req for ContactUs Form")
            // setLoading(false);
        }
        toast.dismiss(toastId)
        setLoading(false);

    }

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({
                email: "",
                firstname: '',
                lastname: '',
                message: "",
                phoneNo: "",
            })
        }
    }, [reset, isSubmitSuccessful])

    return (
        <form onSubmit={handleSubmit(submitContactForm)} className="max-w-3xl mx-auto p-8 bg-gray-900 text-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
            <div className="flex flex-col gap-5">
                <div className='flex gap-5'>
                    {/* FirstName */}
                    <div className='flex flex-col w-1/2'>
                        <label htmlFor='firstname' className="mb-2">First Name</label>
                        <input type='text'
                            name='firstname'
                            id='firstname'
                            placeholder='Enter first name'
                            className='p-2 rounded-md text-black'
                            {...register("firstname", { required: true })}
                        />
                        {
                            errors.firstname && (
                                <span className="text-red-500 text-sm mt-1">Please enter your name</span>
                            )
                        }
                    </div>

                    {/* Lastname */}
                    <div className='flex flex-col w-1/2'>
                        <label htmlFor='lastname' className="mb-2">Last Name</label>
                        <input type='text'
                            name='lastname'
                            id='lastname'
                            placeholder='Enter last name'
                            className='p-2 rounded-md text-black'
                            {...register("lastname")}
                        />
                        {
                            errors.lastname && (
                                <span className="text-red-500 text-sm mt-1">Please enter your name</span>
                            )
                        }
                    </div>

                </div>
                {/* Email */}
                <div className='flex flex-col'>
                    <label htmlFor="email" className="mb-2">Email Address</label>
                    <input type="email"
                        name='email'
                        id='email'
                        placeholder='Enter email'
                        className='p-2 rounded-md text-black'
                        {...register("email", { required: true })}
                    />
                    {
                        errors.email && (
                            <span className="text-red-500 text-sm mt-1">Please enter a valid email</span>
                        )
                    }
                </div>

                {/* Phone Number */}
                <div className='flex flex-col'>
                    <label htmlFor="phonenumber" className="mb-2">Phone Number</label>
                    <div className="flex gap-3">
                        {/* Country Code Dropdown */}
                        <select
                            name='countrycode'
                            id='countrycode'
                            className='p-2 rounded-md text-black w-20'
                            {...register("countrycode", { required: true })}
                            defaultValue='+91'
                        >
                            {
                                CountryCode.map((element, index) => {
                                    return (
                                        
                                        <option key={index} value={element.code}>
                                            {element.code}
                                        </option>
                                    )
                                })
                            }
                        </select>

                        {/* Phone Number Input */}
                        <input type="number"
                            name='phonenumber'
                            id='phonenumber'
                            placeholder='Enter phone no.'
                            className='p-2 rounded-md text-black flex-grow'
                            {...register("phoneNo", {
                                required: { value: true, message: "Please enter phone number" },
                                maxLength: { value: 10, message: "Invalid phone number" },
                                minLength: { value: 8, message: "Invalid phone number" },
                            })}
                        />
                    </div>
                    {
                        errors.phoneNo &&
                        <span className="text-red-500 text-sm mt-1">Please enter a valid phone number</span>
                    }
                </div>

                {/* Message */}
                <div className='flex flex-col'>
                    <label htmlFor="message" className="mb-2">Message</label>
                    <textarea id='message'
                        name='message'
                        rows="5"
                        placeholder='Enter your message here'
                        className='p-2 rounded-md text-black'
                        {...register("message", { required: true })}
                    />
                    {
                        errors.message && (
                            <span className="text-red-500 text-sm mt-1">Please enter your message</span>
                        )
                    }
                </div>

                <button type='submit' className='bg-yellow-50 hover:bg-yellow-300 text-black font-bold py-2 rounded-md mt-4'>
                    {loading ? 'Sending...' : 'Send Message'}
                </button>
            </div>
        </form>
    )
}

export default ContactUsForm

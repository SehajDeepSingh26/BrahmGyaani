import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { apiConnector } from '../../services/apiConnector';
import { contactusEndpoint } from '../../services/apis';
import CountryCode from "../../data/countrycode.json"

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful  }
    } = useForm();

    const submitContactForm = async (data) => {
        console.log("Form data aggregated by UseForm hook", data)
        try {
            setLoading(true)

            // const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data)
            const response = {success: true}
            console.log(response)

            setLoading(false);

        } catch (error) {
            console.log("Error while sendin req for ContactUs Form", error)
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isSubmitSuccessful ) {
            reset({
                email: "",
                firstname: '',
                lastname: '',
                message: "",
                phoneNo: "",
            })
        }
    }, [reset, isSubmitSuccessful])
    //^ here reset is also added as dependency because sometimes, when we select something on form, new column apppears / "form structure may change", to change reset function at that moment, we add this here.



    return (
        <form onSubmit={handleSubmit(submitContactForm)}>
            <div className="flex flex-col gap-5">
                <div className='flex gap-5 mx-auto'>
                    {/* FirstName */}
                    <div className='flex flex-col'>
                        <label htmlFor='firstname'>First Name</label>
                        <input type='text'
                            name='firstname'
                            id='firstname'
                            placeholder='Enter first name'
                            className='text-black'
                            {...register("firstname", { required: true })}
                        />
                        {
                            errors.firstname && (
                                <span>Please enter your name</span>
                            )
                        }
                    </div>

                    {/* Lastname */}
                    <div className='flex flex-col'>
                        <label htmlFor='lastname'>Last Name</label>
                        <input type='text'
                            name='lastname'
                            id='lastname'
                            placeholder='Enter first name'
                            className='text-black'
                            {...register("lastname")}
                        />
                        {
                            errors.lastname && (
                                <span>Please enter your name</span>
                            )
                        }
                    </div>

                </div>
                {/* Email */}
                <div className='flex flex-col'>
                    <label htmlFor="email">Email Address</label>
                    <input type="email"
                        name='email'
                        id='email'
                        placeholder='Enter email'
                        className='text-black'
                        {...register("email", { required: true })}
                    />
                    {
                        errors.lastname && (
                            <span>Please Enter valid Email</span>
                        )
                    }
                </div>

                {/* ?Phone Number */}
                <div className='flex flex-col gap-2'>

                    <label htmlFor="phonenumber">Enter Phonoe Number</label>
                    <div className="flex flex-row gap-5">
                        {/* dropdown */}
                            <select
                                name='dropdown'
                                id='drodown'
                                className='text-black w-[70px]'
                                {...register("countrycode", {required: true})}
                            >
                                {
                                    CountryCode.map( (element, index) => {
                                        return (
                                            <option key={index}>
                                                {element.code} - {element.country}
                                            </option>
                                        )
                                    })
                                }
                            </select>

                        {/* Phone Number field */}
                            <input type="number"
                                name='phonenumber'
                                id='phonenumber'
                                placeholder='123456789'
                                className='text-black w-[calc(100%-50px)]'
                                {...register("phoneNo", {
                                    required: {value: true, message:"Please enter phone number"},
                                    maxLength: {value:10, message:"Invalid phone Number"},
                                    minLength: {value:8, message:"Invalid phone Number"},

                                })}
                            />

                    </div>
                    {
                        errors.phoneNo  &&
                        <span>Please Enter valid Phone Number</span>
                    }
                </div>

                {/* Message */}
                <div className='flex flex-col'>
                    <label htmlFor="message">Enter Message</label>
                    <textarea id='message'
                        name='message'
                        rows="7"
                        cols="30"
                        placeholder='Enter your message here'
                        className='text-black'
                        {...register("message", { required: true })}
                    />
                    {
                        errors.message && (
                            <span>Please Enter your message</span>
                        )
                    }

                </div>

                <button type='submit' className='rounded-md bg-yellow-50 text-center px-6 text-[16px] font-bold text-black'>
                    Send Message
                </button>
            </div>
        </form>
    )
}

export default ContactUsForm

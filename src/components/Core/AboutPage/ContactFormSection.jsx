import React from 'react'
import ContactUsForm from "../../ContactPage/ContactUsForm"

const ContactFormSection = () => {
    return (
        <div className='mx-auto'>
            <h1 className="text-4xl font-bold text-center mt-8 mb-4 text-richblue-5">
                Get in Touch
            </h1>
            <p className="text-lg text-center text-gray-600 mb-6 text-richblack-300">
                We`d love to hear from you. Please fill out this form.
            </p>
            <div className='mt-10'>
                <ContactUsForm />
            </div>

        </div>
    )
}

export default ContactFormSection

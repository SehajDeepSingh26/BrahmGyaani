import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import {rzpLogo} from "../../assets/Images/TimelineImage.png" //TODO get razorpay logo

const {COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints;

//^ Step 1: Load script sdk of razorpay
function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () =>{
            resolve(true);
        }
        script.onerror = () =>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

//^ Buy Course
export async function buyCourse(courses, token, userDetails, navigate, dispatch){
    const toastId = toast.loading("Loading...")
    try {
        //^load script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

        if(!res){
            toastId.error("RazorPay sdk failed to load")
            return;
        }

        //^ initiate order
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API,
                {courses}, 
                {
                    Authorisation: `Bearer ${token}`,
                })

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message)
        }

        //^ options
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id: orderResponse.data.data.id,
            name: "BrahmGyaani",
            description: "Thankyou for purchasing this course!",
            image: rzpLogo,
            prefill: {
                name: `${userDetails.firstName}`,
                email: userDetails.email
            },
            handler: function(response) {
                //send successfull wala email
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token)

                //verify signature
                verifySignature({...response, courses}, token, navigate, dispatch)
            }
        }

    } catch (error) {
        console.log(" PAYMENT API ERROR...... ", error)
        toast.error("Could not make payment")
    }
    toast.dismiss(toastId)
}

async function sendPaymentSuccessEmail(response, amount, token){
    try {
        // const a = b
    } catch (error) {
        console.log(" Error while sending email...... ", error)
        // toast.error("Could not send emasil")
    }
}

import React from 'react';
import IconBtn from './IconBtn';

const ConfirmationModal = ({ modalData }) => {
    // console.log(modalData);
    try {
        return (
            <div className="fixed  inset-0 flex items-center justify-center z-50">
                {/* Backdrop with blur */}
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

                {/* Modal content */}
                <div className="bg-richblack-100 p-6 rounded shadow-lg flex flex-col gap-4 max-w-sm mx-4 relative z-10">
                    <p className="text-lg font-semibold text-richblack-800">
                        {modalData?.text1}
                    </p>
                    <p className="text-sm text-gray-600 text-richblack-800">
                        {modalData?.text2}
                    </p>
                    <div className="flex flex-row gap-3 mt-4">
                        <IconBtn
                            onclick={modalData?.btn1Handler}
                            text={modalData?.btn1Text}
                            customClasses="bg-blue-500 hover:bg-blue-600 text-white"
                        />
                        <IconBtn
                            onclick={modalData?.btn2Handler}
                            text={modalData?.btn2Text}
                            customClasses="bg-gray-300 hover:bg-gray-400 text-black"
                        />
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.log("Error in ConfirmationModal", error);
        return null; // Render nothing or an error message
    }
};

export default ConfirmationModal;

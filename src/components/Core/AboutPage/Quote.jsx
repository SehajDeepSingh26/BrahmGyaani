import React from 'react'
import HighlightText from "../../../components/Core/Homepage/HighlightText"
const Quote = () => {
    return (
        <div className='text-white flex flex-col items-center gap-y-2'>
            <p><span className='text-richblue-200 text-xl font-bold'>Reflect, Learn, Serve</span>: Empowering Minds for a Benevolent Future.</p>
            <div>
                Verse: <span className='text-yellow-100 font-bold text-xl'>{`"`}Vidya Vichaari Ta Parupkaari{`"`}</span>
            </div>
            <span>
                <span className='text-richblue-200 text-xl font-bold'>Contemplate</span> and reflect upon <span className='text-richblue-200 text-xl font-bold'>knowledge</span>, and you shall be <span className='text-richblue-200 text-xl font-bold'>benevolent</span>.
            </span>
        </div>
    )
}

export default Quote
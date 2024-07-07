import React from 'react'
import HighlightText from "../../../components/Core/Homepage/HighlightText"
const Quote = () => {
  return (
    <div className='text-white'>
        we are passionate about revolutionizing the way we lear. Our innovative platform
        <HighlightText text={"combines Technology"}/>
        <span className=' text-yellow-50'>
            {" "}
            expertise
        </span >
        . ans community to create an
        <span className=' text-yellow-50'>
            {" "} unparalleled educational experience.</span> 
    </div>
  )
}

export default Quote
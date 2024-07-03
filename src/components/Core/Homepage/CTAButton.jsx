/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'

function CTAButton({children, active=false, linkTo}) {
  return (
    <div>
        <Link to={linkTo}>
            <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold ${active? "bg-yellow-50 text-black" : "bg-richblack-800"} hover:scale-95 transition-all duration-200`}>
                {children}
            </div>  
        </Link>
    </div>
  )
}

export default CTAButton

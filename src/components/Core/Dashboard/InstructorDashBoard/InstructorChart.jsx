import React, { useState } from 'react'

import { Chart, registerables } from 'chart.js'
import { Pie } from 'react-chartjs-2';

Chart.register(...registerables)


const InstructorChart = ({courses}) => {

    const [currentChart, setCurrentchart] = useState("students")

    // Random colour generator
    const getRandomColors = (numColors) => {
        const colors = []
        for(let i = 0; i < numColors; i++){
            const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`

            colors.push(color)
        }
        return colors;
    }

    // ^ create data for chart to display studentInfo
    const chartDataForStudents = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.totalStudentsEnrolled),
                backgroundColor: getRandomColors(courses.length)
            }
        ]
    }



    // ^ create data for chart to display IncomeInfo
    const chartDataForIncome = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.totalAmountGenerated),
                backgroundColor: getRandomColors(courses.length)
            }
        ]
    }

    // ^ OPTIONS
    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };


    return (
        <div>
            <p>Visulize</p>
            <div className='flex gap-5'>
                <button
                    onClick={() => setCurrentchart("students")}
                >Student</button>
                <button
                    onClick={() => setCurrentchart("income")}
                >Income</button>
            </div>

            <div>
                <Pie
                    data={currentChart === "students" ? chartDataForStudents : chartDataForIncome}
                    options={options}
                    />
            </div>
        </div>
    )
}

export default InstructorChart

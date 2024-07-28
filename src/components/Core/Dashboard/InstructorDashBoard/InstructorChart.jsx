import React, { useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
    const [currentChart, setCurrentChart] = useState('students');

    // Random colour generator
    const getRandomColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
            colors.push(color);
        }
        return colors;
    };

    // Data for chart to display studentInfo
    const chartDataForStudents = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.totalStudentsEnrolled),
                backgroundColor: getRandomColors(courses.length),
            },
        ],
    };

    // Data for chart to display IncomeInfo
    const chartDataForIncome = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.totalAmountGenerated),
                backgroundColor: getRandomColors(courses.length),
            },
        ],
    };

    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="bg-gray-800 pl-6 pt-4 pr-6 pb-6 rounded-lg shadow-md bg-richblack-800">
            <p className="text-2xl font-semibold mb-4">Visualize</p>
            <div className="flex gap-5 mb-6">
                <button
                    className={`py-2 px-4 rounded ${currentChart === 'students' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                    onClick={() => setCurrentChart('students')}
                >
                    Students
                </button>
                <button
                    className={`py-2 px-4 rounded ${currentChart === 'income' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                    onClick={() => setCurrentChart('income')}
                >
                    Income
                </button>
            </div>
            <div className="relative h-[600px] md:h-[200px] lg:h-[400px]">
                <Pie data={currentChart === 'students' ? chartDataForStudents : chartDataForIncome} options={options} />
            </div>
        </div>
    );
};

export default InstructorChart;

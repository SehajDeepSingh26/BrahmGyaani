import React from 'react'
import toast from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import { catalogData } from '../apis';

const getCatalogPageData = async(categoryId) => {
    let result = [];
    const toastId = toast.loading("Loading...")
    try {
        // console.log("categoryId: " + categoryId);
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, {categoryId});

        if(!response?.data?.success)
            throw new Error("Could not fetch category page data")

        result = response?.data
    } 
    catch (error) {
        console.log("CATALOG page data error", error)
        toast.error(error.message)
        result = error.response?.data
    }

    toast.dismiss(toastId)
    return result;
}

export default getCatalogPageData

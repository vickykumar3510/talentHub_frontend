import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//get all jobs
export const fetchJobs = createAsyncThunk(
    "jobs/fetchJobs",
    async() => {
        const response = await axios.get("http://localhost:3000/jobs")
        return response.data
    }
)

//post jobs
export const postJob = createAsyncThunk(
    "jobs/postJobs",
    async(newJob) => {
        const response = await axios.post("http://localhost:3000/jobs", newJob)
        return response.data
    }
)

const jobsSlice = createSlice({
    name: "jobs",

    initialState:{
        jobs: [],
        loading: false,
        error: null
    },
    reducers: {},
    
    extraReducers: (builder) => {
        //fetch jobs
        builder
        .addCase(fetchJobs.pending, (state) => {
            state.loading = true
        })

        .addCase(fetchJobs.fulfilled, (state, action) => {
            state.loading = false;
            state.jobs = action.payload
        })

        .addCase(fetchJobs.rejected, (state) => {
            state.loading = false;
            state.error = "Failed to fetch jobs"
        })

        //post jobs
        builder
        .addCase(postJob.pending, (state) => {
            state.postLoading = true
        })

        .addCase(postJob.fulfilled, (state, action) => {
            state.postLoading = false;
            state.jobs.push(action.payload)
        })
        
        .addCase(postJob.rejected, (state) => {
            state.postLoading = false
            state.postError = "Failed to post job"
        })
    }
})

export default jobsSlice.reducer
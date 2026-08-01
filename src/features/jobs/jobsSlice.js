import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//get all jobs
export const fetchJobs = createAsyncThunk(
    "jobs/fetchJobs",
    async() => {
        const response = await axios.get("https://talent-hub-backend-gray.vercel.app/jobs")
        return response.data
    }
)

//post jobs
export const postJob = createAsyncThunk(
    "jobs/postJobs",
    async(newJob, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token")

            const response = await axios.post(
                "https://talent-hub-backend-gray.vercel.app/jobs",
                newJob,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            return response.data.job
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to post job"
            )
        }
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
            state.postError = null
        })

        .addCase(postJob.fulfilled, (state, action) => {
            state.postLoading = false;
            state.jobs.push(action.payload)
        })
        
        .addCase(postJob.rejected, (state, action) => {
            state.postLoading = false
            state.postError = action.payload || "Failed to post job"
        })
    }
})

export default jobsSlice.reducer
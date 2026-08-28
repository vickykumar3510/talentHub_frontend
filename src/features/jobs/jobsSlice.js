import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://talent-hub-backend-gray.vercel.app"

//get all jobs
export const fetchJobs = createAsyncThunk(
    "jobs/fetchJobs",
    async() => {
        const response = await axios.get(`${API}/jobs`)
        return response.data
    }
)

export const fetchRecruiterJobs = createAsyncThunk(
    "jobs/fetchRecruiterJobs",
    async(_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${API}/recruiter/jobs`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch jobs"
            )
        }
    }
)

//post jobs
export const postJob = createAsyncThunk(
    "jobs/postJobs",
    async(newJob, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token")

            const response = await axios.post(
                `${API}/jobs`,
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

export const updateJob = createAsyncThunk(
    "jobs/updateJob",
    async({ id, data }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token")

            const response = await axios.put(
                `${API}/jobs/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            return response.data.job
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update job"
            )
        }
    }
)

export const archiveJob = createAsyncThunk(
    "jobs/archiveJob",
    async(id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token")

            const response = await axios.put(
                `${API}/jobs/${id}/archive`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            return response.data.job
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to archive job"
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
            state.loading = false
            state.error = "Failed to fetch jobs"
        })

        builder
        .addCase(fetchRecruiterJobs.pending, (state) => {
            state.loading = true
        })

        .addCase(fetchRecruiterJobs.fulfilled, (state, action) => {
            state.loading = false
            state.jobs = action.payload
        })

        .addCase(fetchRecruiterJobs.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || "Failed to fetch jobs"
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

        builder
        .addCase(updateJob.pending, (state) => {
            state.postLoading = true
            state.postError = null
        })

        .addCase(updateJob.fulfilled, (state, action) => {
            state.postLoading = false
            state.jobs = state.jobs.map((job) =>
                job._id === action.payload._id ? action.payload : job
            )
        })

        .addCase(updateJob.rejected, (state, action) => {
            state.postLoading = false
            state.postError = action.payload || "Failed to update job"
        })

        builder
        .addCase(archiveJob.fulfilled, (state, action) => {
            state.jobs = state.jobs.map((job) =>
                job._id === action.payload._id ? action.payload : job
            )
        })
    }
})

export default jobsSlice.reducer

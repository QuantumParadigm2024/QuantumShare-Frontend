import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    fbpagename: [],
    instaname: null,
    linkname: null,
    youname: null,
    telname: null,
    redditname: null,
    pinterestname: null,
}

const NameSlice = createSlice({
    name: 'profilename',
    initialState,
    reducers: {
        setFbName: (state, action) => {
            // console.log(action.payload);
            state.fbpagename = action.payload
        },
        setInstaName: (state, action) => {
            // console.log(action.payload);
            state.instaname = action.payload
        },
        setLinkName: (state, action) => {
            // console.log(action.payload);
            state.linkname = action.payload
        },
        setYouName: (state, action) => {
            // console.log(action.payload);
            state.youname = action.payload
        },
        setTelName: (state, action) => {
            // console.log(action.payload);
            state.telname = action.payload
        },
        setRedditName: (state, action) => {
            // console.log(action.payload);
            state.redditname = action.payload
        },
        setPinterestName: (state, action) => {
            // console.log(action.payload);
            state.pinterestname = action.payload
        },
    }
})

export const { setFbName, setInstaName, setLinkName, setYouName, setTelName, setRedditName, setPinterestName } = NameSlice.actions
export default NameSlice.reducer
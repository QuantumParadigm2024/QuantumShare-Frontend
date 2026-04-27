import { createSlice } from '@reduxjs/toolkit'

const AiTextSlice = createSlice({
    name: 'Aitext',
    initialState: {
        AiText: ''
    },
    reducers: {
        setAiText: (state, action) => {
            state.AiText = action.payload
        },
        updateCaption: (state, action) => {
            state.AiText = action.payload; 
        },
        clearAiText: (state) => {
            state.AiText = ''; 
        }
    }
})

export const { setAiText, updateCaption, clearAiText } = AiTextSlice.actions

export default AiTextSlice.reducer
/* eslint-disable no-undef */
import { createSlice } from '@reduxjs/toolkit';

const initialState={
    PinterestBoards:[],
}
const pinterestBoardsSlice = createSlice({
    name: 'boards',
    initialState,
    reducers: {
        setPinterestBoards: (state, action) => {
            console.log(action.payload);
            state.PinterestBoards=action.payload
        }
    }
});

export const { setPinterestBoards } = pinterestBoardsSlice.actions;

export default pinterestBoardsSlice.reducer;
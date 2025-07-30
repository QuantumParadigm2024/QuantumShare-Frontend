import {configureStore} from '@reduxjs/toolkit'
import dataslice from '../action/dataslice';
import NameSlice from '../action/NameSlice';
import pageUrlsSlice from '../action/pageUrlsSlice';
import loginStatusSlice from '../action/loginStatusSilce'
import AiTextSlice from '../action/AiTextSlice';
import pinterestBoardsSlice from '../action/pinterestBoardsSlice'

const store= configureStore({
    reducer:{
        Aitext:AiTextSlice,
        profilename:NameSlice,
        data:dataslice,
        loginStatus:loginStatusSlice,
        imageUrls:pageUrlsSlice,
        boards: pinterestBoardsSlice,
    },
    // window._REDUX_DEVTOOLS_EXTENSION_ && window._REDUX_DEVTOOLS_EXTENSION_()
})
export default store;
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [remainingDays, setRemainingDays] = useState(localStorage.getItem('remainingDays'));
    const [remainingCredits, setRemainingCredits] = useState(localStorage.getItem('remainingCredits'));

    return (
        <AppContext.Provider value={{ remainingDays, setRemainingDays, remainingCredits, setRemainingCredits }}>
            {children}
        </AppContext.Provider>
    );
};
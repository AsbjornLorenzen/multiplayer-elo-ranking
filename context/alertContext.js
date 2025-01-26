import React, { createContext, useState } from 'react';

const AlertContext = createContext();

export const AlertContextProvider = ({ children }) => {
    const [alertState, setAlertState] = useState([]);

    return (
        <AlertContext.Provider value={{ alertState, setAlertState }}>
            {children}
        </AlertContext.Provider>
    );
};

export default AlertContext;
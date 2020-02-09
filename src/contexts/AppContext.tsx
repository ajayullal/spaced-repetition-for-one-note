import React, {useState, useMemo} from 'react';

export let AppContext: any;

export default (props: any) => {
    const [errorMessage, setErrorMessage] = useState('');
    
    let contextValue = useMemo(() => {
        return {
            errorMessage,
            setErrorMessage
        };
    }, [errorMessage])

    AppContext = React.createContext(contextValue);

    return (
        <>
            <AppContext.Provider value={contextValue}>
                {props.children}
            </AppContext.Provider>  
        </>
    );
}
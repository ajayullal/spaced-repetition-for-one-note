import React, {useEffect} from 'react';
import MuiAlert from '@material-ui/lab/Alert';

export default ({errorMessage}: any) => {
    useEffect(() => {}, [errorMessage]);

    function Alert(props: any) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const handleClose = (event: any, reason: string) => {
        if (reason === 'clickaway') {
            return;
        }

        errorMessage = ''
    };

return (
        <>     
            {errorMessage? (
                <div style={{
                    marginTop: '70px',
                    width: '110%',
                    marginLeft: '50px'
                }}>
                    <Alert severity="error">
                        {errorMessage}
                    </Alert>
                </div>
            ): null}
        </>);
};
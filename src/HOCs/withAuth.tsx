import useAuth from "../hooks/useAuth";
import React from "react";
import mons from '../services/microsoft-one-note.service';

export default (Component: any) => (props: any) => {
    const [isAuthenticated] = useAuth(props.history);
    
    if(!isAuthenticated){
        mons.redirectUrl = props.match.url;
        return null;
    }else{
        mons.redirectUrl = null;
        return <Component {...props} />
    }
}
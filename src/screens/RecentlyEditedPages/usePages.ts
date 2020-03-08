import { useEffect, useState } from "react";
import mons from '../../services/microsoft-one-note.service';

export default () => {
    let [pages, setPages] = useState();
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        mons.getAllPages().then((allPages: any) => {
            setPages(allPages);
        }).finally(() => {
            setLoading(false);
        });
    }, []);
    
    return [pages, loading];
};
import {useEffect, useState} from 'react';
import mons from '../services/microsoft-one-note.service';

export default () => {
    const [db, setDb] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        mons.getAllDBRows().then((db: any) => {
            setDb(db);
        }).finally(()=> {
            setLoading(false);
        });
    }, [setLoading]);

    return [db, loading, setDb];
};
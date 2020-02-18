import {useState, useEffect} from 'react';
import mons from '../../services/microsoft-one-note.service';

export default (sectionId: string) => {
    let [pages, setPages] = useState();
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        mons.getAllPages(sectionId).then((pages: any) => {
            setPages(pages);
        }).finally(() => {
            setLoading(false);
        });
    }, [sectionId]);

    return [pages, loading];
};
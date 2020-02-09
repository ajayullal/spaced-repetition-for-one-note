import mons from '../../services/microsoft-one-note.service';
import {useState, useEffect} from 'react';

export default (notebookId: string)=> {
    let [sections, useSections] = useState([]);

    useEffect(() => {
        mons.getAllSection(notebookId).then((sections: any) => {
            useSections(sections);
        });
    }, [notebookId]);

    return [sections];
};
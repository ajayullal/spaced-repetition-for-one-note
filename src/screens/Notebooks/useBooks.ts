import {useEffect, useState} from 'react';
import microsoftOneNoteService from '../../services/microsoft-one-note.service';

export default () => {
    let [noteBooks, setNoteBooks] = useState(null);
    let [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        microsoftOneNoteService.getAllNoteBooks().then((allBooks: any) => {
            setNoteBooks(allBooks);
        }).catch((error: any) => {
            setErrorMessage(error);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [noteBooks, errorMessage];
};

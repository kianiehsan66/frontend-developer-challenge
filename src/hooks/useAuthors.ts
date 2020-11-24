import { getAuthors } from './../services/authors';

import React from "react";
import { Author } from '../services/author.interface';

const useAuthors = () => {

    const [authors, authorsSet] = React.useState<Author[]>([]);

    React.useEffect(() => {
        getAuthors().then(data => {
            authorsSet(data);
        });
        console.log('useAuthors');
    }, []);

    return authors;
};

export default useAuthors;
import { Author } from './author.interface';

export const getAuthors = (): Promise<Author[]> => {
  return fetch(`${process.env.REACT_APP_API}/authors`).then((response) => (response.json() as unknown) as Author[]);
};

export const putAuthor = (author: Author) => {

  return fetch(`${process.env.REACT_APP_API}/authors/${author.id}`,
    {
      method: 'PUT',
      body: JSON.stringify(author),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
    }).then((response) => (response.json() as unknown as Author));
}


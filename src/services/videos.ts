import { Video } from './video.interface';
import { getCategories } from './categories';
import { getAuthors } from './authors';
import { Author } from './author.interface';
import { Category } from './category.interface';


export const getVideos = (): Promise<Video[]> => {
  return Promise.all([getCategories(), getAuthors()])
    .then(([categories, authors]) => {
      let videos: Video[] = [];
      authors.forEach(author => {
        videos.push(...authorMovies(author, categories))
      });

      return videos;
    }).catch(error => {
      console.error(error);
      return [] as Video[];
    });
};

const authorMovies = (author: Author, categories: Category[]): Video[] => {
  return author.videos.map(authorVideo => {
    let video: Video = {
      id: authorVideo.id,
      author: author.name,
      name: authorVideo.name,
      categories: categoryNamesFromIds(authorVideo.catIds, categories)
    };
    return video;
  });
}

const categoryNamesFromIds = (catIds: number[], categories: Category[]): string[] => {
  return categories.filter(x => catIds.includes(x.id)).map(y => y.name);
}



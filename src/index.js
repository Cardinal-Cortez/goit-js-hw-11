import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { PhotoAPI } from './get';
import createPostsCard from './posts.hbs';

const searchFormEl = document.querySelector('#search-form');
const btnLoadMoreEl = document.querySelector('.load-more');
const galleryListEl = document.querySelector('.gallery');

const photoApi = new PhotoAPI();
const lightbox = new SimpleLightbox('.gallery a', {
    captionSelector: 'img',
    captionsData: 'alt',
    captionDelay: 250,
    scrollZoom: false,
  }); 

  const handleSearch = async event => {
    event.preventDefault();


    const searchQuery = event.currentTarget.elements['searchQuery'].value;
    photoApi.q = searchQuery;

    try {
        const { data } = await photoApi.fetchPosts();
        console.log(data)
        if (!data.hits.length) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        }else{
            Notify.info(`Hooray! We found ${data.totalHits} images.`)
        }
    
        galleryListEl.innerHTML = createPostsCard(data.hits);
        lightbox.refresh()
        btnLoadMoreEl.classList.remove("is-hidden");
    } catch (err) {
        console.log(err);
    }
};

const handleLoadMore = async () => {
    photoApi.page += 1;

    try {
        const { data } = await photoApi.fetchPosts();
        galleryListEl.insertAdjacentHTML('beforeend', createPostsCard(data.hits));
        lightbox.refresh()
        if ( photoApi.page > Math.ceil(data.totalHits / 4)) {
            btnLoadMoreEl.classList.add("is-hidden");
            Notify.info("We're sorry, but you've reached the end of search results.");
        }
    } catch (err) {
        console.log(err);
    }
};

btnLoadMoreEl.addEventListener('click', handleLoadMore);
searchFormEl.addEventListener('submit', handleSearch);
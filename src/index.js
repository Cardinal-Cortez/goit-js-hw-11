import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { PhotoAPI } from './get';
import createPostsCard from './posts.hbs';

const searchFormEl = document.querySelector('#search-form');
const btnLoadMoreEl = document.querySelector('.load-more');
const galleryListEl = document.querySelector('.gallery');

const photoApi = new PhotoAPI();
const gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    scrollZoom: false,
  }); 

const handleSearch = async event => {
    event.preventDefault();
    
    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
    });

    const searchQuery = event.currentTarget.elements['searchQuery'].value;
    photoApi.q = searchQuery;

    gallery.refresh();

    try {
        const { data } = await photoApi.fetchPosts();
        Notify.info(`Hooray! We found ${data.totalHits} images.`)
        console.log(data)
        if (!data.hits.length) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        }
        galleryListEl.innerHTML = createPostsCard(data.hits);
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

        if (data.totalHits === photoApi.page) {
            btnLoadMoreEl.classList.add("is-hidden");
            Notify.info("We're sorry, but you've reached the end of search results.");
        }
    } catch (err) {
        console.log(err);
    }
};

btnLoadMoreEl.addEventListener('click', handleLoadMore);
searchFormEl.addEventListener('submit', handleSearch);

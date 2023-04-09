import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { PhotoAPI } from './get';
import createPostsCard from './posts.hbs';

const searchFormEl = document.querySelector('#search-form');
const btnLoadMoreEl = document.querySelector('.load-more');
const galleryListEl = document.querySelector('.gallery');

const photoApi = new PhotoAPI();
const gallery = new SimpleLightbox('.gallery a'); 

const handleSearch = async event => {
    event.preventDefault();

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

        if (data.page === photoApi.page) {
            btnLoadMoreEl.classList.add("is-hidden");
        }
    } catch (err) {
        console.log(err);
    }
};

btnLoadMoreEl.addEventListener('click', handleLoadMore);
searchFormEl.addEventListener('submit', handleSearch);

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { PixabayAPI } from './get';
import createPostsCard from './murkup.hbs';

const searchFormEl = document.querySelector('#search-form');
const btnLoadMoreEl = document.querySelector('.load-more');
const galleryListEl = document.querySelector('.gallery');

const photoApi = new PixabayAPI();
const lightbox = new SimpleLightbox('.gallery a', {
    captionSelector: 'img',
    captionsData: 'alt',
    captionDelay: 250,
    scrollZoom: false,
});

const handleSearch = async event => {
    event.preventDefault();
    photoApi.page = 1;
    
    
    const searchQuery = event.currentTarget.elements['searchQuery'].value.trim();
    photoApi.q = searchQuery;
    if (!photoApi.q) {
        return;
    }
   
    try {
        const { data } = await photoApi.fetchPosts();
        console.log(data)
        
        if (!data.hits.length) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        } else {
            Notify.info(`Hooray! We found ${data.totalHits} images.`)
        }

        galleryListEl.innerHTML = createPostsCard(data.hits);
        lightbox.refresh()
        if (data.totalHits <= photoApi.perPage) {
            btnLoadMoreEl.classList.add("is-hidden");
          }else{
            btnLoadMoreEl.classList.remove("is-hidden");
          }
    
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
        if (photoApi.page >= Math.ceil(data.totalHits / 40)) {
            btnLoadMoreEl.classList.add("is-hidden");
            Notify.info("We're sorry, but you've reached the end of search results.");
        }
        
        const galleryEl = document.querySelector(".gallery");
        const { height: cardHeight } = galleryEl.getBoundingClientRect();

        if (cardHeight) {
            window.scrollBy({
                top: cardHeight * 2,
                behavior: "smooth",
            });
        }
    } catch (err) {
        console.log(err);
    }
};

btnLoadMoreEl.addEventListener('click', handleLoadMore);
searchFormEl.addEventListener('submit', handleSearch);


  
  
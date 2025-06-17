import { fetchImages } from './js/pixabay-api.js';
import { renderGallery } from './js/render-functions.js';
import 'izitoast/dist/css/iziToast.min.css';
import iziToast from 'izitoast';

const TOAST_CONFIG = {
  position: 'topRight',
  timeout: 5000
};
iziToast.settings(TOAST_CONFIG);

let CURRENT_PAGE = 1;
const PER_PAGE = 15;


const refs = {
  form: document.querySelector('.form'),
  gallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
  input: document.querySelector('input[name="query"]'),
  loadMoreButton: document.querySelector('.js-load-more'),

}
const UI = {
  showLoader: () => refs.loader.classList.remove('hidden'),
  hideLoader: () => refs.loader.classList.add('hidden'),
  clearGallery: () => refs.gallery.innerHTML = '',
  resetForm: () => refs.input.value = '',
  showError: (message) => iziToast.error({ message }),
  showInfo: (message) => iziToast.info({ message }),
  showLoadMore: () => refs.loadMoreButton.classList.remove('hidden'),
  hideLoadMore: () => refs.loadMoreButton.classList.add('hidden'),
};
const scrollPage = () => {
  const firstCard = refs.gallery.querySelector('.gallery-item');
  if (firstCard) {
    const cardHeight = firstCard.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
};


const handleSubmit = event => {
  event.preventDefault();
  const query = refs.input.value.trim();

  if (!query) {
    UI.showError('Please enter search term');
    return;
  }

  CURRENT_PAGE = 1;
  processSearch(query);
};

const handleLoadMore = async () => {
  CURRENT_PAGE += 1;
  UI.showLoader();
  
  try {
    const data = await fetchImages(refs.input.value.trim(), CURRENT_PAGE, PER_PAGE);
    renderGallery(data.hits);
    scrollPage();

    if (data.hits.length < PER_PAGE) {
      UI.hideLoadMore();
      UI.showInfo("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    UI.showError(`Request failed: ${error.message}`);
  } finally {
    UI.hideLoader();
  }
};


const processSearch = query => {
  UI.showLoader();
  UI.clearGallery();
  UI.hideLoadMore();

  fetchImages(query)
    .then(data => {
      if (!data.hits.length) {
        UI.showError('No images found. Try another query!');
        return;
      }
      
      renderGallery(data.hits);
      if (data.totalHits > PER_PAGE) {
        UI.showLoadMore();
      }
    })
    .catch(error => {
      UI.showError(error.message || 'Search failed');
    })
    .finally(() => {
      UI.hideLoader();
    });
};



refs.form.addEventListener('submit', handleSubmit);
refs.loadMoreButton.addEventListener('click', handleLoadMore);
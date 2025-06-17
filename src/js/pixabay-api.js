import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '50891107-566f278151ee6a9d75cddbbab';

export async function fetchImages(query , page = 1, perPage = 15) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  };

  const url = `${BASE_URL}?${new URLSearchParams(params)}`;

  
  const response = await axios.get(BASE_URL, { params });

  return response.data;
}

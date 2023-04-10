import axios from 'axios';

export class PixabayAPI{
    #BASE_URL = 'https://pixabay.com/api/';
    #API_KEY = '35198425-4c40430781db1dbcd425bce9c';

    q = null;
    page = 1;

    async fetchPosts(){ 
        try{   
        return await axios.get(`${this.#BASE_URL}`, {
                  params: {
                    q: this.q,
                    image_type: "photo",
                    page: this.page,
                    per_page: 40,
                    orientation:" horizontal",
                    key: this.#API_KEY,
                    safesearch: true
                },
            });
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

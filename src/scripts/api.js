import store from './store.js'
 
const BASE_URL = 'https://thinkful-list-api.herokuapp.com/vctrjrvs';

const fullFetch = function (...args) {
     console.log('fullfetch run');
     let error;
     return fetch(...args)
          .then(res => {
               if (!res.ok) {
                    error = { code: res.status };
                    if (!res.headers.get('Content-type').includes('json')) {
                         error.message = res.statusText;
                         return Promise.reject(error);
                    }
               }
               return res.json();
          })
          .then(data => {
               if (error) {
                    error.message = data.message;
                    return Promise.reject(error);
               }
               return data;
          });

};

function getBookmarks() {
     console.log('getBookmarks ran');
     return fullFetch(`${BASE_URL}/bookmarks`);
     //return Promise.resolve('A successful response!');
}

/**
 * @param {string} title
 * @param {string} description
 * @param {string} url
 * @param {number} rating
 **/
function createBookmark({ title, url, desc, rating }) {
     console.log('createBookmarks ran');
     let newBookmark = JSON.stringify({ title, url, desc, rating });
     console.log(newBookmark)
     return fullFetch(`${BASE_URL}/bookmarks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: newBookmark
     });
}

/**
 * 
 * @param {string} id 
 * 
 **/
function deleteBookmark(id) {
     return fullFetch(`${BASE_URL}/bookmarks/${id}`, {
          method: 'DELETE'
     });
}

export default {
     getBookmarks,
     createBookmark,
     deleteBookmark,
     fullFetch
}
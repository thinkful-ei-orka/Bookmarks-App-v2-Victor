import store from './store.js'

const BASE_URL = 'https://thinkful-list-api.herokuapp.com/victor';

//wrapper function to set error handling across the board
const fullFetch = function (arguments = {}) {
     return fetch(...arguments)
          .then(response => {
               if (response.ok) {
                   return response.json();
                    } else {
                     let storeError = `${response.status} : ${response.statusText}`;
                      store.error = storeError;
                      alert(storeError)
                    }
          })
          .then(data => {
               return data;
            })
            .catch(error => {
     store.error = error;
     $('.storeError').html(error)
});
}

const getBookmarks = function () {
     return fullFetch(`${BASE_URL}/bookmarks`);
}

const createBookmark = function (title) {
     let newBookmark = JSON.stringify({
          title
     })
     return fullFetch(`${BASE_URL}/bookmarks`, {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json',
          },
          body: newBookmark
     });
}

const deleteBookmark = function (id) {
     return fullFetch(`${BASE_URL} + /bookmarks/` + id, {
          method: 'DELETE'
     });
}

export default {
     getBookmarks,
     createBookmark,
     deleteBookmark
}
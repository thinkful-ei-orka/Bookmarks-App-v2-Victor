// import $ from 'jquery';
 
import store from './store.js';
import bookmarklist from './bookmarklist.js';
import api from './api.js';

import './styles/index.css';

const main = function () {
     console.log('main start')
     api.getBookmarks()
          .then((bookmarks) => {
               bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
               bookmarklist.render();
          });
     bookmarklist.combineEventListeners();
     bookmarklist.render();
};

$(main)
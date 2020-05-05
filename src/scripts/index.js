import store from './store.';
import bookmarklist from './bookmarklist';
import api from './api';

import './scripts/styles/index.css';

const main = function() {
     api.getBookmarks()
     .then((bookmarks) => {
          bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
          bookmarklist.render();
     });
     combineEventListeners();
     render();
}
$(main)
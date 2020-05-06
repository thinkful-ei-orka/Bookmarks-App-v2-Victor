const store = {
     bookmarks: [],
     adding: false,
     error: null,
     filter: 0
}
 
//find bookmark by id
const findById = function (id) {
     console.log('ran FbyI');
     return store.bookmarks.find(currentBookmark => currentBookmark.id === id)
}

//add bookmark to bookmarks
const addBookmark = function (bookmark) {
     const expandedProperty = { expanded: false };
     Object.assign(expandedProperty, bookmark)
     console.log('ran addB');
     this.bookmarks.push(expandedProperty);
     console.log(store.bookmarks)
}

//find bookmark by id and toggle the expanded view
const findAndToggleExpanded = function (id) {
     console.log(`ran findAndToggleExpanded`);
     const currentBookmark = this.findById(id);
     console.log(currentBookmark);
     currentBookmark.expanded = !currentBookmark.expanded;
     $(`#${id}`).next('.content').toggle();
}

//find bookmark by id and delete
const findAndDelete = function (id) {
     console.log('ran FandD');
     console.log(id);
     console.log(store.bookmarks.length);
     store.bookmarks = store.bookmarks.filter(currentItem => currentItem.id !== id);
     console.log(store.bookmarks.length);
     return store.bookmarks;
     // const index = items.findIndex(bookmark => bookmark.id === id);
     // this.bookmarks.splice(index, 1);
}

const filterByRating = function (rating) {
     console.log(`ran filterByRating`);
     return store.bookmarks.filter(bookmark => bookmark.rating >= rating);
     //store.bookmarks.filter(rating);
}


//minor error handling function
const setError = function (error) {
     this.error = error;
}

export default {
     store,
     bookmarks: store.bookmarks,
     adding: store.adding,
     filter: store.filter,
     error: store.error,
     findById,
     addBookmark,
     findAndDelete,
     findAndToggleExpanded,
     filterByRating,
     setError
}
const store = {
     bookmarks: [],
     adding: false,
     error: null,
     filter: 0
};

//find bookmark by id
const findById = function(id) {
     console.log('ran FbyI');
     return store.bookmarks.find(currentBookmark => currentBookmark.id === id)
}

//add bookmark to bookmarks
const addBookmark = function(bookmark) {
     console.log('ran addB');
     store.bookmarks.push(bookmark);
}

//find bookmark by id and delete
const findAndDelete = function(id) {
     console.log('ran FandD');
     const index = items.findIndex(bookmark => bookmark.id === id);
     this.bookmarks.splice(index, 1);
}

//find bookmark by id and toggle the expanded view
const findAndToggleExpanded = function(id) {
     console.log(`ran findAndToggleExpanded`);
     const foundBookmark = findById(id);
     foundBookmark.expanded = !foundBookmark.expanded;
 }

const filterByRating = function(rating) {
     console.log(`ran filterByRating`);
     const filteredBookmarkArray = [];
     filteredBookmarkArray.push(store.bookmarks.filter(rating))
}

 //minor error handling function
 const setError = function(error) {
     this.error = error;
}


export default {
     store,
     findById,
     addBookmark,
     findAndDelete,
     findAndToggleExpanded,
     filterByRating,
     setError
}
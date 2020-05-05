import store from './store.js';
import api from './api.js';

//render functions

     //establish Add New HTML
     let addNewHTML = `
<h2>Add New Bookmark</h2>
<form role='form' class='js-add-bookmark-form'>
     <fieldset class= 'js-add-fieldset'>
          <label for='js-bookmark-title'>Bookmark Title</label>
               <input type='text' id='js-bookmark-title' required>
          <label for='js-bookmark-url'>Bookmark URL</label>
               <input type='text' id='js-bookmark-url' required>
          <label for='js-bookmark-description'>Description</label>
               <div class='js-bookmark-description'>
               <textarea id='js-bookmark-description' required></textarea>
               </div>
          <div class='rating' id='js-bookmark-rating' required>
               <input type='radio' id='star5' name='rating' value='5' />
               <label class ='full' for='star5' title='5 stars'></label>
               <input type='radio' id='star4' name='rating' value='4' />
               <label class ='full' for='star4' title='4 stars'></label>
               <input type='radio' id='star3' name='rating' value='3' />
               <label class = 'full' for='star3' title='3 stars'></label>
               <input type='radio' id='star2' name='rating' value='2' />
               <label class = 'full' for='star2' title='2 stars'></label>
               <input type='radio' id='star1' name='rating' value='1' />
               <label class = 'full' for='star1' title='1 star'></label>
          </div>
          <div class='js-new-bookmark-buttons'>
          <button type='submit' class='js-create'>Create</button>
          <button type='reset' class='js-cancel'>Cancel</button>
          </div>
     </fieldset>
</form>
`;

     //establish 'home' HTML
     let homeHTML = `
     <h1>My Bookmarks</h1>
<div class='js-bookmark-controls'>
<button class='js-add-button'>Add New</button>
<div class='dropdown'>
<label for='js-rating'></label>
<select id='js-rating-dropdown' value='Filter By Rating'>
  <option value='0'>Filter By Minimum Rating</option>
  <option value='5'>★ ★ ★ ★ ★</option>
  <option value='4'>★ ★ ★ ★</option>
  <option value='3'>★ ★ ★</option>
  <option value='2'>★ ★</option>
  <option value='1'>★</option>
</select>
</div>
</div>
`;

//render() 
const render = function () {
     let html = '';
     let bookmarks = [...store.bookmarks];
     let bookmarkListTitleString = generateBookmarkTitlesString(bookmarks);
     //let newBookmarkForm = generateNewBookmarkForm;
     //if adding, generate addNew, else home
     if (store.adding === true) {
          html += addNewHTML; 
     } else if (store.filter !== 0) {
          html += filterByRating(bookmarks)
     } else
          html += homeHTML;
          console.log('home html added')
          html += bookmarkListTitleString;   
     $('main').html(html)          
     }


//renderError()
const renderError = function() {
     if (store.error) {
          const element = generateError(store.error);
          $('.error-container').html(element);
     } else {
          $('.error-container').empty()
     }
}
//get and generate functions

//getBookmarkIdFromElement
const getBookmarkIdFromElement = function(bookmark) {
     return $(bookmark)
     .closest(`.js-bookmark-element`)
     .data(`bookmark-id`);
}

const getBookmarkRatingFromElement = function(bookmark) {
     return $(bookmark)
     .closest(`.js-bookmark-element`)
     .data(`js-bookmark-rating`);
}

//generateBookmarkTitlesString
const generateBookmarkTitlesString = function (bookmarkList) {
     const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
     return bookmarks.join('');
}

//generateBookmarkElement
const generateBookmarkElement = function(bookmark) {
     let bookmarkTitle = `<span class='js-bookmark-title'>${bookmark.title}</span>`;
     let bookmarkRating = `<span class='js-bookmark-rating'>${bookmark.rating}</span>`;     
     let bookmarkURL = `<span class='js-bookmark-url'>${bookmark.URL}</span>`;     
     let bookmarkDescription = `<span class='js-bookmark-description'>${bookmark.description}</span>`;

     return `
     <button type='button' class='js-collapsible'>${bookmarkTitle} ${bookmarkRating}</button>
	  <div class='content'>
      <div class= 'current-rating'>
	      <span class='fa fa-star'></span>
	      <span class='fa fa-star'></span>
	      <span class='fa fa-star'></span>
	      <span class='fa fa-star'></span>
	      <span class='fa fa-star'></span>
      </div>
      <div>
        <button type='button' href='${bookmarkURL}' class='js-site-link-btn'>
          Visit Site
        </button>
      </div>
      <p>${bookmarkDescription}</p>
    </div>
     `;
}


//generateError
const generateError = function(message) {
     return `
          <section class ='error-content'>
               button id='cancel-error'>X</button>
               <p>${message}</p>
          </section>
          `;
}

// event handler functions
//handleAddNewButtonClicked
const handleAddBookmarkButtonClicked = function() {
     console.log('line 148');
     $('main').on('click', '.js-add-button', event => {
          event.preventDefault();
          console.log('Add new clicked');
          store.adding = !store.adding;
          render();
     });
}

// const toggleAdding = function() {
//      store.adding = !store.adding;
// }

//handleNewBookmarkSubmit
const handleNewBookmarkSubmit = function() {
     console.log('line 163');
     $('main').on('submit', '.js-add-bookmark-form', event => {
          event.preventDefault();
          console.log('handlenewbookmarksubmit ran');
          let bookmark;
          let title = $('#js-bookmark-title').val();
          let url = $('#js-bookmark-url').val();
          let description = $('#js-bookmark-description').val();
          let rating = $('#js-bookmark-rating input:checked').val();
          if (title === '' || url === '') {
               generateError(title, url, rating, description)
          } else {
               bookmark = {
                    title: title,
                    url: url,
                    description: description,
                    rating: rating
               };
               console.log(bookmark);
               api.createBookmark(bookmark)
               //.then(response => response.json())
               .then(bookmark => {
                    //add the bookmark to the list
                    store.addBookmark(bookmark);
                    console.log('bookmark added');
                    store.adding = false;
                    render();
               }).catch(error => {
                    renderError();
               })
          render();
          };
     });
}

//handleFilterOptionClicked
const handleFilterOptionClicked = function() {
     $('.js-dropdown-content').on('click', '.js-rating-option', event => {
          const rating = getBookmarkRatingFromElement(event.currentTarget);
          store.filterByRating(rating);
          render();
     });
}

//handleBookmarkClicked (findandtoggleexpanded)
const handleBookmarkClicked = function() {
     // like in `handleItemCheckClicked`, we use event delegation
     $('.js-bookmark-list').on('click', '.js-bookmark-list-entry', event => {
        // get the id of the bookmark in store.bookmarks
        const id = getBookmarkIdFromElement(event.currentTarget);
        // expand the bookmark
        store.findAndToggleExpanded(id);
        // render the updated bookmark list
        render();
      });
    };

//handleDeleteBookmarkClicked
const handleDeleteBookmarkClicked = function() {
     $('.js-bookmark-list-entry').on('click', '.js-bookmark-delete-button', event => {
          console.log('delete button clicked');
          const id = getBookmarkIdFromElement(event.currentTarget);
          api.deleteBookmark(id)
               .then(response => response.json())
               .then(() => {
                    store.findAndDelete(id)
                    render();
               })
               .catch((error) => {
                    console.log(error);
                    store.setError(error.message);
                    renderError();
               });
     });
}

//handleErrorXClicked
const handleErrorXClicked = function() {
     $('.error-container').on('click', '#cancel-error', () => {
          store.setError(null);
     console.log('error x clicked');          
          renderError();
     });
}

//(clearAddBookmarkForm)
function clearAddBookmarkForm() {
     $('.js-add-bookmark-form').val('');
}

//handleCancelClicked 
const handleCancelClicked = function() {
     $('main').on('click', '.js-cancel', (event) => {
          event.preventDefault();
     console.log('cancel button clicked');          
     clearAddBookmarkForm();
     render();
     })
}

//finally, combine eventhandlers
const combineEventListeners = function () {
     handleNewBookmarkSubmit();
     handleBookmarkClicked();
     handleFilterOptionClicked();
     handleAddBookmarkButtonClicked();
     handleDeleteBookmarkClicked();
     handleCancelClicked();
     handleErrorXClicked();
}

export default {
     combineEventListeners,
     renderError,
     render
}
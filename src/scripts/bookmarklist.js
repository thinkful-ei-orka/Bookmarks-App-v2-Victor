
//get and generate functions

import store from './store';

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
     <button type="button" class="js-collapsible">${bookmarkTitle} ${bookmarkRating}</button>
	  <div class="content">
      <div class= "current-rating">
	      <span class="fa fa-star checked"></span>
	      <span class="fa fa-star checked"></span>
	      <span class="fa fa-star checked"></span>
	      <span class="fa fa-star"></span>
	      <span class="fa fa-star"></span>
      </div>
      <div>
        <button type="button" href='${bookmarkURL}' class="js-site-link-btn">
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
     $('main').on('click', '.js-add-button', event => {
          console.log('Add new clicked');
          store.adding = true;
          render();
     })
}

//handleNewBookmarkSubmit
const handleNewBookmarkSubmit = function() {
     let title = $('#form-title').val();
     let url = $('#form-url').val();
     let description = $('#form-description').val();
     let rating = $('#js-form-rating').val();

     if (title === '' || url === '') {
          generateError(title, url)
     } else {
          let bookmark = {
               title: title,
               url: url,
               description: description,
               rating: rating
          };
     };
     // $('#js-add-bookmark-form').submit(function (event) {
     //      event.preventDefault();
     //const newBookmarkTitle = $('.js-bookmark-list-entry').val();
     //      $('.js-bookmark-list-entry').val();
     api.createBookmark(newBookmarkTitle)
          .then(response => response.json())
          .then((newBookmark) => {
               //add the bookmark to the list
               store.addBookmark(newBookmark);
               render();
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
     console.log('error x clicked');
     $('.error-container').on('click', '#cancel-error', () => {
          store.setError(null);
          renderError();
     });
}

//(clearAddBookmarkForm)
function clearAddBookmarkForm() {
     $('js.add-form').val('');
}

//handleCancelClicked 
const handleCancelClicked = function() {
     console.log('cancel button clicked');
     $('main').on('click', '.js-cancel', (event) => {
     clearAddBookmarkForm();
     })
}

//render functions
//establish Add New HTML
let addNewHTML = `
<h2>Add New Bookmark</h2>
<form role='form' class='js-add-form'>
     <fieldset class= 'js-add-fieldset'>
          <label for='title'>Bookmark Title</label>
               <input type='text' id='form-title' required>
          <label for='url'>Bookmark URL</label>
               <input type='text' id='form-url' required>
          <label for='description'>Description</label>
               <div class='js-textarea'>
               <textarea id='form-description' required></textarea>
               </div>
          <div class='rating' id='js-form-rating' required>
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
          <button class='js-create'>Create</button>
          <button class='js-cancel'>Cancel</button>
          </div>
     </fieldset>
</form>
`;

//establish 'home' HTML
let homeHTML = `
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
`

//render() 
const render = function() {
let bookmarks = [...store.bookmarks];
let bookmarkListTitleString = generateBookmarkTitlesString(bookmarks);
//if adding, generate addNew, else home
if (store.adding = true) {
     $('.js-bookmark-list').html(addNewHTML);
} else
     $('.js-home-controls').html(homeHTML);
     $('.js-bookmark-list').html(bookmarkListTitleString);
          // api.createBookmark(newBookmarkTitle)
          // .then((newBookmark) => {
          //      store.addBookmark(newBookmark);
          //      render();
          // })
          // .catch((error) => {
          //      store.setError(error.message);
          //      renderError();
          // })
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
import store from './store.js';
import api from './api.js';

//render functions

//establish Add New HTML
let addNewHTML = `
<h2>Add New Bookmark</h2>
<div class='error-container'></div>
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
          <div class='rating' id='js-bookmark-rating'>
               <label tabindex='0' class='full' for='star5' title='5 stars'>
               <input type='radio' id='star5' name='rating' value='5'/>
               </label>
               <label tabindex='0' class='full' for='star4' title='4 stars'>
               <input type='radio' id='star4' name='rating' value='4'/>
               </label>
               <label tabindex='0' class='full' for='star3' title='3 stars'>
               <input type='radio' id='star3' name='rating' value='3'/>
               </label>
               <label tabindex='0' class='full' for='star2' title='2 stars'>
               <input type='radio' id='star2' name='rating' value='2'/>
               </label>
               <label tabindex='0' class='full' for='star1' title='1 star'>
               <input type='radio' id='star1' name='rating' value='1'/>
               </label>
          </div>
          <div class='js-new-bookmark-buttons'>
          <button type='submit' class='js-create'>Create</button>
          <button type='reset' class='js-cancel'>Cancel</button>
          </div>
     </fieldset>
</form>
`;

// <label for='js-rating'></label> <line 47?

//establish 'home' HTML
let homeHTML = `
          <h1>My Bookmarks</h1>
          <div class='js-bookmark-controls'>
               <button class='js-add-button'>Add New</button>
               <div class='dropdown'>
                    
                    <select id='js-rating-dropdown'>
                         <option value=''>Filter By Minimum Rating</option>
                         <option value='5'>★ ★ ★ ★ ★</option>
                         <option value='4'>★ ★ ★ ★</option>
                         <option value='3'>★ ★ ★</option>
                         <option value='2'>★ ★</option>
                         <option value='1'>★</option>
                         <option value='0'>0 Stars</option>
                    </select>
               </div>
          </div>
          `;

//render() 
const render = function () {
     renderError();
     let html = '';
     let bookmarks = [...store.bookmarks];
     let bookmarkListTitleString = generateBookmarkTitlesString(bookmarks);
     //let newBookmarkForm = generateNewBookmarkForm;
     //if adding, generate addNew, else home
     if (store.adding === true) {
          html += addNewHTML;
     } else if (store.filter !== 0) {
          html += homeHTML;
          html += generateBookmarkTitlesString(store.filterByRating(store.filter))
     } else {
          html += homeHTML;
          console.log('home html added')
          html += bookmarkListTitleString;
     }
     $('main').html(html)
}
//get and generate functions

//getBookmarkIdFromElement
const getBookmarkIdFromElement = function (bookmark) {
     return $(bookmark)
          .closest('li')
          .data('id')
}

//generateBookmarkTitlesString
const generateBookmarkTitlesString = function (bookmarkList) {
     const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
     return bookmarks.join('');
}

//forEach rating value push a star to the current rating
// function setStars(rating) {
//      let checkedStar = `<span class='fa fa-star checked'></span>`;  
//      for (let i = 1; i < 5; i++) {
//           checkedStar[i]
//      }
// }


//generateBookmarkElement
const generateBookmarkElement = function (bookmark) {
     let bookmarkTitle = `<span class='js-bookmark-title'>${bookmark.title}</span>`;
     let bookmarkRating = `<span class='js-bookmark-rating'>${bookmark.rating}</span>`;
     let bookmarkUrl = `${bookmark.url}`;
     let bookmarkDescription = `${bookmark.desc}`;

     let starBar = '';
     for (let i = 0; i < 5; i++) {
          if (i < bookmark.rating) {
               starBar += `<span class='fa fa-star checked'></span>`;
          } else {
               starBar += `<span class='fa fa-star'></span>`;
          }
     }

     //if expand is false, return active view, else return normal view
     // <button type='button' action='${bookmarkUrl}' class='js-site-link-btn'>
     //      Visit Site
     // </button>     
     return `
          <li data-id='${bookmark.id}'>
          <button type='button' class='js-collapsible'> ${bookmarkTitle}: ${bookmarkRating} Stars</button>
          <div class='content ${!bookmark.expanded ? "hidden": ""}'>
          <div class= 'current-rating'>
               ${starBar}
          </div>
          <div>
          <a class='button' class='js-site-link-btn' href='${bookmarkUrl}' target='_blank'>Visit Site</a>
          <button type='' class='js-bookmark-delete-button'>Delete</button>
          </div>
          <p>${bookmarkDescription}</p>
          </div>
          </li>
          `;

}

//generateError
const generateError = function (message) {
     console.log('error!')
     return `
          <section class ='error-content'>
               <button id='cancel-error'>X</button>
               <p>${message}</p>
          </section>
          `;
}

const renderError = function () {
     if (store.error) {
          const errorElement = generateError(store.error);
          $('.error-container').html(errorElement);
     } else {
          $('.error-container').empty();
     }
};

// event handler functions
//handleAddNewButtonClicked
const handleAddBookmarkButtonClicked = function () {
     console.log('line 148');
     $('main').on('click', '.js-add-button', event => {
          event.preventDefault();
          console.log('Add new clicked');
          store.adding = !store.adding;
          render();
     });
}

//handleNewBookmarkSubmit
const handleNewBookmarkSubmit = function () {
     console.log('line 163');
     $('main').on('submit', '.js-add-bookmark-form', event => {
          event.preventDefault();
          console.log('handlenewbookmarksubmit ran');
          let bookmark;
          let title = $('#js-bookmark-title').val();
          let url = $('#js-bookmark-url').val();
          let description = $('#js-bookmark-description').val();
          let rating = $('#js-bookmark-rating input:checked').val();
          if (title === '' || url === '' || rating === '' || description === '') {
               generateError();
          } else {
               bookmark = {
                    title: title,
                    url: url,
                    desc: description,
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
                    })
                    .catch((error) => {
                         store.setError(error.message);
                         renderError();
                    })
          };
     });
}

//handleFilterOptionClicked
const handleFilterOptionClicked = function () {
     $('main').on('change', '#js-rating-dropdown', event => {
          console.log('rating picked');
          const rating = $('option:selected').val();//(event.currentTarget);
          console.log(rating)
          store.filter = rating
          render();
     });
}

//handleBookmarkClicked (findandtoggleexpanded)
const handleBookmarkClicked = function () {
     $('main').on('click', '.js-collapsible', event => {
          console.log('line 200 clicked')
          const id = getBookmarkIdFromElement(event.currentTarget);
          console.log(id);
          store.findAndToggleExpanded(id);
          render();
          //    $('.content').toggleClass('.content hidden');
     });
};

//handleDeleteBookmarkClicked
const handleDeleteBookmarkClicked = function () {
     $('main').on('click', '.js-bookmark-delete-button', event => {
          console.log('delete button clicked');
          const id = getBookmarkIdFromElement(event.currentTarget);
          console.log(id);
          api.deleteBookmark(id)
               .then(() => {
                    store.findAndDelete(id);
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
const handleErrorXClicked = function () {
     $('.error-container').on('click', '#cancel-error', (event) => {
          event.preventDefault();
          console.log('error x clicked');          
          store.setError(null);
          renderError();
     });
}

//handleCancelClicked 
const handleCancelClicked = function () {
     $('main').on('click', '.js-cancel', (event) => {
          event.preventDefault();
          console.log('cancel button clicked');
          store.adding = !store.adding;
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
     render
}
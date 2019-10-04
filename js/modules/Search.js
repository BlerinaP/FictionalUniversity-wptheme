
import $ from 'jquery';

class Search {
  //1.describe and create/initiate our object
  constructor() {
      this.addSearchHTML();
    this.resultsDiv = $ ("#search-overlay__results");
    this.openButton = $(".js-search-trigger");
    this.closeButton = $(".search-overlay__close");
    this.searchOverlay = $(".search-overlay");
    this.searchOverlayField = $("#search-term");
    this.events();
      this.isOverlayOpen = false;
      this.isSpinnerVisibile = false;
      this.previousValue;
      this.typingTimer;
  }
  //2.events
  events() {
    this.openButton.on("click", this.openOverlay.bind(this));
    this.closeButton.on("click",this.closeOverlay.bind(this));
    $(document).on("keydown",this.keyPressDispatcher.bind(this));
    this.searchOverlayField.on("keyup" , this.typingLogic.bind(this));
  }
  //3. methods(function,actions)
    typingLogic(){
      if(this.searchOverlayField.val() != this.previousValue){

          clearTimeout(this.typingTimer);
          if (this.searchOverlayField.val()) {
              if( !this.isSpinnerVisibile){
                  this.resultsDiv.html('<div class="spinner-loader"></div>');
                  this.isSpinnerVisibile = true;
              }
              this.typingTimer = setTimeout(this.getResults.bind(this), 550);
          } else {
              this.resultsDiv.html('');
              this.isSpinnerVisibile = false;
          }

      }

      this.previousValue = this.searchOverlayField.val();

    }
// Showing "general information" and items that we search. ex: when we search lorem- to show all posts with that content.
     getResults() {
      $.getJSON(universityData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchOverlayField.val(), posts => {
          $.getJSON(universityData.root_url + '/wp-json/wp/v2/pages?search=' + this.searchOverlayField.val(), pages => {
              var combinedResults = posts.concat(pages);
              this.resultsDiv.html(`
           <h2 class="search-overlay__section-title">General Information</h2>
           ${combinedResults.length ?'<ul class ="link-list min-list">' : '<p> No general information matches that search </p>'}
           ${combinedResults.map(item => `<li><a href="${item.link}">${item.title.rendered}</a></li>`).join('')}
           ${combinedResults.length ? '</ul>' : ''}
          `);
              this.isSpinnerVisibile = false;
          });
      });
     }
     // If we touch S or ESC with codes(83,27) overlay to open or close. But using conditions that "if we touch S in other text area to not show Overlay".
    keyPressDispatcher(e){

      if(e.keyCode==83 && !this.isOverlayOpen && !$("input , textarea").is(':focus')){
         this.openOverlay();
      }
      if(e.keyCode==27 && this.isOverlayOpen) {
          this.closeOverlay();
      }
    }
  openOverlay(){
    this.searchOverlay.addClass("search-overlay--active");
    $("body").addClass("body-no-scroll");
    this.searchOverlayField.val('');
    setTimeout(()=> this.searchOverlayField.focus(),301);
    console.log("Our open method just run");
    this.isOverlayOpen=true;
  }
  closeOverlay(){
    this.searchOverlay.removeClass("search-overlay--active");
    $("body"). removeClass("body-no-scroll");
      console.log("Our close method just run");
      this.isOverlayOpen=false;
  }
    addSearchHTML(){
      $("body").append(`
      <div class="search-overlay" >
    <div class="search-overlay__top">
        <div class="container">
            <i class="fa fa-search search-overlay__icon"aria-hidden="true"></i>
            <input type="text" class="search-term" placeholder="What are you looking for?"
                   id="search-term">
            <i class="fa fa-window-close search-overlay__close"aria-hidden="true"></i>
        </div>
    </div>

    <div class="container">
        <div id="search-overlay__results"></div>
    </div>

</div>
      `);
  }
}
export default Search;
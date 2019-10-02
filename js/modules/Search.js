
import $ from 'jquery';

class Search {
  //1.describe and create/initiate our object
  constructor() {
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
              this.typingTimer = setTimeout(this.getResults.bind(this), 2000);
          } else {
              this.resultsDiv.html('');
              this.isSpinnerVisibile = false;
          }

      }

      this.previousValue = this.searchOverlayField.val();

    }

     getResults() {
      $.getJSON('http://localhost:3002/wp-json/wp/v2/posts?search=' + this.searchOverlayField.val(), posts => {
          this.resultsDiv.html(`
           <h2 class="search-overlay__section-title">General Information</h2>
           <ul class ="link-list min-list">
           ${posts.map(item => `<li><a href="${item.link}">${item.title.rendered}</a></li>`).join('')}
           </ul>
          `);
      });
     }
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
    console.log("Our open method just run");
    this.isOverlayOpen=true;
  }
  closeOverlay(){
    this.searchOverlay.removeClass("search-overlay--active");
    $("body"). removeClass("body-no-scroll");
      console.log("Our close method just run");
      this.isOverlayOpen=false;
  }
}
export default Search;
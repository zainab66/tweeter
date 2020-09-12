/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// const data = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": "https://i.imgur.com/73hZDYK.png"
//       ,
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1461116232227
//   },
//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": "https://i.imgur.com/nlhLi3I.png",
//       "handle": "@rd" },
//     "content": {
//       "text": "Je pense , donc je suis"
//     },
//     "created_at": 1461113959088
//   }
// ];

//function to escap unsafe text
const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };


//The input time is milliseconds and the resturn the value is the approximate time in minutes, hours or days
const changeTime = function (time) {
  let temp;
  if (time) {
    const timeMin = Math.floor((Date.now() - Number(time)) / 60000);
    if(timeMin < 1) {
        return 'now';
    } else if (timeMin === 1) {
        return '1 minute ago';
    } else if ( timeMin > 1 & timeMin < 60) {
        return `${timeMin} minutes ago`;
    } else if (timeMin >= 60 & timeMin < 1440) {
        temp = Math.floor(timeMin / 60);
        return `${temp} hours ago`;
    } else {
        temp = Math.floor(timeMin / 1440);
        if (temp === 1) {
          return `one day ago`;
        } else if (temp < 30 ) {
            return `${temp} days ago`;
        } else {
          temp = Math.floor(temp / 365);
          if (temp === 1) {
            return `one year ago`;
          } else {
            return `${temp} years ago`;
          }

        }
    } 

  } else {
    return ''
  } 
};
  const renderTweets = function(tweets) {
    // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
  
    for (let t = tweets.length - 1 ; t >= 0; t--) {
      let attachedTweet = createTweetElement(tweets[t]);
      $('#tweet-container').append(attachedTweet);
    }
  }
  //displaying the tweets dynamically
  const createTweetElement = function(tweet) {
    let $tweet = `
          <article class="tweet">
            <header>
              <div class= "name-photo">
                <img src=${tweet.user.avatars}></img>
               <p>${tweet.user.name}</p>
             </div>
             <p class="handler">${tweet.user.handle}</p>
            </header>
            <p class="tweet-text">${escape(tweet.content.text)}</p>
            <footer>${changeTime(tweet.created_at)}</footer>
          </article>
    ` ;
  
    return $tweet;
  }
  
  //Fetch the tweets using ajax
  const loadTweets = function (){
    $.ajax('/tweets/',{method: 'GET', dataType: 'JSON'}).then( function(response){
  
     renderTweets(response)
    } 
    );
   }
  
  
  $(document).ready(function(){
    $('#error-message').slideUp();
    loadTweets();
  
  
    //Form submission handeling
    $(".tweet-form").on('submit', function(evt) {
      evt.preventDefault();
      if(! $('#tweet-text').val()){
        //alert("Sorry, you can't post an empty tweet");
        $('#error-text').text("Sorry, you can't post an empty tweet");
        $('#error-message').addClass('visible');
        $('#error-message').css('visibility','visible');
        $('#error-message').slideDown();
      } else if ($('#tweet-text').val().length > 140) {
        //alert('Sorry, your tweet is longer than 140 characters!!')
        $('#error-text').text('Sorry, your tweet is longer than 140 characters!!');
        $('#error-message').addClass('visible');
        $('#error-message').slideDown();
      } else {
        const input = $('#tweet-text').serialize();
        $.ajax({url: '/tweets/', method: 'POST', data: $('#tweet-text').serialize()}).then( function(){
          console.log('inside post');
          $('#tweet-text').val('');
          $('.counter').val(140);
          $('#error-message').slideUp();
          $('#error-message').addClass('hidden');
          $('#tweet-container').empty();
          loadTweets();
  
        });
      }
     
    });
  } ) ;
  
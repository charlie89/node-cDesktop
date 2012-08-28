var socket = io.connect('http://localhost:8080');

var lastSearch = {
   keyword: '',
   time: 0
};

var lastResult = {
   time: 0,
   result : {}
};
   
socket.on('connect', function () {
   $('div#center button').attr('id', 'online');
});
   
socket.on('disconnect', function () {
   $('div#center button').attr('id', 'offline');
});

$("#button").click(function() {
   socket.emit('my event' ,"Hello World!");
});

$("input.search").keypress(function(key) {
   var now = new Date().getTime(); 
   var previous = lastSearch.time;
   if ((previous + 1000) <= now) {
      search($('input.search').val() + String.fromCharCode(key.which));
   } else {
      lastSearch.time = now;
      setTimeout(function () {
         if (now === lastSearch.time) search($('input.search').val());
      }, now - (previous + 1000)); 
   }
});

$("button.search").click(search());

//TODO: Add timestamp to verify the right results
function search(searchvalue) {
   lastSearch.time = new Date().getTime();
   lastSearch.keyword = searchvalue || $('input.search').val();
   
   if (lastSearch.keyword.length <= 0) return;
   
   socket.emit('search', lastSearch);
   console.log('EMIT: search - ' + lastSearch.time + ': ' + lastSearch.keyword);
   $('p.status').text('Loading...');
   
   socket.on('search-result', function (e) {
      if ((lastResult.time <= e.time) || (e.time === lastSearch.time)) {
         console.log('ON: search - ' + e.time);
         lastResult = e;
         if (e.type === 'google') {
            $('div.results').html('');
            e.value.forEach(function(a){
               $('div.results').append('<div class=\"resultcentered\"><a href=\"' + a.url + '\">' + a.captionHTML + '</a><div>' + a.description + '</div></div>');    
            });   
         }
         else if (e.type === 'bookmark') {
            //console.log('BOOKMARK: ' + JSON.stringify(e.value));  
            $('div.bookmarks').html('');
            e.value.forEach(function(a){
               $('div.bookmarks').append('<div class=\"bookmark\"><a href=\"' + a.href + '\"><img src =\"' + a.icon + '\"></img><span>' + a.name + '<span></a></div>');    
            });    
         }
      }
   });      
}

$('input.search').focus();

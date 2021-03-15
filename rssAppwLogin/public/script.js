var allFeeds = [];
var allItems = [];
var currFeed = 0;
var currItem = 0;

function generateFeedMarkup()
{
  var markup = "";
  for(var i = 0; i < allFeeds.length; i++){
    markup += "<button onclick='feedSelected("+i+")'>" + allFeeds[i].name + "</button>"
  }
  document.getElementById("feedList").innerHTML = markup;
}

var userObj;
function start()
{
   loadFile("/loginStatus", function(data){
    if(data === "0"){
      window.location.href='./login.html'
      return;
    }
    else{
      userObj = JSON.parse(data);
      getAllFeeds();
    }
  });
}

function getAllFeeds()
{
  loadFile("./getFeeds?userid=" + userObj.local.email, function(data){
      allFeeds = JSON.parse(data);
      generateFeedMarkup();
  });
}

function addFeed()
{
  var feed = prompt("Enter feed URL:");
  var url = "./addFeed?feed=" + feed + "&name=Untitled" + "&userid=" + userObj.local.email;
  loadFile(url, function(data){
      allFeeds = JSON.parse(data);
      generateFeedMarkup();
  });
}

function itemSelected(n)
{
  currItem = n;
  $("#itemList button").removeClass("active");
  $("#itemList button:nth-of-type("+ (n+1) +")").addClass("active");
  var itemInfo = allItems[currItem];


  var markup = "";
  markup += "<img src='"+ itemInfo.artworkUrl100 +"'>";
  markup += "<h1>" + itemInfo.name +"</h1>"
  markup += "<h2>" + itemInfo.artistName +"</h2>"



  document.getElementById("itemDetails").innerHTML = markup;
}
 
function feedSelected(n)
{
  $("#itemListWrapper button").show();
  $("#feedList button").removeClass("active");
  $("#feedList button:nth-of-type("+ (n+1) +")").addClass("active");
  currFeed = n;
  var feed = allFeeds[n].feed;
  loadFile("./getFeedData?feed="+ feed, function(data){
    var obj = JSON.parse(data);
    var items = obj.feed.results;
    allItems = items;
    var markup = "";

    for(var i = 0; i < items.length; i++){
      markup+= "<button onclick='itemSelected("+i+")'>" +
         '<p>' + items[i].name + '</p>'+
         '<p>' + items[i].artistName + '</p>'+
        "</button>"
    }
    document.getElementById("itemList").innerHTML = markup;
  });
}


function deleteFeed()
{
  var conf = confirm("Are you sure?");
  if(conf == false) return;

  loadFile("./deleteFeed?feedid=" + allFeeds[currFeed].id + "&userid=" + userObj.local.email, function(data){
      allFeeds = JSON.parse(data);
      generateFeedMarkup();
      $("#itemListWrapper button").hide();
      $("#itemList").html("");
  });
}


function editFeed()
{
  var newname = prompt("Edit Feed name", allFeeds[currFeed].name);
  if(newname.length <=0 ) return;

  loadFile("./editFeed?feedid=" + allFeeds[currFeed].id +"&newname=" + newname + "&userid=" + userObj.local.email, function(data){
      allFeeds = JSON.parse(data);
      generateFeedMarkup();
      $("#itemListWrapper button").hide();
      $("#itemList").html("");
  });
}

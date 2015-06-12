angular.module('starter.controllers', ['ngCordova'])
.controller('DashCtrl', function($scope, $http) {
  
})

.controller('articleCtrl', function($scope, $http) {
	var gsDayNames = new Array(
				   '7',
				   '1',
				   '2',
				   '3',
				   '4',
				   '5',
				   '6');
	var d = new Date();
	var dayName = gsDayNames[d.getDay()];
	$scope.archive = function() {
	  if(localStorage.getItem("archive") === null) {
	      var articleList=[];
              articleList[0]=dayName;
	  }else{
	     var articleList = JSON.parse(localStorage["archive"]);
             var length = articleList.length;
             if(articleList.indexOf(dayName + "") >= 0){
             }else{
		 articleList[length] = dayName;
             }
          }
          localStorage["archive"] =JSON.stringify(articleList);
            alert(localStorage["archive"]);
        };
  var url = "http://54.148.35.232:1337/gem_info?aId="+dayName;
  $http.get(url).success(function(response) {
    var title = response[0]["title"];
    var content = response[0]["content"];
    var pic_url = response[0]["pic_url"];
    document.getElementById("gem_article").innerHTML="";
    document.getElementById("gem_article").innerHTML="<img src=\""+pic_url+"\" id=\"factImg\">";
    document.getElementById("gem_article").innerHTML = document.getElementById("gem_article").innerHTML + content;
  })
})

//load exh data
.controller('exhCtrl', function($scope, $http) {
  $http.get('lib/data.json').success(function(data){
    var json = data;
    var i = 0;
    var myDiv = "";
    while(i < json.length){
      var date = json[i]['date'][0];
      var info = json[i]['info'][0];
      var name = json[i]['name'][0];
      var regex = /(&nbsp;|<([^>]+)>)/ig
	  ,   body = name
	  ,   exhName = body.replace(regex, "");
      var regex = /(&nbsp;|<([^>]+)>)/ig
          ,   body = info
          ,   exhInfo = body.replace(regex, "").trim();
      if(date != null){
       var arr = exhInfo.split(' ');
       var location = arr[0];
       var website = arr[arr.length - 1];
       myDiv = myDiv + "<div class=\"item item-body\"><h2>"+exhName.trim()+"</h2><h3>"+location+"<br>"+website+"</h3><p>"+date+"</p></div>";
      }
      i++;  
    }
    document.getElementById("exh").innerHTML = myDiv;
  }); 
})

.controller('panelCtrl', function($scope, $ionicLoading, zipCode, $injector) {

	$scope.loadingIndicator = $ionicLoading.show({
		content: 'Loading Data',
		animation: 'fade-in',
		showBackdrop: false,
		maxWidth: 200,
		showDelay: 500
	    });
 	   
  zipCode.then(function(response){
   
	  //document.getElementById("locationName").innerHTML=response.data.city;
    window.localStorage.setItem("city", response.data.city);
    var city = response.data.city;
    var cCode = response.data.countryCode;
     
    $injector.invoke(function($http) {
      var url = "http://openapi.baidu.com/public/2.0/bmt/translate?client_id=1AChyy77qsPGxvNeUewV9QfB&q="+city+"&from=en&to=zh&callback=JSON_CALLBACK";
      $http.jsonp(url).success(function(data){
	var response = data.trans_result[0]['dst'];
	document.getElementById("locationName").innerHTML=response;
      })

    })

    $injector.invoke(function($http) {
      var pic = "http://image.baidu.com/i?tn=baiduimagejson&ct=201326592&cl=2&lm=-1&st=-1&fm=result&fr=&sf=1&fmq=1349413075627_R&pv=&ic=0&nc=1&z=&se=1&showtab=0&fb=0&width=&height=&face=0&istype=2&word="+ city  +"&rn=2&pn=1&callback=JSON_CALLBACK";
      $http.jsonp(pic).success(function(data){
	var picUrl = data.data[0]['objURL'];
        document.getElementById("locationImg").innerHTML='';
        document.getElementById("locationImg").innerHTML="<img src=\"" + picUrl + "\" id='cityImg'>";
      })
    })

    //call my sailsjs api from aws
    $injector.invoke(function($http) {
	    var gsDayNames = new Array(
				       '7',
				       '1',
				       '2',
				       '3',
				       '4',
				       '5',
				       '6');
	    var d = new Date();
	    var dayName = gsDayNames[d.getDay()];
	    var url = "http://54.148.35.232:1337/gem_info?aId="+dayName;
	    //var url = "http://54.148.35.232:1337/gem_info?aId=1";
      $http.get(url)
	.success(function(response) {
		//alert(response);
	  var title = response[0]["title"];
          var content = response[0]["content"];
          var pic_url = response[0]["pic_url"];
          document.getElementById("gemTitle").innerHTML="";
          document.getElementById("gemTitle").innerHTML=title;
          document.getElementById("gemPic").innerHTML="";
          document.getElementById("gemPic").innerHTML="<img src=\""+pic_url+"\">";
        });
	})
   
	//display current date
    $injector.invoke(function($http) {  
      var url = "http://api.k780.com:88/?app=life.time&appkey=13965&sign=179b45462a6136b4073aaba7187529dc&format=json&jsoncallback=JSON_CALLBACK";  
      $http.jsonp(url).success(function(data){
	      //      alert(data);
	if(data['success'] == 1){
	  var date = data['result']['datetime_2'].split(' ')[0];
          var week = data['result']['week_2'];
          document.getElementById("date").innerHTML= date + " " + week;
        }

      })
    })
    
    //weather forecast
    
	/*$injector.invoke(function($http) {  
	    var url = "http://api.k780.com:88/?app=weather.future&weaid=1&appkey=13965&sign=179b45462a6136b4073aaba7187529dc&format=json&jsoncallback=JSON_CALLBACK&weaid="+city.toLowerCase();
      $http.jsonp(url).success(function(data){
	      //alert(data);
	if(data['success'] == 1){
	  var list = data['result'];
          var icon = list[0]['weather_icon'];
          var temp = list[0]['temperature'];
          var weather = list[0]['weather'];
          document.getElementById("weather").innerHTML= "<img src=\""+icon+"\" id='wIcon'>" + "<h2 id = 'temp'>" + weather + "</h2><p id = 'temp'> " + temp  + "</p>"; 
          var i = 1;
          while(i < list.length){
	    var element = list[i];
            var icon = element['weather_icon'];
	    var temp = element['temperature'];
	    var weather = element['weather'];
            var day = element['week'];
            document.getElementById("day"+(i-1)).innerHTML="<img src=\""+icon+"\" id='wIcon'>" + "<h2>" + temp +"</h2>" + "<p>" + day  + "</p>";
	    i ++;
          }
        }
	  })
          $ionicLoading.hide();
	  })*/
	$ionicLoading.hide();
	})
      })

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

//get archived list
.controller('ChatsCtrl', function($scope, $http) {
  if(localStorage["archive"] != null){
    var articleList = JSON.parse(localStorage["archive"]);                   
    var length = articleList.length;                                                           
    var i = 0;                                                            
    var url = 'http://54.148.35.232:1337/gem_info?';                                               
    while(i < length){                                                          
      url = url + '&aId='+articleList[i];
      i ++;
    } 
    $http.get(url).
      success(function(data) {
	var j = 0;
        while(j < data.length){
	    var regex = /(<([^>]+)>)/ig
                ,   body = data[j]['content']
                ,   result = body.replace(regex, "");
	    data[j]['content'] = result;  
	  j++;
        }
	$scope.chats = data;
      }).
      error(function(data, status, headers, config) {
 
      });                                                                                                            
  }else{

  }
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

//archive detail   
.controller('ChatDetailCtrl', function($scope, $stateParams, $http) {
  if(localStorage["archive"] != null){
    var articleList = JSON.parse(localStorage["archive"]);
    var length = articleList.length;
    var i = 0;
    var url = 'http://54.148.35.232:1337/gem_info?';
    while(i < length){
      url = url + '&aId='+articleList[i];
      i ++;
    }
    $http.get(url).
    success(function(data) {
      var i = 0;
      while(i < data.length){
        if(data[i]['aId'] == $stateParams.chatId){
	    var regex = /(<([^>]+)>)/ig
		,   body = data[i]['content']
		,   result = body.replace(regex, "");
	  data[i]['content'] = result;
	  $scope.chat = data[i];
          return;
        }
        i ++;
      }
    }).
    error(function(data, status, headers, config) {

    });
  }else{

  }
    
})

;
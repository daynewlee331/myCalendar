angular.module('starter.services', [])

//.factory('myhttpserv', function ($http) {
	//return $http.get('http://api.go2map.com/engine/api/ipcity/json', { cache: true });
  //})
.factory('zipCode',function($http){
  return $http.get('http://ip-api.com/json', { cache: true });
})
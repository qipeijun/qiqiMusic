/**
 * Created by Administrator on 2016/12/13 0013.
 */
var app = angular.module('myapp',['ionic','myCtrl']);

app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

    $stateProvider.state('main',{
        url:"/qq",
        templateUrl:"view/main.html",
        abstract:true
    }).state('main.recom',{
        url:"/recom",
        views:{
            'recom':{
                templateUrl:"view/recom.html",
                controller:'recomCtrl'
            }
        }
    }).state('main.toplist',{
        url:"/toplist",
        views:{
            'toplist':{

                templateUrl:"view/toplist.html",
                controller:'toplistCtrl'
            }
        }
    }).state('main.search',{
        url:"/search",
        views:{
            'search':{
                templateUrl:"view/search.html",
                controller:'searchCtrl'
            }
        }
    }).state('play',{
        url:'/play',
        templateUrl:"view/play.html",
        controller:'playCtrl'
    });


    $urlRouterProvider.otherwise('/qq/toplist')



}])


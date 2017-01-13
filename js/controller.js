/**
 * Created by Administrator on 2016/12/13 0013.
 */

//创建模块
var myCtrl = angular.module('myCtrl',[]);

myCtrl.controller('recomCtrl',['$scope','$http','$ionicLoading','$rootScope',function($scope,$http,$ionicLoading,$rootScope){

    $scope.data = [];

    $ionicLoading.show({
        template:'<ion-spinner icon="bubbles" class=" spinner-balanced"></ion-spinner>',
        noBackdrop:true
    })

    $http.get('http://route.showapi.com/213-4',{
        params:{
            'showapi_appid':'28337',
            'showapi_sign':'fd70204f4b9542fa9c564c437b233036',
            'topid':5
        }
    }).success(function(data){

        if(data && data.showapi_res_code==0){
            $scope.data = data.showapi_res_body.pagebean.songlist;
            $ionicLoading.hide();
        }
    });


    //获取播放歌曲链接
    $scope.getUrl = function(url,img,id,songname,singername){
        $rootScope.obj = {
            "url":url,
            "bigIMG":img,
            'id':id,
            'songname':songname,
            'singername':singername
        };

        $rootScope.fn();
    }
}]);



myCtrl.controller('toplistCtrl',['$scope','$http','$ionicLoading','$rootScope',function($scope,$http,$ionicLoading,$rootScope){

    $scope.data = [];
    $scope.audioSrc = null;

    $ionicLoading.show({
        template:'<ion-spinner icon="bubbles" class=" spinner-balanced"></ion-spinner>',
        noBackdrop:true
    });

    $http.get('http://route.showapi.com/213-4',{
        params:{
            'showapi_appid':'28337',
            'showapi_sign':'fd70204f4b9542fa9c564c437b233036',
            'topid':26
        }
    }).success(function(data){

        if(data && data.showapi_res_code==0){
            $scope.data = data.showapi_res_body.pagebean.songlist;
            // console.log($scope.data);
            $ionicLoading.hide();
        }
    });


    //获取播放歌曲链接
    $scope.getUrl = function(url,img,id,songname,singername){
        $rootScope.obj = {
            "url":url,
            "bigIMG":img,
            'id':id,
            'songname':songname,
            'singername':singername
        }

        $rootScope.fn();
    }







}]);











myCtrl.controller('searchCtrl',['$scope','$http','$ionicLoading','$rootScope',function($scope,$http,$ionicLoading,$rootScope){


    $scope.data = [];
    $scope.keyword = null;
    $scope.isHOT = true;


    $scope.getValue =function(){
        $scope.keyword = document.getElementById('searchVal').value;

        //判断输入的值
        if($scope.keyword == ""){
            return ;
        }

        $scope.isHOT = false;
        // 页面加载等待动画
        $ionicLoading.show({
            template:'<ion-spinner icon="bubbles" class=" spinner-balanced"></ion-spinner>',
            noBackdrop:true
        })

        $http.get('http://route.showapi.com/213-1',{
            params:{
                'showapi_appid':'28337',
                'showapi_sign':'fd70204f4b9542fa9c564c437b233036',
                'keyword':$scope.keyword
            }
        }).success(function(data){


            if(data && data.showapi_res_code==0){
                $scope.data = data.showapi_res_body.pagebean.contentlist;


                $ionicLoading.hide();
            }

        })

    }


    //获取播放歌曲链接
    $scope.getUrl = function(url,img,id,songname,singername){
        $rootScope.obj = {
            "url":url,
            "bigIMG":img,
            'id':id,
            'songname':songname,
            'singername':singername
        }

        $rootScope.fn();
    }






}])



myCtrl.controller('playCtrl',['$scope','$http','$ionicLoading','$rootScope','$timeout',function($scope,$http,$ionicLoading,$rootScope,$timeout){



    $rootScope.fn =function(){
        // 页面加载等待动画
        $ionicLoading.show({
            template:'<ion-spinner icon="bubbles" class=" spinner-balanced"></ion-spinner>',
            noBackdrop:true
        });

        $scope.obj=$rootScope.obj


        document.getElementById('play').src = $scope.obj.url;

        //获取歌词
        $http.get('http://route.showapi.com/213-2',{
            params:{
                'showapi_appid':'28337',
                'showapi_sign':'fd70204f4b9542fa9c564c437b233036',
                'musicid':$scope.obj.id
            }
        }).success(function(data){
            
            if(data && data.showapi_res_code==0){
            	
                $scope.lrc =reconvert(data.showapi_res_body.lyric);
                $scope.lrc = parseLyric($scope.lrc);
					
                playNow($scope.lrc)

            }

            
        });

        $timeout(function(){
            $ionicLoading.hide();
        },800)

    }

    $rootScope.fn();


    //歌词进度
    function playNow(lrc){
        var play = document.getElementById('play');
        
        play.ontimeupdate = function(){
            var currentTime = Math.round(this.currentTime);
            var index = lrc[currentTime];
           for (var i in lrc) {
               if(i == currentTime){
                   $('.i'+i).addClass('on').siblings().removeClass('on');

                   var top = $('.i' + i)[0].offsetTop;
                   $('#lrc').animate({"top":-top+150},300);
               }
           }

        }
    }


	//控制播放
	$(function(){
        		$(".bf").click(function  () {
        			var audio = document.getElementById("play")
        			if (audio !=null) {
        				if (audio.paused) {
        					audio.play();
        					$(".bf i").addClass('ion-pause').removeClass('ion-play')
        				} else{
        					audio.pause();
        					$(".bf i").addClass('ion-play').removeClass('ion-pause')
        				}
        			}
        		});
        		
        	})


    //解码>>中文
    function reconvert(str){
        str = str.replace(/(\\u)(\w{1,4})/gi,function($0){
            return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g,"$2")),16)));
        });
        str = str.replace(/(&#x)(\w{1,4});/gi,function($0){
            return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g,"$2"),16));
        });
        str = str.replace(/(&#)(\d{1,6});/gi,function($0){
            return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g,"$2")));
        });

        return str;
    }


    //解析歌词的方法
    function parseLyric(lrc) {
        var lyrics = lrc.split("\n");
        var lrcObj = {};
        for(var i=0;i<lyrics.length;i++){
            var lyric = decodeURIComponent(lyrics[i]);
            var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
            var timeRegExpArr = lyric.match(timeReg);
            if(!timeRegExpArr)continue;
            var clause = lyric.replace(timeReg,'');

            for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
                var t = timeRegExpArr[k];
                var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                    sec = Number(String(t.match(/\:\d*/i)).slice(1));
                var time = min * 60 + sec;
                lrcObj[time] = clause;
            }
        }
        return lrcObj;
    }




}]);

var redApp = angular.module('redApp',['angular-loading-bar','ui.bootstrap','ngRoute']);

redApp.config(['$routeProvider', '$locationProvider',
      function($routeProvider, $locationProvider) {
          $routeProvider.when('/elementInfo', {
              controller: 'redCtrl'
          }).when('/attributeInfo', {
              controller: 'redCtrl',
          }).when('/globalInfo', {
              controller: 'redCtrl'            
          }).otherwise({
              redirectTo: '/'
          });
          $locationProvider.html5Mode(false);
      }]);
	  

redApp.factory('shareData', function() {
 var savedData = {}
 function set(data) {
   savedData = data;
 }
 function get() {
  return savedData;
 }

 return {
  set: set,
  get: get
 }

});

// Loading data
redApp.controller('redCtrl', function ($scope, $http,$timeout,$interval,$q,$location,$anchorScroll) {
        
		$scope.checkedOrderSOM = {cos : new Array()};
		$scope.checkedOrder = {co : new Array()};
		$scope.checkedOrderGL = {cog : new Array()};
		$scope.riscG = {RedsInSOMClust : null};
		$scope.ricaG = {RedsContainingAttrs : null};
		$scope.riGG = {selectionReds : null};
		$scope.riAG = {AllReds : null};
		
		//context1
		$scope.plotType = -1; //0-violin,1-notchedBP
		$scope.Trends = -1;
		$scope.$parent.resetPlots=0;
		
		//context2
		$scope.plotType1 = -1; //0-violin,1-notchedBP
		$scope.Trends1 = -1;
		$scope.$parent.resetPlots1=0;
		
		//context 3
		$scope.plotType2 = -1; //0-violin,1-notchedBP
		$scope.Trends2 = -1;
		$scope.$parent.resetPlots2=0;
		
		$scope.onTabSelected = function(tab) {
          var route;
          if (typeof tab === 'string') {
            switch (tab) {
              case 'elementInfo':
                route = 'elementInfo.html';
                break;
				case 'attributeInfo':
                route = 'attributeInfo.html';
                break;
				case 'globalInfo':
                route = 'globalInfo.html';
                break;
              default:
                route = tab;
                break;
            }
          }
		  console.log(route);
          $location.path(route);
        };
		
		$scope.tabs = [{
          slug: 'elementInfo',
          title: "Entity - based exploration",
          content: 'elementInfo.html'
        }, {
          slug: 'attributeInfo',
          title: "Attribute - based exploration",
          content: 'attributeInfo.html'
        }, {
          slug: 'globalInfo',
          title: "Property - based exploration",
          content: 'globalInfo.html'
        }];

    // TODO: The exact location of the data has to be specified in the element.
    $scope.getRedescriptonsInSOMCluster = function (options) {
      $http(options)
      .success(function (data) {
        // attach this data to the scope
        $scope.RedsInSOMClust = data;
		$scope.$parent.riscG.RedsInSOMClust = data;
        $scope.error = '';
      })
      .error(function (data, status) {
        if (status === 404) {
          $scope.error = 'REST server is offline!';
        } else {
          $scope.error = 'Error: ' + status;
        }
      });
    };
	
    $scope.filesChanged = function(element) {
      var reader = new FileReader();
      reader.onload = function(e) {
        $scope.data = JSON.parse(reader.result);
        $scope.$apply(); // apply should come here, not outside onload function!
      }
      reader.readAsText(element.files[0]);  
    };

    $scope.getRedescriptionInfo = function(options) {
      $http(options)
           .success(function (data) {
			  // console.log('function gRI called');
			   //console.log(data);
                $scope.RedescriptionInfo = data;
                $scope.error = '';
           })
          .error(function (data, status) {
              if (status === 404) {
                $scope.error = 'REST server is offline!';
              } else {
                $scope.error = 'Error: ' + status;
              }
          });
    };
	

	 $scope.getInitAtData = function(options) {
      $http(options)
           .success(function (data) {
			  // console.log('function gRI called');
			   //console.log(data);
                $scope.RedAtData = data;
                $scope.error = '';
           })
          .error(function (data, status) {
              if (status === 404) {
                $scope.error = 'REST server is offline!';
              } else {
                $scope.error = 'Error: ' + status;
              }
          });
    };
	
	
	 $scope.getHeatmapData = function(options,deferrer) {//gets the input for heatmap training
      $http(options)
           .success(function (data) {
			  // console.log('function gRI called');
			   //console.log(data);
                $scope.heatData = data;
                $scope.error = '';
				deferrer.resolve();
           })
          .error(function (data, status) {
              if (status === 404) {
                $scope.error = 'REST server is offline!';
              } else {
                $scope.error = 'Error: ' + status;
              }
			   deferrer.reject();
          });
    };
	
	 $scope.getRedescriptionElement = function(options) {//gets the input for heatmap construction
      $http(options)
           .success(function (data) {
			  // console.log('function gRI called');
			   //console.log(data);
                $scope.SOMInput = data;
                $scope.error = '';
           })
          .error(function (data, status) {
              if (status === 404) {
                $scope.error = 'REST server is offline!';
              } else {
                $scope.error = 'Error: ' + status;
              }
          });
    };
	
	 $scope.getRedescriptionElement1 = function(options, deferrer) {//gets the input for heatmap construction
      $http(options)
           .success(function (data) {
			  // console.log('function gRI called');
			   //console.log(data);
                $scope.SOMInput = data;
                $scope.error = '';
				deferrer.resolve();
           })
          .error(function (data, status) {
              if (status === 404) {
                $scope.error = 'REST server is offline!';
				 deferrer.reject();
              } else {
                $scope.error = 'Error: ' + status;
				 deferrer.reject();
              }
          });
    };
	
	$scope.encapsulateGRE = function(options){
		var deferrer = $q.defer();
        
        $timeout(function() {
            $scope.getRedescriptionElement1(options, deferrer);
        }, 100)
        
        return deferrer.promise;
	}
	
	 $scope.getRedundancyInfo = function(options) {
      return $http(options);  
   };
   
    $scope.getCheckTable = function(options) {
      return $http(options);  
   };
   
   $scope.getRedsSupps = function(options) {
      return $http(options);  
   };
   
   $scope.getRedsAttrs = function(options) {
      return $http(options);  
   };
   
      $scope.getGraphData = function(options) {
      return $http(options);  
   };
   
   $scope.generalGETRequest = function(options) {
      return $http(options);  
   };
   
    $scope.getRedundancyAll = function(options) {
      return $http(options);  
   };
	
	 $scope.getRedundancyInfo1 = function(options) {
		return $http(options);
         /*  .success(function (data) {
			  // console.log('function gRI called');
			   //console.log(data);
                $scope.RedundancyInfo1 = data;
                $scope.error = '';
           })
          .error(function (data, status) {
              if (status === 404) {
                $scope.error = 'REST server is offline!';
              } else {
                $scope.error = 'Error: ' + status;
              }
          });*/
    };
	
	  $scope.getRedescriptionSupport = function(options) {
      $http(options)
           .success(function (data) {
                $scope.RedSupports = data;
                $scope.error = '';
           })
          .error(function (data, status) {
              if (status === 404) {
                $scope.error = 'REST server is offline!';
              } else {
                $scope.error = 'Error: ' + status;
              }
          });
    };
	
	function encapsulateSSD(options) {
    	var deferrer = $q.defer();
        
        $timeout(function() {
            $scope.setSOMData(options, deferrer);
        }, 100)
        
        return deferrer.promise;
    }
	

		  $scope.setSOMData = function(options, deferrer) {
      $http(options)
           .success(function (data) {
                console.log("Sent sucessfully!");
				deferrer.resolve();
           })
          .error(function (data, status) {
              if (status === 404) {
                $scope.error = 'REST server is offline!';
              } else {
                $scope.error = 'Error: ' + status;
              }
			  deferrer.reject();
          });
    };
	
	$scope.setGraphData = function(options) {
     return $http(options);
    };
	
	  $scope.setAttrFreq = function(options, deferrer) {
      $http(options)
           .success(function (data) {
                console.log("Sent sucessfully!");
				//$scope.checked = false;
				deferrer.resolve();
           })
          .error(function (data, status) {
              if (status === 404) {
                $scope.error = 'REST server is offline!';
              } else {
                $scope.error = 'Error: ' + status;
              }
          });
    };
	
	
	
	  $scope.setSharedData = function(options, deferrer) {
      $http(options)
           .success(function (data) {
                console.log("Sent sucessfully!");
				$scope.checked = false;
				deferrer.resolve();
           })
          .error(function (data, status) {
              if (status === 404) {
                $scope.error = 'REST server is offline!';
              } else {
                $scope.error = 'Error: ' + status;
              }
          });
    };
	
		$scope.getSharedData = function(options, deferrer) {
      $http(options)
           .success(function (data) {
                $scope.sharedData=data;
				console.log("Received sucessfully!");
				//$scope.checked = false;
				deferrer.resolve();
           })
          .error(function (data, status) {
              if (status === 404) {
                $scope.error = 'REST server is offline!';
              } else {
                $scope.error = 'Error: ' + status;
              }
          });
    };
	
	
		$scope.encapsulateShared = function(options) {
    	var deferrer = $q.defer();
        
        $timeout(function() {
            $scope.setSharedData(options, deferrer);
        }, 100)
        
        return deferrer.promise;
    }
	
	$scope.encapsulateSharedGet = function(options){
		var deferrer = $q.defer();
        
        $timeout(function() {
            $scope.getSharedData(options, deferrer);
        }, 100)
        
        return deferrer.promise;
		
	}
	
	$scope.compHeatmap = function (params) {//function to load and create heatmap on full data
			
		/*scope.attrURL=attrs.redattrUrl;
		scope.attrFreqURL=attrs.attrfreqUrl;
		scope.attrcoocURL=attrs.allredUrl;*/
			
	if(params!=null){
		$scope.checked = true;

	   console.log("Heatmap parameters: ");
		console.log("To display: "+params.toDisplay);
		$scope.params=params;	
	 }
	 else{
		 var params={};
		 params.toDisplay=50;
		 $scope.params=params;
	 }
	 
	 $scope.trainMode=0;
	 
	 var options = {url: $scope.attrURL,
               method: 'GET', 
               params: {
                        }
                          };
						  
		 
		 	function encapsulateHD(options) {
					var deferrer = $q.defer();
				
        $timeout(function() {
            $scope.getHeatmapData(options, deferrer);
        }, 100)
        
				return deferrer.promise;
			}
			
					function encapsulateAttrFreqW(options) {
							var deferrer = $q.defer();
        
						$timeout(function() {
							$scope.setAttrFreq(options, deferrer);
						}, 100)
        
					return deferrer.promise;
					}
		 
		 		$q.all([encapsulateHD(options)]).then(function(){ //compute attribute frequency and return to database
			    console.log("Heatmap data to be processed...");
				console.log( $scope.heatData);
		
				var atHeat=new HashMap();
				
				for(var i=0;i<$scope.heatData.frequency.length;i++){
					atHeat.set($scope.heatData.frequency[i].id,$scope.heatData.frequency[i].frequency);
				}
				
				var returnData=new Array();
				
				for(var i=0;i<$scope.heatData.attributes.length;i++){
					var obj={};
					obj.id=$scope.heatData.attributes[i].id;
					obj.name=$scope.heatData.attributes[i].Name;
					if(atHeat.has(obj.id)){
						obj.frequency=atHeat.get(obj.id);
						returnData.push(obj);
					}
				}
				
				console.log(returnData);
		
		var options1 = {url: $scope.attrFreqURL,
               method: 'POST', 
               params: {
                        },
				data: { 
						userId: JSON.stringify($scope.userInfo.userInfo[0].userId),
						attributeFrequency:  JSON.stringify(returnData),
						attCooc: JSON.stringify($scope.heatData.attCooc),
						selReds: JSON.stringify(new Array())}		
                          };
						  
						  $q.all([encapsulateAttrFreqW(options1)]).then(function(){console.log('Ready to draw heatmap!');
						  
						  
						   console.log($scope.attrcoocURL);
	 console.log($scope.params.toDisplay);
	 
	 	var optionsStart = {url: $scope.attrcoocURL,
               method: 'GET', 
               params: {
				 userId: JSON.stringify($scope.userInfo.userInfo[0].userId),  
				offsetRow: JSON.stringify(1),
			   offsetCol: JSON.stringify(1),
			   toDisplay: JSON.stringify(parseInt($scope.params.toDisplay))
                        }
                          };
	 console.log(optionsStart);
	 $scope.getAttributeCoocurence(optionsStart);
						  
						  });
						  //scope.setAttrFreq(options1);
		   }
				);
  }
  
  $scope.compHeatmapSel = function (params){//function to load and create heatmap on selected data
			
		/*scope.attrURL=attrs.redattrUrl;
		scope.attrFreqURL=attrs.attrfreqUrl;
		scope.attrcoocURL=attrs.allredUrl;*/
		
			
	if(params!=null){
		$scope.checked = true;

	    console.log("Heatmap parameters on selection: ");
		console.log("To display: "+params.toDisplay);
		$scope.params=params;	
	 }
	 else{
		 var params={};
		 params.toDisplay=50;
		 $scope.params=params;
	 }
	 
	 $scope.trainMode=1;
	  
	 var options = {url: $scope.attrURL,
               method: 'GET', 
               params: {
                        }
                          };
						  
		 
		 	function encapsulateHD(options) {
					var deferrer = $q.defer();
				
        $timeout(function() {
            $scope.getHeatmapData(options, deferrer);
        }, 100)
        
				return deferrer.promise;
			}
			
					function encapsulateAttrFreqW(options) {
							var deferrer = $q.defer();
        
						$timeout(function() {
							$scope.setAttrFreq(options, deferrer);
						}, 100)
        
					return deferrer.promise;
					}
		 
		 //compute attr freq and coocurence for a selected group of attributes
		 	 

				var atRed = new HashMap();
				var redAt = new HashMap();
				var selectedReds= new HashSet();
				
				if(typeof $scope.selectionReds == 'undefined'){
					window.alert('Please make a selection!');
					$scope.checked=false;
					$scope.trainMode=0;
					return;
				}
				
				for(var i=0;i<$scope.selectionReds.redescriptions.length;i++)
				selectedReds.add($scope.selectionReds.redescriptions[i].id);
				
				console.log("scope on selection...");
				console.log($scope);
				console.log("selectedReds");
				console.log(selectedReds.size());
				console.log("red attribute data");
				
				for(var i=0;i<$scope.RedAtData.data.length;i++){
					if(!selectedReds.contains($scope.RedAtData.data[i].redId))
						continue;
					//console.log($scope.RedAtData.data[i].redId+" contained");
					if(!atRed.has($scope.RedAtData.data[i].atId)){
						atRed.set($scope.RedAtData.data[i].atId,new HashSet());
						atRed.get($scope.RedAtData.data[i].atId).add($scope.RedAtData.data[i].redId);
					}
					else{
						atRed.get($scope.RedAtData.data[i].atId).add($scope.RedAtData.data[i].redId);
					}
					
					if(!redAt.has($scope.RedAtData.data[i].redId)){
						redAt.set($scope.RedAtData.data[i].redId, new HashSet());
						redAt.get($scope.RedAtData.data[i].redId).add($scope.RedAtData.data[i].atId);
					}
					else{
						redAt.get($scope.RedAtData.data[i].redId).add($scope.RedAtData.data[i].atId);
					}
					
					//atHeat.set($scope.heatData.frequency[i].id,$scope.heatData.frequency[i].frequency);
				}
				
				console.log("mappings...");
				console.log(redAt.count());
				console.log(atRed.count());
				
				var returnDataFreq=new Array();
				
				for(var i=0;i<$scope.heatData.attributes.length;i++){
					var obj={};
					if(atRed.has($scope.heatData.attributes[i].id)){
					obj.id=$scope.heatData.attributes[i].id;
					obj.name=$scope.heatData.attributes[i].Name;
					obj.frequency=atRed.get($scope.heatData.attributes[i].id).size();
					returnDataFreq.push(obj);
					}
				}
			
			var Cooc=new HashMap();
				
				redAt.forEach(function(value, key) {

					var tmpS=value.values();
					
					for(var i=0;i<tmpS.length;i++){
						
						if(!Cooc.has(tmpS[i])){
							var tmp=new HashMap();
							Cooc.set(tmpS[i],tmp);
						}
						
						for(var j=0;j<tmpS.length;j++){
								if(!Cooc.get(tmpS[i]).has(tmpS[j])){
									Cooc.get(tmpS[i]).set(tmpS[j],1);
								}
								else{
									var t=Cooc.get(tmpS[i]);
									var c=t.get(tmpS[j]);
									c=c+1;
									t.set(tmpS[j],c);
									Cooc.set(tmpS[i],t);
								}
						}
					}
				});	
		
		var returnDataCooc=new Array();
		
		var idAr=Cooc.keys();
		console.log(idAr);
		
		for(var i=0;i<idAr.length;i++){
				
				var ts=Cooc.get(idAr[i]);
				console.log("mapping size: "+ts.count());
				var tsV=ts.keys();
				
				for(var j=0;j<tsV.length;j++){
					var obj={};
					obj.id1=idAr[i];
					obj.id2=tsV[j];
					obj.cooc=ts.get(tsV[j]);
					returnDataCooc.push(obj);
				}
		}
		
		console.log(returnDataFreq);
		console.log(returnDataCooc);
				
				//console.log(returnData);
		
		var options1 = {url: $scope.attrFreqURL,
               method: 'POST', 
               params: {
                        },
				data: { 
						userId: JSON.stringify($scope.userInfo.userInfo[0].userId),
						attributeFrequency:  JSON.stringify(returnDataFreq),
						attCooc: JSON.stringify(returnDataCooc),
						selReds: JSON.stringify(selectedReds.values())}		
                          };
						  
						  $q.all([encapsulateAttrFreqW(options1)]).then(function(){console.log('Ready to draw heatmap!');
						  
						  
						   console.log($scope.attrcoocURL);
	 console.log($scope.params.toDisplay);
	 
	 	var optionsStart = {url: $scope.attrcoocURL,
               method: 'GET', 
               params: {
				 userId: JSON.stringify($scope.userInfo.userInfo[0].userId),  
				offsetRow: JSON.stringify(1),
			   offsetCol: JSON.stringify(1),
			   toDisplay: JSON.stringify(parseInt($scope.params.toDisplay))
                        }
                          };
	 console.log(optionsStart);
	 $scope.getAttributeCoocurence(optionsStart);
						  
						  });
  }
	
	
$scope.compHeatmapSelShared = function (params){//function to load and create heatmap on selected data
			
		/*scope.attrURL=attrs.redattrUrl;
		scope.attrFreqURL=attrs.attrfreqUrl;
		scope.attrcoocURL=attrs.allredUrl;*/
			console.log("params sel shared");
		console.log(params);
	
			if( typeof $scope.action == 'undefined'){
				alert('Select an option "load" or "save"!');
				return;
			}
			
			
			$scope.checked=true;
			
			if($scope.action.type == "save"){
				
				var redIds= new HashSet();
				
				$('#redTableDiv').each(function (i, row) {

        // reference all the stuff you need first
        var $row = $(row),
            $checkedBoxes = $row.find('input:checked');

        $checkedBoxes.each(function (i, checkbox) {
            // assuming you layout the elements this way, 
            // we'll take advantage of .next()
            var $checkbox = $(checkbox);
               console.log('checkbox');
			   console.log($checkbox);
			   console.log($checkbox[0].id);
			   redIds.add(parseInt($checkbox[0].id));
			   $checkbox.attr('checked', false); 
        });
    });
	
	
		if(redIds.size()>0){
			
			var res1=redIds.values();
			
			var options1 = {
				url: $scope.sharedDataUrl,
               method: 'POST', 
               data: { 
			   userId: JSON.stringify($scope.userInfo.userInfo[0].userId),
			   sharedData:  JSON.stringify(res1)}
                          };
			
			$scope.encapsulateShared(options1);					
		}
		else{
				
			if(typeof $scope.selectionReds == 'undefined'){
				alert('Please make a selection!');
				$scope.checked=false;
				$scope.trainMode=0;
				return;
			}
				
			//scope.selectionReds
			
			var redIds= new HashSet();
			console.log("selection reds");
			console.log($scope.selectionReds);
			for(var i=0;i<$scope.selectionReds.redescriptions.length;i++){
					redIds.add($scope.selectionReds.redescriptions[i].id);
			}
			
					var res=redIds.values();
			
			var options = {url: $scope.sharedDataUrl,
               method: 'POST', 
               data: { 
			   userId: JSON.stringify($scope.userInfo.userInfo[0].userId),
				sharedData:  JSON.stringify(res)}
                          };
			
			$scope.encapsulateShared(options);
			}
		}
			else if($scope.action.type == "load"){
					
					if(params!=null){
						$scope.checked = true;

						console.log("Heatmap parameters on selection: ");
						console.log("To display: "+params.toDisplay);
						$scope.params=params;	
					}
					else{
							var params={};
							params.toDisplay=50;
							$scope.params=params;
							$scope.checked = true;
						}

					$scope.trainMode=1;//selected
					
					var options = {
						url: $scope.sharedDataUrl,
               method: 'GET', 
                params: {
					userId: JSON.stringify($scope.userInfo.userInfo[0].userId)
                        }
                          };
						  
					 var options1 = {url: $scope.attrURL,
               method: 'GET', 
               params: {
                        }
                          };
		
		 	function encapsulateHD(options) {
					var deferrer = $q.defer();
				
					$timeout(function() {
						$scope.getHeatmapData(options, deferrer);
						}, 100)
        
				return deferrer.promise;
			}		  

				$q.all([$scope.encapsulateSharedGet(options),encapsulateHD(options1)]).then(function(){
					
					console.log('data loaded from shared storage!');
					console.log($scope);
					
					var redIds=new HashSet();
					
					for(var i=0;i<$scope.sharedData.data.length;i++){
						redIds.add($scope.sharedData.data[i].id);
					}
					
					//$scope.selectionReds
			
					function encapsulateAttrFreqW(options) {
							var deferrer = $q.defer();
        
						$timeout(function() {
							$scope.setAttrFreq(options, deferrer);
						}, 100)
        
					return deferrer.promise;
					}
		 
		 //compute attr freq and coocurence for a selected group of attributes

				var atRed = new HashMap();
				var redAt = new HashMap();
				var selectedReds= redIds;
				
				console.log("scope on selection...");
				console.log($scope);
				console.log("selectedReds");
				console.log(selectedReds.size());
				console.log("red attribute data");
				
				for(var i=0;i<$scope.RedAtData.data.length;i++){
					if(!selectedReds.contains($scope.RedAtData.data[i].redId))
						continue;
					//console.log($scope.RedAtData.data[i].redId+" contained");
					if(!atRed.has($scope.RedAtData.data[i].atId)){
						atRed.set($scope.RedAtData.data[i].atId,new HashSet());
						atRed.get($scope.RedAtData.data[i].atId).add($scope.RedAtData.data[i].redId);
					}
					else{
						atRed.get($scope.RedAtData.data[i].atId).add($scope.RedAtData.data[i].redId);
					}
					
					if(!redAt.has($scope.RedAtData.data[i].redId)){
						redAt.set($scope.RedAtData.data[i].redId, new HashSet());
						redAt.get($scope.RedAtData.data[i].redId).add($scope.RedAtData.data[i].atId);
					}
					else{
						redAt.get($scope.RedAtData.data[i].redId).add($scope.RedAtData.data[i].atId);
					}
					
					//atHeat.set($scope.heatData.frequency[i].id,$scope.heatData.frequency[i].frequency);
				}
				
				console.log("mappings...");
				console.log(redAt.count());
				console.log(atRed.count());
				
				var returnDataFreq=new Array();
				
				for(var i=0;i<$scope.heatData.attributes.length;i++){
					var obj={};
					if(atRed.has($scope.heatData.attributes[i].id)){
					obj.id=$scope.heatData.attributes[i].id;
					obj.name=$scope.heatData.attributes[i].Name;
					obj.frequency=atRed.get($scope.heatData.attributes[i].id).size();
					returnDataFreq.push(obj);
					}
				}
			
			var Cooc=new HashMap();
				
				redAt.forEach(function(value, key) {

					var tmpS=value.values();
					
					for(var i=0;i<tmpS.length;i++){
						
						if(!Cooc.has(tmpS[i])){
							var tmp=new HashMap();
							Cooc.set(tmpS[i],tmp);
						}
						
						for(var j=0;j<tmpS.length;j++){
								if(!Cooc.get(tmpS[i]).has(tmpS[j])){
									Cooc.get(tmpS[i]).set(tmpS[j],1);
								}
								else{
									var t=Cooc.get(tmpS[i]);
									var c=t.get(tmpS[j]);
									c=c+1;
									t.set(tmpS[j],c);
									Cooc.set(tmpS[i],t);
								}
						}
					}
				});	
		
		var returnDataCooc=new Array();
		
		var idAr=Cooc.keys();
		console.log(idAr);
		
		for(var i=0;i<idAr.length;i++){
				
				var ts=Cooc.get(idAr[i]);
				console.log("mapping size: "+ts.count());
				var tsV=ts.keys();
				
				for(var j=0;j<tsV.length;j++){
					var obj={};
					obj.id1=idAr[i];
					obj.id2=tsV[j];
					obj.cooc=ts.get(tsV[j]);
					returnDataCooc.push(obj);
				}
		}
		
		console.log(returnDataFreq);
		console.log(returnDataCooc);
				
				//console.log(returnData);
		
		var options1 = {url: $scope.attrFreqURL,
               method: 'POST', 
               params: {
                        },
				data: { 
						userId: JSON.stringify($scope.userInfo.userInfo[0].userId),
						attributeFrequency:  JSON.stringify(returnDataFreq),
						attCooc: JSON.stringify(returnDataCooc),
						selReds: JSON.stringify(selectedReds.values())
						}		
                          };
						  
						  $q.all([encapsulateAttrFreqW(options1)]).then(function(){console.log('Ready to draw heatmap!');
						  
						  
						   console.log($scope.attrcoocURL);
	 console.log($scope.params.toDisplay);
	 
	 	var optionsStart = {url: $scope.attrcoocURL,
               method: 'GET', 
               params: {
				 userId: JSON.stringify($scope.userInfo.userInfo[0].userId),  
				offsetRow: JSON.stringify(1),
			   offsetCol: JSON.stringify(1),
			   toDisplay: JSON.stringify(parseInt($scope.params.toDisplay))
                        }
                          };
	 console.log(optionsStart);
	 $scope.getAttributeCoocurence(optionsStart);
						  
						  });
  });	
			}
}
	
	
	/*var optionsStart = {url: attrs.allredUrl,
               method: 'GET', 
               params: {
               offsetRow: JSON.stringify(1),
			   offsetCol: JSON.stringify(1),
			   toDisplay: JSON.stringify(numItemsToDisplay)
                        }
                          };*/
	
	$scope.getSOMData = function(options) {
      $http(options)
           .success(function (data) {
                //$scope.SomData=data;
				console.log("Received sucessfully!");
           })
          .error(function (data, status) {
              if (status === 404) {
                $scope.error = 'REST server is offline!';
              } else {
                $scope.error = 'Error: ' + status;
              }
          });
    };
	
	
	$scope.getRedescriptionAttributes = function(options) {
      $http(options)
           .success(function (data) {
                $scope.RedAttributes = data;
                $scope.error = '';
           })
          .error(function (data, status) {
              if (status === 404) {
                $scope.error = 'REST server is offline!';
              } else {
                $scope.error = 'Error: ' + status;
              }
          });
    };
	
	$scope.getAttributeRedescriptions = function(options) {
      $http(options)
           .success(function (data) {
                $scope.RedsContainingAttrs = data;
				$scope.$parent.ricaG.RedsContainingAttrs = data;
				$scope.selectionReds = data;
                $scope.error = '';
           })
          .error(function (data, status) {
              if (status === 404) {
                $scope.error = 'REST server is offline!';
              } else {
                $scope.error = 'Error: ' + status;
              }
          });
    };
	
		  $scope.getSOMClusterInfo = function(options) {
				$http(options)
					.success(function (data) {
						//console.log("success");
						$scope.SOMInfo = data;
						$scope.error = '';
				})
					.error(function (data, status) {
						console.log("error");
						if (status === 404) {
							$scope.error = 'REST server is offline!';
							console.log("REST server is offline!")
						} else {
							$scope.error = 'Error: ' + status;
							console.log("Error "+status);
              }
          });
    };
	
	
	  $scope.getAllRedescriptions = function (options) {
      $http.get(options)
      .success(function (data) {
        // attach this data to the scope
        $scope.AllReds = data;
		$scope.$parent.riAG.AllReds =$scope.AllReds;
	  $scope.AllRedsCopy=jQuery.extend(true, {}, data);
        $scope.error = '';
      })
      .error(function (data, status) {
        if (status === 404) {
          $scope.error = 'REST server is offline!';
        } else {
          $scope.error = 'Error: ' + status;
        }
      });
    };
	
	
	$scope.getMaximumMeasureValues = function (options) {
      $http.get(options)
      .success(function (data) {
        // attach this data to the scope
        $scope.Maxima = data;
        $scope.error = '';
      })
      .error(function (data, status) {
        if (status === 404) {
          $scope.error = 'REST server is offline!';
        } else {
          $scope.error = 'Error: ' + status;
        }
      });
    };
	
	$scope.getAttributeCoocurence = function (options) {
      $http(options)
      .success(function (data) {
        // attach this data to the scope
		//console.log("data"); console.log(data);
		//console.log(options);
        $scope.Coocurence = data;
        $scope.error = '';
      })
      .error(function (data, status) {
        if (status === 404) {
          $scope.error = 'REST server is offline!';
        } else {
          $scope.error = 'Error: ' + status;
        }
      });
    };
	
	$scope.compglInfo= function(){
		console.log("function pressed!");
		console.log($scope.allRedUrl);
		$scope.checked=true;
		//$scope.allRedUrl
		$scope.getAllRedescriptions($scope.allRedUrl);
		$scope.checked=false;
	}
	
	$scope.compglInfoSel = function(){
		
		if(typeof $scope.selectionReds == 'undefined'){
			window.alert('Please make a selection!')
			return;
		}

		$scope.AllReds.redescriptions = $scope.selectionReds.redescriptions;
		//compute new min max variable
		var minMax = new Array();
		var numMeasures = $scope.AllReds.measures.length-3;
		var mins=new Array(), maxs=new Array();
		
		console.log("numMeasures");
		console.log(numMeasures);
		
		for(var j=0;j<numMeasures;j++){
			var ind='col'+(j+3);
			mins.push($scope.selectionReds.redescriptions[0][ind]);
			maxs.push($scope.selectionReds.redescriptions[0][ind]);
		}
		
		for(var i=1;i<$scope.selectionReds.redescriptions.length;i++){
			for(var j=0;j<numMeasures;j++){
				var ind='col'+(j+3);
				if(mins[j]>$scope.selectionReds.redescriptions[i][ind])
					mins[j] = $scope.selectionReds.redescriptions[i][ind];	
				
				if(maxs[j]<$scope.selectionReds.redescriptions[i][ind])
					maxs[j] = $scope.selectionReds.redescriptions[i][ind];	
			}
		}
		
		var obj={};
		for(var j=0;j<numMeasures;j++){
			var ind='maxMeasure'+(j+1);
			if(mins[j]!=maxs[j])
			obj[ind]=maxs[j];
			else
				obj[ind]=maxs[j]+0.00001;
		}
		
		for(var j=0;j<numMeasures;j++){
			var ind='minMeasure'+(j+1);
			obj[ind]=mins[j];
		}
		
		minMax.push(obj);
		console.log('minMax');
		console.log(minMax);
		
		$scope.AllReds.minMax=minMax;		
	}
	
	$scope.compglInfoSelSh=function(){
			//sharedDataUrl
			
			//console.log($scope.action.type)
			//console.log($scope.selectionReds);
			
			if( typeof $scope.action == 'undefined'){
				alert('Select an option "load" or "save"!');
				return;
			}
			
			
			$scope.checked=true;
			
			if($scope.action.type == "save"){
				
				//first check if user checked som particular redescriptions for saving, otherwise save cross-filter selection
				
					var redIds= new HashSet();
				
				$('#git-list').each(function (i, row) {

        // reference all the stuff you need first
        var $row = $(row),
            $checkedBoxes = $row.find('input:checked');

        $checkedBoxes.each(function (i, checkbox) {
            // assuming you layout the elements this way, 
            // we'll take advantage of .next()
            var $checkbox = $(checkbox);
               console.log('checkbox');
			   console.log($checkbox);
			   console.log($checkbox[0].id);
			   redIds.add(parseInt($checkbox[0].id));
			   $checkbox.attr('checked', false); 
        });
    });
	
	
		if(redIds.size()>0){
			
			var res1=redIds.values();
			
			var options1 = {
				url: $scope.sharedDataUrl,
               method: 'POST', 
               data: { 
			   userId: JSON.stringify($scope.userInfo.userInfo[0].userId),
			   sharedData:  JSON.stringify(res1)}
                          };
			
			$scope.encapsulateShared(options1);					
		}
		else{
				
			if(typeof $scope.selectionReds == 'undefined'){
				alert('Please make a selection!');
				return;
			}
				
			//scope.selectionReds
			
			console.log("selection reds");
			console.log($scope.selectionReds);
			for(var i=0;i<$scope.selectionReds.redescriptions.length;i++){
					redIds.add($scope.selectionReds.redescriptions[i].id);
			}
			
					var res=redIds.values();
			
			var options = {
				url: $scope.sharedDataUrl,
               method: 'POST', 
               data: { 
			   userId: JSON.stringify($scope.userInfo.userInfo[0].userId),
			   sharedData:  JSON.stringify(res)}
                          };
			
			$scope.encapsulateShared(options);
		}
			}
			else if($scope.action.type == "load"){
					
					var cch = $('#' + 'recSubsM').is(":checked")
					
					console.log('checked');
					console.log(cch);

					var options = {
						url: $scope.sharedDataUrl,
               method: 'GET', 
                params: {
						userId: JSON.stringify($scope.userInfo.userInfo[0].userId)
                        }
                          };

					var saveGraph="http://localhost:8081/graphData";
					var saveGraphG="http://localhost:8081/graphDataG";
					var saveGraphAttr="http://localhost:8081/graphDataAttr";
					var saveGraphAttrG="http://localhost:8081/graphDataAttrG";						  
						  
				var getInPartsAttr = function(startIndex, endIndex, numReds, $scope){
				if(typeof($scope.graphInputAttrs)=='undefined')
						$scope.graphInputAttrs = [];
					return Q.spread([startIndex, endIndex, $scope], function(startIndex, endIndex,$scope){
							var options = {url: saveGraphAttr,
												method: 'GET', 
												params: {
													start: JSON.stringify(startIndex),
													end: JSON.stringify(endIndex),
													nr: JSON.stringify(numReds)
													}
												};
												
									var tmpPromise = $scope.getGraphData(options);	
									
									return tmpPromise;
									
									var tmpRes;
									
									tmpPromise.success(function (data) {
											tmpRes=data;
											console.log('data');
											console.log(tmpRes);
												$scope.error = '';
										})
										.error(function (data, status) {
										if (status === 404) {
											$scope.error = 'REST server is offline!';
										} else {
												$scope.error = 'Error: ' + status;
											}
											}).then(function(){
											
											console.log('got a part of data');
											console.log(tmpRes);
											var tmp=new Array();
											
											
											
											return tmp;
											//convert to HashMap arrayList
											
											});
												
					})
				};
				
				
				var getInParts = function(startIndex, endIndex, numReds, $scope){
				if(typeof($scope.rawGraph)=='undefined')
						$scope.rawGraph = [];
					return Q.spread([startIndex, endIndex, $scope], function(startIndex, endIndex,$scope){
							var options = {url: saveGraph,
												method: 'GET', 
												params: {
													start: JSON.stringify(startIndex),
													end: JSON.stringify(endIndex),
													nr: JSON.stringify(numReds)
													}
												};
												
									var tmpPromise = $scope.getGraphData(options);	
									
									return tmpPromise;
									
									var tmpRes;
									
									tmpPromise.success(function (data) {
											tmpRes=data;
											console.log('data');
											console.log(tmpRes);
												$scope.error = '';
										})
										.error(function (data, status) {
										if (status === 404) {
											$scope.error = 'REST server is offline!';
										} else {
												$scope.error = 'Error: ' + status;
											}
											}).then(function(){
											
											console.log('got a part of data');
											console.log(tmpRes);
											var tmp=new Array();
											
											
											
											return tmp;
											//convert to HashMap arrayList
											
											});
												
					})
				};
					
				$q.all([$scope.encapsulateSharedGet(options)]).then(function(){
					
					
					//depending on the value of a checkbox do standard or non standard
					console.log('data loaded from shared storage!');
					console.log($scope);
					console.log('graph input attrs');
					console.log($scope.$parent.graphInputAttrs);
					console.log('graph input');
					console.log($scope.$parent.graphInput);
					
					var redIds=new HashSet();
					
					for(var i=0;i<$scope.sharedData.data.length;i++){
						redIds.add($scope.sharedData.data[i].id);
					}
					
					//$scope.selectionReds
					
					
					
					var tmp=new Array();
					
					//console.log("set values:");
					console.log(redIds.values());
					
					for(var i=0;i<$scope.AllRedsCopy.redescriptions.length;i++){
						if(redIds.contains($scope.AllRedsCopy.redescriptions[i].id)){
							tmp.push($scope.AllRedsCopy.redescriptions[i]);
						}
					}
					
					console.log("tmp");
					console.log(tmp);
					
				if(cch==false){	
					$scope.AllReds.redescriptions=tmp;
					$scope.checked=false;
					}
					else{
					var numredsLink="http://localhost:8081/numReds";

					
					//non-standard
					if(typeof $scope.$parent.graphInputAttrs == 'undefined'){
						 
						var optionsNR = {url: numredsLink,
											  method: 'GET',
											  params: {}
													};
								 
					var promiseNR = $scope.$parent.generalGETRequest(optionsNR);
				
				
					promiseNR.success(function (data) {
								$scope.$parent.numReds = data;
								$scope.$parent.error = '';
									})
									.error(function (data, status) {
								if (status === 404) {
									$scope.$parent.error = 'REST server is offline!';
							} else {
									$scope.$parent.error = 'Error: ' + status;
									}
									}).then(function(){
											
											console.log('num reds:');
											console.log($scope.$parent.numReds); 
											console.log($scope.$parent.numReds.numReds[0].numReds);
											
											var numReds = $scope.$parent.numReds.numReds[0].numReds;																				
																					
										    //var promiseGR=getAttrGraph($scope);

											var totalNumber = numReds*numReds;
											var numRedsinBucket = Math.floor(2571800/numReds);
											console.log('numRedsInBucket: '+numRedsinBucket);
											var numIters = Math.ceil(totalNumber/(numRedsinBucket*parseInt(numReds)));
											console.log('numIters: '+numIters);

											var promises=new Array();
									
												for(var parts=0;parts<numIters;parts++){
														var startIndex = parts*numRedsinBucket;
														var endIndex = (parts+1)*numRedsinBucket;
															if(endIndex>numReds)
																	endIndex=numReds;
																	promises.push(getInPartsAttr(startIndex,endIndex,numReds,$scope));
																}
									
												var joinedPromise = Q.all(promises);
																										
													joinedPromise.then(function(values){
									
																console.log('All data received!');
																console.log('values');
																console.log(values);
									
																var inputAttrs = [];
									
																console.log('computing input: ');
																console.log('values length: '+values.length);
																console.log('graph length: '+values[0].data.GraphDataAttr.length);
									
																	for(var iv=0;iv<values.length;iv++){
																					for(var iv1=0;iv1<values[iv].data.GraphDataAttr.length;iv1++)
																							inputAttrs.push(values[iv].data.GraphDataAttr[iv1]);
																									console.log(inputAttrs.length);
																	}
									
																		console.log('joined input: ');
																		console.log(inputAttrs);
										
																		values=[];
	
																		console.log("Create parameters and define scope variable here");//put watch on it in the scope.
													
																		var inputForAlgoAttrs={};
													
																			for(var i=0;i<inputAttrs.length;i++){
																							var eds1={};
																					for(var j=0;j<inputAttrs[i].length;j++){
																							if(i==j)
																								continue;
																							if(typeof inputAttrs[i][j] == 'undefined')
																								continue;//retData[i][j]=0.0;//continue;
													
																							eds1[j]=1.0-inputAttrs[i][j];
																							}
																						inputForAlgoAttrs[i]=eds1;
																						}

																						$scope.$parent.graphInputAttrs = inputForAlgoAttrs;
																						console.log('graphInputAttrs loaded');
																						//console.log($scope.$parent.graphInputAttrs);
																						
																			if(typeof $scope.$parent.graphInput == 'undefined'){
																						var optionsNR = {url: numredsLink,
																										method: 'GET',
																										params: {}
																									};
								 
																					var promiseNR = $scope.$parent.generalGETRequest(optionsNR);
				
				
																						promiseNR.success(function (data) {
																										$scope.$parent.numReds = data;
																										$scope.$parent.error = '';
																							})
																									.error(function (data, status) {
																									if (status === 404) {
																											$scope.$parent.error = 'REST server is offline!';
																									} else {
																										$scope.$parent.error = 'Error: ' + status;
																										}
																									}).then(function(){
											
																										console.log('num reds:');
																										console.log($scope.$parent.numReds); 
																										console.log($scope.$parent.numReds.numReds[0].numReds);
											
																										var numReds = $scope.$parent.numReds.numReds[0].numReds;																				
																					
																										//var promiseGR=getAttrGraph($scope);

																														var totalNumber = numReds*numReds;
																														var numRedsinBucket = Math.floor(2571800/numReds);
																														console.log('numRedsInBucket: '+numRedsinBucket);
																														var numIters = Math.ceil(totalNumber/(numRedsinBucket*parseInt(numReds)));
																														console.log('numIters: '+numIters);

																														var promisesE=new Array();
									
																															for(var parts=0;parts<numIters;parts++){
																																	var startIndex = parts*numRedsinBucket;
																																	var endIndex = (parts+1)*numRedsinBucket;
																																		if(endIndex>numReds)
																																				endIndex=numReds;
																																				promisesE.push(getInParts(startIndex,endIndex,numReds,$scope));
																																			}
									
																															var joinedPromiseE = Q.all(promisesE);
																										
																										joinedPromiseE.then(function(values){
									
																													console.log('All data received!');
																													console.log('values');
																													console.log(values);
									
																													var input = [];
									
																													console.log('computing input: ');
																													console.log('values length: '+values.length);
																													console.log('graph length: '+values[0].data.GraphData.length);
									
																														for(var iv=0;iv<values.length;iv++){
																																		for(var iv1=0;iv1<values[iv].data.GraphData.length;iv1++)
																																				input.push(values[iv].data.GraphData[iv1]);
																																						console.log(input.length);
																														}
									
																															console.log('joined input: ');
																															console.log(input);
										
																															values=[];
	
																															console.log("Create parameters and define scope variable here");//put watch on it in the scope.
														
																															var inputForAlgo={};
														
																																for(var i=0;i<input.length;i++){
																																				var eds1={};
																																		for(var j=0;j<input[i].length;j++){
																																				if(i==j)
																																					continue;
																																				if(typeof input[i][j] == 'undefined')
																																					continue;//retData[i][j]=0.0;//continue;
																	
																																				eds1[j]=1.0-input[i][j];
																																				}
																																			inputForAlgo[i]=eds1;
																																			}

																																			$scope.$parent.graphInput = inputForAlgo;
																																			console.log('Entity graph loaded');
																																		//add three cases for attributes
																																		//use GraphInput and GraphInputAttrs
																																		//tmp  
																																		
																																		var indAAJ=0;
																																		var indAEJ=0;

																																		console.log('measures');
																																		console.log($scope.AllReds.measureNames);
																																		
																																		for(var mes=0;mes<$scope.AllReds.measureNames.length;mes++)
																																			if($scope.AllReds.measureNames[mes].shortName == "AEJ")
																																				indAEJ = mes;
																																			else if($scope.AllReds.measureNames[mes].shortName == "AAJ")
																																				indAAJ = mes;
																																		
																																		console.log('indAAJ'); console.log(indAAJ);
																																		console.log('indAEJ'); console.log(indAEJ);
																																		console.log('tmp'); console.log(tmp);
																																		
																																		var num = tmp.length-1;
																																		var sum=0;
																																		var sumAt=0;
																																		
																																		console.log('num'); console.log(num);
																																		console.log('graphs');
																																		console.log($scope.$parent.graphInput);
																																		console.log($scope.$parent.graphInputAttrs);
																																		
																																		for(var vi=0;vi<tmp.length;vi++){
																																			sum=0; sumAt=0;
																																			for(var vi1=0;vi1<tmp.length;vi1++){
																																				if(vi==vi1)
																																					continue;
																																				sum=sum+1.0-$scope.$parent.graphInput[tmp[vi].id+""][tmp[vi1].id+""];
																																				sumAt=sumAt+1.0-$scope.$parent.graphInputAttrs[tmp[vi].id+""][tmp[vi1].id+""];
																											
																																			}
																																			
																																			sum = sum/num;
																																			sumAt = sumAt/num;
																																			console.log('sum '+sum); console.log('sumAt '+sumAt);
																																			
																																			tmp[vi]['col'+(indAEJ)] = sum;
																																			tmp[vi]['col'+(indAAJ)] = sumAt;
																																		}
																																		
																																		var mins = new Array(5);
																																		var maxs = new Array(5);
																																		
																																		for(var vi=0;vi<tmp.length;vi++){
																																			for(var vi1=1;vi1<6;vi1++)
																																			if(vi==0){
																																				mins[vi1-1] = tmp[vi]['col'+(vi1+2)];
																																				maxs[vi1-1] = tmp[vi]['col'+(vi1+2)];
																																			}
																																			else{
																																				if(mins[vi1-1]>tmp[vi]['col'+(vi1+2)])
																																					mins[vi1-1] = tmp[vi]['col'+(vi1+2)];
																																				if(maxs[vi1-1]<tmp[vi]['col'+(vi1+2)])
																																					maxs[vi1-1] = tmp[vi]['col'+(vi1+2)];
																																			}
																																		}
																																		
																																		for(var vi =0; vi<mins.length;vi++){
																																				$scope.AllReds.minMax[0]['maxMeasure'+(vi+1)] = maxs[vi];
																																				$scope.AllReds.minMax[0]['minMeasure'+(vi+1)] = mins[vi];
																																		}
																																		
																																		console.log('computed reds');
																																		console.log(tmp);
																																		$scope.AllReds.redescriptions=tmp;
																																		$scope.checked=false;
																																		
																																		//add measure computation part 
																																		
																																});
																														});
																				}

																			else{
																				//add measure computation here and modify reds
																			}
																						
																						
																		});
																});	
					}
					else{
						
						if(typeof $scope.$parent.graphInput == 'undefined'){
								//add code
						}
						else{
					//compute similarity measures
					
					$scope.AllReds.redescriptions=tmp;
					$scope.checked=false;
					}
				  }
				}
			});				
	}
}
	
	
	$scope.trainSom = function (params) {//functions to be defined on a button press
	if(params!=null){
		$scope.trainMode=0;//all data;
		$scope.checked = true;
		var timer=$timeout(function(){$scope.progress="Getting SOM parameters!";},0);

		
	var timer1=$timeout(function(){
	   console.log("SOM parameters: ");
		console.log("Num rows: "+params.nRows);
		console.log("Num cols: "+params.nCols);
		console.log("Learning rate: "+params.lRate);
		console.log("Number of iterations: "+params.nIter);
		$scope.params=params;
		$scope.progress="Parameters set!";		
		},1000);
		

								
		/*var timer2=$timeout(function(){
		$scope.params=null;
		$scope.progress="Parameters cleared!";

		console.log("data in a button: ");
		console.log($scope.SOMInput);},2000);*/
	
		//var timer3=$timeout(function(){console.log("setting params to the old value!"); $scope.params=params; $scope.progress="Parameters restored!";},3000);
		var timer4=$timeout(function(){$scope.progress="Training SOM map!";},2000);
		
		var elemIds=new HashSet();
		var TmpIdRedIdMap=new HashMap();
		var RedIdTmpIdMap=new HashMap();
		var ElementRedescriptionMap=new HashMap();
		var feat = new Array();
		var som;
		
		var timer6=$timeout(function(){
			
			var count=0;
			for(var i=0;i<$scope.SOMInput.redElems.length;i++){
				
				if(!RedIdTmpIdMap.has($scope.SOMInput.redElems[i].id)){
					RedIdTmpIdMap.set($scope.SOMInput.redElems[i].id,count);
					TmpIdRedIdMap.set(count,$scope.SOMInput.redElems[i].id);
					count=count+1;
				}
				
				elemIds.add($scope.SOMInput.redElems[i].elementID);
				if(!ElementRedescriptionMap.has($scope.SOMInput.redElems[i].elementID)){
					var tS=new HashSet();
					tS.add($scope.SOMInput.redElems[i].id);
					ElementRedescriptionMap.set($scope.SOMInput.redElems[i].elementID,tS);
					}
					else{
						var tS=ElementRedescriptionMap.get($scope.SOMInput.redElems[i].elementID);
						tS.add($scope.SOMInput.redElems[i].id);
						ElementRedescriptionMap.set($scope.SOMInput.redElems[i].elementID,tS);
					}	
			}
			
			for(var i=0;i<TmpIdRedIdMap.keys().length;i++){
				var id=TmpIdRedIdMap.get(i);
				feat.push('red'+id);
			}
			
			som = new Som({features:  feat, iterationCount: elemIds.size(),initialLearningRate: params.lRate, width: params.nCols, height: params.nRows});
			console.log('end create som', +new Date());
			
			som.init({});
			
		console.log(ElementRedescriptionMap);
		console.log(elemIds);
		console.log(som);
		
				 	ElementCoverage= new Array();
					var elems = elemIds.values();
								
					var q = 0;
				var interval = $interval(SOMIteration, 10,elemIds.size());
					
						function SOMIteration() {
							//$scope.someThing = q;

		 console.log('start', +new Date());
		 
		 var progCount=0;
		 
				
				var elemString = ''+elems[q];
				
				var elemReds=ElementRedescriptionMap.get(elems[q]);
				//console.log("Reds: "); console.log(elemReds.values()); console.log(elemReds.size());
				
				var somInput={};
				for(var j=0;j<TmpIdRedIdMap.keys().length;j++){
					var propName = feat[j];
					if(elemReds.contains(TmpIdRedIdMap.get(j))){
						somInput[propName]=1;
					}
					else{
						somInput[propName]=0;
					}
				}
				
				/*if(q==0){
					console.log('somInput');
					console.log(somInput);
					console.log('element: '+elems[q]);
				}*/
				//console.log("somInput"); console.log(somInput);
				//console.log("elemString: "); console.log(elemString);		
			
			    som.train(elemString,somInput);

				var ob={};
				ob.name=elems[q];
				ob.count=ElementRedescriptionMap.get(elems[q]).size();
				ElementCoverage.push(ob);

							console.log("q: "+q);
							if(q<(elemIds.size()-1))
							$scope.progress=(Math.floor(q/elemIds.size()*100))+"% complete!";
						else {$scope.progress="100 % complete!";  var tt; $scope.checked = false; $scope.action=tt;};
    
						//if(q == 19) $interval.cancel(interval);
							//else q++;
							q++;
							}
							
							interval.then(function(){ 
							
							som.cleanData();
				
				
				som.nodeList.NumRows=som.height;
			som.nodeList.NumCols=som.width;
			
			console.log('node list: ',som.nodeList);
				///////////////SOM map///////////////
			
			$scope.progress="SOM map trained!";
			
			//for(var j=0;j<som.height*som.width;j++)
				//som.nodeList[j].neighbors=elems;
			
			console.log("changed som"); console.log(som);
			
			var srd = new Array();
			
			for(var k=0;k<feat.length;k++)
				srd.push(parseInt(feat[k].replace('red','')));
			
		var options = {url: $scope.SOMURL,
               method: 'POST', 
               data: { 
						userId: JSON.stringify($scope.userInfo.userInfo[0].userId),
						somDat:  JSON.stringify(som.nodeList),
						elCov: JSON.stringify(ElementCoverage),
						numRows: JSON.stringify(som.nodeList.NumRows),
						numCols: JSON.stringify(som.nodeList.NumCols),
						selReds: JSON.stringify(srd)}
                          };
		//scope.getRedescriptionInfo(options);
		$q.all([encapsulateSSD(options)]).then(function(){

		var options1 = {url: $scope.CLusterInfoURL,
               method: 'GET', 
               params: {
				   userId: JSON.stringify($scope.userInfo.userInfo[0].userId)
                        }
                          };
						  $scope.getSOMClusterInfo(options1/*$scope.CLusterInfoURL*/);
						  //$scope.getSOMData(options1)
		   }
				);					
							});
							},2500);
	}
	else{
		window.alert("Insert input parameters!");
	}
  };
		
	$scope.trainOnSelection= function (params) {
		console.log("train on selection initiated!");
		if(params!=null){
			$scope.trainMode=1;//on selection
			$scope.checked = true;
		var timer=$timeout(function(){$scope.progress="Getting SOM parameters!";},0);

		
	var timer1=$timeout(function(){
	   console.log("SOM parameters: ");
		console.log("Num rows: "+params.nRows);
		console.log("Num cols: "+params.nCols);
		console.log("Learning rate: "+params.lRate);
		console.log("Number of iterations: "+params.nIter);
		$scope.params=params;
		$scope.progress="Parameters set!";		
		},1000);
		

								
		/*var timer2=$timeout(function(){
		$scope.params=null;
		$scope.progress="Parameters cleared!";

		console.log("data in a button: ");
		console.log($scope.SOMInput);},2000);*/
	
		//var timer3=$timeout(function(){console.log("setting params to the old value!"); $scope.params=params; $scope.progress="Parameters restored!";},3000);
		var timer4=$timeout(function(){$scope.progress="Training SOM map!";},2000);
		
		/*load selected elements into set*/
		
		var elemIds = new HashSet();
		var selectedReds = new HashSet();
		var TmpIdRedIdMap = new HashMap();
		var RedIdTmpIdMap = new HashMap();
		var ElementRedescriptionMap = new HashMap();
		var feat = new Array();
		var som;
		
		var timer6=$timeout(function(){
			//scope.selectionReds=newData;
			for(var i=0;i<$scope.selectionReds.somElements.length;i++)
				elemIds.add($scope.selectionReds.somElements[i].id);
			
			for(var i=0;i<$scope.selectionReds.redescriptions.length;i++)
				selectedReds.add($scope.selectionReds.redescriptions[i].id);
			
			var count=0;
			for(var i=0;i<$scope.SOMInput.redElems.length;i++){
				
				if(!selectedReds.contains($scope.SOMInput.redElems[i].id))
					continue;
				
				if(!RedIdTmpIdMap.has($scope.SOMInput.redElems[i].id)){
					RedIdTmpIdMap.set($scope.SOMInput.redElems[i].id,count);
					TmpIdRedIdMap.set(count,$scope.SOMInput.redElems[i].id);
					count=count+1;
				}
				
				if(!elemIds.contains($scope.SOMInput.redElems[i].elementID))
					continue;
				
				if(!ElementRedescriptionMap.has($scope.SOMInput.redElems[i].elementID)){
					var tS=new HashSet();
					tS.add($scope.SOMInput.redElems[i].id);
					ElementRedescriptionMap.set($scope.SOMInput.redElems[i].elementID,tS);
					}
					else{
						var tS=ElementRedescriptionMap.get($scope.SOMInput.redElems[i].elementID);
						tS.add($scope.SOMInput.redElems[i].id);
						ElementRedescriptionMap.set($scope.SOMInput.redElems[i].elementID,tS);
					}	
			}
			
			for(var i=0;i<TmpIdRedIdMap.keys().length;i++){
				var id=TmpIdRedIdMap.get(i);
				feat.push('red'+id);
			}
			
			som = new Som({features:  feat, iterationCount: elemIds.size(),initialLearningRate: params.lRate, width: params.nCols, height: params.nRows});
			console.log('end create som', +new Date());
			
			som.init({});
			
		console.log(ElementRedescriptionMap);
		console.log(elemIds.size());
		console.log(som);
		
				 	ElementCoverage= new Array();
					var elems = elemIds.values();
								
					var q = 0;
				var interval = $interval(SOMIteration, 10,elemIds.size());
					
						function SOMIteration() {
							//$scope.someThing = q;

		 console.log('start', +new Date());
		 
		 var progCount=0;
		 
				
				var elemString = ''+elems[q];
				
				var elemReds=ElementRedescriptionMap.get(elems[q]);
				//console.log("Reds: "); console.log(elemReds.values()); console.log(elemReds.size());
				
				var somInput={};
				for(var j=0;j<TmpIdRedIdMap.keys().length;j++){
					var propName = feat[j];
					if(elemReds.contains(TmpIdRedIdMap.get(j))){
						somInput[propName]=1;
					}
					else{
						somInput[propName]=0;
					}
				}
				
				/*if(q==0){
					console.log('somInput');
					console.log(somInput);
					console.log('element: '+elems[q]);
				}*/
				//console.log("somInput"); console.log(somInput);
				//console.log("elemString: "); console.log(elemString);		
			
			    som.train(elemString,somInput);

				var ob={};
				ob.name=elems[q];
				ob.count=ElementRedescriptionMap.get(elems[q]).size();
				ElementCoverage.push(ob);

							console.log("q: "+q);
							if(q<(elemIds.size()-1))
							$scope.progress=(Math.floor(q/elemIds.size()*100))+"% complete!";
						else {$scope.progress="100 % complete!";  var tt; $scope.checked = false; $scope.action=tt;}
    
						//if(q == 19) $interval.cancel(interval);
							//else q++;
							q++;
							}
							
							interval.then(function(){ 
							
							som.cleanData();
				
				
				som.nodeList.NumRows=som.height;
			som.nodeList.NumCols=som.width;
			
			console.log('node list: ',som.nodeList);
				///////////////SOM map///////////////
			
			$scope.progress="SOM map trained!";
			
			//for(var j=0;j<som.height*som.width;j++)
				//som.nodeList[j].neighbors=elems;
			
			console.log("changed som"); console.log(som);
			
		var options = {url: $scope.SOMURL,
               method: 'POST', 
               data: { 
						userId: JSON.stringify($scope.userInfo.userInfo[0].userId),
						somDat:  JSON.stringify(som.nodeList),
						elCov: JSON.stringify(ElementCoverage),
						numRows: JSON.stringify(som.nodeList.NumRows),
						numCols: JSON.stringify(som.nodeList.NumCols),
						selReds: JSON.stringify(selectedReds.values())}

                          };
		//scope.getRedescriptionInfo(options);
		$q.all([encapsulateSSD(options)]).then(function(){
		
		var options1 = {url: $scope.CLusterInfoSelURL/*$scope.SOMURL*/,
               method: 'GET', 
               params: {
					userId: JSON.stringify($scope.userInfo.userInfo[0].userId)
                        }
                          };
						  $scope.getSOMClusterInfo(options1/*$scope.CLusterInfoSelURL*/);
						  //$scope.getSOMData(options1)
		   }
				);							
							});
							},2500);
	}
	else{
		window.alert("Insert input parameters!");
	}
	   };
	
	
	$scope.trainOnSelectionShared= function (params){//add code loading/saving to shared storage
	
			if( typeof $scope.action == 'undefined'){
				alert('Select an option "load" or "save"!');
				return;
			}
	
		console.log("train on selection initiated!");
		
		console.log('train mode');
		console.log($scope.trainMode);
		
		var redSupps = new HashMap();
		//var somElems = new HashSet();
		
		
		
		if($scope.action.type == "save"){
			var timer4S=$timeout(function(){if($scope.action.type=="save") $scope.progress="Saving shared data!";});
			var minfr=0;
			
				if(params!=null && typeof params.minFR != "undefined")
					minfr=params.minFR;
				
				console.log('somElems');
				console.log($scope.selSOMElements);
				/*return;
				for(var se=0; se<$scope.selSOMElements.length;se++)
					somElems.add($scope.selSOMElements[se].id);*/
			
				var redIds= new HashSet();
				
				$('#redTable').each(function (i, row){

        // reference all the stuff you need first
        var $row = $(row),
            $checkedBoxes = $row.find('input:checked');

        $checkedBoxes.each(function (i, checkbox) {
            // assuming you layout the elements this way, 
            // we'll take advantage of .next()
            var $checkbox = $(checkbox);
               console.log('checkbox');
			   console.log($checkbox);
			   console.log($checkbox[0].id);
			   redIds.add(parseInt($checkbox[0].id));
			   $checkbox.attr('checked', false); 
        });
    });
	
	
		if(redIds.size()>0){
			
			var res1=redIds.values();
			
			var options1 = {
				url: $scope.sharedDataURL,
               method: 'POST', 
               data: { 
			   userId: JSON.stringify($scope.userInfo.userInfo[0].userId),
			   sharedData:  JSON.stringify(res1)}
                          };
			
			$scope.encapsulateShared(options1);					
		}
		else{			
				
				if(minfr==0){
					
					var redIds = new HashSet();
					
					for(var i=0;i<$scope.selectionReds.redescriptions.length;i++){
															redIds.add($scope.selectionReds.redescriptions[i].id);
														}
			
														var res=redIds.values();
			
														var options = {
															url: $scope.sharedDataURL,
																method: 'POST', 
																data: { 
																userId: JSON.stringify($scope.userInfo.userInfo[0].userId),
																sharedData:  JSON.stringify(res)}
																};
			
															$scope.encapsulateShared(options);
																	return;
				}
				else{
					
					console.log('minFR');
					console.log(minfr);
					
					console.log($scope.selectionReds);

						if(typeof $scope.selectionReds == 'undefined'){
								alert('Please make a selection!');
								$scope.checked=false;
								$scope.trainMode=0;
							return;
						}
						
						if(typeof $scope.SOMInput == 'undefined'){
								var options1 = {url: $scope.redElemURL,
										method: 'GET', 
											params: {
													}
												};
												
										$q.all([$scope.encapsulateGRE(options1)]).then(function(){
											
											for(var i=0;i<$scope.selectionReds.redescriptions.length;i++){
													redSupps.set($scope.selectionReds.redescriptions[i].id, new HashSet());
											}
											
											for(var i=0;i<$scope.SOMInput.redElems.length;i++){
													if(!redSupps.has($scope.SOMInput.redElems[i].id))
														continue;
													redSupps.get($scope.SOMInput.redElems[i].id).add($scope.SOMInput.redElems[i].elementID);
												}
												
												var redIds= new HashSet();
												
												for(var i=0;i<$scope.selectionReds.redescriptions.length;i++){
													var hsr = redSupps.get($scope.selectionReds.redescriptions[i].id);
													
													var interCount=0;
													
													for(var j=0;j<$scope.selSOMElements.length;j++){
														if(hsr.contains($scope.selSOMElements[j].id))
															interCount=interCount+1;
													}
													
													var fr = interCount/(hsr.size());
													
													//console.log('js'); console.log(js);
													if(fr>=minfr)
														redIds.add($scope.selectionReds.redescriptions[i].id);
													}
													
													var res=redIds.values();
													
													if(res.length<=0){
														alert('No redescriptions found, aborting!');
														console.log('train mode');
														console.log($scope.trainMode);
														return;
													}
			
														var options = {
															url: $scope.sharedDataURL,
																method: 'POST', 
																data: { 
															    userId: JSON.stringify($scope.userInfo.userInfo[0].userId),
																sharedData:  JSON.stringify(res)}
																};
			
															$scope.encapsulateShared(options);
																	return;
										});
									}
									else{
										
										for(var i=0;i<$scope.selectionReds.redescriptions.length;i++){
												redSupps.set($scope.selectionReds.redescriptions[i].id, new HashSet());
											}
											
											//console.log('SOMInput: '); console.log($scope.SOMInput);
											//console.log(redSupps);
											
											for(var i=0;i<$scope.SOMInput.redElems.length;i++){
													if(redSupps.has($scope.SOMInput.redElems[i].id))
														redSupps.get($scope.SOMInput.redElems[i].id).add($scope.SOMInput.redElems[i].elementID);
												else continue;
												}
												
											
												
												var redIds= new HashSet();
												
												for(var i=0;i<$scope.selectionReds.redescriptions.length;i++){
													var hsr = redSupps.get($scope.selectionReds.redescriptions[i].id);
													
													var interCount=0;
													
													for(var j=0;j<$scope.selSOMElements.length;j++){
														if(hsr.contains($scope.selSOMElements[j].id))
															interCount=interCount+1;
													}
													
													var fr = interCount/(hsr.size());
													
													if(fr>=minfr)
														redIds.add($scope.selectionReds.redescriptions[i].id);
													}
			
														var res=redIds.values();
														
															if(res.length<=0){
																alert('No redescriptions found, aborting!');
																console.log('train mode');
																console.log($scope.trainMode);
																return;
															}
			
														var options = {
															url: $scope.sharedDataURL,
																method: 'POST', 
																data: { 
														        userId: JSON.stringify($scope.userInfo.userInfo[0].userId),
																sharedData:  JSON.stringify(res)}
																};
			
															$scope.encapsulateShared(options);
																	return;
									}
				}
		     }
			}
		
		if(params!=null && $scope.action.type != "saveLayout" && $scope.action.type != "loadLayout" && $scope.action.type!= "save"){
			
			$scope.trainMode=1;//on selection
			$scope.checked = true;
		var timer=$timeout(function(){$scope.progress="Getting SOM parameters!";},0);

		
	var timer1=$timeout(function(){
	   console.log("SOM parameters: ");
		console.log("Num rows: "+params.nRows);
		console.log("Num cols: "+params.nCols);
		console.log("Learning rate: "+params.lRate);
		console.log("Number of iterations: "+params.nIter);
		$scope.params=params;
		$scope.progress="Parameters set!";		
		},1000);
										
		/*var timer2=$timeout(function(){
		$scope.params=null;
		$scope.progress="Parameters cleared!";

		console.log("data in a button: ");
		console.log($scope.SOMInput);},2000);*/
	
		//var timer3=$timeout(function(){console.log("setting params to the old value!"); $scope.params=params; $scope.progress="Parameters restored!";},3000);
		var timer4=$timeout(function(){if($scope.action.type=="save") $scope.progress="Saving shared data!"; else if($scope.action.type == "load") $scope.progress="Training SOM map!";},2000);
				
		/*load selected elements into set*/
		
		var elemIds = new HashSet();
		var selectedReds = new HashSet();
		var TmpIdRedIdMap = new HashMap();
		var RedIdTmpIdMap = new HashMap();
		var ElementRedescriptionMap = new HashMap();
		var feat = new Array();
		var som;
		
		var timer6=$timeout(function(){
			
			
					
			if($scope.action.type == "load"){
			
			
			$("[id=attrdistE]").empty();
			$("#redSupTableE").remove();
			$("#redADContE").remove();
			
					var options = {
						url: $scope.sharedDataURL,
               method: 'GET', 
                params: {
						userId: JSON.stringify($scope.userInfo.userInfo[0].userId)
                        }
                          };
					
					console.log("scope redelem url");
					console.log($scope.redElemURL);
					
					var options1 = {url: $scope.redElemURL,
               method: 'GET', 
               params: {
                        }
                          };
						  
				$q.all([$scope.encapsulateSharedGet(options),$scope.encapsulateGRE(options1)]).then(function(){
					
					console.log('data loaded from shared storage!');
					console.log($scope);

					
					for(var i=0;i<$scope.sharedData.data.length;i++){
						selectedReds.add($scope.sharedData.data[i].id);
					}
					
					//$scope.selectionReds	
					
					console.log('SOMInput');
					console.log($scope.SOMInput);
			
			//scope.selectionReds=newData;
			for(var i=0;i<$scope.SOMInput.redElems.length;i++)
				if(selectedReds.contains($scope.SOMInput.redElems[i].id))
				elemIds.add($scope.SOMInput.redElems[i].elementID);
			
			console.log("elem ids: ");
			console.log(elemIds.values());
			
			var count=0;
			for(var i=0;i<$scope.SOMInput.redElems.length;i++){
				
				if(!selectedReds.contains($scope.SOMInput.redElems[i].id))
					continue;
				
				if(!RedIdTmpIdMap.has($scope.SOMInput.redElems[i].id)){
					RedIdTmpIdMap.set($scope.SOMInput.redElems[i].id,count);
					TmpIdRedIdMap.set(count,$scope.SOMInput.redElems[i].id);
					count=count+1;
				}
				
				if(!elemIds.contains($scope.SOMInput.redElems[i].elementID))
					continue;
				
				if(!ElementRedescriptionMap.has($scope.SOMInput.redElems[i].elementID)){
					var tS=new HashSet();
					tS.add($scope.SOMInput.redElems[i].id);
					ElementRedescriptionMap.set($scope.SOMInput.redElems[i].elementID,tS);
					}
					else{
						var tS=ElementRedescriptionMap.get($scope.SOMInput.redElems[i].elementID);
						tS.add($scope.SOMInput.redElems[i].id);
						ElementRedescriptionMap.set($scope.SOMInput.redElems[i].elementID,tS);
					}	
			}
			
			for(var i=0;i<TmpIdRedIdMap.keys().length;i++){
				var id=TmpIdRedIdMap.get(i);
				feat.push('red'+id);
			}
			
			som = new Som({features:  feat, iterationCount: elemIds.size(),initialLearningRate: params.lRate, width: params.nCols, height: params.nRows});
			console.log('end create som', +new Date());
			
			som.init({});
			
		console.log(ElementRedescriptionMap);
		console.log(elemIds);
		console.log(som);
		
				 	ElementCoverage= new Array();
					var elems = elemIds.values();
								
					var q = 0;
				var interval = $interval(SOMIteration, 10,elemIds.size());
					
						function SOMIteration() {
							//$scope.someThing = q;

		 console.log('start', +new Date());
		 
		 var progCount=0;
		 
				
				var elemString = ''+elems[q];
				
				var elemReds=ElementRedescriptionMap.get(elems[q]);
				//console.log("Reds: "); console.log(elemReds.values()); console.log(elemReds.size());
				
				var somInput={};
				for(var j=0;j<TmpIdRedIdMap.keys().length;j++){
					var propName = feat[j];
					if(elemReds.contains(TmpIdRedIdMap.get(j))){
						somInput[propName]=1;
					}
					else{
						somInput[propName]=0;
					}
				}
				
				/*if(q==0){
					console.log('somInput');
					console.log(somInput);
					console.log('element: '+elems[q]);
				}*/
				//console.log("somInput"); console.log(somInput);
				//console.log("elemString: "); console.log(elemString);		
			
			    som.train(elemString,somInput);

				var ob={};
				ob.name=elems[q];
				ob.count=ElementRedescriptionMap.get(elems[q]).size();
				ElementCoverage.push(ob);

							console.log("q: "+q);
							if(q<(elemIds.size()-1))
							$scope.progress=(Math.floor(q/elemIds.size()*100))+"% complete!";
						else {$scope.progress="100 % complete!"; var tt; $scope.checked = false; $scope.action=tt;}
    
						//if(q == 19) $interval.cancel(interval);
							//else q++;
							q++;
							}
							
							interval.then(function(){ 
							
							som.cleanData();
				
				
				som.nodeList.NumRows=som.height;
			som.nodeList.NumCols=som.width;
			
			console.log('node list: ',som.nodeList);
				///////////////SOM map///////////////
			
			$scope.progress="SOM map trained!";
			
			//for(var j=0;j<som.height*som.width;j++)
				//som.nodeList[j].neighbors=elems;
			
			console.log("changed som"); console.log(som);
			
		var options = {url: $scope.SOMURL,
               method: 'POST', 
               data: {  userId: JSON.stringify($scope.userInfo.userInfo[0].userId),
						somDat:  JSON.stringify(som.nodeList),
						elCov: JSON.stringify(ElementCoverage),
						numRows: JSON.stringify(som.nodeList.NumRows),
						numCols: JSON.stringify(som.nodeList.NumCols),
						selReds: JSON.stringify(selectedReds.values())}

                          };
		//scope.getRedescriptionInfo(options);
		$q.all([encapsulateSSD(options)]).then(function(){
								 var tt; $scope.checked = false; $scope.action=tt;
								//$scope.trainMode=1;
								
								var options1 = {url: $scope.CLusterInfoSelURL/*$scope.SOMURL*/,
               method: 'GET', 
               params: {
					userId: JSON.stringify($scope.userInfo.userInfo[0].userId)
                        }
                          };
								
						  $scope.getSOMClusterInfo(options1/*$scope.CLusterInfoSelURL*/);
						  //$scope.getSOMData(options1)
		   }
				);
							
							});
							
				});
				}
						
							},2500);
	}
	else{
		if($scope.action.type == "saveLayout"){
				console.log('saveLayout code');
		
			if(typeof(som)=='undefined'){
				alert('Please create/load a SOM map to be saved!');
				return;
			}
		
			if(typeof(som.nodeList)!='undefined' && typeof(ElementCoverage)!='undefined' && typeof(som.nodeList.NumRows)!='undefined' && typeof(som.nodeList.NumCols) && typeof(selectedReds)!='undefined'){
		
				
			$("[id=attrdistE]").empty();
			$("#redSupTableE").remove();
			$("#redADContE").remove();
		
			var options = {url: $scope.SOMBackURL,
						method: 'POST', 
               data: { userId: JSON.stringify($scope.userInfo.userInfo[0].userId),
						somDat:  JSON.stringify(som.nodeList),
						elCov: JSON.stringify(ElementCoverage),
						numRows: JSON.stringify(som.nodeList.NumRows),
						numCols: JSON.stringify(som.nodeList.NumCols),
						selReds: JSON.stringify(selectedReds.values())}

                          };
								 var tt; $scope.checked = false; $scope.action=tt;
								$scope.trainMode=0;
			encapsulateSSD(options);
			}
			else{
				alert('Please create/load a SOM map to be saved!');
				return;
			}
			
						 
			}
			else if($scope.action.type == "loadLayout"){
				console.log('loadLayout code');
				 var tt; $scope.checked = false; $scope.action=tt;
				$scope.trainMode=2;
				
				var options1 = {url: $scope.CLusterInfoSelBackURL/*$scope.SOMURL*/,
               method: 'GET', 
               params: {
                        }
                          };
				
				 $scope.getSOMClusterInfo(options1/*$scope.CLusterInfoSelBackURL*/);
				
			}
		else if($scope.action.type != "saveLayout" && $scope.action.type != "loadLayout" && $scope.action.type!= "save"){	
				window.alert("Insert input parameters!");
				return;
		}
	}
	   };
		
	 $scope.$on(
                        "$destroy",
                        function( event ) {
                            $timeout.cancel( timer );
							$timeout.cancel( timer1 );
							//$timeout.cancel( timer2 );
							//$timeout.cancel( timer3 );
							$timeout.cancel( timer4 );
							$timeout.cancel( timer5 );
							$timeout.cancel( timer6 );
                        }
                    );
});

redApp.directive('drawGraphe',function(){
	return{
		restrict: 'E',
       replace: false,
	 
		link: function (scope, element, attrs) {
			
			scope.$watch('RedRelationGraphE', function (newData, oldData) {
				if (!newData) { return; }
				
				if(typeof scope.forceE!='undefined'){
					scope.forceE.stop();
					console.log(scope.forceE);
					scope.forceE=[];
				}
				
				$(element[0]).empty();
				
					console.log('Relation graph set, draw graph here!');
					console.log(newData);
					console.log('Checked order: ');
					console.log(scope.$parent.checkedOrder.co);
					//add info about check order to new Data and put scope.$parent.checkedOrder.co to null, uncheck all checked checkboxes! 
					
				var	length = newData.nGr;
				var color = d3.scale.linear().domain([1,length])
						.interpolate(d3.interpolateHcl)
						.range([d3.rgb("#007AFF"), d3.rgb('#CCC200')]);
								
				var container = d3.select(element[0]).append("div")
													 .attr("id","RelationGraphE")
													 .attr("style","position: relative; height: 700px; width: 1200px;")
				var titdiv=container.append("div").style("width","960px");
				
				titdiv.append("h2").text("Redescription relation graph").style("text-align", "center");
				
				var width = 960, height = 700;
				
				var ld=0;
				
				/*if(newData.nodes.length>4 && newData.nodes.length<6)
					ld=Math.floor(2000/newData.nodes.length);
				else if(newData.nodes.length<=3) ld=Math.floor(1000/newData.nodes.length);
				else if(newData.nodes.length>6) ld=Math.floor(4000/newData.nodes.length);*/
				
				ld=Math.floor((900*(newData.links.length/newData.nodes.length))/newData.nodes.length);
				
				var force = d3.layout.force()
    .charge(-200.0)
    .linkDistance(ld)
    .size([width, height]);
	
	scope.forceE=force;

var svg = d3.select("#RelationGraphE").append("svg")
    .attr("width", width)
    .attr("height", height);


  force
      .nodes(newData.nodes)
      .links(newData.links)
      .start();

  var links = svg.selectAll(".link")
      .data(newData.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(10+(1.0-d.value)*10); })
      .style("stroke", function(d) { if(d.group>0)  return color(d.group); else return "#000000"; });

	var startNodeColor = '#009933', endNodeColor = '#ff0000', intermediaryNodesColor = '#33ccff', regularNodesColor = '#808080';  
	  
  var node = svg.selectAll(".node")
      .data(newData.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", Math.floor(80/Math.sqrt(newData.nodes.length)))
      .style("fill", function(d) { if(d.id==newData.startNode) return startNodeColor; else if(d.id==newData.endNode) return endNodeColor; else if(newData.intermediary.contains(d.id)) return intermediaryNodesColor; else return regularNodesColor; })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.lq+"\n"+d.rq+"\n"+"JS: "+d.js+"\n"+"Supp: "+d.supp+"\n"+"p: "+d.pVal; });

	  node.on('mouseover', function(d,i){
				/*console.log('mouse in');
				console.log(d);
				console.log(this);*/
				d3.select(this).transition().attr("r",Math.floor(90/Math.sqrt(newData.nodes.length)));
			})
			.on('mouseout', function(d,i){
				//console.log('mouse out'+d)
				 d3.select(this).transition().attr("r",Math.floor(80/Math.sqrt(newData.nodes.length)));
			})
			.on('click',function(d,i){  if (d3.event.defaultPrevented) return;  
			
			console.log('Click '); console.log(d);
			console.log(parseInt(d.id));
			console.log(attrs);
			console.log(attrs.redinfoUrl);
			console.log(scope);
			
					var options = {url: attrs.redinfoUrl,
							method: 'GET', 
					params: {
							id: JSON.stringify(parseInt(d.id))
							}
                          };
				scope.getRedescriptionInfo(options);
			});
			
			
			/* function mclick(d,i) { 
		//console.log("mclick on redescription: "+newData.redescriptions[i].id);
		//d3.selectAll('#selected').style('background-color', 'white');
		//d3.selectAll('#selected').attr("id",null);
		//d3.select(this).attr("id","selected");
		//console.log("url: "+attrs.redinfoUrl);
		var options = {url: attrs.redinfoUrl,
               method: 'GET', 
               params: {
               id: JSON.stringify(newData.redescriptions[i].id)
                        }
                          };
		scope.getRedescriptionInfo(options);
		//console.log(scope.RedescriptionInfo);
	};*/
	  
  links.append("title")
		.text(function(d){if(d.group>0){ return 'Path rank: '+d.group+"."+'\nStrength: '+(1.0-d.value);} else{ return 'Strength: '+(1.0-d.value);}});
	  
  force.on("tick", function() {
    links.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
					
			});
			
		}
		
	}
	
		}
	);	
	
redApp.directive('drawGrapha',function(){
	return{
		restrict: 'E',
       replace: false,
	 
		link: function (scope, element, attrs) {
			
			scope.$watch('RedRelationGraphA', function (newData, oldData) {
				if (!newData) { return; }
				
				if(typeof scope.forceA!='undefined'){
					scope.forceA.stop();
					console.log(scope.forceA);
					scope.forceA=[];
				}
				
				$(element[0]).empty();
				
					console.log('Relation graph set, draw graph here!');
					console.log(newData);
					console.log('Checked order: ');
					console.log(scope.$parent.checkedOrder.co);
					//add info about check order to new Data and put scope.$parent.checkedOrder.co to null, uncheck all checked checkboxes! 
					
				var	length = newData.nGr;
				var color = d3.scale.linear().domain([1,length])
						.interpolate(d3.interpolateHcl)
						.range([d3.rgb("#007AFF"), d3.rgb('#CCC200')]);
								
				var container = d3.select(element[0]).append("div")
													 .attr("id","RelationGraphA")
													 .attr("style","position: relative; height: 700px; width: 1200px;")
				var titdiv=container.append("div").style("width","960px");
				
				titdiv.append("h2").text("Redescription relation graph").style("text-align", "center");
				
				var width = 960, height = 700;
				
				var ld=0;
				
				/*if(newData.nodes.length>4 && newData.nodes.length<6)
					ld=Math.floor(2000/newData.nodes.length);
				else if(newData.nodes.length<=3) ld=Math.floor(1000/newData.nodes.length);
				else if(newData.nodes.length>6) ld=Math.floor(4000/newData.nodes.length);*/
				
				ld=Math.floor((900*(newData.links.length/newData.nodes.length))/newData.nodes.length);
				
				var force = d3.layout.force()
    .charge(-200.0)
    .linkDistance(ld)
    .size([width, height]);
	
	scope.forceA=force;

var svg = d3.select("#RelationGraphA").append("svg")
    .attr("width", width)
    .attr("height", height);


  force
      .nodes(newData.nodes)
      .links(newData.links)
      .start();

  var links = svg.selectAll(".link")
      .data(newData.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(10+(1.0-d.value)*10); })
      .style("stroke", function(d) { if(d.group>0)  return color(d.group); else return "#000000"; });

	var startNodeColor = '#009933', endNodeColor = '#ff0000', intermediaryNodesColor = '#33ccff', regularNodesColor = '#808080';  
	  
  var node = svg.selectAll(".node")
      .data(newData.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", Math.floor(80/Math.sqrt(newData.nodes.length)))
      .style("fill", function(d) { if(d.id==newData.startNode) return startNodeColor; else if(d.id==newData.endNode) return endNodeColor; else if(newData.intermediary.contains(d.id)) return intermediaryNodesColor; else return regularNodesColor; })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.lq+"\n"+d.rq+"\n"+"JS: "+d.js+"\n"+"Supp: "+d.supp+"\n"+"p: "+d.pVal; });

	  node.on('mouseover', function(d,i){
				/*console.log('mouse in');
				console.log(d);
				console.log(this);*/
				d3.select(this).transition().attr("r",Math.floor(90/Math.sqrt(newData.nodes.length)));
			})
			.on('mouseout', function(d,i){
				//console.log('mouse out'+d)
				 d3.select(this).transition().attr("r",Math.floor(80/Math.sqrt(newData.nodes.length)));
			})
			.on('click',function(d,i){  if (d3.event.defaultPrevented) return;  
			
			console.log('Click '); console.log(d);
			console.log(parseInt(d.id));
			console.log(attrs);
			console.log(attrs.redinfoUrl);
			console.log(scope);
			
					var options = {url: attrs.redinfoUrl,
							method: 'GET', 
					params: {
							id: JSON.stringify(parseInt(d.id))
							}
                          };
				scope.getRedescriptionInfo(options);
			});
			
			
			/* function mclick(d,i) { 
		//console.log("mclick on redescription: "+newData.redescriptions[i].id);
		//d3.selectAll('#selected').style('background-color', 'white');
		//d3.selectAll('#selected').attr("id",null);
		//d3.select(this).attr("id","selected");
		//console.log("url: "+attrs.redinfoUrl);
		var options = {url: attrs.redinfoUrl,
               method: 'GET', 
               params: {
               id: JSON.stringify(newData.redescriptions[i].id)
                        }
                          };
		scope.getRedescriptionInfo(options);
		//console.log(scope.RedescriptionInfo);
	};*/
	  
  links.append("title")
		.text(function(d){if(d.group>0){ return 'Path rank: '+d.group+"."+'\nStrength: '+(1.0-d.value);} else{ return 'Strength: '+(1.0-d.value);}});
	  
  force.on("tick", function() {
    links.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
					
			});
			
		}
		
	}
	
		}
	);	
	
redApp.directive('drawGraphg',function(){
	return{
		restrict: 'E',
       replace: false,
	 
		link: function (scope, element, attrs) {
			
			scope.$watch('RedRelationGraph', function (newData, oldData) {
				if (!newData) { return; }
				
				if(typeof scope.force!='undefined'){
					scope.force.stop();
					console.log(scope.force);
					scope.force=[];
				}
				
				$(element[0]).empty();
				
					console.log('Relation graph set, draw graph here!');
					console.log(newData);
					console.log('Checked order: ');
					console.log(scope.$parent.checkedOrder.co);
					//add info about check order to new Data and put scope.$parent.checkedOrder.co to null, uncheck all checked checkboxes! 
					
				var	length = newData.nGr;
				var color = d3.scale.linear().domain([1,length])
						.interpolate(d3.interpolateHcl)
						.range([d3.rgb("#007AFF"), d3.rgb('#CCC200')]);
								
				var container = d3.select(element[0]).append("div")
													 .attr("id","RelationGraphG")
													 .attr("style","position: relative; height: 700px; width: 1200px;")
				var titdiv=container.append("div").style("width","960px");
				
				titdiv.append("h2").text("Redescription relation graph").style("text-align", "center");
				
				var width = 960, height = 700;
				
				var ld=0;
				
				/*if(newData.nodes.length>4 && newData.nodes.length<6)
					ld=Math.floor(2000/newData.nodes.length);
				else if(newData.nodes.length<=3) ld=Math.floor(1000/newData.nodes.length);
				else if(newData.nodes.length>6) ld=Math.floor(4000/newData.nodes.length);*/
				
				ld=Math.floor((900*(newData.links.length/newData.nodes.length))/newData.nodes.length);
				
				var force = d3.layout.force()
    .charge(-200.0)
    .linkDistance(ld)
    .size([width, height]);
	
	scope.force=force;

var svg = d3.select("#RelationGraphG").append("svg")
    .attr("width", width)
    .attr("height", height);


  force
      .nodes(newData.nodes)
      .links(newData.links)
      .start();

  var links = svg.selectAll(".link")
      .data(newData.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(10+(1.0-d.value)*10); })
      .style("stroke", function(d) { if(d.group>0)  return color(d.group); else return "#000000"; });

	var startNodeColor = '#009933', endNodeColor = '#ff0000', intermediaryNodesColor = '#33ccff', regularNodesColor = '#808080';  
	  
  var node = svg.selectAll(".node")
      .data(newData.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", Math.floor(80/Math.sqrt(newData.nodes.length)))
      .style("fill", function(d) { if(d.id==newData.startNode) return startNodeColor; else if(d.id==newData.endNode) return endNodeColor; else if(newData.intermediary.contains(d.id)) return intermediaryNodesColor; else return regularNodesColor; })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.lq+"\n"+d.rq+"\n"+"JS: "+d.js+"\n"+"Supp: "+d.supp+"\n"+"p: "+d.pVal; });

	  node.on('mouseover', function(d,i){
				/*console.log('mouse in');
				console.log(d);
				console.log(this);*/
				d3.select(this).transition().attr("r",Math.floor(90/Math.sqrt(newData.nodes.length)));
			})
			.on('mouseout', function(d,i){
				//console.log('mouse out'+d)
				 d3.select(this).transition().attr("r",Math.floor(80/Math.sqrt(newData.nodes.length)));
			})
			.on('click',function(d,i){  if (d3.event.defaultPrevented) return;  
			
			console.log('Click '); console.log(d);
			console.log(parseInt(d.id));
			console.log(attrs);
			console.log(attrs.redinfoUrl);
			console.log(scope);
			
					var options = {url: attrs.redinfoUrl,
							method: 'GET', 
					params: {
							id: JSON.stringify(parseInt(d.id))
							}
                          };
				scope.getRedescriptionInfo(options);
			});
			
			
			/* function mclick(d,i) { 
		//console.log("mclick on redescription: "+newData.redescriptions[i].id);
		//d3.selectAll('#selected').style('background-color', 'white');
		//d3.selectAll('#selected').attr("id",null);
		//d3.select(this).attr("id","selected");
		//console.log("url: "+attrs.redinfoUrl);
		var options = {url: attrs.redinfoUrl,
               method: 'GET', 
               params: {
               id: JSON.stringify(newData.redescriptions[i].id)
                        }
                          };
		scope.getRedescriptionInfo(options);
		//console.log(scope.RedescriptionInfo);
	};*/
	  
  links.append("title")
		.text(function(d){if(d.group>0){ return 'Path rank: '+d.group+"."+'\nStrength: '+(1.0-d.value);} else{ return 'Strength: '+(1.0-d.value);}});
	  
  force.on("tick", function() {
    links.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
					
			});
			
		}
		
	}
	
		}
	);	

redApp.directive('somElements',function(){
	return{
		restrict: 'E',
     replace: false,

	 link: function (scope, element, attrs) {
	//console.log("mclick on hexagon: "+i);
	
	scope.$watch('RedsInSOMClust', function (newData, oldData) {
          if (!newData) { return; }
		  
		  $(element[0]).empty();
		  $("#RelationGraphE").remove();
		  scope.selSOMElements = newData.somElements;
		 // console.log(newData);
		  //console.log(newData.somElements);
		 // console.log(newData.somElements[0].name);
		var columns=["SOM Cluster elements"];
		var data=[];

		var table = d3.select(element[0]).append("table")
				.attr("id","SOMTable")
				.attr("style", "margin-left: 0px")
				.attr("class", "tablesorter")
				.attr("style", "position: relative;  height: 190px; width: 290px; margin-left: 0px; overflow-x: hidden"),
			thead = table.append("thead"),
			tbody = table.append("tbody");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
				.text(function(column) { return column; })
			.attr("style", "text-align:center");

		// create a row for each object in the data
		var rows = tbody.selectAll("tr")
			.data(newData.somElements)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			.attr("style", "text-align:center");

		// create a cell in each row for each column
		var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log(row);
				return columns.map(function(column) {
					return {column: column, value: row.name};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
				.html(function(d,i) { 
					return d.value; 
				});
		
		//return table;
	     $("#SOMTable").tablesorter(); 
		 element[0].scrollIntoView(true);
		
	  }); 
	  
    }}
  });
  
  
  redApp.directive('selectedRedescription',function($location,$anchorScroll){
	
	return{
		restrict: 'E',
		replace: false,
		
		link: function(scope, element, attrs){
			
			scope.$watch('RedsInSOMClust', function (newData, oldData) {
						if(!newData){return;}
						
						//$("#attrdist").empty();
						$("[id=attrdistE]").empty();
						$("#redSupTableE").remove();
						$("#redADContE").remove();
			});
			
			scope.$watch('RedsContainingAttrs', function (newData, oldData) {
						if(!newData){return;}
						
						//$("#attrdist").empty();
						$("[id=attrdistA]").empty();
						$("#redSupTableA").remove();
						$("#redADContA").remove();
						$("#RelationGraphA").remove();
			});
			
			scope.$watch('Coocurence', function (newData, oldData) {
						if(!newData){return;}
						
						//$("#attrdist").empty();
						$("[id=attrdistA]").empty();
						$("#redSupTableA").remove();
						$("#redADContA").remove();
			});
			
			scope.$parent.$watch('Trends',function(newData, oldData){
				if(scope.view==2 || scope.view ==3 || scope.$parent.Trends == -1)
					return;
				
				 $(element[0]).empty();
						 
						 var checked = false;
							
						 if(scope.view==1){
							$("#redSupTableE").empty();
							$("#redADE").empty();
							$("[id=attrdistE]").empty();
						 }
						 
						var w = 60,//120,
							h = 250,//500,
							m = [5,25,10,25],//[10, 50, 20, 50], // top right bottom left
							min = Infinity,
							max = -Infinity;
							
							var aat = "", butContAt="";
							
							if(scope.view==1){
								aat="attrdistE";
								butContAt = "butContE";
							}
							else if(scope.view==2){ 
								aat="attrdistA";
								butContAt = "butContA";
							}
							else if(scope.view==3){ 
								aat="attrdistG";
								butContAt = "butContG";
							}
							
							var boxOptions = d3.select(element[0]).append("div").attr("id",butContAt);
							var boxSpan = boxOptions.append("span").attr("id",butContAt+"sp");
							var lab=boxSpan.append("label").style("margin-right","40px");
							var radio1=lab.append("input").attr("type","radio").attr("name",butContAt+"plot").attr("value","nbox").attr("onclick","choosePlotTypeEl(this)").style("margin-left","48px");
							lab.append("p").text("Notched box plot");
							var lab1=boxSpan.append("label").style("margin-right","40px");
							var radio2=lab1.append("input").attr("type","radio").attr("name",butContAt+"plot").attr("value","viol").attr("onclick","choosePlotTypeEl(this)").style("margin-left","30px");
							lab1.append("p").text("Violin plot");
							
							if(scope.$parent.plotType==1 || scope.$parent.plotType==2){
								radio1.property("checked",true);
								radio2.property("checked",false);
							}
							else{ 
								radio1.property("checked",false);
								radio2.property("checked",true);
							}
							
							var lab2=boxSpan.append("label").style("margin-right","40px");
							var chk=lab2.append("input").attr("type","checkbox").attr("name",butContAt+"Trends").attr("onclick","addTrandLinesEl(this)").style("margin-left","35px");
							lab2.append("p").text("Trend Lines");
							
							if(scope.$parent.Trends==1)
								chk.property("checked",true);
							else if(scope.$parent.Trends==0) chk.property("checked",false);
								
						
						var maxCLW1=0,maxCLW2=0;
						var attrOcc=new HashMap();
						
						for(j=0;j<scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length;j++){//add loading bar
							if(!attrOcc.has(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]))
								attrOcc.set(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0],1);
							else{
								var occ=attrOcc.get(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]);
								attrOcc.set(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0],occ+1);
							}
								for(i=0;i<scope.$parent.SelectedRedInfo.sri.AttrDesc.length;i++){
										if(scope.$parent.SelectedRedInfo.sri.AttrDesc[i].data[2]==1 && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[4]>maxCLW1 && scope.$parent.SelectedRedInfo.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])
												maxCLW1=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[4];
										else if(scope.$parent.SelectedRedInfo.sri.AttrDesc[i].data[2]==2 && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[4]>maxCLW2 && scope.$parent.SelectedRedInfo.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])
												maxCLW2=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[4];
								}
						}
						
					for(j=0;j<scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length;j++){
						var attrsView=0;
						var	intervalOK=0;
						if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[1]!="null" && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[2]!="null"){
							
						for(i=0;i<scope.$parent.SelectedRedInfo.sri.AttrDesc.length;i++){
							
									if(scope.$parent.SelectedRedInfo.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]){
										attrsView=scope.$parent.SelectedRedInfo.sri.AttrDesc[i].data[2];
										break;
									}
								}							
						
						var avallSet=new HashSet();						
						var boxplotValues=[], attributeValuesAll=[], attributeValuesInterval=[], attributeValuesRed=[], attributeValuesClause=[],attributeValuesAllAttrOcc=[], boxplotValuesNew=[];
						min = Infinity,
						max = -Infinity;

							var elementValues=new HashMap();
						for(i=0;i<scope.$parent.SelectedRedInfo.sri.RedAttributes.length;i++){
								var values=new Array(1);
								if(!elementValues.has(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0]))
									elementValues.set(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0],values);
								//for(azat=0;azat<scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length;azat++){
									
									if(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]){
										
										values=elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0]);
										values[0]=scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1];
										elementValues.set(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0],values);
									}
								//}
						}
							
						for(i=0;i<scope.$parent.SelectedRedInfo.sri.RedAttributes.length;i++){
							intervalOK=0;
							if(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]){
								attributeValuesAll.push(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]);
								boxplotValuesNew.push({group:"All",value:scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]});
								
								if(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]>=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[1] && scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]<=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[2] && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[3]==0){//add flag for negation
									attributeValuesInterval.push(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]);
									boxplotValuesNew.push({group:"Interval",value:scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]});
								}
								else if((!(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]>=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[1]) || !(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]<=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[2])) && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[3]==1){
										attributeValuesInterval.push(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]);
										boxplotValuesNew.push({group:"Interval",value:scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]});
								}

									if(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]>max)
										max=scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1];
									if(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]<min)
										min=scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1];
									
								for(k=0;k<scope.$parent.SelectedRedInfo.sri.RedSupport.length;k++){
									if(scope.$parent.SelectedRedInfo.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0]){
										attributeValuesRed.push(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]);
										boxplotValuesNew.push({group:"Support",value:scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]});
										intervalOK=1;
										break;
									}
								}
								
							if(intervalOK==1){
								var contained=1, containedU=1;
								//for(azat=0;azat<scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length;azat++){
									var attrsViewNew=0;
									//if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[4]==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat].data[4]){
											for(iz=0;iz<scope.$parent.SelectedRedInfo.sri.AttrDesc.length;iz++){
												if(scope.$parent.SelectedRedInfo.sri.AttrDesc[iz].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]){
														attrsViewNew=scope.$parent.SelectedRedInfo.sri.AttrDesc[iz].data[2];
															break;
													}
												}
											if(attrsView==attrsViewNew){
												if(!(elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[1] && elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[2]) && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[3]==0){//add flag for negation
														contained=0;
											}
												else if((elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[1]) && (elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[2]) && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[3]==1){
														contained=0;
												}	
											
											}		

											var containedUTmp=1;
											for(azat1=0;azat1<scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length;azat1++){
												
												
												if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat1].data[0]!=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])
													continue;
												
												containedUTmp=1;
												//if(attrsViewNew2==attrsViewTmp && attrsView==attrsViewTmp && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat1].data[4]==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat].data[4]){
												if(!(elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat1].data[1] && elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat1].data[2]) && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat1].data[3]==0){//add flag for negation
														containedUTmp=0;
											}
												else if((elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat1].data[1]) && (elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat1].data[2]) && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat1].data[3]==1){
														containedUTmp=0;
												}	
												
											//}
											if(containedUTmp==1)
												break;
										}

												if(containedUTmp==1){
													if(!avallSet.contains(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])){
														attributeValuesAllAttrOcc.push(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]);
														if((attrsView==1 && maxCLW1>0 && attrOcc.get(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])>1) || (attrsView==2 && maxCLW2>0 && attrOcc.get(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])>1))
															boxplotValuesNew.push({group:"All Clauses",value:scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]});
														avallSet.add(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0]);
													}
												}										
									//  }
								//   }
								   
								   if(contained==1){
									   if(!avallSet.contains(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])){
													attributeValuesAllAttrOcc.push(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]);
													if((attrsView==1 && maxCLW1>0 && attrOcc.get(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])>1) || (attrsView==2 && maxCLW2>0 && attrOcc.get(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])>1))
														boxplotValuesNew.push({group:"All Clauses",value:scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]});
													 avallSet.add(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0]);
											}
									  
									   attributeValuesClause.push(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]);
									  if((attrsView==1 && maxCLW1>0) || (attrsView==2 && maxCLW2>0)) 
											boxplotValuesNew.push({group:"Clause",value:scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]});
								   }  
								   
							  }							  
							}
						}

						//console.log("Finished with attribute!")
						
						if(attrsView==1 && maxCLW1>0){
							if(attrOcc.get(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])>1)
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesAllAttrOcc,attributeValuesClause];
							else
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesClause];	
							}							
						else if(attrsView==2 && maxCLW2>0){
							if(attrOcc.get(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])>1)
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesAllAttrOcc,attributeValuesClause];
							else
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesClause];	
						}
						else if(attrsView==1 && maxCLW1==0)
							boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed];
						else if(attrsView==2 && maxCLW2==0)
							boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed];
						
						var attribute;
						
						for(i=0;i<scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length;i++)
							for(atz=0;atz<scope.$parent.SelectedRedInfo.sri.AttrDesc.length;atz++)
									if(scope.$parent.SelectedRedInfo.sri.AttrDesc[atz].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]){
										attribute=scope.$parent.SelectedRedInfo.sri.AttrDesc[atz].data[0];
										break;
									}
						
						if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[3]==1)
								attribute = " ~ "+attribute+" Cl"+(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[4]+1);
						else
							attribute=attribute+" Cl"+(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[4]+1);
						
						var chart = d3.chart.box()
							.whiskers(iqr(1.5))
							.width(w - m[1] - m[3])
							.height(h - m[0] - m[2]);
							
							chart.domain([min, max]);

							 var vis = d3.select(element[0]).append("div")
										 .attr("id",aat);
										 
										 if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length>3)
										 vis.style("display","inline-block").style("width","380px");   //.style("display","table-cell"); "33%"
									 else if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length<=3)
										 vis.style("display","table-cell");//.style("width","0%");   //.style("display","table-cell");
										 
										 vis.append("p")
										  .attr("align","center")
										  .style("font-weight","bold")
										  .style("font-size","20px")
										 .text(attribute);
								
									var interpolation='basis';

										var domain=[min,max];
										console.log("boxplotValues");
										console.log(boxplotValues);
										console.log(boxplotValuesNew);
										
										vis.append("div").attr("id",aat+j).style("height","330px").style("width","360px").style("background-color", "#f0f5f5");
										
										boxplotValuesNew.forEach(function (d) {d.value = +d.value;});
										 var chartDistAnalysis1;
											 chartDistAnalysis1 = makeDistroChart({
															data:boxplotValuesNew,
															xName:'group',
															yName:'value',
															axisLabels: {xAxis: null, yAxis: 'Value'},
															selector:"#"+aat+j,
															chartSize:{height:320, width:350},
															margin: {top: 35, right: 5, bottom: 51, left: 50},
															constrainExtremes:false});

															console.log("chart1");
															console.log(chartDistAnalysis1);															
													
															chartDistAnalysis1.renderBoxPlot({showOutliers:false});
															chartDistAnalysis1.renderDataPlots();
															chartDistAnalysis1.renderNotchBoxes({showNotchBox:false});
															chartDistAnalysis1.renderViolinPlot({showViolinPlot:false});
		
										if((scope.$parent.plotType==1 || scope.$parent.plotType==2) && scope.$parent.resetPlots==0){
											chartDistAnalysis1.violinPlots.hide(); chartDistAnalysis1.notchBoxes.show({reset:true});
											chartDistAnalysis1.boxPlots.show({reset:true, showBox:false,showOutliers:true,boxWidth:20,scatterOutliers:true,colors:['#555'],medianCSize:2});
										}
										if(scope.$parent.plotType==0 || scope.$parent.plotType==-1 || scope.$parent.resetPlots==1){
											chartDistAnalysis1.violinPlots.show({reset:true,clamp:1,bandwidth:1,resolution:100});
											chartDistAnalysis1.boxPlots.show({reset:true, showWhiskers:false,showOutliers:false,boxWidth:10,lineWidth:15,colors:['#555'],medianCSize:2,showWhiskers:true});
										}
										
										if(scope.$parent.Trends==1){
											console.log("plot type: "+scope.$parent.plotType);
											chartDistAnalysis1.dataPlots.change({showLines:['median','quartile1','quartile3']});
										}
										else if(scope.$parent.Trends==0){
											chartDistAnalysis1.dataPlots.change({showLines:false});
											
										}
						}
					else{
							var map=new HashMap();
							var map1=new HashMap();
							var categoryMap=new HashMap();

							var einSupp= scope.$parent.SelectedRedInfo.sri.RedSupport[0].element;
							var category=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[1];

							var c=0,c1=0;
							for(i=0;i<scope.$parent.SelectedRedInfo.sri.RedAttributes.length;i++){
								if(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]){
										
										for(z=0;z<scope.$parent.SelectedRedInfo.sri.CategoryDesc.length;z++)
												if(scope.$parent.SelectedRedInfo.sri.CategoryDesc[z].data[0] == scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])
													categoryMap.set(scope.$parent.SelectedRedInfo.sri.CategoryDesc[z].data[0]+","+scope.$parent.SelectedRedInfo.sri.CategoryDesc[z].data[1],scope.$parent.SelectedRedInfo.sri.CategoryDesc[z].data[2]);
	
									c=c+1;
									
									 var cv=scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1];
								 var key= scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]+","+cv;
								 var catString=categoryMap.get(key);
								 
									if(!map.has(catString))
										map.set(catString,1);
									else{
										map.set(catString,map.get(catString)+1);
										}
									
									var found=0;
								if(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]==category && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[3]==0){//optimize
								c1=c1+1;

									
									for(k=0;k<scope.$parent.SelectedRedInfo.sri.RedSupport.length;k++){
										if(scope.$parent.SelectedRedInfo.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0]){

												if(!map1.has(catString+" in"))
														map1.set(catString+" in",1);
												else{
														map1.set(catString+" in",map1.get(catString+" in")+1);
													}
													found=1;
												break;
											}
										}	
								  if(found==0){
									if(!map1.has(catString+" out"))
										map1.set(catString+" out",1);
									else{
										map1.set(catString+" out", map1.get(catString+" out")+1);
										}
								  }
								}
								else if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[3]==1){//code for negated attribute
									
									if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[1]!="null")
										category=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[1];
									else
										category=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[2];
									
									for(k=0;k<scope.$parent.SelectedRedInfo.sri.RedSupport.length;k++){
										if(scope.$parent.SelectedRedInfo.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0]){

												var cv=scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1];
											 var key= scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]+","+cv;
											 var catString=categoryMap.get(key);
											 
												if(!map1.has(catString+" in"))
														map1.set(catString+" in",1);
												else{
														map1.set(catString+" in",map1.get(catString+" in")+1);
													}
													found=1;
												break;
											}
										}	
										
								  if(found==0){
									if(!map1.has(catString+" out"))
										map1.set(catString+" out",1);
									else{
										map1.set(catString+" out",map1.get(catString+" out")+1);
										}
								  }
							  }
							}
						} 
						/*console.log(c);	console.log(c1);	
					    console.log('map1');		
						console.log(map1);*/
							
							var attribute;
						
						for(i=0;i<scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length;i++)
							if(scope.$parent.SelectedRedInfo.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])
								attribute=scope.$parent.SelectedRedInfo.sri.AttrDesc[i].data[0];
								
								var aat="";
								if(scope.view == 1)
									aat="attrdistE";
								else if(scope.view == 2) aat="attrdistA";
								else if(scope.view == 3) aat = "attrdistG";
								
							var vis = d3.select(element[0]).append("div")
										 .attr("id",aat);
										 
										 if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length>3)
										 vis.style("display","inline-block").style("width","33%");   //.style("display","table-cell");
									 else if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length<=3)
										 vis.style("display","table-cell");//.style("width","0%");   //.style("display","table-cell");
									 
									 vis.append("p")
										  .attr("align","center")
										  .style("font-weight","bold")
										  .style("font-size","20px")
										 .text(attribute);
								
							var pieData=[];
							map.forEach(function(value, key){ 
								pieData.push([key,value]);
							});	
							
							var pieData1=[];
							map1.forEach(function(value, key){ 
								pieData1.push([key,value]);
							});	
								
								var width = 200,
									height = 250,
							radius = Math.min(width- m[1] - m[3], height- m[0] - m[2]) / 2;

							var color = d3.scale.ordinal()
								.range(["#98abc5", "#8a89a6", "#6F5D7B", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);//#7b6888

							var arc = d3.svg.arc()
								.outerRadius(radius - 10)
								.innerRadius(0);

							var pie = d3.layout.pie()
								.sort(null)
								.value(function(d) {return d[1]; });

								
							 var svg=vis.append("svg:svg");
										
									var gout=svg.attr("width", width- m[1] - m[3])
										.attr("height", height- m[0] - m[2])
										.append("g");
										
										gout.attr("transform", "translate(" + (width- m[1] - m[3]) / 2 + "," + (height- m[0] - m[2]) / 2 + ")");

							var g = gout.selectAll(".arc")
								.data(pie(pieData))
								.enter().append("g")
								.attr("class", "arc");

							g.append("path")
							.attr("d", arc)
							.style("fill", function(d) {return color(d.data[0]); })
							.style("opacity",0.6);

							g.append("text")
							.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
							.attr("dy", ".35em")
							.style("text-anchor", "middle")
							.text(function(d) { return d.data[0]; });							
						
						var arc = d3.svg.arc()
								.outerRadius(radius - 10)
								.innerRadius(0);

							var pie = d3.layout.pie()
								.sort(null)
								.value(function(d) {return d[1]; });

								
							 var svg=vis.append("svg:svg");
										
									var gout=svg.attr("width", width- m[1] - m[3])
										.attr("height", height- m[0] - m[2])
										.append("g");
										
										gout.attr("transform", "translate(" + (width- m[1] - m[3]) / 2 + "," + (height- m[0] - m[2]) / 2 + ")");

							var g = gout.selectAll(".arc")
								.data(pie(pieData1))
								.enter().append("g")
								.attr("class", "arc");

							g.append("path")
							.attr("d", arc)
							.style("fill", function(d) {return color(d.data[0]); })
							.style("opacity",0.6);

							g.append("text")
							.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
							.attr("dy", ".35em")
							.style("text-anchor", "middle")
							.text(function(d) { return d.data[0]; });							
						}
					}
		   
			//pload.style="visibility: hidden";			
					
	if(scope.$parent.SelectedRedInfo.sri.ElemDesc.length<100000){	
		
		var somClustElem = [];

		var stable = document.getElementById("SOMTable");
		if(stable!=null){
		var stablebody = stable.getElementsByTagName("tbody")[0];
	    var strow       = stablebody.getElementsByTagName("tr");
		
		if(scope.view==1){
		for(var k=0;k<strow.length;k++){
				var elem = strow[k].getElementsByTagName("td")[0].childNodes[0];
				somClustElem.push(elem.data);
		}
		}
	}
		var columns=["Redescription support"];
		
		var tabid = "";
		
		if(scope.view==1)
			tabid="redSupTableE";
		else if(scope.view == 2) tabid="redSupTableA";
		else if(scope.view == 3) tabid ="redSupTableG";
		
		
		
		var clSupTab = function clSuptabF(){
			console.log('support click '+1);
			if(scope.view==1)
			 $location.hash('somContainer');
			else if(scope.view==2)
				$location.hash('heatmap');
			else if(scope.view==3)
				$location.hash('redCharts');
			 $anchorScroll();
		}
		
		var clSupTabt = function clSuptabFt(){
			var tt="";
			if(scope.view==1)
			tt="redSomContainer";
		else if(scope.view == 2) tt="redTableDiv";
		else if(scope.view == 3) tt ="lists";
		console.log(tt);
				$location.hash(tt);
			 $anchorScroll();
		}
		
		var clSupTabtEnt = function clSuptabFEnt(){
				if(scope.view==2){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[1].active=false;
				}
				else if(scope.view==3){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[2].active=false;
				}
			
				scope.$parent.onTabSelected('entityInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		var clSupTabtAtt = function clSuptabFAtt(){
				if(scope.view==1){
					scope.$parent.tabs[0].active=false;
				    scope.$parent.tabs[1].active=true;
				}
				else if(scope.view==3){
					scope.$parent.tabs[2].active=false;
				    scope.$parent.tabs[1].active=true;
				}
			
				scope.$parent.onTabSelected('attributeInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		
		var clSupTabtGLP = function clSuptabFGlp(){
				if(scope.view==1){
					scope.$parent.tabs[0].active=false;
				    scope.$parent.tabs[2].active=true;
				}
				else if(scope.view==2){
					scope.$parent.tabs[1].active=false;
				    scope.$parent.tabs[2].active=true;
				}
			
				scope.$parent.onTabSelected('globalInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		var clSupTabtEnt = function clSuptabFEnt(){
			if(scope.view==2){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[1].active=false;
				}
				else if(scope.view==3){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[2].active=false;
				}
				scope.$parent.onTabSelected('entityInfo');
				console.log(scope.$parent.tabs);
				 $location.hash('start');
				 $anchorScroll();
				scope.$parent.$apply();
		}
      
	  
	  var clSupTabMO = function movclSupTabMO(){
			d3.select(this).style("cursor","pointer");
	  }
	
		var tdiv=d3.select(element[0]).append("div")
			.attr("id", tabid)
			.style("position","relative")
			.style("margin-top","20px")
			.style("margin-bottom","20px")
			.style("height","200px")
			.attr("style", "position: relative; display:inline-block; width:30%; height: 220px; width: 250px; margin-left: 0px; margin-top: 20px; margin-right: 20px;  overflow-y: scroll; overflow-x: hidden;")
			
		//console.log(scope.$parent.SelectedRedInfo.sri.ElemDesc);
		
		var redsupId = "";
		
		if(scope.view == 1)
			redSupId = "redSupTTE";
		else if(scope.view == 2) redSupId = "redSupTTA";
		else if(scope.view == 3) redSupId = "redSupTTG";
		
		var table = tdiv.append("table")
				.attr("id",redSupId)
				.attr("class", "tablesorter")
				.attr("border-collapse","separate")
				.attr("border-spacing","10 10")
				.attr("style", "position: relative; float:left; height: 220px; width: 220px; margin-left: 0px;")
				//.style("max-height","200px"),
			thead = table.append("thead"),
			tbody = table.append("tbody")
					.attr("style", "height: 200px; overflow-y: scroll; overflow-x: hidden; ");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center")
			.style("cursor", "pointer");

		// create a row for each object in the data
		var rows = tbody.selectAll("tr")
			.data(scope.$parent.SelectedRedInfo.sri.ElemDesc)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			
		// create a cell in each row for each column
		var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log(row);
				return columns.map(function(column) {
					return {column: column, value: row.elementDescription};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					return d.value; 
				})
			.attr("style", "text-align:center")
			.style("background-color",function(d,i){if($.inArray(d.value, somClustElem)!=-1) return "#4CAF50";});//add array of SOM elements

		if(scope.view == 1)
			$("#redSupTTE").tablesorter({sortList:[[0,0]]});
		else if(scope.view == 2)
			 $("#redSupTTA").tablesorter({sortList:[[0,0]]});
		else if(scope.view == 3)
			 $("#redSupTTG").tablesorter({sortList:[[0,0]]});
	}
		else{
			var butId="";
			var expFuncName = "";
			if(scope.view==1){
				globalVarE1 = scope.$parent.SelectedRedInfo.sri.ElemDesc;
				butId = "exButtSE";
				expFuncName = "exportFunctionSuppE()";
			}
			else if(scope.view == 2){
				globalVarA1 = scope.$parent.SelectedRedInfo.sri.ElemDesc;
				butId = "exButtSA";
				expFuncName = "exportFunctionSuppA()";
			}
			else if(scope.view == 3){
				globalVarG1 = scope.$parent.SelectedRedInfo.sri.ElemDesc;
				butId = "exButtSG";
				expFuncName = "exportFunctionSuppG()";
			}
		globalVar1=scope.$parent.SelectedRedInfo.sri.ElemDesc;
			var exButtonS = d3.select(element[0]).append("button").attr("type","button")
										.attr("id",butId)
										.attr("onclick",expFuncName)
										.style("margin-bottom","20px")
										.text('Export redescription support');
		}
		
// make a attribute description table
var columns=["Name", "Description"];
			    //console.log('something is wrong!');
				//console.log(element[0]);
				
		var atTableId = "";
		var ttabId = "";
		
		if(scope.view == 1){
			atTableId = "redADContE";
			ttabId = "redADE";
		}
		else if(scope.view == 2){ 
		atTableId = "redADContA";
		ttabId = "redADA";
		}
		else if(scope.view == 3){
			atTableId = "redADContG";
			ttabId = "redADG";
		}
		
		var tdiv=d3.select(element[0]).append("div")
			.attr("id", atTableId)
			.style("position","relative")
			.style("margin-top","20px")
			.style("margin-bottom","20px")
			.style("height","200px")
			.attr("style", "position: relative; display:inline-block; width:30%; height: 220px; width: 350px; margin-left: 0px; margin-top: 20px; overflow-y: scroll; overflow-x: scroll;");
		
		//console.log(scope.$parent.SelectedRedInfo.sri.ElemDesc);
		
		var table = tdiv.append("table")
				.attr("id",ttabId)
				.attr("class", "tablesorter")
				.attr("border-collapse","separate")
				.attr("border-spacing","10 10")
				.attr("style", "position: relative;  height: 220px; width: 330px; margin-left: 0px;")
				.attr("border","1px solid black")
				.attr("rules","cols")
				.attr("frame","void")
				//.style("max-height","200px"),
			thead = table.append("thead"),
			tbody = table.append("tbody")
					.attr("style", "height: 200px; overflow-y: scroll; overflow-x: scroll; ");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center")
			.style("cursor", "pointer");

		// create a row for each object in the data
		//console.log(scope.$parent.SelectedRedInfo.sri.AttrDesc);
		var rows = tbody.selectAll("tr")
			.data(scope.$parent.SelectedRedInfo.sri.AttrDesc)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			
		// create a cell in each row for each column
		var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log(row);
				return columns.map(function(column) {
					return {column: column, value: row.data};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					return d.value[i]; 
				})
			.attr("style", "text-align:center");

//$(document).ready(function() 
  //  { 
  
  if(scope.view==1)
        $("#redADE").tablesorter({sortList:[[0,0]]}); 
	else if(scope.view==2)
		$("#redADA").tablesorter({sortList:[[0,0]]}); 
	else if(scope.view==3)
		$("#redADG").tablesorter({sortList:[[0,0]]}); 
    //} 
//); 
				
 // Returns a function to compute the interquartile range.
		function iqr(k) {
				return function(d, i) {
				var q1 = d.quartiles[0],
				q3 = d.quartiles[2],
				iqr = (q3 - q1) * k,
				i = -1,
				j = d.length;
				while (d[++i] < q1 - iqr);
				while (d[--j] > q3 + iqr);
		return [i, j];
   };
  }
  
   element[0].scrollIntoView(true);
   
    var dlabul=d3.select(element[0]).append("ul")
	.style("list-style","none")
	.style("overflow","hidden")
	.style("background-color","#e6EEEE")
	.style("margin-top", "0.2cm")
	.style("width","760px");
   
   var t="";
   if(scope.view==1)
	   t="Go to SOM";
   else if(scope.view==2)
	   t="Go to heatmap";
   else if(scope.view == 3)
	   t="Go to crossfilter";
   
   var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'lab')
		.style("float", "left")
		.style("display","inline-block");;
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'labt')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",clSupTab)
		.on("mouseover",clSupTabMO);
	
 t="Go to redescription table";
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'rt')
		.style("float", "left")
		.style("display","inline-block");
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'rt')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",clSupTabt)
		.on("mouseover",clSupTabMO);

if(scope.view==1)		
	t="Go to attribute context";
else if(scope.view==2)
	t="Go to entity context"
else if(scope.view==3)
	t="Go to entity context";
	
	var func;
	
	if(scope.view==1)
		func=clSupTabtAtt;
	else func=clSupTabtEnt;
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'fcon')
		.style("float", "left")
		.style("display","inline-block");
		

   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'fcon')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",func)
		.on("mouseover",clSupTabMO);

if(scope.view==1)		
	t="Go to properties context";
else if(scope.view==2)
	t="Go to properties context"
else if(scope.view==3)
	t="Go to attribute context";

	if(scope.view==3)
		func=clSupTabtAtt;
	else func=clSupTabtGLP;
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'secon')
		.style("float", "left")
		.style("display","inline-block");
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'secon')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.style("margin-top","2cm")
		.on("click",func)
		.on("mouseover",clSupTabMO);
				
			},true);
			
			 scope.$parent.$watch('Trends1',function(newData, oldData){
				if(scope.view==1 || scope.view ==3 || scope.$parent.Trends1 == -1)
					return;
				
				 $(element[0]).empty();
						 
						 var checked = false;
							
						 if(scope.view==2){
							$("[id=attrdistA]").empty();
							$("#redSupTableA").remove();
							$("#redADContA").remove();
							$("#RelationGraphA").remove();
						 }
						 
						var w = 60,//120,
							h = 250,//500,
							m = [5,25,10,25],//[10, 50, 20, 50], // top right bottom left
							min = Infinity,
							max = -Infinity;
							
							var aat = "", butContAt="";
							
							if(scope.view==1){
								aat="attrdistE";
								butContAt = "butContE";
							}
							else if(scope.view==2){ 
								aat="attrdistA";
								butContAt = "butContA";
							}
							else if(scope.view==3){ 
								aat="attrdistG";
								butContAt = "butContG";
							}
							
							var boxOptions = d3.select(element[0]).append("div").attr("id",butContAt);
							var boxSpan = boxOptions.append("span").attr("id",butContAt+"sp");
							var lab=boxSpan.append("label").style("margin-right","40px");
							var radio1=lab.append("input").attr("type","radio").attr("name",butContAt+"plot").attr("value","nbox").attr("onclick","choosePlotTypeAtt(this)").style("margin-left","48px");
							lab.append("p").text("Notched box plot");
							var lab1=boxSpan.append("label").style("margin-right","40px");
							var radio2=lab1.append("input").attr("type","radio").attr("name",butContAt+"plot").attr("value","viol").attr("onclick","choosePlotTypeAtt(this)").style("margin-left","30px");
							lab1.append("p").text("Violin plot");
							
							if(scope.$parent.plotType1==1 || scope.$parent.plotType1==2){
								radio1.property("checked",true);
								radio2.property("checked",false);
							}
							else{ 
								radio1.property("checked",false);
								radio2.property("checked",true);
							}
							
							var lab2=boxSpan.append("label").style("margin-right","40px");
							var chk=lab2.append("input").attr("type","checkbox").attr("name",butContAt+"Trends").attr("onclick","addTrandLinesAtt(this)").style("margin-left","35px");
							lab2.append("p").text("Trend Lines");
							
							if(scope.$parent.Trends1==1)
								chk.property("checked",true);
							else if(scope.$parent.Trends1==0) chk.property("checked",false);
								
						
						var maxCLW1=0,maxCLW2=0;
						var attrOcc=new HashMap();
						
						for(j=0;j<scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length;j++){//add loading bar
							if(!attrOcc.has(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]))
								attrOcc.set(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0],1);
							else{
								var occ=attrOcc.get(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]);
								attrOcc.set(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0],occ+1);
							}
								for(i=0;i<scope.$parent.SelectedRedInfo1.sri.AttrDesc.length;i++){
										if(scope.$parent.SelectedRedInfo1.sri.AttrDesc[i].data[2]==1 && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[4]>maxCLW1 && scope.$parent.SelectedRedInfo1.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])
												maxCLW1=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[4];
										else if(scope.$parent.SelectedRedInfo1.sri.AttrDesc[i].data[2]==2 && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[4]>maxCLW2 && scope.$parent.SelectedRedInfo1.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])
												maxCLW2=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[4];
								}
						}
						
					for(j=0;j<scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length;j++){
						var attrsView=0;
						var	intervalOK=0;
						if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[1]!="null" && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[2]!="null"){
							
						for(i=0;i<scope.$parent.SelectedRedInfo1.sri.AttrDesc.length;i++){
							
									if(scope.$parent.SelectedRedInfo1.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]){
										attrsView=scope.$parent.SelectedRedInfo1.sri.AttrDesc[i].data[2];
										break;
									}
								}							
						
						var avallSet=new HashSet();						
						var boxplotValues=[], attributeValuesAll=[], attributeValuesInterval=[], attributeValuesRed=[], attributeValuesClause=[],attributeValuesAllAttrOcc=[], boxplotValuesNew=[];
						min = Infinity,
						max = -Infinity;

							var elementValues=new HashMap();
						for(i=0;i<scope.$parent.SelectedRedInfo1.sri.RedAttributes.length;i++){
								var values=new Array(1);
								if(!elementValues.has(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0]))
									elementValues.set(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0],values);
								//for(azat=0;azat<scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length;azat++){
									
									if(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]){
										
										values=elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0]);
										values[0]=scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1];
										elementValues.set(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0],values);
									}
								//}
						}
							
						for(i=0;i<scope.$parent.SelectedRedInfo1.sri.RedAttributes.length;i++){
							intervalOK=0;
							if(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]){
								attributeValuesAll.push(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]);
								boxplotValuesNew.push({group:"All",value:scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]});
								
								if(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]>=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[1] && scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]<=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[2] && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[3]==0){//add flag for negation
									attributeValuesInterval.push(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]);
									boxplotValuesNew.push({group:"Interval",value:scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]});
								}
								else if((!(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]>=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[1]) || !(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]<=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[2])) && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[3]==1){
										attributeValuesInterval.push(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]);
										boxplotValuesNew.push({group:"Interval",value:scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]});
								}

									if(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]>max)
										max=scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1];
									if(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]<min)
										min=scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1];
									
								for(k=0;k<scope.$parent.SelectedRedInfo1.sri.RedSupport.length;k++){
									if(scope.$parent.SelectedRedInfo1.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0]){
										attributeValuesRed.push(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]);
										boxplotValuesNew.push({group:"Support",value:scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]});
										intervalOK=1;
										break;
									}
								}
								
							if(intervalOK==1){
								var contained=1, containedU=1;
								//for(azat=0;azat<scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length;azat++){
									var attrsViewNew=0;
									//if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[4]==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat].data[4]){
											for(iz=0;iz<scope.$parent.SelectedRedInfo1.sri.AttrDesc.length;iz++){
												if(scope.$parent.SelectedRedInfo1.sri.AttrDesc[iz].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]){
														attrsViewNew=scope.$parent.SelectedRedInfo1.sri.AttrDesc[iz].data[2];
															break;
													}
												}
											if(attrsView==attrsViewNew){
												if(!(elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[1] && elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[2]) && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[3]==0){//add flag for negation
														contained=0;
											}
												else if((elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[1]) && (elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[2]) && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[3]==1){
														contained=0;
												}	
											
											}		

											var containedUTmp=1;
											for(azat1=0;azat1<scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length;azat1++){
												
												
												if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat1].data[0]!=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])
													continue;
												
												containedUTmp=1;
												//if(attrsViewNew2==attrsViewTmp && attrsView==attrsViewTmp && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat1].data[4]==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat].data[4]){
												if(!(elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat1].data[1] && elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat1].data[2]) && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat1].data[3]==0){//add flag for negation
														containedUTmp=0;
											}
												else if((elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat1].data[1]) && (elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat1].data[2]) && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat1].data[3]==1){
														containedUTmp=0;
												}	
												
											//}
											if(containedUTmp==1)
												break;
										}

												if(containedUTmp==1){
													if(!avallSet.contains(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])){
														attributeValuesAllAttrOcc.push(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]);
														if((attrsView==1 && maxCLW1>0 && attrOcc.get(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])>1) || (attrsView==2 && maxCLW2>0 && attrOcc.get(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])>1))
															boxplotValuesNew.push({group:"All Clauses",value:scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]});
														avallSet.add(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0]);
													}
												}										
									//  }
								//   }
								   
								   if(contained==1){
									   if(!avallSet.contains(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])){
													attributeValuesAllAttrOcc.push(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]);
													if((attrsView==1 && maxCLW1>0 && attrOcc.get(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])>1) || (attrsView==2 && maxCLW2>0 && attrOcc.get(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])>1))
														boxplotValuesNew.push({group:"All Clauses",value:scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]});
													 avallSet.add(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0]);
											}
									  
									   attributeValuesClause.push(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]);
									  if((attrsView==1 && maxCLW1>0) || (attrsView==2 && maxCLW2>0)) 
											boxplotValuesNew.push({group:"Clause",value:scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]});
								   }  
								   
							  }							  
							}
						}

						//console.log("Finished with attribute!")
						
						if(attrsView==1 && maxCLW1>0){
							if(attrOcc.get(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])>1)
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesAllAttrOcc,attributeValuesClause];
							else
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesClause];	
							}							
						else if(attrsView==2 && maxCLW2>0){
							if(attrOcc.get(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])>1)
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesAllAttrOcc,attributeValuesClause];
							else
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesClause];	
						}
						else if(attrsView==1 && maxCLW1==0)
							boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed];
						else if(attrsView==2 && maxCLW2==0)
							boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed];
						
						var attribute;
						
						for(i=0;i<scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length;i++)
							for(atz=0;atz<scope.$parent.SelectedRedInfo1.sri.AttrDesc.length;atz++)
									if(scope.$parent.SelectedRedInfo1.sri.AttrDesc[atz].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]){
										attribute=scope.$parent.SelectedRedInfo1.sri.AttrDesc[atz].data[0];
										break;
									}
						
						if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[3]==1)
								attribute = " ~ "+attribute+" Cl"+(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[4]+1);
						else
							attribute=attribute+" Cl"+(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[4]+1);
						
						var chart = d3.chart.box()
							.whiskers(iqr(1.5))
							.width(w - m[1] - m[3])
							.height(h - m[0] - m[2]);
							
							chart.domain([min, max]);

							 var vis = d3.select(element[0]).append("div")
										 .attr("id",aat);
										 
										 if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length>3)
										 vis.style("display","inline-block").style("width","380px");   //.style("display","table-cell"); "33%"
									 else if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length<=3)
										 vis.style("display","table-cell");//.style("width","0%");   //.style("display","table-cell");
										 
										 vis.append("p")
										  .attr("align","center")
										  .style("font-weight","bold")
										  .style("font-size","20px")
										 .text(attribute);
								
									var interpolation='basis';

										var domain=[min,max];
										console.log("boxplotValues");
										console.log(boxplotValues);
										console.log(boxplotValuesNew);
										
										vis.append("div").attr("id",aat+j).style("height","330px").style("width","360px").style("background-color", "#f0f5f5");
										
										boxplotValuesNew.forEach(function (d) {d.value = +d.value;});
										 var chartDistAnalysis1;
											 chartDistAnalysis1 = makeDistroChart({
															data:boxplotValuesNew,
															xName:'group',
															yName:'value',
															axisLabels: {xAxis: null, yAxis: 'Value'},
															selector:"#"+aat+j,
															chartSize:{height:320, width:350},
															margin: {top: 35, right: 5, bottom: 51, left: 50},
															constrainExtremes:false});

															console.log("chart1");
															console.log(chartDistAnalysis1);															
													
															chartDistAnalysis1.renderBoxPlot({showOutliers:false});
															chartDistAnalysis1.renderDataPlots();
															chartDistAnalysis1.renderNotchBoxes({showNotchBox:false});
															chartDistAnalysis1.renderViolinPlot({showViolinPlot:false});
		
										if((scope.$parent.plotType1==1 || scope.$parent.plotType1==2) && scope.$parent.resetPlots1==0){
											chartDistAnalysis1.violinPlots.hide(); chartDistAnalysis1.notchBoxes.show({reset:true});
											chartDistAnalysis1.boxPlots.show({reset:true, showBox:false,showOutliers:true,boxWidth:20,scatterOutliers:true,colors:['#555'],medianCSize:2});
										}
										if(scope.$parent.plotType1==0 || scope.$parent.plotType1==-1 || scope.$parent.resetPlots1==1){
											chartDistAnalysis1.violinPlots.show({reset:true,clamp:1,bandwidth:1,resolution:100});
											chartDistAnalysis1.boxPlots.show({reset:true, showWhiskers:false,showOutliers:false,boxWidth:10,lineWidth:15,colors:['#555'],medianCSize:2,showWhiskers:true});
										}
										
										if(scope.$parent.Trends1==1){
											console.log("plot type: "+scope.$parent.plotType);
											chartDistAnalysis1.dataPlots.change({showLines:['median','quartile1','quartile3']});
										}
										else if(scope.$parent.Trends1==0){
											chartDistAnalysis1.dataPlots.change({showLines:false});
											
										}
						}
					else{
							var map=new HashMap();
							var map1=new HashMap();
							var categoryMap=new HashMap();

							var einSupp= scope.$parent.SelectedRedInfo1.sri.RedSupport[0].element;
							var category=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[1];

							var c=0,c1=0;
							for(i=0;i<scope.$parent.SelectedRedInfo1.sri.RedAttributes.length;i++){
								if(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]){
										
										for(z=0;z<scope.$parent.SelectedRedInfo1.sri.CategoryDesc.length;z++)
												if(scope.$parent.SelectedRedInfo1.sri.CategoryDesc[z].data[0] == scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])
													categoryMap.set(scope.$parent.SelectedRedInfo1.sri.CategoryDesc[z].data[0]+","+scope.$parent.SelectedRedInfo1.sri.CategoryDesc[z].data[1],scope.$parent.SelectedRedInfo1.sri.CategoryDesc[z].data[2]);
	
									c=c+1;
									
									 var cv=scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1];
								 var key= scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]+","+cv;
								 var catString=categoryMap.get(key);
								 
									if(!map.has(catString))
										map.set(catString,1);
									else{
										map.set(catString,map.get(catString)+1);
										}
									
									var found=0;
								if(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]==category && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[3]==0){//optimize
								c1=c1+1;

									
									for(k=0;k<scope.$parent.SelectedRedInfo1.sri.RedSupport.length;k++){
										if(scope.$parent.SelectedRedInfo1.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0]){

												if(!map1.has(catString+" in"))
														map1.set(catString+" in",1);
												else{
														map1.set(catString+" in",map1.get(catString+" in")+1);
													}
													found=1;
												break;
											}
										}	
								  if(found==0){
									if(!map1.has(catString+" out"))
										map1.set(catString+" out",1);
									else{
										map1.set(catString+" out", map1.get(catString+" out")+1);
										}
								  }
								}
								else if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[3]==1){//code for negated attribute
									
									if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[1]!="null")
										category=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[1];
									else
										category=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[2];
									
									for(k=0;k<scope.$parent.SelectedRedInfo1.sri.RedSupport.length;k++){
										if(scope.$parent.SelectedRedInfo1.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0]){

												var cv=scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1];
											 var key= scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]+","+cv;
											 var catString=categoryMap.get(key);
											 
												if(!map1.has(catString+" in"))
														map1.set(catString+" in",1);
												else{
														map1.set(catString+" in",map1.get(catString+" in")+1);
													}
													found=1;
												break;
											}
										}	
										
								  if(found==0){
									if(!map1.has(catString+" out"))
										map1.set(catString+" out",1);
									else{
										map1.set(catString+" out",map1.get(catString+" out")+1);
										}
								  }
							  }
							}
						} 
						/*console.log(c);	console.log(c1);	
					    console.log('map1');		
						console.log(map1);*/
							
							var attribute;
						
						for(i=0;i<scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length;i++)
							if(scope.$parent.SelectedRedInfo1.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])
								attribute=scope.$parent.SelectedRedInfo1.sri.AttrDesc[i].data[0];
								
								var aat="";
								if(scope.view == 1)
									aat="attrdistE";
								else if(scope.view == 2) aat="attrdistA";
								else if(scope.view == 3) aat = "attrdistG";
								
							var vis = d3.select(element[0]).append("div")
										 .attr("id",aat);
										 
										 if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length>3)
										 vis.style("display","inline-block").style("width","33%");   //.style("display","table-cell");
									 else if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length<=3)
										 vis.style("display","table-cell");//.style("width","0%");   //.style("display","table-cell");
									 
									 vis.append("p")
										  .attr("align","center")
										  .style("font-weight","bold")
										  .style("font-size","20px")
										 .text(attribute);
								
							var pieData=[];
							map.forEach(function(value, key){ 
								pieData.push([key,value]);
							});	
							
							var pieData1=[];
							map1.forEach(function(value, key){ 
								pieData1.push([key,value]);
							});	
								
								var width = 200,
									height = 250,
							radius = Math.min(width- m[1] - m[3], height- m[0] - m[2]) / 2;

							var color = d3.scale.ordinal()
								.range(["#98abc5", "#8a89a6", "#6F5D7B", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);//#7b6888

							var arc = d3.svg.arc()
								.outerRadius(radius - 10)
								.innerRadius(0);

							var pie = d3.layout.pie()
								.sort(null)
								.value(function(d) {return d[1]; });

								
							 var svg=vis.append("svg:svg");
										
									var gout=svg.attr("width", width- m[1] - m[3])
										.attr("height", height- m[0] - m[2])
										.append("g");
										
										gout.attr("transform", "translate(" + (width- m[1] - m[3]) / 2 + "," + (height- m[0] - m[2]) / 2 + ")");

							var g = gout.selectAll(".arc")
								.data(pie(pieData))
								.enter().append("g")
								.attr("class", "arc");

							g.append("path")
							.attr("d", arc)
							.style("fill", function(d) {return color(d.data[0]); })
							.style("opacity",0.6);

							g.append("text")
							.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
							.attr("dy", ".35em")
							.style("text-anchor", "middle")
							.text(function(d) { return d.data[0]; });							
						
						var arc = d3.svg.arc()
								.outerRadius(radius - 10)
								.innerRadius(0);

							var pie = d3.layout.pie()
								.sort(null)
								.value(function(d) {return d[1]; });

								
							 var svg=vis.append("svg:svg");
										
									var gout=svg.attr("width", width- m[1] - m[3])
										.attr("height", height- m[0] - m[2])
										.append("g");
										
										gout.attr("transform", "translate(" + (width- m[1] - m[3]) / 2 + "," + (height- m[0] - m[2]) / 2 + ")");

							var g = gout.selectAll(".arc")
								.data(pie(pieData1))
								.enter().append("g")
								.attr("class", "arc");

							g.append("path")
							.attr("d", arc)
							.style("fill", function(d) {return color(d.data[0]); })
							.style("opacity",0.6);

							g.append("text")
							.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
							.attr("dy", ".35em")
							.style("text-anchor", "middle")
							.text(function(d) { return d.data[0]; });							
						}
					}
					
						if(scope.$parent.SelectedRedInfo1.sri.ElemDesc.length<100000){	
		
		var somClustElem = [];

		var stable = document.getElementById("SOMTable");
		if(stable!=null){
		var stablebody = stable.getElementsByTagName("tbody")[0];
	    var strow       = stablebody.getElementsByTagName("tr");
		
		if(scope.view==1){
		for(var k=0;k<strow.length;k++){
				var elem = strow[k].getElementsByTagName("td")[0].childNodes[0];
				somClustElem.push(elem.data);
		}
		}
	}
		var columns=["Redescription support"];
		
		var tabid = "";
		
		if(scope.view==1)
			tabid="redSupTableE";
		else if(scope.view == 2) tabid="redSupTableA";
		else if(scope.view == 3) tabid ="redSupTableG";
		
		
		
		var clSupTab = function clSuptabF(){
			console.log('support click '+1);
			if(scope.view==1)
			 $location.hash('somContainer');
			else if(scope.view==2)
				$location.hash('heatmap');
			else if(scope.view==3)
				$location.hash('redCharts');
			 $anchorScroll();
		}
		
		var clSupTabt = function clSuptabFt(){
			var tt="";
			if(scope.view==1)
			tt="redSomContainer";
		else if(scope.view == 2) tt="redTableDiv";
		else if(scope.view == 3) tt ="lists";
		console.log(tt);
				$location.hash(tt);
			 $anchorScroll();
		}
		
		var clSupTabtEnt = function clSuptabFEnt(){
				if(scope.view==2){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[1].active=false;
				}
				else if(scope.view==3){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[2].active=false;
				}
			
				scope.$parent.onTabSelected('entityInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		var clSupTabtAtt = function clSuptabFAtt(){
				if(scope.view==1){
					scope.$parent.tabs[0].active=false;
				    scope.$parent.tabs[1].active=true;
				}
				else if(scope.view==3){
					scope.$parent.tabs[2].active=false;
				    scope.$parent.tabs[1].active=true;
				}
			
				scope.$parent.onTabSelected('attributeInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		
		var clSupTabtGLP = function clSuptabFGlp(){
				if(scope.view==1){
					scope.$parent.tabs[0].active=false;
				    scope.$parent.tabs[2].active=true;
				}
				else if(scope.view==2){
					scope.$parent.tabs[1].active=false;
				    scope.$parent.tabs[2].active=true;
				}
			
				scope.$parent.onTabSelected('globalInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		var clSupTabtEnt = function clSuptabFEnt(){
			if(scope.view==2){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[1].active=false;
				}
				else if(scope.view==3){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[2].active=false;
				}
				scope.$parent.onTabSelected('entityInfo');
				console.log(scope.$parent.tabs);
				 $location.hash('start');
				 $anchorScroll();
				scope.$parent.$apply();
		}
      
	  
	  var clSupTabMO = function movclSupTabMO(){
			d3.select(this).style("cursor","pointer");
	  }
	
		var tdiv=d3.select(element[0]).append("div")
			.attr("id", tabid)
			.style("position","relative")
			.style("margin-top","20px")
			.style("margin-bottom","20px")
			.style("height","200px")
			.attr("style", "position: relative; display:inline-block; width:30%; height: 220px; width: 250px; margin-left: 0px; margin-top: 20px; margin-right: 20px;  overflow-y: scroll; overflow-x: hidden;")
			
		//console.log(scope.$parent.SelectedRedInfo1.sri.ElemDesc);
		
		var redsupId = "";
		
		if(scope.view == 1)
			redSupId = "redSupTTE";
		else if(scope.view == 2) redSupId = "redSupTTA";
		else if(scope.view == 3) redSupId = "redSupTTG";
		
		var table = tdiv.append("table")
				.attr("id",redSupId)
				.attr("class", "tablesorter")
				.attr("border-collapse","separate")
				.attr("border-spacing","10 10")
				.attr("style", "position: relative; float:left; height: 220px; width: 220px; margin-left: 0px;")
				//.style("max-height","200px"),
			thead = table.append("thead"),
			tbody = table.append("tbody")
					.attr("style", "height: 200px; overflow-y: scroll; overflow-x: hidden; ");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center")
			.style("cursor", "pointer");

		// create a row for each object in the data
		var rows = tbody.selectAll("tr")
			.data(scope.$parent.SelectedRedInfo1.sri.ElemDesc)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			
		// create a cell in each row for each column
		var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log(row);
				return columns.map(function(column) {
					return {column: column, value: row.elementDescription};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					return d.value; 
				})
			.attr("style", "text-align:center")
			.style("background-color",function(d,i){if($.inArray(d.value, somClustElem)!=-1) return "#4CAF50";});//add array of SOM elements

		if(scope.view == 1)
			$("#redSupTTE").tablesorter({sortList:[[0,0]]});
		else if(scope.view == 2)
			 $("#redSupTTA").tablesorter({sortList:[[0,0]]});
		else if(scope.view == 3)
			 $("#redSupTTG").tablesorter({sortList:[[0,0]]});
	}
		else{
			var butId="";
			var expFuncName = "";
			if(scope.view==1){
				globalVarE1 = scope.$parent.SelectedRedInfo1.sri.ElemDesc;
				butId = "exButtSE";
				expFuncName = "exportFunctionSuppE()";
			}
			else if(scope.view == 2){
				globalVarA1 = scope.$parent.SelectedRedInfo1.sri.ElemDesc;
				butId = "exButtSA";
				expFuncName = "exportFunctionSuppA()";
			}
			else if(scope.view == 3){
				globalVarG1 = scope.$parent.SelectedRedInfo1.sri.ElemDesc;
				butId = "exButtSG";
				expFuncName = "exportFunctionSuppG()";
			}
		globalVar1=scope.$parent.SelectedRedInfo1.sri.ElemDesc;
			var exButtonS = d3.select(element[0]).append("button").attr("type","button")
										.attr("id",butId)
										.attr("onclick",expFuncName)
										.style("margin-bottom","20px")
										.text('Export redescription support');
		}
		
// make a attribute description table
var columns=["Name", "Description"];
			    //console.log('something is wrong!');
				//console.log(element[0]);
				
		var atTableId = "";
		var ttabId = "";
		
		if(scope.view == 1){
			atTableId = "redADContE";
			ttabId = "redADE";
		}
		else if(scope.view == 2){ 
		atTableId = "redADContA";
		ttabId = "redADA";
		}
		else if(scope.view == 3){
			atTableId = "redADContG";
			ttabId = "redADG";
		}
		
		var tdiv=d3.select(element[0]).append("div")
			.attr("id", atTableId)
			.style("position","relative")
			.style("margin-top","20px")
			.style("margin-bottom","20px")
			.style("height","200px")
			.attr("style", "position: relative; display:inline-block; width:30%; height: 220px; width: 350px; margin-left: 0px; margin-top: 20px; overflow-y: scroll; overflow-x: scroll;");
		
		//console.log(scope.$parent.SelectedRedInfo1.sri.ElemDesc);
		
		var table = tdiv.append("table")
				.attr("id",ttabId)
				.attr("class", "tablesorter")
				.attr("border-collapse","separate")
				.attr("border-spacing","10 10")
				.attr("style", "position: relative;  height: 220px; width: 330px; margin-left: 0px;")
				.attr("border","1px solid black")
				.attr("rules","cols")
				.attr("frame","void")
				//.style("max-height","200px"),
			thead = table.append("thead"),
			tbody = table.append("tbody")
					.attr("style", "height: 200px; overflow-y: scroll; overflow-x: scroll; ");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center")
			.style("cursor", "pointer");

		// create a row for each object in the data
		//console.log(scope.$parent.SelectedRedInfo1.sri.AttrDesc);
		var rows = tbody.selectAll("tr")
			.data(scope.$parent.SelectedRedInfo1.sri.AttrDesc)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			
		// create a cell in each row for each column
		var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log(row);
				return columns.map(function(column) {
					return {column: column, value: row.data};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					return d.value[i]; 
				})
			.attr("style", "text-align:center");

//$(document).ready(function() 
  //  { 
  
  if(scope.view==1)
        $("#redADE").tablesorter({sortList:[[0,0]]}); 
	else if(scope.view==2)
		$("#redADA").tablesorter({sortList:[[0,0]]}); 
	else if(scope.view==3)
		$("#redADG").tablesorter({sortList:[[0,0]]}); 
    //} 
//); 
				
 // Returns a function to compute the interquartile range.
		function iqr(k) {
				return function(d, i) {
				var q1 = d.quartiles[0],
				q3 = d.quartiles[2],
				iqr = (q3 - q1) * k,
				i = -1,
				j = d.length;
				while (d[++i] < q1 - iqr);
				while (d[--j] > q3 + iqr);
		return [i, j];
   };
  }
  
   element[0].scrollIntoView(true);
   
    var dlabul=d3.select(element[0]).append("ul")
	.style("list-style","none")
	.style("overflow","hidden")
	.style("background-color","#e6EEEE")
	.style("margin-top", "0.2cm")
	.style("width","760px");
   
   var t="";
   if(scope.view==1)
	   t="Go to SOM";
   else if(scope.view==2)
	   t="Go to heatmap";
   else if(scope.view == 3)
	   t="Go to crossfilter";
   
   var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'lab')
		.style("float", "left")
		.style("display","inline-block");;
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'labt')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",clSupTab)
		.on("mouseover",clSupTabMO);
	
 t="Go to redescription table";
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'rt')
		.style("float", "left")
		.style("display","inline-block");
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'rt')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",clSupTabt)
		.on("mouseover",clSupTabMO);

if(scope.view==1)		
	t="Go to attribute context";
else if(scope.view==2)
	t="Go to entity context"
else if(scope.view==3)
	t="Go to entity context";
	
	var func;
	
	if(scope.view==1)
		func=clSupTabtAtt;
	else func=clSupTabtEnt;
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'fcon')
		.style("float", "left")
		.style("display","inline-block");
		

   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'fcon')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",func)
		.on("mouseover",clSupTabMO);

if(scope.view==1)		
	t="Go to properties context";
else if(scope.view==2)
	t="Go to properties context"
else if(scope.view==3)
	t="Go to attribute context";

	if(scope.view==3)
		func=clSupTabtAtt;
	else func=clSupTabtGLP;
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'secon')
		.style("float", "left")
		.style("display","inline-block");
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'secon')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.style("margin-top","2cm")
		.on("click",func)
		.on("mouseover",clSupTabMO);
				
			},true);
					
		   scope.$parent.$watch('Trends2',function(newData, oldData){//modify
				if(scope.view==1 || scope.view ==2 || scope.$parent.Trends2 == -1)
					return;
				
				 $(element[0]).empty();
						 
						 var checked = false;
							
						 if(scope.view==3){
							$("#redSupTableG").empty();
							$("#redADG").empty();
							$("[id=attrdistG]").empty();
							$("#RelationGraphG").remove();
						 }
						 
						var w = 60,//120,
							h = 250,//500,
							m = [5,25,10,25],//[10, 50, 20, 50], // top right bottom left
							min = Infinity,
							max = -Infinity;
							
							var aat = "", butContAt="";
							
							if(scope.view==1){
								aat="attrdistE";
								butContAt = "butContE";
							}
							else if(scope.view==2){ 
								aat="attrdistA";
								butContAt = "butContA";
							}
							else if(scope.view==3){ 
								aat="attrdistG";
								butContAt = "butContG";
							}
							
							var boxOptions = d3.select(element[0]).append("div").attr("id",butContAt);
							var boxSpan = boxOptions.append("span").attr("id",butContAt+"sp");
							var lab=boxSpan.append("label").style("margin-right","40px");
							var radio1=lab.append("input").attr("type","radio").attr("name",butContAt+"plot").attr("value","nbox").attr("onclick","choosePlotTypeGP(this)").style("margin-left","48px");
							lab.append("p").text("Notched box plot");
							var lab1=boxSpan.append("label").style("margin-right","40px");
							var radio2=lab1.append("input").attr("type","radio").attr("name",butContAt+"plot").attr("value","viol").attr("onclick","choosePlotTypeGP(this)").style("margin-left","30px");
							lab1.append("p").text("Violin plot");
							
							if(scope.$parent.plotType2==1 || scope.$parent.plotType2==2){
								radio1.property("checked",true);
								radio2.property("checked",false);
							}
							else{ 
								radio1.property("checked",false);
								radio2.property("checked",true);
							}
							
							var lab2=boxSpan.append("label").style("margin-right","40px");
							var chk=lab2.append("input").attr("type","checkbox").attr("name",butContAt+"Trends").attr("onclick","addTrandLinesGP(this)").style("margin-left","35px");
							lab2.append("p").text("Trend Lines");
							
							if(scope.$parent.Trends2==1)
								chk.property("checked",true);
							else if(scope.$parent.Trends2==0) chk.property("checked",false);
								
						
						var maxCLW1=0,maxCLW2=0;
						var attrOcc=new HashMap();
						
						for(j=0;j<scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length;j++){//add loading bar
							if(!attrOcc.has(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]))
								attrOcc.set(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0],1);
							else{
								var occ=attrOcc.get(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]);
								attrOcc.set(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0],occ+1);
							}
								for(i=0;i<scope.$parent.SelectedRedInfo2.sri.AttrDesc.length;i++){
										if(scope.$parent.SelectedRedInfo2.sri.AttrDesc[i].data[2]==1 && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[4]>maxCLW1 && scope.$parent.SelectedRedInfo2.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])
												maxCLW1=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[4];
										else if(scope.$parent.SelectedRedInfo2.sri.AttrDesc[i].data[2]==2 && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[4]>maxCLW2 && scope.$parent.SelectedRedInfo2.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])
												maxCLW2=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[4];
								}
						}
						
					for(j=0;j<scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length;j++){
						var attrsView=0;
						var	intervalOK=0;
						if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[1]!="null" && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[2]!="null"){
							
						for(i=0;i<scope.$parent.SelectedRedInfo2.sri.AttrDesc.length;i++){
							
									if(scope.$parent.SelectedRedInfo2.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]){
										attrsView=scope.$parent.SelectedRedInfo2.sri.AttrDesc[i].data[2];
										break;
									}
								}							
						
						var avallSet=new HashSet();						
						var boxplotValues=[], attributeValuesAll=[], attributeValuesInterval=[], attributeValuesRed=[], attributeValuesClause=[],attributeValuesAllAttrOcc=[], boxplotValuesNew=[];
						min = Infinity,
						max = -Infinity;

							var elementValues=new HashMap();
						for(i=0;i<scope.$parent.SelectedRedInfo2.sri.RedAttributes.length;i++){
								var values=new Array(1);
								if(!elementValues.has(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0]))
									elementValues.set(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0],values);
								//for(azat=0;azat<scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length;azat++){
									
									if(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]){
										
										values=elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0]);
										values[0]=scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1];
										elementValues.set(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0],values);
									}
								//}
						}
							
						for(i=0;i<scope.$parent.SelectedRedInfo2.sri.RedAttributes.length;i++){
							intervalOK=0;
							if(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]){
								attributeValuesAll.push(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]);
								boxplotValuesNew.push({group:"All",value:scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]});
								
								if(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]>=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[1] && scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]<=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[2] && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[3]==0){//add flag for negation
									attributeValuesInterval.push(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]);
									boxplotValuesNew.push({group:"Interval",value:scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]});
								}
								else if((!(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]>=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[1]) || !(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]<=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[2])) && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[3]==1){
										attributeValuesInterval.push(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]);
										boxplotValuesNew.push({group:"Interval",value:scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]});
								}

									if(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]>max)
										max=scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1];
									if(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]<min)
										min=scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1];
									
								for(k=0;k<scope.$parent.SelectedRedInfo2.sri.RedSupport.length;k++){
									if(scope.$parent.SelectedRedInfo2.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0]){
										attributeValuesRed.push(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]);
										boxplotValuesNew.push({group:"Support",value:scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]});
										intervalOK=1;
										break;
									}
								}
								
							if(intervalOK==1){
								var contained=1, containedU=1;
								//for(azat=0;azat<scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length;azat++){
									var attrsViewNew=0;
									//if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[4]==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat].data[4]){
											for(iz=0;iz<scope.$parent.SelectedRedInfo2.sri.AttrDesc.length;iz++){
												if(scope.$parent.SelectedRedInfo2.sri.AttrDesc[iz].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]){
														attrsViewNew=scope.$parent.SelectedRedInfo2.sri.AttrDesc[iz].data[2];
															break;
													}
												}
											if(attrsView==attrsViewNew){
												if(!(elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[1] && elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[2]) && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[3]==0){//add flag for negation
														contained=0;
											}
												else if((elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[1]) && (elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[2]) && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[3]==1){
														contained=0;
												}	
											
											}		

											var containedUTmp=1;
											for(azat1=0;azat1<scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length;azat1++){
												
												
												if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat1].data[0]!=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])
													continue;
												
												containedUTmp=1;
												//if(attrsViewNew2==attrsViewTmp && attrsView==attrsViewTmp && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat1].data[4]==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat].data[4]){
												if(!(elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat1].data[1] && elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat1].data[2]) && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat1].data[3]==0){//add flag for negation
														containedUTmp=0;
											}
												else if((elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat1].data[1]) && (elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat1].data[2]) && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat1].data[3]==1){
														containedUTmp=0;
												}	
												
											//}
											if(containedUTmp==1)
												break;
										}

												if(containedUTmp==1){
													if(!avallSet.contains(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])){
														attributeValuesAllAttrOcc.push(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]);
														if((attrsView==1 && maxCLW1>0 && attrOcc.get(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])>1) || (attrsView==2 && maxCLW2>0 && attrOcc.get(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])>1))
															boxplotValuesNew.push({group:"All Clauses",value:scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]});
														avallSet.add(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0]);
													}
												}										
									//  }
								//   }
								   
								   if(contained==1){
									   if(!avallSet.contains(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])){
													attributeValuesAllAttrOcc.push(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]);
													if((attrsView==1 && maxCLW1>0 && attrOcc.get(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])>1) || (attrsView==2 && maxCLW2>0 && attrOcc.get(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])>1))
														boxplotValuesNew.push({group:"All Clauses",value:scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]});
													 avallSet.add(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0]);
											}
									  
									   attributeValuesClause.push(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]);
									  if((attrsView==1 && maxCLW1>0) || (attrsView==2 && maxCLW2>0)) 
											boxplotValuesNew.push({group:"Clause",value:scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]});
								   }  
								   
							  }							  
							}
						}

						//console.log("Finished with attribute!")
						
						if(attrsView==1 && maxCLW1>0){
							if(attrOcc.get(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])>1)
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesAllAttrOcc,attributeValuesClause];
							else
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesClause];	
							}							
						else if(attrsView==2 && maxCLW2>0){
							if(attrOcc.get(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])>1)
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesAllAttrOcc,attributeValuesClause];
							else
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesClause];	
						}
						else if(attrsView==1 && maxCLW1==0)
							boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed];
						else if(attrsView==2 && maxCLW2==0)
							boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed];
						
						var attribute;
						
						for(i=0;i<scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length;i++)
							for(atz=0;atz<scope.$parent.SelectedRedInfo2.sri.AttrDesc.length;atz++)
									if(scope.$parent.SelectedRedInfo2.sri.AttrDesc[atz].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]){
										attribute=scope.$parent.SelectedRedInfo2.sri.AttrDesc[atz].data[0];
										break;
									}
						
						if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[3]==1)
								attribute = " ~ "+attribute+" Cl"+(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[4]+1);
						else
							attribute=attribute+" Cl"+(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[4]+1);
						
						var chart = d3.chart.box()
							.whiskers(iqr(1.5))
							.width(w - m[1] - m[3])
							.height(h - m[0] - m[2]);
							
							chart.domain([min, max]);

							 var vis = d3.select(element[0]).append("div")
										 .attr("id",aat);
										 
										 if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length>3)
										 vis.style("display","inline-block").style("width","380px");   //.style("display","table-cell"); "33%"
									 else if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length<=3)
										 vis.style("display","table-cell");//.style("width","0%");   //.style("display","table-cell");
										 
										 vis.append("p")
										  .attr("align","center")
										  .style("font-weight","bold")
										  .style("font-size","20px")
										 .text(attribute);
								
									var interpolation='basis';

										var domain=[min,max];
										console.log("boxplotValues");
										console.log(boxplotValues);
										console.log(boxplotValuesNew);
										
										vis.append("div").attr("id",aat+j).style("height","330px").style("width","360px").style("background-color", "#f0f5f5");
										
										boxplotValuesNew.forEach(function (d) {d.value = +d.value;});
										 var chartDistAnalysis1;
											 chartDistAnalysis1 = makeDistroChart({
															data:boxplotValuesNew,
															xName:'group',
															yName:'value',
															axisLabels: {xAxis: null, yAxis: 'Value'},
															selector:"#"+aat+j,
															chartSize:{height:320, width:350},
															margin: {top: 35, right: 5, bottom: 51, left: 50},
															constrainExtremes:false});

															console.log("chart1");
															console.log(chartDistAnalysis1);															
													
															chartDistAnalysis1.renderBoxPlot({showOutliers:false});
															chartDistAnalysis1.renderDataPlots();
															chartDistAnalysis1.renderNotchBoxes({showNotchBox:false});
															chartDistAnalysis1.renderViolinPlot({showViolinPlot:false});
		
										if((scope.$parent.plotType2==1 || scope.$parent.plotType2==2) && scope.$parent.resetPlots2==0){
											chartDistAnalysis1.violinPlots.hide(); chartDistAnalysis1.notchBoxes.show({reset:true});
											chartDistAnalysis1.boxPlots.show({reset:true, showBox:false,showOutliers:true,boxWidth:20,scatterOutliers:true,colors:['#555'],medianCSize:2});
										}
										if(scope.$parent.plotType2==0 || scope.$parent.plotType2==-1 || scope.$parent.resetPlots2==1){
											chartDistAnalysis1.violinPlots.show({reset:true,clamp:1,bandwidth:1,resolution:100});
											chartDistAnalysis1.boxPlots.show({reset:true, showWhiskers:false,showOutliers:false,boxWidth:10,lineWidth:15,colors:['#555'],medianCSize:2,showWhiskers:true});
										}
										
										if(scope.$parent.Trends2==1){
											console.log("plot type: "+scope.$parent.plotType);
											chartDistAnalysis1.dataPlots.change({showLines:['median','quartile1','quartile3']});
										}
										else if(scope.$parent.Trends2==0){
											chartDistAnalysis1.dataPlots.change({showLines:false});
											
										}
						}
					else{
							var map=new HashMap();
							var map1=new HashMap();
							var categoryMap=new HashMap();

							var einSupp= scope.$parent.SelectedRedInfo2.sri.RedSupport[0].element;
							var category=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[1];

							var c=0,c1=0;
							for(i=0;i<scope.$parent.SelectedRedInfo2.sri.RedAttributes.length;i++){
								if(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]){
										
										for(z=0;z<scope.$parent.SelectedRedInfo2.sri.CategoryDesc.length;z++)
												if(scope.$parent.SelectedRedInfo2.sri.CategoryDesc[z].data[0] == scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])
													categoryMap.set(scope.$parent.SelectedRedInfo2.sri.CategoryDesc[z].data[0]+","+scope.$parent.SelectedRedInfo2.sri.CategoryDesc[z].data[1],scope.$parent.SelectedRedInfo2.sri.CategoryDesc[z].data[2]);
	
									c=c+1;
									
									 var cv=scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1];
								 var key= scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]+","+cv;
								 var catString=categoryMap.get(key);
								 
									if(!map.has(catString))
										map.set(catString,1);
									else{
										map.set(catString,map.get(catString)+1);
										}
									
									var found=0;
								if(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]==category && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[3]==0){//optimize
								c1=c1+1;

									
									for(k=0;k<scope.$parent.SelectedRedInfo2.sri.RedSupport.length;k++){
										if(scope.$parent.SelectedRedInfo2.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0]){

												if(!map1.has(catString+" in"))
														map1.set(catString+" in",1);
												else{
														map1.set(catString+" in",map1.get(catString+" in")+1);
													}
													found=1;
												break;
											}
										}	
								  if(found==0){
									if(!map1.has(catString+" out"))
										map1.set(catString+" out",1);
									else{
										map1.set(catString+" out", map1.get(catString+" out")+1);
										}
								  }
								}
								else if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[3]==1){//code for negated attribute
									
									if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[1]!="null")
										category=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[1];
									else
										category=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[2];
									
									for(k=0;k<scope.$parent.SelectedRedInfo2.sri.RedSupport.length;k++){
										if(scope.$parent.SelectedRedInfo2.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0]){

												var cv=scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1];
											 var key= scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]+","+cv;
											 var catString=categoryMap.get(key);
											 
												if(!map1.has(catString+" in"))
														map1.set(catString+" in",1);
												else{
														map1.set(catString+" in",map1.get(catString+" in")+1);
													}
													found=1;
												break;
											}
										}	
										
								  if(found==0){
									if(!map1.has(catString+" out"))
										map1.set(catString+" out",1);
									else{
										map1.set(catString+" out",map1.get(catString+" out")+1);
										}
								  }
							  }
							}
						} 
						/*console.log(c);	console.log(c1);	
					    console.log('map1');		
						console.log(map1);*/
							
							var attribute;
						
						for(i=0;i<scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length;i++)
							if(scope.$parent.SelectedRedInfo2.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])
								attribute=scope.$parent.SelectedRedInfo2.sri.AttrDesc[i].data[0];
								
								var aat="";
								if(scope.view == 1)
									aat="attrdistE";
								else if(scope.view == 2) aat="attrdistA";
								else if(scope.view == 3) aat = "attrdistG";
								
							var vis = d3.select(element[0]).append("div")
										 .attr("id",aat);
										 
										 if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length>3)
										 vis.style("display","inline-block").style("width","33%");   //.style("display","table-cell");
									 else if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length<=3)
										 vis.style("display","table-cell");//.style("width","0%");   //.style("display","table-cell");
									 
									 vis.append("p")
										  .attr("align","center")
										  .style("font-weight","bold")
										  .style("font-size","20px")
										 .text(attribute);
								
							var pieData=[];
							map.forEach(function(value, key){ 
								pieData.push([key,value]);
							});	
							
							var pieData1=[];
							map1.forEach(function(value, key){ 
								pieData1.push([key,value]);
							});	
								
								var width = 200,
									height = 250,
							radius = Math.min(width- m[1] - m[3], height- m[0] - m[2]) / 2;

							var color = d3.scale.ordinal()
								.range(["#98abc5", "#8a89a6", "#6F5D7B", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);//#7b6888

							var arc = d3.svg.arc()
								.outerRadius(radius - 10)
								.innerRadius(0);

							var pie = d3.layout.pie()
								.sort(null)
								.value(function(d) {return d[1]; });

								
							 var svg=vis.append("svg:svg");
										
									var gout=svg.attr("width", width- m[1] - m[3])
										.attr("height", height- m[0] - m[2])
										.append("g");
										
										gout.attr("transform", "translate(" + (width- m[1] - m[3]) / 2 + "," + (height- m[0] - m[2]) / 2 + ")");

							var g = gout.selectAll(".arc")
								.data(pie(pieData))
								.enter().append("g")
								.attr("class", "arc");

							g.append("path")
							.attr("d", arc)
							.style("fill", function(d) {return color(d.data[0]); })
							.style("opacity",0.6);

							g.append("text")
							.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
							.attr("dy", ".35em")
							.style("text-anchor", "middle")
							.text(function(d) { return d.data[0]; });							
						
						var arc = d3.svg.arc()
								.outerRadius(radius - 10)
								.innerRadius(0);

							var pie = d3.layout.pie()
								.sort(null)
								.value(function(d) {return d[1]; });

								
							 var svg=vis.append("svg:svg");
										
									var gout=svg.attr("width", width- m[1] - m[3])
										.attr("height", height- m[0] - m[2])
										.append("g");
										
										gout.attr("transform", "translate(" + (width- m[1] - m[3]) / 2 + "," + (height- m[0] - m[2]) / 2 + ")");

							var g = gout.selectAll(".arc")
								.data(pie(pieData1))
								.enter().append("g")
								.attr("class", "arc");

							g.append("path")
							.attr("d", arc)
							.style("fill", function(d) {return color(d.data[0]); })
							.style("opacity",0.6);

							g.append("text")
							.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
							.attr("dy", ".35em")
							.style("text-anchor", "middle")
							.text(function(d) { return d.data[0]; });							
						}
					}
				
					if(scope.$parent.SelectedRedInfo2.sri.ElemDesc.length<100000){	
		
		var somClustElem = [];

		var stable = document.getElementById("SOMTable");
		if(stable!=null){
		var stablebody = stable.getElementsByTagName("tbody")[0];
	    var strow       = stablebody.getElementsByTagName("tr");
		
		if(scope.view==1){
		for(var k=0;k<strow.length;k++){
				var elem = strow[k].getElementsByTagName("td")[0].childNodes[0];
				somClustElem.push(elem.data);
		}
		}
	}
		var columns=["Redescription support"];
		
		var tabid = "";
		
		if(scope.view==1)
			tabid="redSupTableE";
		else if(scope.view == 2) tabid="redSupTableA";
		else if(scope.view == 3) tabid ="redSupTableG";
		
		
		
		var clSupTab = function clSuptabF(){
			console.log('support click '+1);
			if(scope.view==1)
			 $location.hash('somContainer');
			else if(scope.view==2)
				$location.hash('heatmap');
			else if(scope.view==3)
				$location.hash('redCharts');
			 $anchorScroll();
		}
		
		var clSupTabt = function clSuptabFt(){
			var tt="";
			if(scope.view==1)
			tt="redSomContainer";
		else if(scope.view == 2) tt="redTableDiv";
		else if(scope.view == 3) tt ="lists";
		console.log(tt);
				$location.hash(tt);
			 $anchorScroll();
		}
		
		var clSupTabtEnt = function clSuptabFEnt(){
				if(scope.view==2){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[1].active=false;
				}
				else if(scope.view==3){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[2].active=false;
				}
			
				scope.$parent.onTabSelected('entityInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		var clSupTabtAtt = function clSuptabFAtt(){
				if(scope.view==1){
					scope.$parent.tabs[0].active=false;
				    scope.$parent.tabs[1].active=true;
				}
				else if(scope.view==3){
					scope.$parent.tabs[2].active=false;
				    scope.$parent.tabs[1].active=true;
				}
			
				scope.$parent.onTabSelected('attributeInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		
		var clSupTabtGLP = function clSuptabFGlp(){
				if(scope.view==1){
					scope.$parent.tabs[0].active=false;
				    scope.$parent.tabs[2].active=true;
				}
				else if(scope.view==2){
					scope.$parent.tabs[1].active=false;
				    scope.$parent.tabs[2].active=true;
				}
			
				scope.$parent.onTabSelected('globalInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		var clSupTabtEnt = function clSuptabFEnt(){
			if(scope.view==2){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[1].active=false;
				}
				else if(scope.view==3){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[2].active=false;
				}
				scope.$parent.onTabSelected('entityInfo');
				console.log(scope.$parent.tabs);
				 $location.hash('start');
				 $anchorScroll();
				scope.$parent.$apply();
		}
      
	  
	  var clSupTabMO = function movclSupTabMO(){
			d3.select(this).style("cursor","pointer");
	  }
	
		var tdiv=d3.select(element[0]).append("div")
			.attr("id", tabid)
			.style("position","relative")
			.style("margin-top","20px")
			.style("margin-bottom","20px")
			.style("height","200px")
			.attr("style", "position: relative; display:inline-block; width:30%; height: 220px; width: 250px; margin-left: 0px; margin-top: 20px; margin-right: 20px;  overflow-y: scroll; overflow-x: hidden;")
			
		//console.log(scope.$parent.SelectedRedInfo2.sri.ElemDesc);
		
		var redsupId = "";
		
		if(scope.view == 1)
			redSupId = "redSupTTE";
		else if(scope.view == 2) redSupId = "redSupTTA";
		else if(scope.view == 3) redSupId = "redSupTTG";
		
		var table = tdiv.append("table")
				.attr("id",redSupId)
				.attr("class", "tablesorter")
				.attr("border-collapse","separate")
				.attr("border-spacing","10 10")
				.attr("style", "position: relative; float:left; height: 220px; width: 220px; margin-left: 0px;")
				//.style("max-height","200px"),
			thead = table.append("thead"),
			tbody = table.append("tbody")
					.attr("style", "height: 200px; overflow-y: scroll; overflow-x: hidden; ");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center")
			.style("cursor", "pointer");

		// create a row for each object in the data
		var rows = tbody.selectAll("tr")
			.data(scope.$parent.SelectedRedInfo2.sri.ElemDesc)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			
		// create a cell in each row for each column
		var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log(row);
				return columns.map(function(column) {
					return {column: column, value: row.elementDescription};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					return d.value; 
				})
			.attr("style", "text-align:center")
			.style("background-color",function(d,i){if($.inArray(d.value, somClustElem)!=-1) return "#4CAF50";});//add array of SOM elements

		if(scope.view == 1)
			$("#redSupTTE").tablesorter({sortList:[[0,0]]});
		else if(scope.view == 2)
			 $("#redSupTTA").tablesorter({sortList:[[0,0]]});
		else if(scope.view == 3)
			 $("#redSupTTG").tablesorter({sortList:[[0,0]]});
	}
		else{
			var butId="";
			var expFuncName = "";
			if(scope.view==1){
				globalVarE1 = scope.$parent.SelectedRedInfo2.sri.ElemDesc;
				butId = "exButtSE";
				expFuncName = "exportFunctionSuppE()";
			}
			else if(scope.view == 2){
				globalVarA1 = scope.$parent.SelectedRedInfo2.sri.ElemDesc;
				butId = "exButtSA";
				expFuncName = "exportFunctionSuppA()";
			}
			else if(scope.view == 3){
				globalVarG1 = scope.$parent.SelectedRedInfo2.sri.ElemDesc;
				butId = "exButtSG";
				expFuncName = "exportFunctionSuppG()";
			}
		globalVar1=scope.$parent.SelectedRedInfo2.sri.ElemDesc;
			var exButtonS = d3.select(element[0]).append("button").attr("type","button")
										.attr("id",butId)
										.attr("onclick",expFuncName)
										.style("margin-bottom","20px")
										.text('Export redescription support');
		}
		
// make a attribute description table
var columns=["Name", "Description"];
			    //console.log('something is wrong!');
				//console.log(element[0]);
				
		var atTableId = "";
		var ttabId = "";
		
		if(scope.view == 1){
			atTableId = "redADContE";
			ttabId = "redADE";
		}
		else if(scope.view == 2){ 
		atTableId = "redADContA";
		ttabId = "redADA";
		}
		else if(scope.view == 3){
			atTableId = "redADContG";
			ttabId = "redADG";
		}
		
		var tdiv=d3.select(element[0]).append("div")
			.attr("id", atTableId)
			.style("position","relative")
			.style("margin-top","20px")
			.style("margin-bottom","20px")
			.style("height","200px")
			.attr("style", "position: relative; display:inline-block; width:30%; height: 220px; width: 350px; margin-left: 0px; margin-top: 20px; overflow-y: scroll; overflow-x: scroll;");
		
		//console.log(scope.$parent.SelectedRedInfo2.sri.ElemDesc);
		
		var table = tdiv.append("table")
				.attr("id",ttabId)
				.attr("class", "tablesorter")
				.attr("border-collapse","separate")
				.attr("border-spacing","10 10")
				.attr("style", "position: relative;  height: 220px; width: 330px; margin-left: 0px;")
				.attr("border","1px solid black")
				.attr("rules","cols")
				.attr("frame","void")
				//.style("max-height","200px"),
			thead = table.append("thead"),
			tbody = table.append("tbody")
					.attr("style", "height: 200px; overflow-y: scroll; overflow-x: scroll; ");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center")
			.style("cursor", "pointer");

		// create a row for each object in the data
		//console.log(scope.$parent.SelectedRedInfo2.sri.AttrDesc);
		var rows = tbody.selectAll("tr")
			.data(scope.$parent.SelectedRedInfo2.sri.AttrDesc)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			
		// create a cell in each row for each column
		var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log(row);
				return columns.map(function(column) {
					return {column: column, value: row.data};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					return d.value[i]; 
				})
			.attr("style", "text-align:center");

//$(document).ready(function() 
  //  { 
  
  if(scope.view==1)
        $("#redADE").tablesorter({sortList:[[0,0]]}); 
	else if(scope.view==2)
		$("#redADA").tablesorter({sortList:[[0,0]]}); 
	else if(scope.view==3)
		$("#redADG").tablesorter({sortList:[[0,0]]}); 
    //} 
//); 
				
 // Returns a function to compute the interquartile range.
		function iqr(k) {
				return function(d, i) {
				var q1 = d.quartiles[0],
				q3 = d.quartiles[2],
				iqr = (q3 - q1) * k,
				i = -1,
				j = d.length;
				while (d[++i] < q1 - iqr);
				while (d[--j] > q3 + iqr);
		return [i, j];
   };
  }
  
   element[0].scrollIntoView(true);
   
    var dlabul=d3.select(element[0]).append("ul")
	.style("list-style","none")
	.style("overflow","hidden")
	.style("background-color","#e6EEEE")
	.style("margin-top", "0.2cm")
	.style("width","760px");
   
   var t="";
   if(scope.view==1)
	   t="Go to SOM";
   else if(scope.view==2)
	   t="Go to heatmap";
   else if(scope.view == 3)
	   t="Go to crossfilter";
   
   var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'lab')
		.style("float", "left")
		.style("display","inline-block");;
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'labt')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",clSupTab)
		.on("mouseover",clSupTabMO);
	
 t="Go to redescription table";
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'rt')
		.style("float", "left")
		.style("display","inline-block");
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'rt')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",clSupTabt)
		.on("mouseover",clSupTabMO);

if(scope.view==1)		
	t="Go to attribute context";
else if(scope.view==2)
	t="Go to entity context"
else if(scope.view==3)
	t="Go to entity context";
	
	var func;
	
	if(scope.view==1)
		func=clSupTabtAtt;
	else func=clSupTabtEnt;
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'fcon')
		.style("float", "left")
		.style("display","inline-block");
		

   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'fcon')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",func)
		.on("mouseover",clSupTabMO);

if(scope.view==1)		
	t="Go to properties context";
else if(scope.view==2)
	t="Go to properties context"
else if(scope.view==3)
	t="Go to attribute context";

	if(scope.view==3)
		func=clSupTabtAtt;
	else func=clSupTabtGLP;
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'secon')
		.style("float", "left")
		.style("display","inline-block");
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'secon')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.style("margin-top","2cm")
		.on("click",func)
		.on("mouseover",clSupTabMO);
				
			},true);
			
			scope.$parent.$watch('plotType',function(newData, oldData){
				if(scope.view==2 || scope.view ==3 || scope.$parent.plotType==-1)
					return;
						
						 $(element[0]).empty();
						 
						 var checked = false;
							
						 if(scope.view==1){
							$("#redSupTableE").empty();
							$("#redADE").empty();
							$("[id=attrdistE]").empty();
						 }
						 
						var w = 60,//120,
							h = 250,//500,
							m = [5,25,10,25],//[10, 50, 20, 50], // top right bottom left
							min = Infinity,
							max = -Infinity;
							
							var aat = "", butContAt="";
							
							if(scope.view==1){
								aat="attrdistE";
								butContAt = "butContE";
							}
							else if(scope.view==2){ 
								aat="attrdistA";
								butContAt = "butContA";
							}
							else if(scope.view==3){ 
								aat="attrdistG";
								butContAt = "butContG";
							}
							
							var boxOptions = d3.select(element[0]).append("div").attr("id",butContAt);
							var boxSpan = boxOptions.append("span").attr("id",butContAt+"sp");
							var lab=boxSpan.append("label").style("margin-right","40px");
							var radio1=lab.append("input").attr("type","radio").attr("name",butContAt+"plot").attr("value","nbox").attr("onclick","choosePlotTypeEl(this)").style("margin-left","48px");
							lab.append("p").text("Notched box plot");
							var lab1=boxSpan.append("label").style("margin-right","40px");
							var radio2=lab1.append("input").attr("type","radio").attr("name",butContAt+"plot").attr("value","viol").attr("onclick","choosePlotTypeEl(this)").style("margin-left","30px");
							lab1.append("p").text("Violin plot");
							
							if(scope.$parent.plotType==1 || scope.$parent.plotType==2){
								radio1.property("checked",true);
								radio2.property("checked",false);
							}
							else{ 
								radio1.property("checked",false);
								radio2.property("checked",true);
							}
							
							var lab2=boxSpan.append("label").style("margin-right","40px");
							var chk=lab2.append("input").attr("type","checkbox").attr("name",butContAt+"Trends").attr("onclick","addTrandLinesEl(this)").style("margin-left","35px");
							lab2.append("p").text("Trend Lines");
							
							if(scope.$parent.Trends==1)
									chk.property("checked",true);
							else if(scope.$parent.Trends==0) chk.property("checked",false);
								
						
						var maxCLW1=0,maxCLW2=0;
						var attrOcc=new HashMap();
						
						for(j=0;j<scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length;j++){//add loading bar
							if(!attrOcc.has(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]))
								attrOcc.set(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0],1);
							else{
								var occ=attrOcc.get(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]);
								attrOcc.set(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0],occ+1);
							}
								for(i=0;i<scope.$parent.SelectedRedInfo.sri.AttrDesc.length;i++){
										if(scope.$parent.SelectedRedInfo.sri.AttrDesc[i].data[2]==1 && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[4]>maxCLW1 && scope.$parent.SelectedRedInfo.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])
												maxCLW1=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[4];
										else if(scope.$parent.SelectedRedInfo.sri.AttrDesc[i].data[2]==2 && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[4]>maxCLW2 && scope.$parent.SelectedRedInfo.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])
												maxCLW2=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[4];
								}
						}
						
					for(j=0;j<scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length;j++){
						var attrsView=0;
						var	intervalOK=0;
						if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[1]!="null" && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[2]!="null"){
							
						for(i=0;i<scope.$parent.SelectedRedInfo.sri.AttrDesc.length;i++){
							
									if(scope.$parent.SelectedRedInfo.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]){
										attrsView=scope.$parent.SelectedRedInfo.sri.AttrDesc[i].data[2];
										break;
									}
								}							
						
						var avallSet=new HashSet();						
						var boxplotValues=[], attributeValuesAll=[], attributeValuesInterval=[], attributeValuesRed=[], attributeValuesClause=[],attributeValuesAllAttrOcc=[], boxplotValuesNew=[];
						min = Infinity,
						max = -Infinity;

							var elementValues=new HashMap();
						for(i=0;i<scope.$parent.SelectedRedInfo.sri.RedAttributes.length;i++){
								var values=new Array(1);
								if(!elementValues.has(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0]))
									elementValues.set(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0],values);
								//for(azat=0;azat<scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length;azat++){
									
									if(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]){
										
										values=elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0]);
										values[0]=scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1];
										elementValues.set(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0],values);
									}
								//}
						}
							
						for(i=0;i<scope.$parent.SelectedRedInfo.sri.RedAttributes.length;i++){
							intervalOK=0;
							if(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]){
								attributeValuesAll.push(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]);
								boxplotValuesNew.push({group:"All",value:scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]});
								
								if(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]>=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[1] && scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]<=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[2] && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[3]==0){//add flag for negation
									attributeValuesInterval.push(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]);
									boxplotValuesNew.push({group:"Interval",value:scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]});
								}
								else if((!(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]>=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[1]) || !(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]<=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[2])) && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[3]==1){
										attributeValuesInterval.push(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]);
										boxplotValuesNew.push({group:"Interval",value:scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]});
								}

									if(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]>max)
										max=scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1];
									if(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]<min)
										min=scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1];
									
								for(k=0;k<scope.$parent.SelectedRedInfo.sri.RedSupport.length;k++){
									if(scope.$parent.SelectedRedInfo.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0]){
										attributeValuesRed.push(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]);
										boxplotValuesNew.push({group:"Support",value:scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]});
										intervalOK=1;
										break;
									}
								}
								
							if(intervalOK==1){
								var contained=1, containedU=1;
								//for(azat=0;azat<scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length;azat++){
									var attrsViewNew=0;
									//if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[4]==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat].data[4]){
											for(iz=0;iz<scope.$parent.SelectedRedInfo.sri.AttrDesc.length;iz++){
												if(scope.$parent.SelectedRedInfo.sri.AttrDesc[iz].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]){
														attrsViewNew=scope.$parent.SelectedRedInfo.sri.AttrDesc[iz].data[2];
															break;
													}
												}
											if(attrsView==attrsViewNew){
												if(!(elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[1] && elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[2]) && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[3]==0){//add flag for negation
														contained=0;
											}
												else if((elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[1]) && (elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[2]) && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[3]==1){
														contained=0;
												}	
											
											}		

											var containedUTmp=1;
											for(azat1=0;azat1<scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length;azat1++){
												
												
												if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat1].data[0]!=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])
													continue;
												
												containedUTmp=1;
												//if(attrsViewNew2==attrsViewTmp && attrsView==attrsViewTmp && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat1].data[4]==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat].data[4]){
												if(!(elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat1].data[1] && elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat1].data[2]) && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat1].data[3]==0){//add flag for negation
														containedUTmp=0;
											}
												else if((elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat1].data[1]) && (elementValues.get(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat1].data[2]) && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[azat1].data[3]==1){
														containedUTmp=0;
												}	
												
											//}
											if(containedUTmp==1)
												break;
										}

												if(containedUTmp==1){
													if(!avallSet.contains(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])){
														attributeValuesAllAttrOcc.push(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]);
														if((attrsView==1 && maxCLW1>0 && attrOcc.get(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])>1) || (attrsView==2 && maxCLW2>0 && attrOcc.get(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])>1))
															boxplotValuesNew.push({group:"All Clauses",value:scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]});
														avallSet.add(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0]);
													}
												}										
									//  }
								//   }
								   
								   if(contained==1){
									   if(!avallSet.contains(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0])){
													attributeValuesAllAttrOcc.push(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]);
													if((attrsView==1 && maxCLW1>0 && attrOcc.get(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])>1) || (attrsView==2 && maxCLW2>0 && attrOcc.get(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])>1))
														boxplotValuesNew.push({group:"All Clauses",value:scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]});
													 avallSet.add(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0]);
											}
									  
									   attributeValuesClause.push(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]);
									  if((attrsView==1 && maxCLW1>0) || (attrsView==2 && maxCLW2>0)) 
											boxplotValuesNew.push({group:"Clause",value:scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]});
								   }  
								   
							  }							  
							}
						}

						//console.log("Finished with attribute!")
						
						if(attrsView==1 && maxCLW1>0){
							if(attrOcc.get(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])>1)
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesAllAttrOcc,attributeValuesClause];
							else
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesClause];	
							}							
						else if(attrsView==2 && maxCLW2>0){
							if(attrOcc.get(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])>1)
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesAllAttrOcc,attributeValuesClause];
							else
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesClause];	
						}
						else if(attrsView==1 && maxCLW1==0)
							boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed];
						else if(attrsView==2 && maxCLW2==0)
							boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed];
						
						var attribute;
						
						for(i=0;i<scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length;i++)
							for(atz=0;atz<scope.$parent.SelectedRedInfo.sri.AttrDesc.length;atz++)
									if(scope.$parent.SelectedRedInfo.sri.AttrDesc[atz].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]){
										attribute=scope.$parent.SelectedRedInfo.sri.AttrDesc[atz].data[0];
										break;
									}
						
						if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[3]==1)
								attribute = " ~ "+attribute+" Cl"+(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[4]+1);
						else
							attribute=attribute+" Cl"+(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[4]+1);
						
						var chart = d3.chart.box()
							.whiskers(iqr(1.5))
							.width(w - m[1] - m[3])
							.height(h - m[0] - m[2]);
							
							chart.domain([min, max]);

							 var vis = d3.select(element[0]).append("div")
										 .attr("id",aat);
										 
										 if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length>3)
										 vis.style("display","inline-block").style("width","380px");   //.style("display","table-cell"); "33%"
									 else if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length<=3)
										 vis.style("display","table-cell");//.style("width","0%");   //.style("display","table-cell");
										 
										 vis.append("p")
										  .attr("align","center")
										  .style("font-weight","bold")
										  .style("font-size","20px")
										 .text(attribute);
								
									var interpolation='basis';

										var domain=[min,max];
										console.log("boxplotValues");
										console.log(boxplotValues);
										console.log(boxplotValuesNew);
										
										vis.append("div").attr("id",aat+j).style("height","330px").style("width","360px").style("background-color", "#f0f5f5");
										
										boxplotValuesNew.forEach(function (d) {d.value = +d.value;});
										 var chartDistAnalysis1;
											 chartDistAnalysis1 = makeDistroChart({
															data:boxplotValuesNew,
															xName:'group',
															yName:'value',
															axisLabels: {xAxis: null, yAxis: 'Value'},
															selector:"#"+aat+j,
															chartSize:{height:320, width:350},
															margin: {top: 35, right: 5, bottom: 51, left: 50},
															constrainExtremes:false});

															console.log("chart1");
															console.log(chartDistAnalysis1);															
													
															chartDistAnalysis1.renderBoxPlot({showOutliers:false});
															chartDistAnalysis1.renderDataPlots();
															chartDistAnalysis1.renderNotchBoxes({showNotchBox:false});
															chartDistAnalysis1.renderViolinPlot({showViolinPlot:false});
		
										if(scope.$parent.plotType==1 || scope.$parent.plotType==2){
											scope.$parent.resetPlots=0;
											chartDistAnalysis1.violinPlots.hide(); chartDistAnalysis1.notchBoxes.show({reset:true});
											chartDistAnalysis1.boxPlots.show({reset:true, showBox:false,showOutliers:true,boxWidth:20,scatterOutliers:true,colors:['#555'],medianCSize:2});
										}
										if(scope.$parent.plotType==0){
											scope.$parent.resetPlots=0;
											chartDistAnalysis1.violinPlots.show({reset:true,clamp:1,bandwidth:1,resolution:100});
											chartDistAnalysis1.boxPlots.show({reset:true, showWhiskers:false,showOutliers:false,boxWidth:10,lineWidth:15,colors:['#555'],medianCSize:2,showWhiskers:true});
										}
										
										if(scope.$parent.Trends==1){
											console.log("plot type: "+scope.$parent.plotType);
											chartDistAnalysis1.dataPlots.change({showLines:['median','quartile1','quartile3']});
										}
										else if(scope.$parent.Trends==0){
											chartDistAnalysis1.dataPlots.change({showLines:false});
											
										}
										
										
						}
					else{
							var map=new HashMap();
							var map1=new HashMap();
							var categoryMap=new HashMap();

							var einSupp= scope.$parent.SelectedRedInfo.sri.RedSupport[0].element;
							var category=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[1];

							var c=0,c1=0;
							for(i=0;i<scope.$parent.SelectedRedInfo.sri.RedAttributes.length;i++){
								if(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]){
										
										for(z=0;z<scope.$parent.SelectedRedInfo.sri.CategoryDesc.length;z++)
												if(scope.$parent.SelectedRedInfo.sri.CategoryDesc[z].data[0] == scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])
													categoryMap.set(scope.$parent.SelectedRedInfo.sri.CategoryDesc[z].data[0]+","+scope.$parent.SelectedRedInfo.sri.CategoryDesc[z].data[1],scope.$parent.SelectedRedInfo.sri.CategoryDesc[z].data[2]);
	
									c=c+1;
									
									 var cv=scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1];
								 var key= scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]+","+cv;
								 var catString=categoryMap.get(key);
								 
									if(!map.has(catString))
										map.set(catString,1);
									else{
										map.set(catString,map.get(catString)+1);
										}
									
									var found=0;
								if(scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1]==category && scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[3]==0){//optimize
								c1=c1+1;

									
									for(k=0;k<scope.$parent.SelectedRedInfo.sri.RedSupport.length;k++){
										if(scope.$parent.SelectedRedInfo.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0]){

												if(!map1.has(catString+" in"))
														map1.set(catString+" in",1);
												else{
														map1.set(catString+" in",map1.get(catString+" in")+1);
													}
													found=1;
												break;
											}
										}	
								  if(found==0){
									if(!map1.has(catString+" out"))
										map1.set(catString+" out",1);
									else{
										map1.set(catString+" out", map1.get(catString+" out")+1);
										}
								  }
								}
								else if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[3]==1){//code for negated attribute
									
									if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[1]!="null")
										category=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[1];
									else
										category=scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[2];
									
									for(k=0;k<scope.$parent.SelectedRedInfo.sri.RedSupport.length;k++){
										if(scope.$parent.SelectedRedInfo.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[0]){

												var cv=scope.$parent.SelectedRedInfo.sri.RedAttributes[i].data[1];
											 var key= scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0]+","+cv;
											 var catString=categoryMap.get(key);
											 
												if(!map1.has(catString+" in"))
														map1.set(catString+" in",1);
												else{
														map1.set(catString+" in",map1.get(catString+" in")+1);
													}
													found=1;
												break;
											}
										}	
										
								  if(found==0){
									if(!map1.has(catString+" out"))
										map1.set(catString+" out",1);
									else{
										map1.set(catString+" out",map1.get(catString+" out")+1);
										}
								  }
							  }
							}
						} 
						/*console.log(c);	console.log(c1);	
					    console.log('map1');		
						console.log(map1);*/
							
							var attribute;
						
						for(i=0;i<scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length;i++)
							if(scope.$parent.SelectedRedInfo.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo.sri.AttributeIntervals[j].data[0])
								attribute=scope.$parent.SelectedRedInfo.sri.AttrDesc[i].data[0];
								
								var aat="";
								if(scope.view == 1)
									aat="attrdistE";
								else if(scope.view == 2) aat="attrdistA";
								else if(scope.view == 3) aat = "attrdistG";
								
							var vis = d3.select(element[0]).append("div")
										 .attr("id",aat);
										 
										 if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length>3)
										 vis.style("display","inline-block").style("width","33%");   //.style("display","table-cell");
									 else if(scope.$parent.SelectedRedInfo.sri.AttributeIntervals.length<=3)
										 vis.style("display","table-cell");//.style("width","0%");   //.style("display","table-cell");
									 
									 vis.append("p")
										  .attr("align","center")
										  .style("font-weight","bold")
										  .style("font-size","20px")
										 .text(attribute);
								
							var pieData=[];
							map.forEach(function(value, key){ 
								pieData.push([key,value]);
							});	
							
							var pieData1=[];
							map1.forEach(function(value, key){ 
								pieData1.push([key,value]);
							});	
								
								var width = 200,
									height = 250,
							radius = Math.min(width- m[1] - m[3], height- m[0] - m[2]) / 2;

							var color = d3.scale.ordinal()
								.range(["#98abc5", "#8a89a6", "#6F5D7B", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);//#7b6888

							var arc = d3.svg.arc()
								.outerRadius(radius - 10)
								.innerRadius(0);

							var pie = d3.layout.pie()
								.sort(null)
								.value(function(d) {return d[1]; });

								
							 var svg=vis.append("svg:svg");
										
									var gout=svg.attr("width", width- m[1] - m[3])
										.attr("height", height- m[0] - m[2])
										.append("g");
										
										gout.attr("transform", "translate(" + (width- m[1] - m[3]) / 2 + "," + (height- m[0] - m[2]) / 2 + ")");

							var g = gout.selectAll(".arc")
								.data(pie(pieData))
								.enter().append("g")
								.attr("class", "arc");

							g.append("path")
							.attr("d", arc)
							.style("fill", function(d) {return color(d.data[0]); })
							.style("opacity",0.6);

							g.append("text")
							.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
							.attr("dy", ".35em")
							.style("text-anchor", "middle")
							.text(function(d) { return d.data[0]; });							
						
						var arc = d3.svg.arc()
								.outerRadius(radius - 10)
								.innerRadius(0);

							var pie = d3.layout.pie()
								.sort(null)
								.value(function(d) {return d[1]; });

								
							 var svg=vis.append("svg:svg");
										
									var gout=svg.attr("width", width- m[1] - m[3])
										.attr("height", height- m[0] - m[2])
										.append("g");
										
										gout.attr("transform", "translate(" + (width- m[1] - m[3]) / 2 + "," + (height- m[0] - m[2]) / 2 + ")");

							var g = gout.selectAll(".arc")
								.data(pie(pieData1))
								.enter().append("g")
								.attr("class", "arc");

							g.append("path")
							.attr("d", arc)
							.style("fill", function(d) {return color(d.data[0]); })
							.style("opacity",0.6);

							g.append("text")
							.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
							.attr("dy", ".35em")
							.style("text-anchor", "middle")
							.text(function(d) { return d.data[0]; });							
						}
					}

			//pload.style="visibility: hidden";			
					
	if(scope.$parent.SelectedRedInfo.sri.ElemDesc.length<100000){	
		
		var somClustElem = [];

		var stable = document.getElementById("SOMTable");
		if(stable!=null){
		var stablebody = stable.getElementsByTagName("tbody")[0];
	    var strow       = stablebody.getElementsByTagName("tr");
		
		if(scope.view==1){
		for(var k=0;k<strow.length;k++){
				var elem = strow[k].getElementsByTagName("td")[0].childNodes[0];
				somClustElem.push(elem.data);
		}
		}
	}
		var columns=["Redescription support"];
		
		var tabid = "";
		
		if(scope.view==1)
			tabid="redSupTableE";
		else if(scope.view == 2) tabid="redSupTableA";
		else if(scope.view == 3) tabid ="redSupTableG";
		
		
		
		var clSupTab = function clSuptabF(){
			console.log('support click '+1);
			if(scope.view==1)
			 $location.hash('somContainer');
			else if(scope.view==2)
				$location.hash('heatmap');
			else if(scope.view==3)
				$location.hash('redCharts');
			 $anchorScroll();
		}
		
		var clSupTabt = function clSuptabFt(){
			var tt="";
			if(scope.view==1)
			tt="redSomContainer";
		else if(scope.view == 2) tt="redTableDiv";
		else if(scope.view == 3) tt ="lists";
		console.log(tt);
				$location.hash(tt);
			 $anchorScroll();
		}
		
		var clSupTabtEnt = function clSuptabFEnt(){
				if(scope.view==2){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[1].active=false;
				}
				else if(scope.view==3){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[2].active=false;
				}
			
				scope.$parent.onTabSelected('entityInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		var clSupTabtAtt = function clSuptabFAtt(){
				if(scope.view==1){
					scope.$parent.tabs[0].active=false;
				    scope.$parent.tabs[1].active=true;
				}
				else if(scope.view==3){
					scope.$parent.tabs[2].active=false;
				    scope.$parent.tabs[1].active=true;
				}
			
				scope.$parent.onTabSelected('attributeInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		
		var clSupTabtGLP = function clSuptabFGlp(){
				if(scope.view==1){
					scope.$parent.tabs[0].active=false;
				    scope.$parent.tabs[2].active=true;
				}
				else if(scope.view==2){
					scope.$parent.tabs[1].active=false;
				    scope.$parent.tabs[2].active=true;
				}
			
				scope.$parent.onTabSelected('globalInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		var clSupTabtEnt = function clSuptabFEnt(){
			if(scope.view==2){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[1].active=false;
				}
				else if(scope.view==3){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[2].active=false;
				}
				scope.$parent.onTabSelected('entityInfo');
				console.log(scope.$parent.tabs);
				 $location.hash('start');
				 $anchorScroll();
				scope.$parent.$apply();
		}
      
	  
	  var clSupTabMO = function movclSupTabMO(){
			d3.select(this).style("cursor","pointer");
	  }
	
		var tdiv=d3.select(element[0]).append("div")
			.attr("id", tabid)
			.style("position","relative")
			.style("margin-top","20px")
			.style("margin-bottom","20px")
			.style("height","200px")
			.attr("style", "position: relative; display:inline-block; width:30%; height: 220px; width: 250px; margin-left: 0px; margin-top: 20px; margin-right: 20px;  overflow-y: scroll; overflow-x: hidden;")
			
		//console.log(scope.$parent.SelectedRedInfo.sri.ElemDesc);
		
		var redsupId = "";
		
		if(scope.view == 1)
			redSupId = "redSupTTE";
		else if(scope.view == 2) redSupId = "redSupTTA";
		else if(scope.view == 3) redSupId = "redSupTTG";
		
		var table = tdiv.append("table")
				.attr("id",redSupId)
				.attr("class", "tablesorter")
				.attr("border-collapse","separate")
				.attr("border-spacing","10 10")
				.attr("style", "position: relative; float:left; height: 220px; width: 220px; margin-left: 0px;")
				//.style("max-height","200px"),
			thead = table.append("thead"),
			tbody = table.append("tbody")
					.attr("style", "height: 200px; overflow-y: scroll; overflow-x: hidden; ");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center")
			.style("cursor", "pointer");

		// create a row for each object in the data
		var rows = tbody.selectAll("tr")
			.data(scope.$parent.SelectedRedInfo.sri.ElemDesc)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			
		// create a cell in each row for each column
		var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log(row);
				return columns.map(function(column) {
					return {column: column, value: row.elementDescription};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					return d.value; 
				})
			.attr("style", "text-align:center")
			.style("background-color",function(d,i){if($.inArray(d.value, somClustElem)!=-1) return "#4CAF50";});//add array of SOM elements

		if(scope.view == 1)
			$("#redSupTTE").tablesorter({sortList:[[0,0]]});
		else if(scope.view == 2)
			 $("#redSupTTA").tablesorter({sortList:[[0,0]]});
		else if(scope.view == 3)
			 $("#redSupTTG").tablesorter({sortList:[[0,0]]});
	}
		else{
			var butId="";
			var expFuncName = "";
			if(scope.view==1){
				globalVarE1 = scope.$parent.SelectedRedInfo.sri.ElemDesc;
				butId = "exButtSE";
				expFuncName = "exportFunctionSuppE()";
			}
			else if(scope.view == 2){
				globalVarA1 = scope.$parent.SelectedRedInfo.sri.ElemDesc;
				butId = "exButtSA";
				expFuncName = "exportFunctionSuppA()";
			}
			else if(scope.view == 3){
				globalVarG1 = scope.$parent.SelectedRedInfo.sri.ElemDesc;
				butId = "exButtSG";
				expFuncName = "exportFunctionSuppG()";
			}
		globalVar1=scope.$parent.SelectedRedInfo.sri.ElemDesc;
			var exButtonS = d3.select(element[0]).append("button").attr("type","button")
										.attr("id",butId)
										.attr("onclick",expFuncName)
										.style("margin-bottom","20px")
										.text('Export redescription support');
		}
		
// make a attribute description table
var columns=["Name", "Description"];
			    //console.log('something is wrong!');
				//console.log(element[0]);
				
		var atTableId = "";
		var ttabId = "";
		
		if(scope.view == 1){
			atTableId = "redADContE";
			ttabId = "redADE";
		}
		else if(scope.view == 2){ 
		atTableId = "redADContA";
		ttabId = "redADA";
		}
		else if(scope.view == 3){
			atTableId = "redADContG";
			ttabId = "redADG";
		}
		
		var tdiv=d3.select(element[0]).append("div")
			.attr("id", atTableId)
			.style("position","relative")
			.style("margin-top","20px")
			.style("margin-bottom","20px")
			.style("height","200px")
			.attr("style", "position: relative; display:inline-block; width:30%; height: 220px; width: 350px; margin-left: 0px; margin-top: 20px; overflow-y: scroll; overflow-x: scroll;");
		
		//console.log(scope.$parent.SelectedRedInfo.sri.ElemDesc);
		
		var table = tdiv.append("table")
				.attr("id",ttabId)
				.attr("class", "tablesorter")
				.attr("border-collapse","separate")
				.attr("border-spacing","10 10")
				.attr("style", "position: relative;  height: 220px; width: 330px; margin-left: 0px;")
				.attr("border","1px solid black")
				.attr("rules","cols")
				.attr("frame","void")
				//.style("max-height","200px"),
			thead = table.append("thead"),
			tbody = table.append("tbody")
					.attr("style", "height: 200px; overflow-y: scroll; overflow-x: scroll; ");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center")
			.style("cursor", "pointer");

		// create a row for each object in the data
		//console.log(scope.$parent.SelectedRedInfo.sri.AttrDesc);
		var rows = tbody.selectAll("tr")
			.data(scope.$parent.SelectedRedInfo.sri.AttrDesc)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			
		// create a cell in each row for each column
		var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log(row);
				return columns.map(function(column) {
					return {column: column, value: row.data};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					return d.value[i]; 
				})
			.attr("style", "text-align:center");

//$(document).ready(function() 
  //  { 
  
  if(scope.view==1)
        $("#redADE").tablesorter({sortList:[[0,0]]}); 
	else if(scope.view==2)
		$("#redADA").tablesorter({sortList:[[0,0]]}); 
	else if(scope.view==3)
		$("#redADG").tablesorter({sortList:[[0,0]]}); 
    //} 
//); 
				
 // Returns a function to compute the interquartile range.
		function iqr(k) {
				return function(d, i) {
				var q1 = d.quartiles[0],
				q3 = d.quartiles[2],
				iqr = (q3 - q1) * k,
				i = -1,
				j = d.length;
				while (d[++i] < q1 - iqr);
				while (d[--j] > q3 + iqr);
		return [i, j];
   };
  }
  
   element[0].scrollIntoView(true);
   
    var dlabul=d3.select(element[0]).append("ul")
	.style("list-style","none")
	.style("overflow","hidden")
	.style("background-color","#e6EEEE")
	.style("margin-top", "0.2cm")
	.style("width","760px");
   
   var t="";
   if(scope.view==1)
	   t="Go to SOM";
   else if(scope.view==2)
	   t="Go to heatmap";
   else if(scope.view == 3)
	   t="Go to crossfilter";
   
   var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'lab')
		.style("float", "left")
		.style("display","inline-block");;
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'labt')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",clSupTab)
		.on("mouseover",clSupTabMO);
	
 t="Go to redescription table";
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'rt')
		.style("float", "left")
		.style("display","inline-block");
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'rt')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",clSupTabt)
		.on("mouseover",clSupTabMO);

if(scope.view==1)		
	t="Go to attribute context";
else if(scope.view==2)
	t="Go to entity context"
else if(scope.view==3)
	t="Go to entity context";
	
	var func;
	
	if(scope.view==1)
		func=clSupTabtAtt;
	else func=clSupTabtEnt;
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'fcon')
		.style("float", "left")
		.style("display","inline-block");
		

   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'fcon')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",func)
		.on("mouseover",clSupTabMO);

if(scope.view==1)		
	t="Go to properties context";
else if(scope.view==2)
	t="Go to properties context"
else if(scope.view==3)
	t="Go to attribute context";

	if(scope.view==3)
		func=clSupTabtAtt;
	else func=clSupTabtGLP;
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'secon')
		.style("float", "left")
		.style("display","inline-block");
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'secon')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.style("margin-top","2cm")
		.on("click",func)
		.on("mouseover",clSupTabMO);		
	
					},true);
					
		scope.$parent.$watch('plotType1',function(newData, oldData){
				if(scope.view==1 || scope.view ==3 || scope.$parent.plotType1==-1)
					return;
						
						 $(element[0]).empty();
						 
						 var checked = false;
							
						 if(scope.view==2){
							$("[id=attrdistA]").empty();
							$("#redSupTableA").remove();
							$("#redADContA").remove();
							$("#RelationGraphA").remove();
						 }
						 
						var w = 60,//120,
							h = 250,//500,
							m = [5,25,10,25],//[10, 50, 20, 50], // top right bottom left
							min = Infinity,
							max = -Infinity;
							
							var aat = "", butContAt="";
							
							if(scope.view==1){
								aat="attrdistE";
								butContAt = "butContE";
							}
							else if(scope.view==2){ 
								aat="attrdistA";
								butContAt = "butContA";
							}
							else if(scope.view==3){ 
								aat="attrdistG";
								butContAt = "butContG";
							}
							
							var boxOptions = d3.select(element[0]).append("div").attr("id",butContAt);
							var boxSpan = boxOptions.append("span").attr("id",butContAt+"sp");
							var lab=boxSpan.append("label").style("margin-right","40px");
							var radio1=lab.append("input").attr("type","radio").attr("name",butContAt+"plot").attr("value","nbox").attr("onclick","choosePlotTypeAtt(this)").style("margin-left","48px");
							lab.append("p").text("Notched box plot");
							var lab1=boxSpan.append("label").style("margin-right","40px");
							var radio2=lab1.append("input").attr("type","radio").attr("name",butContAt+"plot").attr("value","viol").attr("onclick","choosePlotTypeAtt(this)").style("margin-left","30px");
							lab1.append("p").text("Violin plot");
							
							if(scope.$parent.plotType1==1 || scope.$parent.plotType1==2){
								radio1.property("checked",true);
								radio2.property("checked",false);
							}
							else{ 
								radio1.property("checked",false);
								radio2.property("checked",true);
							}
							
							var lab2=boxSpan.append("label").style("margin-right","40px");
							var chk=lab2.append("input").attr("type","checkbox").attr("name",butContAt+"Trends").attr("onclick","addTrandLinesAtt(this)").style("margin-left","35px");
							lab2.append("p").text("Trend Lines");
							
							if(scope.$parent.Trends1==1)
									chk.property("checked",true);
							else if(scope.$parent.Trends==0) chk.property("checked",false);
								
						
						var maxCLW1=0,maxCLW2=0;
						var attrOcc=new HashMap();
						
						for(j=0;j<scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length;j++){//add loading bar
							if(!attrOcc.has(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]))
								attrOcc.set(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0],1);
							else{
								var occ=attrOcc.get(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]);
								attrOcc.set(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0],occ+1);
							}
								for(i=0;i<scope.$parent.SelectedRedInfo1.sri.AttrDesc.length;i++){
										if(scope.$parent.SelectedRedInfo1.sri.AttrDesc[i].data[2]==1 && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[4]>maxCLW1 && scope.$parent.SelectedRedInfo1.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])
												maxCLW1=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[4];
										else if(scope.$parent.SelectedRedInfo1.sri.AttrDesc[i].data[2]==2 && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[4]>maxCLW2 && scope.$parent.SelectedRedInfo1.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])
												maxCLW2=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[4];
								}
						}
						
					for(j=0;j<scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length;j++){
						var attrsView=0;
						var	intervalOK=0;
						if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[1]!="null" && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[2]!="null"){
							
						for(i=0;i<scope.$parent.SelectedRedInfo1.sri.AttrDesc.length;i++){
							
									if(scope.$parent.SelectedRedInfo1.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]){
										attrsView=scope.$parent.SelectedRedInfo1.sri.AttrDesc[i].data[2];
										break;
									}
								}							
						
						var avallSet=new HashSet();						
						var boxplotValues=[], attributeValuesAll=[], attributeValuesInterval=[], attributeValuesRed=[], attributeValuesClause=[],attributeValuesAllAttrOcc=[], boxplotValuesNew=[];
						min = Infinity,
						max = -Infinity;

							var elementValues=new HashMap();
						for(i=0;i<scope.$parent.SelectedRedInfo1.sri.RedAttributes.length;i++){
								var values=new Array(1);
								if(!elementValues.has(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0]))
									elementValues.set(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0],values);
								//for(azat=0;azat<scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length;azat++){
									
									if(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]){
										
										values=elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0]);
										values[0]=scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1];
										elementValues.set(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0],values);
									}
								//}
						}
							
						for(i=0;i<scope.$parent.SelectedRedInfo1.sri.RedAttributes.length;i++){
							intervalOK=0;
							if(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]){
								attributeValuesAll.push(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]);
								boxplotValuesNew.push({group:"All",value:scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]});
								
								if(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]>=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[1] && scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]<=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[2] && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[3]==0){//add flag for negation
									attributeValuesInterval.push(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]);
									boxplotValuesNew.push({group:"Interval",value:scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]});
								}
								else if((!(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]>=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[1]) || !(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]<=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[2])) && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[3]==1){
										attributeValuesInterval.push(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]);
										boxplotValuesNew.push({group:"Interval",value:scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]});
								}

									if(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]>max)
										max=scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1];
									if(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]<min)
										min=scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1];
									
								for(k=0;k<scope.$parent.SelectedRedInfo1.sri.RedSupport.length;k++){
									if(scope.$parent.SelectedRedInfo1.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0]){
										attributeValuesRed.push(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]);
										boxplotValuesNew.push({group:"Support",value:scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]});
										intervalOK=1;
										break;
									}
								}
								
							if(intervalOK==1){
								var contained=1, containedU=1;
								//for(azat=0;azat<scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length;azat++){
									var attrsViewNew=0;
									//if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[4]==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat].data[4]){
											for(iz=0;iz<scope.$parent.SelectedRedInfo1.sri.AttrDesc.length;iz++){
												if(scope.$parent.SelectedRedInfo1.sri.AttrDesc[iz].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]){
														attrsViewNew=scope.$parent.SelectedRedInfo1.sri.AttrDesc[iz].data[2];
															break;
													}
												}
											if(attrsView==attrsViewNew){
												if(!(elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[1] && elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[2]) && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[3]==0){//add flag for negation
														contained=0;
											}
												else if((elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[1]) && (elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[2]) && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[3]==1){
														contained=0;
												}	
											
											}		

											var containedUTmp=1;
											for(azat1=0;azat1<scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length;azat1++){
												
												
												if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat1].data[0]!=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])
													continue;
												
												containedUTmp=1;
												//if(attrsViewNew2==attrsViewTmp && attrsView==attrsViewTmp && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat1].data[4]==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat].data[4]){
												if(!(elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat1].data[1] && elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat1].data[2]) && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat1].data[3]==0){//add flag for negation
														containedUTmp=0;
											}
												else if((elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat1].data[1]) && (elementValues.get(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat1].data[2]) && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[azat1].data[3]==1){
														containedUTmp=0;
												}	
												
											//}
											if(containedUTmp==1)
												break;
										}

												if(containedUTmp==1){
													if(!avallSet.contains(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])){
														attributeValuesAllAttrOcc.push(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]);
														if((attrsView==1 && maxCLW1>0 && attrOcc.get(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])>1) || (attrsView==2 && maxCLW2>0 && attrOcc.get(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])>1))
															boxplotValuesNew.push({group:"All Clauses",value:scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]});
														avallSet.add(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0]);
													}
												}										
									//  }
								//   }
								   
								   if(contained==1){
									   if(!avallSet.contains(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0])){
													attributeValuesAllAttrOcc.push(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]);
													if((attrsView==1 && maxCLW1>0 && attrOcc.get(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])>1) || (attrsView==2 && maxCLW2>0 && attrOcc.get(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])>1))
														boxplotValuesNew.push({group:"All Clauses",value:scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]});
													 avallSet.add(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0]);
											}
									  
									   attributeValuesClause.push(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]);
									  if((attrsView==1 && maxCLW1>0) || (attrsView==2 && maxCLW2>0)) 
											boxplotValuesNew.push({group:"Clause",value:scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]});
								   }  
								   
							  }							  
							}
						}

						//console.log("Finished with attribute!")
						
						if(attrsView==1 && maxCLW1>0){
							if(attrOcc.get(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])>1)
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesAllAttrOcc,attributeValuesClause];
							else
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesClause];	
							}							
						else if(attrsView==2 && maxCLW2>0){
							if(attrOcc.get(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])>1)
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesAllAttrOcc,attributeValuesClause];
							else
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesClause];	
						}
						else if(attrsView==1 && maxCLW1==0)
							boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed];
						else if(attrsView==2 && maxCLW2==0)
							boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed];
						
						var attribute;
						
						for(i=0;i<scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length;i++)
							for(atz=0;atz<scope.$parent.SelectedRedInfo1.sri.AttrDesc.length;atz++)
									if(scope.$parent.SelectedRedInfo1.sri.AttrDesc[atz].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]){
										attribute=scope.$parent.SelectedRedInfo1.sri.AttrDesc[atz].data[0];
										break;
									}
						
						if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[3]==1)
								attribute = " ~ "+attribute+" Cl"+(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[4]+1);
						else
							attribute=attribute+" Cl"+(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[4]+1);
						
						var chart = d3.chart.box()
							.whiskers(iqr(1.5))
							.width(w - m[1] - m[3])
							.height(h - m[0] - m[2]);
							
							chart.domain([min, max]);

							 var vis = d3.select(element[0]).append("div")
										 .attr("id",aat);
										 
										 if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length>3)
										 vis.style("display","inline-block").style("width","380px");   //.style("display","table-cell"); "33%"
									 else if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length<=3)
										 vis.style("display","table-cell");//.style("width","0%");   //.style("display","table-cell");
										 
										 vis.append("p")
										  .attr("align","center")
										  .style("font-weight","bold")
										  .style("font-size","20px")
										 .text(attribute);
								
									var interpolation='basis';

										var domain=[min,max];
										console.log("boxplotValues");
										console.log(boxplotValues);
										console.log(boxplotValuesNew);
										
										vis.append("div").attr("id",aat+j).style("height","330px").style("width","360px").style("background-color", "#f0f5f5");
										
										boxplotValuesNew.forEach(function (d) {d.value = +d.value;});
										 var chartDistAnalysis1;
											 chartDistAnalysis1 = makeDistroChart({
															data:boxplotValuesNew,
															xName:'group',
															yName:'value',
															axisLabels: {xAxis: null, yAxis: 'Value'},
															selector:"#"+aat+j,
															chartSize:{height:320, width:350},
															margin: {top: 35, right: 5, bottom: 51, left: 50},
															constrainExtremes:false});

															console.log("chart1");
															console.log(chartDistAnalysis1);															
													
															chartDistAnalysis1.renderBoxPlot({showOutliers:false});
															chartDistAnalysis1.renderDataPlots();
															chartDistAnalysis1.renderNotchBoxes({showNotchBox:false});
															chartDistAnalysis1.renderViolinPlot({showViolinPlot:false});
		
										if(scope.$parent.plotType1==1 || scope.$parent.plotType1==2){
											scope.$parent.resetPlots1=0;
											chartDistAnalysis1.violinPlots.hide(); chartDistAnalysis1.notchBoxes.show({reset:true});
											chartDistAnalysis1.boxPlots.show({reset:true, showBox:false,showOutliers:true,boxWidth:20,scatterOutliers:true,colors:['#555'],medianCSize:2});
										}
										if(scope.$parent.plotType1==0){
											scope.$parent.resetPlots1=0;
											chartDistAnalysis1.violinPlots.show({reset:true,clamp:1,bandwidth:1,resolution:100});
											chartDistAnalysis1.boxPlots.show({reset:true, showWhiskers:false,showOutliers:false,boxWidth:10,lineWidth:15,colors:['#555'],medianCSize:2,showWhiskers:true});
										}
										
										if(scope.$parent.Trends1==1){
											console.log("plot type: "+scope.$parent.plotType1);
											chartDistAnalysis1.dataPlots.change({showLines:['median','quartile1','quartile3']});
										}
										else if(scope.$parent.Trends1==0){
											chartDistAnalysis1.dataPlots.change({showLines:false});
											
										}
										
										
						}
					else{
							var map=new HashMap();
							var map1=new HashMap();
							var categoryMap=new HashMap();

							var einSupp= scope.$parent.SelectedRedInfo1.sri.RedSupport[0].element;
							var category=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[1];

							var c=0,c1=0;
							for(i=0;i<scope.$parent.SelectedRedInfo1.sri.RedAttributes.length;i++){
								if(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]){
										
										for(z=0;z<scope.$parent.SelectedRedInfo1.sri.CategoryDesc.length;z++)
												if(scope.$parent.SelectedRedInfo1.sri.CategoryDesc[z].data[0] == scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])
													categoryMap.set(scope.$parent.SelectedRedInfo1.sri.CategoryDesc[z].data[0]+","+scope.$parent.SelectedRedInfo1.sri.CategoryDesc[z].data[1],scope.$parent.SelectedRedInfo1.sri.CategoryDesc[z].data[2]);
	
									c=c+1;
									
									 var cv=scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1];
								 var key= scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]+","+cv;
								 var catString=categoryMap.get(key);
								 
									if(!map.has(catString))
										map.set(catString,1);
									else{
										map.set(catString,map.get(catString)+1);
										}
									
									var found=0;
								if(scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1]==category && scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[3]==0){//optimize
								c1=c1+1;

									
									for(k=0;k<scope.$parent.SelectedRedInfo1.sri.RedSupport.length;k++){
										if(scope.$parent.SelectedRedInfo1.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0]){

												if(!map1.has(catString+" in"))
														map1.set(catString+" in",1);
												else{
														map1.set(catString+" in",map1.get(catString+" in")+1);
													}
													found=1;
												break;
											}
										}	
								  if(found==0){
									if(!map1.has(catString+" out"))
										map1.set(catString+" out",1);
									else{
										map1.set(catString+" out", map1.get(catString+" out")+1);
										}
								  }
								}
								else if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[3]==1){//code for negated attribute
									
									if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[1]!="null")
										category=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[1];
									else
										category=scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[2];
									
									for(k=0;k<scope.$parent.SelectedRedInfo1.sri.RedSupport.length;k++){
										if(scope.$parent.SelectedRedInfo1.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[0]){

												var cv=scope.$parent.SelectedRedInfo1.sri.RedAttributes[i].data[1];
											 var key= scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0]+","+cv;
											 var catString=categoryMap.get(key);
											 
												if(!map1.has(catString+" in"))
														map1.set(catString+" in",1);
												else{
														map1.set(catString+" in",map1.get(catString+" in")+1);
													}
													found=1;
												break;
											}
										}	
										
								  if(found==0){
									if(!map1.has(catString+" out"))
										map1.set(catString+" out",1);
									else{
										map1.set(catString+" out",map1.get(catString+" out")+1);
										}
								  }
							  }
							}
						} 
						/*console.log(c);	console.log(c1);	
					    console.log('map1');		
						console.log(map1);*/
							
							var attribute;
						
						for(i=0;i<scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length;i++)
							if(scope.$parent.SelectedRedInfo1.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo1.sri.AttributeIntervals[j].data[0])
								attribute=scope.$parent.SelectedRedInfo1.sri.AttrDesc[i].data[0];
								
								var aat="";
								if(scope.view == 1)
									aat="attrdistE";
								else if(scope.view == 2) aat="attrdistA";
								else if(scope.view == 3) aat = "attrdistG";
								
							var vis = d3.select(element[0]).append("div")
										 .attr("id",aat);
										 
										 if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length>3)
										 vis.style("display","inline-block").style("width","33%");   //.style("display","table-cell");
									 else if(scope.$parent.SelectedRedInfo1.sri.AttributeIntervals.length<=3)
										 vis.style("display","table-cell");//.style("width","0%");   //.style("display","table-cell");
									 
									 vis.append("p")
										  .attr("align","center")
										  .style("font-weight","bold")
										  .style("font-size","20px")
										 .text(attribute);
								
							var pieData=[];
							map.forEach(function(value, key){ 
								pieData.push([key,value]);
							});	
							
							var pieData1=[];
							map1.forEach(function(value, key){ 
								pieData1.push([key,value]);
							});	
								
								var width = 200,
									height = 250,
							radius = Math.min(width- m[1] - m[3], height- m[0] - m[2]) / 2;

							var color = d3.scale.ordinal()
								.range(["#98abc5", "#8a89a6", "#6F5D7B", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);//#7b6888

							var arc = d3.svg.arc()
								.outerRadius(radius - 10)
								.innerRadius(0);

							var pie = d3.layout.pie()
								.sort(null)
								.value(function(d) {return d[1]; });

								
							 var svg=vis.append("svg:svg");
										
									var gout=svg.attr("width", width- m[1] - m[3])
										.attr("height", height- m[0] - m[2])
										.append("g");
										
										gout.attr("transform", "translate(" + (width- m[1] - m[3]) / 2 + "," + (height- m[0] - m[2]) / 2 + ")");

							var g = gout.selectAll(".arc")
								.data(pie(pieData))
								.enter().append("g")
								.attr("class", "arc");

							g.append("path")
							.attr("d", arc)
							.style("fill", function(d) {return color(d.data[0]); })
							.style("opacity",0.6);

							g.append("text")
							.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
							.attr("dy", ".35em")
							.style("text-anchor", "middle")
							.text(function(d) { return d.data[0]; });							
						
						var arc = d3.svg.arc()
								.outerRadius(radius - 10)
								.innerRadius(0);

							var pie = d3.layout.pie()
								.sort(null)
								.value(function(d) {return d[1]; });

								
							 var svg=vis.append("svg:svg");
										
									var gout=svg.attr("width", width- m[1] - m[3])
										.attr("height", height- m[0] - m[2])
										.append("g");
										
										gout.attr("transform", "translate(" + (width- m[1] - m[3]) / 2 + "," + (height- m[0] - m[2]) / 2 + ")");

							var g = gout.selectAll(".arc")
								.data(pie(pieData1))
								.enter().append("g")
								.attr("class", "arc");

							g.append("path")
							.attr("d", arc)
							.style("fill", function(d) {return color(d.data[0]); })
							.style("opacity",0.6);

							g.append("text")
							.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
							.attr("dy", ".35em")
							.style("text-anchor", "middle")
							.text(function(d) { return d.data[0]; });							
						}
					}

			//pload.style="visibility: hidden";			
					
	if(scope.$parent.SelectedRedInfo1.sri.ElemDesc.length<100000){	
		
		var somClustElem = [];

		var stable = document.getElementById("SOMTable");
		if(stable!=null){
		var stablebody = stable.getElementsByTagName("tbody")[0];
	    var strow       = stablebody.getElementsByTagName("tr");
		
		if(scope.view==1){
		for(var k=0;k<strow.length;k++){
				var elem = strow[k].getElementsByTagName("td")[0].childNodes[0];
				somClustElem.push(elem.data);
		}
		}
	}
		var columns=["Redescription support"];
		
		var tabid = "";
		
		if(scope.view==1)
			tabid="redSupTableE";
		else if(scope.view == 2) tabid="redSupTableA";
		else if(scope.view == 3) tabid ="redSupTableG";
		
		
		
		var clSupTab = function clSuptabF(){
			console.log('support click '+1);
			if(scope.view==1)
			 $location.hash('somContainer');
			else if(scope.view==2)
				$location.hash('heatmap');
			else if(scope.view==3)
				$location.hash('redCharts');
			 $anchorScroll();
		}
		
		var clSupTabt = function clSuptabFt(){
			var tt="";
			if(scope.view==1)
			tt="redSomContainer";
		else if(scope.view == 2) tt="redTableDiv";
		else if(scope.view == 3) tt ="lists";
		console.log(tt);
				$location.hash(tt);
			 $anchorScroll();
		}
		
		var clSupTabtEnt = function clSuptabFEnt(){
				if(scope.view==2){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[1].active=false;
				}
				else if(scope.view==3){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[2].active=false;
				}
			
				scope.$parent.onTabSelected('entityInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		var clSupTabtAtt = function clSuptabFAtt(){
				if(scope.view==1){
					scope.$parent.tabs[0].active=false;
				    scope.$parent.tabs[1].active=true;
				}
				else if(scope.view==3){
					scope.$parent.tabs[2].active=false;
				    scope.$parent.tabs[1].active=true;
				}
			
				scope.$parent.onTabSelected('attributeInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		
		var clSupTabtGLP = function clSuptabFGlp(){
				if(scope.view==1){
					scope.$parent.tabs[0].active=false;
				    scope.$parent.tabs[2].active=true;
				}
				else if(scope.view==2){
					scope.$parent.tabs[1].active=false;
				    scope.$parent.tabs[2].active=true;
				}
			
				scope.$parent.onTabSelected('globalInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		var clSupTabtEnt = function clSuptabFEnt(){
			if(scope.view==2){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[1].active=false;
				}
				else if(scope.view==3){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[2].active=false;
				}
				scope.$parent.onTabSelected('entityInfo');
				console.log(scope.$parent.tabs);
				 $location.hash('start');
				 $anchorScroll();
				scope.$parent.$apply();
		}
      
	  
	  var clSupTabMO = function movclSupTabMO(){
			d3.select(this).style("cursor","pointer");
	  }
	
		var tdiv=d3.select(element[0]).append("div")
			.attr("id", tabid)
			.style("position","relative")
			.style("margin-top","20px")
			.style("margin-bottom","20px")
			.style("height","200px")
			.attr("style", "position: relative; display:inline-block; width:30%; height: 220px; width: 250px; margin-left: 0px; margin-top: 20px; margin-right: 20px;  overflow-y: scroll; overflow-x: hidden;")
			
		//console.log(scope.$parent.SelectedRedInfo1.sri.ElemDesc);
		
		var redsupId = "";
		
		if(scope.view == 1)
			redSupId = "redSupTTE";
		else if(scope.view == 2) redSupId = "redSupTTA";
		else if(scope.view == 3) redSupId = "redSupTTG";
		
		var table = tdiv.append("table")
				.attr("id",redSupId)
				.attr("class", "tablesorter")
				.attr("border-collapse","separate")
				.attr("border-spacing","10 10")
				.attr("style", "position: relative; float:left; height: 220px; width: 220px; margin-left: 0px;")
				//.style("max-height","200px"),
			thead = table.append("thead"),
			tbody = table.append("tbody")
					.attr("style", "height: 200px; overflow-y: scroll; overflow-x: hidden; ");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center")
			.style("cursor", "pointer");

		// create a row for each object in the data
		var rows = tbody.selectAll("tr")
			.data(scope.$parent.SelectedRedInfo1.sri.ElemDesc)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			
		// create a cell in each row for each column
		var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log(row);
				return columns.map(function(column) {
					return {column: column, value: row.elementDescription};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					return d.value; 
				})
			.attr("style", "text-align:center")
			.style("background-color",function(d,i){if($.inArray(d.value, somClustElem)!=-1) return "#4CAF50";});//add array of SOM elements

		if(scope.view == 1)
			$("#redSupTTE").tablesorter({sortList:[[0,0]]});
		else if(scope.view == 2)
			 $("#redSupTTA").tablesorter({sortList:[[0,0]]});
		else if(scope.view == 3)
			 $("#redSupTTG").tablesorter({sortList:[[0,0]]});
	}
		else{
			var butId="";
			var expFuncName = "";
			if(scope.view==1){
				globalVarE1 = scope.$parent.SelectedRedInfo1.sri.ElemDesc;
				butId = "exButtSE";
				expFuncName = "exportFunctionSuppE()";
			}
			else if(scope.view == 2){
				globalVarA1 = scope.$parent.SelectedRedInfo1.sri.ElemDesc;
				butId = "exButtSA";
				expFuncName = "exportFunctionSuppA()";
			}
			else if(scope.view == 3){
				globalVarG1 = scope.$parent.SelectedRedInfo1.sri.ElemDesc;
				butId = "exButtSG";
				expFuncName = "exportFunctionSuppG()";
			}
		globalVar1=scope.$parent.SelectedRedInfo1.sri.ElemDesc;
			var exButtonS = d3.select(element[0]).append("button").attr("type","button")
										.attr("id",butId)
										.attr("onclick",expFuncName)
										.style("margin-bottom","20px")
										.text('Export redescription support');
		}
		
// make a attribute description table
var columns=["Name", "Description"];
			    //console.log('something is wrong!');
				//console.log(element[0]);
				
		var atTableId = "";
		var ttabId = "";
		
		if(scope.view == 1){
			atTableId = "redADContE";
			ttabId = "redADE";
		}
		else if(scope.view == 2){ 
		atTableId = "redADContA";
		ttabId = "redADA";
		}
		else if(scope.view == 3){
			atTableId = "redADContG";
			ttabId = "redADG";
		}
		
		var tdiv=d3.select(element[0]).append("div")
			.attr("id", atTableId)
			.style("position","relative")
			.style("margin-top","20px")
			.style("margin-bottom","20px")
			.style("height","200px")
			.attr("style", "position: relative; display:inline-block; width:30%; height: 220px; width: 350px; margin-left: 0px; margin-top: 20px; overflow-y: scroll; overflow-x: scroll;");
		
		//console.log(scope.$parent.SelectedRedInfo1.sri.ElemDesc);
		
		var table = tdiv.append("table")
				.attr("id",ttabId)
				.attr("class", "tablesorter")
				.attr("border-collapse","separate")
				.attr("border-spacing","10 10")
				.attr("style", "position: relative;  height: 220px; width: 330px; margin-left: 0px;")
				.attr("border","1px solid black")
				.attr("rules","cols")
				.attr("frame","void")
				//.style("max-height","200px"),
			thead = table.append("thead"),
			tbody = table.append("tbody")
					.attr("style", "height: 200px; overflow-y: scroll; overflow-x: scroll; ");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center")
			.style("cursor", "pointer");

		// create a row for each object in the data
		//console.log(scope.$parent.SelectedRedInfo1.sri.AttrDesc);
		var rows = tbody.selectAll("tr")
			.data(scope.$parent.SelectedRedInfo1.sri.AttrDesc)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			
		// create a cell in each row for each column
		var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log(row);
				return columns.map(function(column) {
					return {column: column, value: row.data};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					return d.value[i]; 
				})
			.attr("style", "text-align:center");

//$(document).ready(function() 
  //  { 
  
  if(scope.view==1)
        $("#redADE").tablesorter({sortList:[[0,0]]}); 
	else if(scope.view==2)
		$("#redADA").tablesorter({sortList:[[0,0]]}); 
	else if(scope.view==3)
		$("#redADG").tablesorter({sortList:[[0,0]]}); 
    //} 
//); 
				
 // Returns a function to compute the interquartile range.
		function iqr(k) {
				return function(d, i) {
				var q1 = d.quartiles[0],
				q3 = d.quartiles[2],
				iqr = (q3 - q1) * k,
				i = -1,
				j = d.length;
				while (d[++i] < q1 - iqr);
				while (d[--j] > q3 + iqr);
		return [i, j];
   };
  }
  
   element[0].scrollIntoView(true);
   
    var dlabul=d3.select(element[0]).append("ul")
	.style("list-style","none")
	.style("overflow","hidden")
	.style("background-color","#e6EEEE")
	.style("margin-top", "0.2cm")
	.style("width","760px");
   
   var t="";
   if(scope.view==1)
	   t="Go to SOM";
   else if(scope.view==2)
	   t="Go to heatmap";
   else if(scope.view == 3)
	   t="Go to crossfilter";
   
   var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'lab')
		.style("float", "left")
		.style("display","inline-block");;
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'labt')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",clSupTab)
		.on("mouseover",clSupTabMO);
	
 t="Go to redescription table";
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'rt')
		.style("float", "left")
		.style("display","inline-block");
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'rt')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",clSupTabt)
		.on("mouseover",clSupTabMO);

if(scope.view==1)		
	t="Go to attribute context";
else if(scope.view==2)
	t="Go to entity context"
else if(scope.view==3)
	t="Go to entity context";
	
	var func;
	
	if(scope.view==1)
		func=clSupTabtAtt;
	else func=clSupTabtEnt;
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'fcon')
		.style("float", "left")
		.style("display","inline-block");
		

   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'fcon')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",func)
		.on("mouseover",clSupTabMO);

if(scope.view==1)		
	t="Go to properties context";
else if(scope.view==2)
	t="Go to properties context"
else if(scope.view==3)
	t="Go to attribute context";

	if(scope.view==3)
		func=clSupTabtAtt;
	else func=clSupTabtGLP;
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'secon')
		.style("float", "left")
		.style("display","inline-block");
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'secon')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.style("margin-top","2cm")
		.on("click",func)
		.on("mouseover",clSupTabMO);		
	
					},true);
					
		scope.$parent.$watch('plotType2',function(newData, oldData){
				if(scope.view==1 || scope.view ==2 || scope.$parent.plotType2==-1)
					return;
						
						 $(element[0]).empty();
						 
						 var checked = false;
							
						 if(scope.view==3){
							$("#redSupTableG").empty();
							$("#redADG").empty();
							$("[id=attrdistG]").empty();
							$("#RelationGraphG").remove();
						 }
						 
						var w = 60,//120,
							h = 250,//500,
							m = [5,25,10,25],//[10, 50, 20, 50], // top right bottom left
							min = Infinity,
							max = -Infinity;
							
							var aat = "", butContAt="";
							
							if(scope.view==1){
								aat="attrdistE";
								butContAt = "butContE";
							}
							else if(scope.view==2){ 
								aat="attrdistA";
								butContAt = "butContA";
							}
							else if(scope.view==3){ 
								aat="attrdistG";
								butContAt = "butContG";
							}
							
							var boxOptions = d3.select(element[0]).append("div").attr("id",butContAt);
							var boxSpan = boxOptions.append("span").attr("id",butContAt+"sp");
							var lab=boxSpan.append("label").style("margin-right","40px");
							var radio1=lab.append("input").attr("type","radio").attr("name",butContAt+"plot").attr("value","nbox").attr("onclick","choosePlotTypeGP(this)").style("margin-left","48px");
							lab.append("p").text("Notched box plot");
							var lab1=boxSpan.append("label").style("margin-right","40px");
							var radio2=lab1.append("input").attr("type","radio").attr("name",butContAt+"plot").attr("value","viol").attr("onclick","choosePlotTypeGP(this)").style("margin-left","30px");
							lab1.append("p").text("Violin plot");
							
							if(scope.$parent.plotType2==1 || scope.$parent.plotType2==2){
								radio1.property("checked",true);
								radio2.property("checked",false);
							}
							else{ 
								radio1.property("checked",false);
								radio2.property("checked",true);
							}
							
							var lab2=boxSpan.append("label").style("margin-right","40px");
							var chk=lab2.append("input").attr("type","checkbox").attr("name",butContAt+"Trends").attr("onclick","addTrandLinesGP(this)").style("margin-left","35px");
							lab2.append("p").text("Trend Lines");
							
							if(scope.$parent.Trends2==1)
									chk.property("checked",true);
							else if(scope.$parent.Trends2==0) chk.property("checked",false);
								
						
						var maxCLW1=0,maxCLW2=0;
						var attrOcc=new HashMap();
						
						for(j=0;j<scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length;j++){//add loading bar
							if(!attrOcc.has(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]))
								attrOcc.set(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0],1);
							else{
								var occ=attrOcc.get(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]);
								attrOcc.set(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0],occ+1);
							}
								for(i=0;i<scope.$parent.SelectedRedInfo2.sri.AttrDesc.length;i++){
										if(scope.$parent.SelectedRedInfo2.sri.AttrDesc[i].data[2]==1 && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[4]>maxCLW1 && scope.$parent.SelectedRedInfo2.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])
												maxCLW1=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[4];
										else if(scope.$parent.SelectedRedInfo2.sri.AttrDesc[i].data[2]==2 && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[4]>maxCLW2 && scope.$parent.SelectedRedInfo2.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])
												maxCLW2=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[4];
								}
						}
						
					for(j=0;j<scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length;j++){
						var attrsView=0;
						var	intervalOK=0;
						if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[1]!="null" && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[2]!="null"){
							
						for(i=0;i<scope.$parent.SelectedRedInfo2.sri.AttrDesc.length;i++){
							
									if(scope.$parent.SelectedRedInfo2.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]){
										attrsView=scope.$parent.SelectedRedInfo2.sri.AttrDesc[i].data[2];
										break;
									}
								}							
						
						var avallSet=new HashSet();						
						var boxplotValues=[], attributeValuesAll=[], attributeValuesInterval=[], attributeValuesRed=[], attributeValuesClause=[],attributeValuesAllAttrOcc=[], boxplotValuesNew=[];
						min = Infinity,
						max = -Infinity;

							var elementValues=new HashMap();
						for(i=0;i<scope.$parent.SelectedRedInfo2.sri.RedAttributes.length;i++){
								var values=new Array(1);
								if(!elementValues.has(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0]))
									elementValues.set(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0],values);
								//for(azat=0;azat<scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length;azat++){
									
									if(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]){
										
										values=elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0]);
										values[0]=scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1];
										elementValues.set(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0],values);
									}
								//}
						}
							
						for(i=0;i<scope.$parent.SelectedRedInfo2.sri.RedAttributes.length;i++){
							intervalOK=0;
							if(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]){
								attributeValuesAll.push(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]);
								boxplotValuesNew.push({group:"All",value:scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]});
								
								if(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]>=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[1] && scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]<=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[2] && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[3]==0){//add flag for negation
									attributeValuesInterval.push(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]);
									boxplotValuesNew.push({group:"Interval",value:scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]});
								}
								else if((!(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]>=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[1]) || !(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]<=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[2])) && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[3]==1){
										attributeValuesInterval.push(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]);
										boxplotValuesNew.push({group:"Interval",value:scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]});
								}

									if(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]>max)
										max=scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1];
									if(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]<min)
										min=scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1];
									
								for(k=0;k<scope.$parent.SelectedRedInfo2.sri.RedSupport.length;k++){
									if(scope.$parent.SelectedRedInfo2.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0]){
										attributeValuesRed.push(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]);
										boxplotValuesNew.push({group:"Support",value:scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]});
										intervalOK=1;
										break;
									}
								}
								
							if(intervalOK==1){
								var contained=1, containedU=1;
								//for(azat=0;azat<scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length;azat++){
									var attrsViewNew=0;
									//if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[4]==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat].data[4]){
											for(iz=0;iz<scope.$parent.SelectedRedInfo2.sri.AttrDesc.length;iz++){
												if(scope.$parent.SelectedRedInfo2.sri.AttrDesc[iz].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]){
														attrsViewNew=scope.$parent.SelectedRedInfo2.sri.AttrDesc[iz].data[2];
															break;
													}
												}
											if(attrsView==attrsViewNew){
												if(!(elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[1] && elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[2]) && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[3]==0){//add flag for negation
														contained=0;
											}
												else if((elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[1]) && (elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[2]) && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[3]==1){
														contained=0;
												}	
											
											}		

											var containedUTmp=1;
											for(azat1=0;azat1<scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length;azat1++){
												
												
												if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat1].data[0]!=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])
													continue;
												
												containedUTmp=1;
												//if(attrsViewNew2==attrsViewTmp && attrsView==attrsViewTmp && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat1].data[4]==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat].data[4]){
												if(!(elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat1].data[1] && elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat1].data[2]) && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat1].data[3]==0){//add flag for negation
														containedUTmp=0;
											}
												else if((elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])[0]>=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat1].data[1]) && (elementValues.get(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])[0]<=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat1].data[2]) && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[azat1].data[3]==1){
														containedUTmp=0;
												}	
												
											//}
											if(containedUTmp==1)
												break;
										}

												if(containedUTmp==1){
													if(!avallSet.contains(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])){
														attributeValuesAllAttrOcc.push(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]);
														if((attrsView==1 && maxCLW1>0 && attrOcc.get(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])>1) || (attrsView==2 && maxCLW2>0 && attrOcc.get(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])>1))
															boxplotValuesNew.push({group:"All Clauses",value:scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]});
														avallSet.add(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0]);
													}
												}										
									//  }
								//   }
								   
								   if(contained==1){
									   if(!avallSet.contains(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0])){
													attributeValuesAllAttrOcc.push(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]);
													if((attrsView==1 && maxCLW1>0 && attrOcc.get(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])>1) || (attrsView==2 && maxCLW2>0 && attrOcc.get(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])>1))
														boxplotValuesNew.push({group:"All Clauses",value:scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]});
													 avallSet.add(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0]);
											}
									  
									   attributeValuesClause.push(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]);
									  if((attrsView==1 && maxCLW1>0) || (attrsView==2 && maxCLW2>0)) 
											boxplotValuesNew.push({group:"Clause",value:scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]});
								   }  
								   
							  }							  
							}
						}

						//console.log("Finished with attribute!")
						
						if(attrsView==1 && maxCLW1>0){
							if(attrOcc.get(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])>1)
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesAllAttrOcc,attributeValuesClause];
							else
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesClause];	
							}							
						else if(attrsView==2 && maxCLW2>0){
							if(attrOcc.get(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])>1)
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesAllAttrOcc,attributeValuesClause];
							else
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesClause];	
						}
						else if(attrsView==1 && maxCLW1==0)
							boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed];
						else if(attrsView==2 && maxCLW2==0)
							boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed];
						
						var attribute;
						
						for(i=0;i<scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length;i++)
							for(atz=0;atz<scope.$parent.SelectedRedInfo2.sri.AttrDesc.length;atz++)
									if(scope.$parent.SelectedRedInfo2.sri.AttrDesc[atz].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]){
										attribute=scope.$parent.SelectedRedInfo2.sri.AttrDesc[atz].data[0];
										break;
									}
						
						if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[3]==1)
								attribute = " ~ "+attribute+" Cl"+(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[4]+1);
						else
							attribute=attribute+" Cl"+(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[4]+1);
						
						var chart = d3.chart.box()
							.whiskers(iqr(1.5))
							.width(w - m[1] - m[3])
							.height(h - m[0] - m[2]);
							
							chart.domain([min, max]);

							 var vis = d3.select(element[0]).append("div")
										 .attr("id",aat);
										 
										 if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length>3)
										 vis.style("display","inline-block").style("width","380px");   //.style("display","table-cell"); "33%"
									 else if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length<=3)
										 vis.style("display","table-cell");//.style("width","0%");   //.style("display","table-cell");
										 
										 vis.append("p")
										  .attr("align","center")
										  .style("font-weight","bold")
										  .style("font-size","20px")
										 .text(attribute);
								
									var interpolation='basis';

										var domain=[min,max];
										console.log("boxplotValues");
										console.log(boxplotValues);
										console.log(boxplotValuesNew);
										
										vis.append("div").attr("id",aat+j).style("height","330px").style("width","360px").style("background-color", "#f0f5f5");
										
										boxplotValuesNew.forEach(function (d) {d.value = +d.value;});
										 var chartDistAnalysis1;
											 chartDistAnalysis1 = makeDistroChart({
															data:boxplotValuesNew,
															xName:'group',
															yName:'value',
															axisLabels: {xAxis: null, yAxis: 'Value'},
															selector:"#"+aat+j,
															chartSize:{height:320, width:350},
															margin: {top: 35, right: 5, bottom: 51, left: 50},
															constrainExtremes:false});

															console.log("chart1");
															console.log(chartDistAnalysis1);															
													
															chartDistAnalysis1.renderBoxPlot({showOutliers:false});
															chartDistAnalysis1.renderDataPlots();
															chartDistAnalysis1.renderNotchBoxes({showNotchBox:false});
															chartDistAnalysis1.renderViolinPlot({showViolinPlot:false});
		
										if(scope.$parent.plotType2==1 || scope.$parent.plotType2==2){
											scope.$parent.resetPlots2=0;
											chartDistAnalysis1.violinPlots.hide(); chartDistAnalysis1.notchBoxes.show({reset:true});
											chartDistAnalysis1.boxPlots.show({reset:true, showBox:false,showOutliers:true,boxWidth:20,scatterOutliers:true,colors:['#555'],medianCSize:2});
										}
										if(scope.$parent.plotType2==0){
											scope.$parent.resetPlots2=0;
											chartDistAnalysis1.violinPlots.show({reset:true,clamp:1,bandwidth:1,resolution:100});
											chartDistAnalysis1.boxPlots.show({reset:true, showWhiskers:false,showOutliers:false,boxWidth:10,lineWidth:15,colors:['#555'],medianCSize:2,showWhiskers:true});
										}
										
										if(scope.$parent.Trends2==1){
											console.log("plot type: "+scope.$parent.plotType2);
											chartDistAnalysis1.dataPlots.change({showLines:['median','quartile1','quartile3']});
										}
										else if(scope.$parent.Trends2==0){
											chartDistAnalysis1.dataPlots.change({showLines:false});
											
										}
										
										
						}
					else{
							var map=new HashMap();
							var map1=new HashMap();
							var categoryMap=new HashMap();

							var einSupp= scope.$parent.SelectedRedInfo2.sri.RedSupport[0].element;
							var category=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[1];

							var c=0,c1=0;
							for(i=0;i<scope.$parent.SelectedRedInfo2.sri.RedAttributes.length;i++){
								if(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]){
										
										for(z=0;z<scope.$parent.SelectedRedInfo2.sri.CategoryDesc.length;z++)
												if(scope.$parent.SelectedRedInfo2.sri.CategoryDesc[z].data[0] == scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])
													categoryMap.set(scope.$parent.SelectedRedInfo2.sri.CategoryDesc[z].data[0]+","+scope.$parent.SelectedRedInfo2.sri.CategoryDesc[z].data[1],scope.$parent.SelectedRedInfo2.sri.CategoryDesc[z].data[2]);
	
									c=c+1;
									
									 var cv=scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1];
								 var key= scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]+","+cv;
								 var catString=categoryMap.get(key);
								 
									if(!map.has(catString))
										map.set(catString,1);
									else{
										map.set(catString,map.get(catString)+1);
										}
									
									var found=0;
								if(scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1]==category && scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[3]==0){//optimize
								c1=c1+1;

									
									for(k=0;k<scope.$parent.SelectedRedInfo2.sri.RedSupport.length;k++){
										if(scope.$parent.SelectedRedInfo2.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0]){

												if(!map1.has(catString+" in"))
														map1.set(catString+" in",1);
												else{
														map1.set(catString+" in",map1.get(catString+" in")+1);
													}
													found=1;
												break;
											}
										}	
								  if(found==0){
									if(!map1.has(catString+" out"))
										map1.set(catString+" out",1);
									else{
										map1.set(catString+" out", map1.get(catString+" out")+1);
										}
								  }
								}
								else if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[3]==1){//code for negated attribute
									
									if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[1]!="null")
										category=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[1];
									else
										category=scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[2];
									
									for(k=0;k<scope.$parent.SelectedRedInfo2.sri.RedSupport.length;k++){
										if(scope.$parent.SelectedRedInfo2.sri.RedSupport[k].element==scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[0]){

												var cv=scope.$parent.SelectedRedInfo2.sri.RedAttributes[i].data[1];
											 var key= scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0]+","+cv;
											 var catString=categoryMap.get(key);
											 
												if(!map1.has(catString+" in"))
														map1.set(catString+" in",1);
												else{
														map1.set(catString+" in",map1.get(catString+" in")+1);
													}
													found=1;
												break;
											}
										}	
										
								  if(found==0){
									if(!map1.has(catString+" out"))
										map1.set(catString+" out",1);
									else{
										map1.set(catString+" out",map1.get(catString+" out")+1);
										}
								  }
							  }
							}
						} 
						/*console.log(c);	console.log(c1);	
					    console.log('map1');		
						console.log(map1);*/
							
							var attribute;
						
						for(i=0;i<scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length;i++)
							if(scope.$parent.SelectedRedInfo2.sri.AttrDesc[i].id==scope.$parent.SelectedRedInfo2.sri.AttributeIntervals[j].data[0])
								attribute=scope.$parent.SelectedRedInfo2.sri.AttrDesc[i].data[0];
								
								var aat="";
								if(scope.view == 1)
									aat="attrdistE";
								else if(scope.view == 2) aat="attrdistA";
								else if(scope.view == 3) aat = "attrdistG";
								
							var vis = d3.select(element[0]).append("div")
										 .attr("id",aat);
										 
										 if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length>3)
										 vis.style("display","inline-block").style("width","33%");   //.style("display","table-cell");
									 else if(scope.$parent.SelectedRedInfo2.sri.AttributeIntervals.length<=3)
										 vis.style("display","table-cell");//.style("width","0%");   //.style("display","table-cell");
									 
									 vis.append("p")
										  .attr("align","center")
										  .style("font-weight","bold")
										  .style("font-size","20px")
										 .text(attribute);
								
							var pieData=[];
							map.forEach(function(value, key){ 
								pieData.push([key,value]);
							});	
							
							var pieData1=[];
							map1.forEach(function(value, key){ 
								pieData1.push([key,value]);
							});	
								
								var width = 200,
									height = 250,
							radius = Math.min(width- m[1] - m[3], height- m[0] - m[2]) / 2;

							var color = d3.scale.ordinal()
								.range(["#98abc5", "#8a89a6", "#6F5D7B", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);//#7b6888

							var arc = d3.svg.arc()
								.outerRadius(radius - 10)
								.innerRadius(0);

							var pie = d3.layout.pie()
								.sort(null)
								.value(function(d) {return d[1]; });

								
							 var svg=vis.append("svg:svg");
										
									var gout=svg.attr("width", width- m[1] - m[3])
										.attr("height", height- m[0] - m[2])
										.append("g");
										
										gout.attr("transform", "translate(" + (width- m[1] - m[3]) / 2 + "," + (height- m[0] - m[2]) / 2 + ")");

							var g = gout.selectAll(".arc")
								.data(pie(pieData))
								.enter().append("g")
								.attr("class", "arc");

							g.append("path")
							.attr("d", arc)
							.style("fill", function(d) {return color(d.data[0]); })
							.style("opacity",0.6);

							g.append("text")
							.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
							.attr("dy", ".35em")
							.style("text-anchor", "middle")
							.text(function(d) { return d.data[0]; });							
						
						var arc = d3.svg.arc()
								.outerRadius(radius - 10)
								.innerRadius(0);

							var pie = d3.layout.pie()
								.sort(null)
								.value(function(d) {return d[1]; });

								
							 var svg=vis.append("svg:svg");
										
									var gout=svg.attr("width", width- m[1] - m[3])
										.attr("height", height- m[0] - m[2])
										.append("g");
										
										gout.attr("transform", "translate(" + (width- m[1] - m[3]) / 2 + "," + (height- m[0] - m[2]) / 2 + ")");

							var g = gout.selectAll(".arc")
								.data(pie(pieData1))
								.enter().append("g")
								.attr("class", "arc");

							g.append("path")
							.attr("d", arc)
							.style("fill", function(d) {return color(d.data[0]); })
							.style("opacity",0.6);

							g.append("text")
							.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
							.attr("dy", ".35em")
							.style("text-anchor", "middle")
							.text(function(d) { return d.data[0]; });							
						}
					}

			//pload.style="visibility: hidden";			
					
	if(scope.$parent.SelectedRedInfo2.sri.ElemDesc.length<100000){	
		
		var somClustElem = [];

		var stable = document.getElementById("SOMTable");
		if(stable!=null){
		var stablebody = stable.getElementsByTagName("tbody")[0];
	    var strow       = stablebody.getElementsByTagName("tr");
		
		if(scope.view==1){
		for(var k=0;k<strow.length;k++){
				var elem = strow[k].getElementsByTagName("td")[0].childNodes[0];
				somClustElem.push(elem.data);
		}
		}
	}
		var columns=["Redescription support"];
		
		var tabid = "";
		
		if(scope.view==1)
			tabid="redSupTableE";
		else if(scope.view == 2) tabid="redSupTableA";
		else if(scope.view == 3) tabid ="redSupTableG";
		
		
		
		var clSupTab = function clSuptabF(){
			console.log('support click '+1);
			if(scope.view==1)
			 $location.hash('somContainer');
			else if(scope.view==2)
				$location.hash('heatmap');
			else if(scope.view==3)
				$location.hash('redCharts');
			 $anchorScroll();
		}
		
		var clSupTabt = function clSuptabFt(){
			var tt="";
			if(scope.view==1)
			tt="redSomContainer";
		else if(scope.view == 2) tt="redTableDiv";
		else if(scope.view == 3) tt ="lists";
		console.log(tt);
				$location.hash(tt);
			 $anchorScroll();
		}
		
		var clSupTabtEnt = function clSuptabFEnt(){
				if(scope.view==2){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[1].active=false;
				}
				else if(scope.view==3){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[2].active=false;
				}
			
				scope.$parent.onTabSelected('entityInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		var clSupTabtAtt = function clSuptabFAtt(){
				if(scope.view==1){
					scope.$parent.tabs[0].active=false;
				    scope.$parent.tabs[1].active=true;
				}
				else if(scope.view==3){
					scope.$parent.tabs[2].active=false;
				    scope.$parent.tabs[1].active=true;
				}
			
				scope.$parent.onTabSelected('attributeInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		
		var clSupTabtGLP = function clSuptabFGlp(){
				if(scope.view==1){
					scope.$parent.tabs[0].active=false;
				    scope.$parent.tabs[2].active=true;
				}
				else if(scope.view==2){
					scope.$parent.tabs[1].active=false;
				    scope.$parent.tabs[2].active=true;
				}
			
				scope.$parent.onTabSelected('globalInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		var clSupTabtEnt = function clSuptabFEnt(){
			if(scope.view==2){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[1].active=false;
				}
				else if(scope.view==3){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[2].active=false;
				}
				scope.$parent.onTabSelected('entityInfo');
				console.log(scope.$parent.tabs);
				 $location.hash('start');
				 $anchorScroll();
				scope.$parent.$apply();
		}
      
	  
	  var clSupTabMO = function movclSupTabMO(){
			d3.select(this).style("cursor","pointer");
	  }
	
		var tdiv=d3.select(element[0]).append("div")
			.attr("id", tabid)
			.style("position","relative")
			.style("margin-top","20px")
			.style("margin-bottom","20px")
			.style("height","200px")
			.attr("style", "position: relative; display:inline-block; width:30%; height: 220px; width: 250px; margin-left: 0px; margin-top: 20px; margin-right: 20px;  overflow-y: scroll; overflow-x: hidden;")
			
		//console.log(scope.$parent.SelectedRedInfo2.sri.ElemDesc);
		
		var redsupId = "";
		
		if(scope.view == 1)
			redSupId = "redSupTTE";
		else if(scope.view == 2) redSupId = "redSupTTA";
		else if(scope.view == 3) redSupId = "redSupTTG";
		
		var table = tdiv.append("table")
				.attr("id",redSupId)
				.attr("class", "tablesorter")
				.attr("border-collapse","separate")
				.attr("border-spacing","10 10")
				.attr("style", "position: relative; float:left; height: 220px; width: 220px; margin-left: 0px;")
				//.style("max-height","200px"),
			thead = table.append("thead"),
			tbody = table.append("tbody")
					.attr("style", "height: 200px; overflow-y: scroll; overflow-x: hidden; ");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center")
			.style("cursor", "pointer");

		// create a row for each object in the data
		var rows = tbody.selectAll("tr")
			.data(scope.$parent.SelectedRedInfo2.sri.ElemDesc)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			
		// create a cell in each row for each column
		var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log(row);
				return columns.map(function(column) {
					return {column: column, value: row.elementDescription};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					return d.value; 
				})
			.attr("style", "text-align:center")
			.style("background-color",function(d,i){if($.inArray(d.value, somClustElem)!=-1) return "#4CAF50";});//add array of SOM elements

		if(scope.view == 1)
			$("#redSupTTE").tablesorter({sortList:[[0,0]]});
		else if(scope.view == 2)
			 $("#redSupTTA").tablesorter({sortList:[[0,0]]});
		else if(scope.view == 3)
			 $("#redSupTTG").tablesorter({sortList:[[0,0]]});
	}
		else{
			var butId="";
			var expFuncName = "";
			if(scope.view==1){
				globalVarE1 = scope.$parent.SelectedRedInfo2.sri.ElemDesc;
				butId = "exButtSE";
				expFuncName = "exportFunctionSuppE()";
			}
			else if(scope.view == 2){
				globalVarA1 = scope.$parent.SelectedRedInfo2.sri.ElemDesc;
				butId = "exButtSA";
				expFuncName = "exportFunctionSuppA()";
			}
			else if(scope.view == 3){
				globalVarG1 = scope.$parent.SelectedRedInfo2.sri.ElemDesc;
				butId = "exButtSG";
				expFuncName = "exportFunctionSuppG()";
			}
		globalVar1=scope.$parent.SelectedRedInfo2.sri.ElemDesc;
			var exButtonS = d3.select(element[0]).append("button").attr("type","button")
										.attr("id",butId)
										.attr("onclick",expFuncName)
										.style("margin-bottom","20px")
										.text('Export redescription support');
		}
		
// make a attribute description table
var columns=["Name", "Description"];
			    //console.log('something is wrong!');
				//console.log(element[0]);
				
		var atTableId = "";
		var ttabId = "";
		
		if(scope.view == 1){
			atTableId = "redADContE";
			ttabId = "redADE";
		}
		else if(scope.view == 2){ 
		atTableId = "redADContA";
		ttabId = "redADA";
		}
		else if(scope.view == 3){
			atTableId = "redADContG";
			ttabId = "redADG";
		}
		
		var tdiv=d3.select(element[0]).append("div")
			.attr("id", atTableId)
			.style("position","relative")
			.style("margin-top","20px")
			.style("margin-bottom","20px")
			.style("height","200px")
			.attr("style", "position: relative; display:inline-block; width:30%; height: 220px; width: 350px; margin-left: 0px; margin-top: 20px; overflow-y: scroll; overflow-x: scroll;");
		
		//console.log(scope.$parent.SelectedRedInfo2.sri.ElemDesc);
		
		var table = tdiv.append("table")
				.attr("id",ttabId)
				.attr("class", "tablesorter")
				.attr("border-collapse","separate")
				.attr("border-spacing","10 10")
				.attr("style", "position: relative;  height: 220px; width: 330px; margin-left: 0px;")
				.attr("border","1px solid black")
				.attr("rules","cols")
				.attr("frame","void")
				//.style("max-height","200px"),
			thead = table.append("thead"),
			tbody = table.append("tbody")
					.attr("style", "height: 200px; overflow-y: scroll; overflow-x: scroll; ");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center")
			.style("cursor", "pointer");

		// create a row for each object in the data
		//console.log(scope.$parent.SelectedRedInfo2.sri.AttrDesc);
		var rows = tbody.selectAll("tr")
			.data(scope.$parent.SelectedRedInfo2.sri.AttrDesc)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			
		// create a cell in each row for each column
		var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log(row);
				return columns.map(function(column) {
					return {column: column, value: row.data};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					return d.value[i]; 
				})
			.attr("style", "text-align:center");

//$(document).ready(function() 
  //  { 
  
  if(scope.view==1)
        $("#redADE").tablesorter({sortList:[[0,0]]}); 
	else if(scope.view==2)
		$("#redADA").tablesorter({sortList:[[0,0]]}); 
	else if(scope.view==3)
		$("#redADG").tablesorter({sortList:[[0,0]]}); 
    //} 
//); 
				
 // Returns a function to compute the interquartile range.
		function iqr(k) {
				return function(d, i) {
				var q1 = d.quartiles[0],
				q3 = d.quartiles[2],
				iqr = (q3 - q1) * k,
				i = -1,
				j = d.length;
				while (d[++i] < q1 - iqr);
				while (d[--j] > q3 + iqr);
		return [i, j];
   };
  }
  
   element[0].scrollIntoView(true);
   
    var dlabul=d3.select(element[0]).append("ul")
	.style("list-style","none")
	.style("overflow","hidden")
	.style("background-color","#e6EEEE")
	.style("margin-top", "0.2cm")
	.style("width","760px");
   
   var t="";
   if(scope.view==1)
	   t="Go to SOM";
   else if(scope.view==2)
	   t="Go to heatmap";
   else if(scope.view == 3)
	   t="Go to crossfilter";
   
   var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'lab')
		.style("float", "left")
		.style("display","inline-block");;
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'labt')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",clSupTab)
		.on("mouseover",clSupTabMO);
	
 t="Go to redescription table";
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'rt')
		.style("float", "left")
		.style("display","inline-block");
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'rt')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",clSupTabt)
		.on("mouseover",clSupTabMO);

if(scope.view==1)		
	t="Go to attribute context";
else if(scope.view==2)
	t="Go to entity context"
else if(scope.view==3)
	t="Go to entity context";
	
	var func;
	
	if(scope.view==1)
		func=clSupTabtAtt;
	else func=clSupTabtEnt;
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'fcon')
		.style("float", "left")
		.style("display","inline-block");
		

   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'fcon')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",func)
		.on("mouseover",clSupTabMO);

if(scope.view==1)		
	t="Go to properties context";
else if(scope.view==2)
	t="Go to properties context"
else if(scope.view==3)
	t="Go to attribute context";

	if(scope.view==3)
		func=clSupTabtAtt;
	else func=clSupTabtGLP;
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'secon')
		.style("float", "left")
		.style("display","inline-block");
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'secon')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.style("margin-top","2cm")
		.on("click",func)
		.on("mouseover",clSupTabMO);		
	
					},true);
			
			scope.$watch('RedescriptionInfo',function(newData, oldData) {
						if(!newData){return;}
						
						if(scope.view==1)
						scope.$parent.SelectedRedInfo = {sri:newData};
					else if(scope.view == 2)
						scope.$parent.SelectedRedInfo1 = {sri:newData};
					else if(scope.view == 3)
						scope.$parent.SelectedRedInfo2 = {sri:newData};
						console.log("after add: ");
						console.log(scope);
						console.log(scope.$parent);
						
						 $(element[0]).empty();
							
						 if(scope.view==1){
							$("#redSupTableE").empty();
							$("#redADE").empty();
							$("[id=attrdistE]").empty();
						 }
						 else if(scope.view==2){
							 $("#redSupTableA").empty();
							$("#redADA").empty();
							$("[id=attrdistA]").empty();
						 }
						 else if(scope.view == 3){
							 $("#redSupTableG").empty();
							$("#redADG").empty();
							$("[id=attrdistG]").empty();
						 }	
						 
						console.log('SR directive: ');
						console.log(newData)
						console.log(newData.RedAttributes);
							
						var w = 60,//120,
							h = 250,//500,
							m = [5,25,10,25],//[10, 50, 20, 50], // top right bottom left
							min = Infinity,
							max = -Infinity;
							
							var aat = "", butContAt="";
							
							if(scope.view==1){
								aat="attrdistE";
								butContAt = "butContE";
							}
							else if(scope.view==2){ 
								aat="attrdistA";
								butContAt = "butContA";
							}
							else if(scope.view==3){ 
								aat="attrdistG";
								butContAt = "butContG";
							}
							

							var plotName = "", trendsName="";
							
							if(scope.view==1){
								plotName = "choosePlotTypeEl(this)";
								trendsName = "addTrandLinesEl(this)";
							}
							else if(scope.view==2){
								plotName = "choosePlotTypeAtt(this)";
								trendsName = "addTrandLinesAtt(this)";
							}
							else if(scope.view==3){
								plotName = "choosePlotTypeGP(this)";
								trendsName = "addTrandLinesGP(this)";
							}
						
						
							var boxOptions = d3.select(element[0]).append("div").attr("id",butContAt);
							var boxSpan = boxOptions.append("span").attr("id",butContAt+"sp");
							var lab=boxSpan.append("label").style("margin-right","40px");
							var radio1=lab.append("input").attr("type","radio").attr("name",butContAt+"plot").attr("value","nbox").attr("onclick",plotName).style("margin-left","48px");
							lab.append("p").text("Notched box plot");
							var lab1=boxSpan.append("label").style("margin-right","40px");
							var radio2=lab1.append("input").attr("type","radio").attr("name",butContAt+"plot").attr("value","viol").attr("onclick",plotName).style("margin-left","30px");
							lab1.append("p").text("Violin plot");
							var lab2=boxSpan.append("label").style("margin-right","40px");
							var chk=lab2.append("input").attr("type","checkbox").attr("name",butContAt+"Trends").attr("onclick",trendsName).style("margin-left","35px");
							lab2.append("p").text("Trend Lines");
							
							radio1.property("checked",false);
								radio2.property("checked",true);
								if(scope.view==1)
								scope.$parent.resetPlots=1;
							else if(scope.view == 2)
								scope.$parent.resetPlots1=1;
							else if(scope.view==3)
								scope.$parent.resetPlots2=1;
								
								if(scope.$parent.Trends==1 && scope.view == 1)
								chk.property("checked",true);
							else if(scope.$parent.Trends==0 && scope.view==1) chk.property("checked",false);
							
							if(scope.$parent.Trends1==1 && scope.view == 2)
								chk.property("checked",true);
							else if(scope.$parent.Trends1==0 && scope.view==2) chk.property("checked",false);
							
							if(scope.$parent.Trends2==1 && scope.view == 3)
								chk.property("checked",true);
							else if(scope.$parent.Trends2==0 && scope.view==3) chk.property("checked",false);
							
							var hideControl=1;
								
						//console.log('RedescriptionInfo');
						//console.log(newData);
						//implement logic
						
					/* var pload=document.getElementById("loader");
						pload.style="visibility: visible";
						console.log(pload);*/
						
						var maxCLW1=0,maxCLW2=0;
						var attrOcc=new HashMap();
						
						for(j=0;j<newData.AttributeIntervals.length;j++){//add loading bar
							if(!attrOcc.has(newData.AttributeIntervals[j].data[0]))
								attrOcc.set(newData.AttributeIntervals[j].data[0],1);
							else{
								var occ=attrOcc.get(newData.AttributeIntervals[j].data[0]);
								attrOcc.set(newData.AttributeIntervals[j].data[0],occ+1);
							}
								for(i=0;i<newData.AttrDesc.length;i++){
										if(newData.AttrDesc[i].data[2]==1 && newData.AttributeIntervals[j].data[4]>maxCLW1 && newData.AttrDesc[i].id==newData.AttributeIntervals[j].data[0])
												maxCLW1=newData.AttributeIntervals[j].data[4];
										else if(newData.AttrDesc[i].data[2]==2 && newData.AttributeIntervals[j].data[4]>maxCLW2 && newData.AttrDesc[i].id==newData.AttributeIntervals[j].data[0])
												maxCLW2=newData.AttributeIntervals[j].data[4];
								}
						}
						
					for(j=0;j<newData.AttributeIntervals.length;j++){
						var attrsView=0;
						var	intervalOK=0;
						if(newData.AttributeIntervals[j].data[1]!="null" && newData.AttributeIntervals[j].data[2]!="null"){
							hideControl=0;
						for(i=0;i<newData.AttrDesc.length;i++){
							
									if(newData.AttrDesc[i].id==newData.AttributeIntervals[j].data[0]){
										attrsView=newData.AttrDesc[i].data[2];
										break;
									}
								}							
						
						var avallSet=new HashSet();						
						var boxplotValues=[], attributeValuesAll=[], attributeValuesInterval=[], attributeValuesRed=[], attributeValuesClause=[],attributeValuesAllAttrOcc=[], boxplotValuesNew=[];
						min = Infinity,
						max = -Infinity;

							var elementValues=new HashMap();
						for(i=0;i<newData.RedAttributes.length;i++){
								var values=new Array(1/*newData.AttributeIntervals.length*/);
								if(!elementValues.has(newData.RedAttributes[i].data[0]))
									elementValues.set(newData.RedAttributes[i].data[0],values);
								//for(azat=0;azat<newData.AttributeIntervals.length;azat++){
									
									if(newData.RedAttributes[i].id==newData.AttributeIntervals[j].data[0]){
										
										values=elementValues.get(newData.RedAttributes[i].data[0]);
										values[0]=newData.RedAttributes[i].data[1];
										elementValues.set(newData.RedAttributes[i].data[0],values);
									}
								//}
						}
							
						for(i=0;i<newData.RedAttributes.length;i++){
							intervalOK=0;
							if(newData.RedAttributes[i].id==newData.AttributeIntervals[j].data[0]){
								attributeValuesAll.push(newData.RedAttributes[i].data[1]);
								boxplotValuesNew.push({group:"All",value:newData.RedAttributes[i].data[1]});
								
								if(newData.RedAttributes[i].data[1]>=newData.AttributeIntervals[j].data[1] && newData.RedAttributes[i].data[1]<=newData.AttributeIntervals[j].data[2] && newData.AttributeIntervals[j].data[3]==0){//add flag for negation
									attributeValuesInterval.push(newData.RedAttributes[i].data[1]);
									boxplotValuesNew.push({group:"Interval",value:newData.RedAttributes[i].data[1]});
								}
								else if((!(newData.RedAttributes[i].data[1]>=newData.AttributeIntervals[j].data[1]) || !(newData.RedAttributes[i].data[1]<=newData.AttributeIntervals[j].data[2])) && newData.AttributeIntervals[j].data[3]==1){
										attributeValuesInterval.push(newData.RedAttributes[i].data[1]);
										boxplotValuesNew.push({group:"Interval",value:newData.RedAttributes[i].data[1]});
								}

									if(newData.RedAttributes[i].data[1]>max)
										max=newData.RedAttributes[i].data[1];
									if(newData.RedAttributes[i].data[1]<min)
										min=newData.RedAttributes[i].data[1];
									
								for(k=0;k<newData.RedSupport.length;k++){
									if(newData.RedSupport[k].element==newData.RedAttributes[i].data[0]){
										attributeValuesRed.push(newData.RedAttributes[i].data[1]);
										boxplotValuesNew.push({group:"Support",value:newData.RedAttributes[i].data[1]});
										intervalOK=1;
										break;
									}
								}
								
							if(intervalOK==1){
								var contained=1, containedU=1;
								//for(azat=0;azat<newData.AttributeIntervals.length;azat++){
									var attrsViewNew=0;
									//if(newData.AttributeIntervals[j].data[4]==newData.AttributeIntervals[azat].data[4]){
											for(iz=0;iz<newData.AttrDesc.length;iz++){
												if(newData.AttrDesc[iz].id==newData.AttributeIntervals[j].data[0]){
														attrsViewNew=newData.AttrDesc[iz].data[2];
															break;
													}
												}
											if(attrsView==attrsViewNew){
												if(!(elementValues.get(newData.RedAttributes[i].data[0])[0]>=newData.AttributeIntervals[j].data[1] && elementValues.get(newData.RedAttributes[i].data[0])[0]<=newData.AttributeIntervals[j].data[2]) && newData.AttributeIntervals[j].data[3]==0){//add flag for negation
														contained=0;
											}
												else if((elementValues.get(newData.RedAttributes[i].data[0])[0]>=newData.AttributeIntervals[j].data[1]) && (elementValues.get(newData.RedAttributes[i].data[0])[0]<=newData.AttributeIntervals[j].data[2]) && newData.AttributeIntervals[j].data[3]==1){
														contained=0;
												}	
											
											}		
									 // }
									  //else if(newData.AttributeIntervals[j].data[0] == newData.AttributeIntervals[azat].data[0]){
										/*for(azat=0;azat<newData.AttributeIntervals.length;azat++){  
										  var attrsViewNew2=0;
										  
										  for(iz=0;iz<newData.AttrDesc.length;iz++){
												if(newData.AttrDesc[iz].id==newData.AttributeIntervals[azat].data[0]){
														attrsViewNew2=newData.AttrDesc[iz].data[2];
															break;
													}
												}
											*/
											var containedUTmp=1;
											for(azat1=0;azat1<newData.AttributeIntervals.length;azat1++){
												
												/*var attrsViewTmp=0;
												
												for(iz=0;iz<newData.AttrDesc.length;iz++){
												if(newData.AttrDesc[iz].id==newData.AttributeIntervals[azat1].data[0]){
														attrsViewTmp=newData.AttrDesc[iz].data[2];
															break;
													}
												}*/
												
												if(newData.AttributeIntervals[azat1].data[0]!=newData.AttributeIntervals[j].data[0])
													continue;
												
												containedUTmp=1;
												//if(attrsViewNew2==attrsViewTmp && attrsView==attrsViewTmp && newData.AttributeIntervals[azat1].data[4]==newData.AttributeIntervals[azat].data[4]){
												if(!(elementValues.get(newData.RedAttributes[i].data[0])[0]>=newData.AttributeIntervals[azat1].data[1] && elementValues.get(newData.RedAttributes[i].data[0])[0]<=newData.AttributeIntervals[azat1].data[2]) && newData.AttributeIntervals[azat1].data[3]==0){//add flag for negation
														containedUTmp=0;
											}
												else if((elementValues.get(newData.RedAttributes[i].data[0])[0]>=newData.AttributeIntervals[azat1].data[1]) && (elementValues.get(newData.RedAttributes[i].data[0])[0]<=newData.AttributeIntervals[azat1].data[2]) && newData.AttributeIntervals[azat1].data[3]==1){
														containedUTmp=0;
												}	
												
											//}
											if(containedUTmp==1)
												break;
										}

												if(containedUTmp==1){
													if(!avallSet.contains(newData.RedAttributes[i].data[0])){
														attributeValuesAllAttrOcc.push(newData.RedAttributes[i].data[1]);
														if((attrsView==1 && maxCLW1>0 && attrOcc.get(newData.AttributeIntervals[j].data[0])>1) || (attrsView==2 && maxCLW2>0 && attrOcc.get(newData.AttributeIntervals[j].data[0])>1))
															boxplotValuesNew.push({group:"All Clauses",value:newData.RedAttributes[i].data[1]});
														avallSet.add(newData.RedAttributes[i].data[0]);
													}
												}										
									//  }
								//   }
								   
								   if(contained==1){
									   if(!avallSet.contains(newData.RedAttributes[i].data[0])){
													attributeValuesAllAttrOcc.push(newData.RedAttributes[i].data[1]);
													if((attrsView==1 && maxCLW1>0 && attrOcc.get(newData.AttributeIntervals[j].data[0])>1) || (attrsView==2 && maxCLW2>0 && attrOcc.get(newData.AttributeIntervals[j].data[0])>1))
														boxplotValuesNew.push({group:"All Clauses",value:newData.RedAttributes[i].data[1]});
													 avallSet.add(newData.RedAttributes[i].data[0]);
											}
									  
									   attributeValuesClause.push(newData.RedAttributes[i].data[1]);
									  if((attrsView==1 && maxCLW1>0) || (attrsView==2 && maxCLW2>0)) 
											boxplotValuesNew.push({group:"Clause",value:newData.RedAttributes[i].data[1]});
								   }  
									
									//console.log("contained: "+contained);
									//console.log("contained1: "+containedUTmp);
								   
							  }							  
							}
						}

						//console.log("Finished with attribute!")
						
						if(attrsView==1 && maxCLW1>0){
							if(attrOcc.get(newData.AttributeIntervals[j].data[0])>1)
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesAllAttrOcc,attributeValuesClause];
							else
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesClause];	
							}							
						else if(attrsView==2 && maxCLW2>0){
							if(attrOcc.get(newData.AttributeIntervals[j].data[0])>1)
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesAllAttrOcc,attributeValuesClause];
							else
								boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed,attributeValuesClause];	
						}
						else if(attrsView==1 && maxCLW1==0)
							boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed];
						else if(attrsView==2 && maxCLW2==0)
							boxplotValues=[attributeValuesAll,attributeValuesInterval,attributeValuesRed];
						
						var attribute;
						
						for(i=0;i<newData.AttributeIntervals.length;i++)
							for(atz=0;atz<newData.AttrDesc.length;atz++)
									if(newData.AttrDesc[atz].id==newData.AttributeIntervals[j].data[0]){
										attribute=newData.AttrDesc[atz].data[0];
										break;
									}
						
						if(newData.AttributeIntervals[j].data[3]==1)
								attribute = " ~ "+attribute+" Cl"+(newData.AttributeIntervals[j].data[4]+1);
						else
							attribute=attribute+" Cl"+(newData.AttributeIntervals[j].data[4]+1);
						
						var chart = d3.chart.box()
							.whiskers(iqr(1.5))
							.width(w - m[1] - m[3])
							.height(h - m[0] - m[2]);
							
							chart.domain([min, max]);
							/*var aat = "", butContAt="";
							
							if(scope.view==1){
								aat="attrdistE";
								butContAt = "butContE";
							}
							else if(scope.view==2){ 
								aat="attrdistA";
								butContAt = "butContA";
							}
							else if(scope.view==3){ 
								aat="attrdistG";
								butContAt = "butContG";
							}*/
							
							/*<span id="butonWithRadio" style="margin-left:20px, width: 700px">
			 <label>
					<input type="radio" ng-model="action.type" value="save" style="margin-left: 40px">
						Save selection
					</label>
			<label>
					<input type="radio" ng-model="action.type" value="load">
						Load and create SOM
			</label>
			 <label>
					<input type="radio" ng-model="action.type" value="saveLayout">
						Save SOM layout
					</label>
			<label>
					<input type="radio" ng-model="action.type" value="loadLayout">
						Load SOM layout
			</label>
			</br> <div id="selectionControls" style="margin-left: 380px;"> <label>minimal Fraction: <input type="text" ng-model="params.minFR" style="width:50px"/></label style="margin-left: 450px;"> 
			<button ng-model="button" ng-disabled="checked" ng-click="trainOnSelectionShared(params)" style="margin-left: 80px;">Perform</button></div>
			</span>*/
			

							 var vis = d3.select(element[0]).append("div")
										 .attr("id",aat);
										 
										 if(newData.AttributeIntervals.length>3)
										 vis.style("display","inline-block").style("width","380px");   //.style("display","table-cell"); "33%"
									 else if(newData.AttributeIntervals.length<=3)
										 vis.style("display","table-cell");//.style("width","0%");   //.style("display","table-cell");
										 
										 vis.append("p")
										  .attr("align","center")
										  .style("font-weight","bold")
										  .style("font-size","20px")
										 .text(attribute);
								
									var interpolation='basis';

										var domain=[min,max];
										console.log("boxplotValues");
										console.log(boxplotValues);
										console.log(boxplotValuesNew);
										
										vis.append("div").attr("id",aat+j).style("height","330px").style("width","360px").style("background-color", "#f0f5f5");
										
										boxplotValuesNew.forEach(function (d) {d.value = +d.value;});
										 var chartDistAnalysis1;
											 chartDistAnalysis1 = makeDistroChart({
															data:boxplotValuesNew,
															xName:'group',
															yName:'value',
															axisLabels: {xAxis: null, yAxis: 'Value'},
															selector:"#"+aat+j,
															chartSize:{height:320, width:350},
															margin: {top: 35, right: 5, bottom: 51, left: 50},
															constrainExtremes:false});

															console.log("chart1");
															console.log(chartDistAnalysis1);															
													
															chartDistAnalysis1.renderBoxPlot({showOutliers:false});
															chartDistAnalysis1.renderDataPlots();
															chartDistAnalysis1.renderNotchBoxes({showNotchBox:false});
															chartDistAnalysis1.renderViolinPlot({showViolinPlot:false});
															
															chartDistAnalysis1.violinPlots.show({reset:true,clamp:1,bandwidth:1,resolution:100});
															chartDistAnalysis1.boxPlots.show({reset:true, showWhiskers:false,showOutliers:false,boxWidth:10,lineWidth:15,colors:['#555'],medianCSize:2,showWhiskers:true});
															
															if(scope.$parent.Trends==1 && scope.view == 1){
																console.log("plot type: "+scope.$parent.plotType);
																chartDistAnalysis1.dataPlots.change({showLines:['median','quartile1','quartile3']});
															}
															else if(scope.$parent.Trends==0 && scope.view == 1){
																	chartDistAnalysis1.dataPlots.change({showLines:false});
																}
																
																if(scope.$parent.Trends1==1 && scope.view == 2){
																console.log("plot type: "+scope.$parent.plotType);
																chartDistAnalysis1.dataPlots.change({showLines:['median','quartile1','quartile3']});
															}
															else if(scope.$parent.Trends1==0 && scope.view == 2){
																	chartDistAnalysis1.dataPlots.change({showLines:false});
																}
																
																if(scope.$parent.Trends2==1 && scope.view == 3){
																console.log("plot type: "+scope.$parent.plotType);
																chartDistAnalysis1.dataPlots.change({showLines:['median','quartile1','quartile3']});
															}
															else if(scope.$parent.Trends2==0 && scope.view == 3){
																	chartDistAnalysis1.dataPlots.change({showLines:false});
																}
															
															//chart1.notchBoxes.hide();
															//chart1.dataPlots.change({showPlot:false,showBeanLines:false});
										
										/*for(var z=0; z<boxplotValues.length; z++){
													boxplotValues[z]=boxplotValues[z].sort(d3.ascending)
											var g=vis.append("svg:svg").attr("class","boxV").attr("width", w)
													.attr("height", h+30);
											
											var ttext=boxplotValues[z].length;
											
											  g.append("svg:g").attr("transform","translate ("+(m[3]) + "," + (m[0]+20) + ")").append("svg:text")
																.attr("x", 0).attr("y", 0).attr("font-family","sans-serif").attr("font-size","15px")
																.attr("fill","red").attr("align","center").text("("+ttext+")");

												if(boxplotValues[z].length>0){
											var gViolin=g.append("svg:g").attr("transform",  "translate(" + (m[3]-20) + "," + (m[0]+30) + ")");
											if(z==0)
												addViolin(gViolin, interpolation, 20, boxplotValues[z], h- m[0] - m[2] , w- m[1] - m[3]+40, domain, min, "#3385ff");//"#b780c9"
											else if(z==1)
												addViolin(gViolin, interpolation, 20, boxplotValues[z], h- m[0] - m[2] , w- m[1] - m[3]+40, domain, min, "#0099e6");
											else if(z==2)
												addViolin(gViolin, interpolation, 20, boxplotValues[z], h- m[0] - m[2] , w- m[1] - m[3]+40, domain, min, "#00e6e6");
											else if(z==3)
												addViolin(gViolin, interpolation, 20, boxplotValues[z], h- m[0] - m[2] , w- m[1] - m[3]+40, domain, min, "#a1dab4");
											else if(z==4)
												addViolin(gViolin, interpolation, 20, boxplotValues[z], h- m[0] - m[2] , w- m[1] - m[3]+40, domain, min, "#e6e600");
											addBoxPlot(gViolin, boxplotValues[z], h- m[0] - m[2], w- m[1] - m[3]+40, domain, .15, "black", "white");
												}
											
										}*/
							//	}
						}
						else{
							var map=new HashMap();
							var map1=new HashMap();
							var categoryMap=new HashMap();

							var einSupp= newData.RedSupport[0].element;
							var category=newData.AttributeIntervals[j].data[1];

							var c=0,c1=0;
							for(i=0;i<newData.RedAttributes.length;i++){
								if(newData.RedAttributes[i].id==newData.AttributeIntervals[j].data[0]){
										
										for(z=0;z<newData.CategoryDesc.length;z++)
												if(newData.CategoryDesc[z].data[0] == newData.AttributeIntervals[j].data[0])
													categoryMap.set(newData.CategoryDesc[z].data[0]+","+newData.CategoryDesc[z].data[1],newData.CategoryDesc[z].data[2]);
	
									c=c+1;
									
									 var cv=newData.RedAttributes[i].data[1];
								 var key= newData.AttributeIntervals[j].data[0]+","+cv;
								 var catString=categoryMap.get(key);
								 
									if(!map.has(catString))
										map.set(catString,1);
									else{
										map.set(catString,map.get(catString)+1);
										}
									
									var found=0;
								if(newData.RedAttributes[i].data[1]==category && newData.AttributeIntervals[j].data[3]==0){//optimize
								c1=c1+1;

									
									for(k=0;k<newData.RedSupport.length;k++){
										if(newData.RedSupport[k].element==newData.RedAttributes[i].data[0]){

												if(!map1.has(catString+" in"))
														map1.set(catString+" in",1);
												else{
														map1.set(catString+" in",map1.get(catString+" in")+1);
													}
													found=1;
												break;
											}
										}	
								  if(found==0){
									if(!map1.has(catString+" out"))
										map1.set(catString+" out",1);
									else{
										map1.set(catString+" out", map1.get(catString+" out")+1);
										}
								  }
								}
								else if(newData.AttributeIntervals[j].data[3]==1){//code for negated attribute
									
									if(newData.AttributeIntervals[j].data[1]!="null")
										category=newData.AttributeIntervals[j].data[1];
									else
										category=newData.AttributeIntervals[j].data[2];
									
									for(k=0;k<newData.RedSupport.length;k++){
										if(newData.RedSupport[k].element==newData.RedAttributes[i].data[0]){

												var cv=newData.RedAttributes[i].data[1];
											 var key= newData.AttributeIntervals[j].data[0]+","+cv;
											 var catString=categoryMap.get(key);
											 
												if(!map1.has(catString+" in"))
														map1.set(catString+" in",1);
												else{
														map1.set(catString+" in",map1.get(catString+" in")+1);
													}
													found=1;
												break;
											}
										}	
										
								  if(found==0){
									if(!map1.has(catString+" out"))
										map1.set(catString+" out",1);
									else{
										map1.set(catString+" out",map1.get(catString+" out")+1);
										}
								  }
							  }
							}
						} 
						/*console.log(c);	console.log(c1);	
					    console.log('map1');		
						console.log(map1);*/
							
							var attribute;
						
						for(i=0;i<newData.AttributeIntervals.length;i++)
							if(newData.AttrDesc[i].id==newData.AttributeIntervals[j].data[0])
								attribute=newData.AttrDesc[i].data[0];
								
								var aat="";
								if(scope.view == 1)
									aat="attrdistE";
								else if(scope.view == 2) aat="attrdistA";
								else if(scope.view == 3) aat = "attrdistG";
								
							var vis = d3.select(element[0]).append("div")
										 .attr("id",aat);
										 
										 if(newData.AttributeIntervals.length>3)
										 vis.style("display","inline-block").style("width","33%");   //.style("display","table-cell");
									 else if(newData.AttributeIntervals.length<=3)
										 vis.style("display","table-cell");//.style("width","0%");   //.style("display","table-cell");
									 
									 vis.append("p")
										  .attr("align","center")
										  .style("font-weight","bold")
										  .style("font-size","20px")
										 .text(attribute);
								
							var pieData=[];
							map.forEach(function(value, key){ 
								pieData.push([key,value]);
							});	
							
							var pieData1=[];
							map1.forEach(function(value, key){ 
								pieData1.push([key,value]);
							});	
								
								var width = 200,
									height = 250,
							radius = Math.min(width- m[1] - m[3], height- m[0] - m[2]) / 2;

							var color = d3.scale.ordinal()
								.range(["#98abc5", "#8a89a6", "#6F5D7B", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);//#7b6888

							var arc = d3.svg.arc()
								.outerRadius(radius - 10)
								.innerRadius(0);

							var pie = d3.layout.pie()
								.sort(null)
								.value(function(d) {return d[1]; });

								
							 var svg=vis.append("svg:svg");
										
									var gout=svg.attr("width", width- m[1] - m[3])
										.attr("height", height- m[0] - m[2])
										.append("g");
										
										gout.attr("transform", "translate(" + (width- m[1] - m[3]) / 2 + "," + (height- m[0] - m[2]) / 2 + ")");

							var g = gout.selectAll(".arc")
								.data(pie(pieData))
								.enter().append("g")
								.attr("class", "arc");

							g.append("path")
							.attr("d", arc)
							.style("fill", function(d) {return color(d.data[0]); })
							.style("opacity",0.6);

							g.append("text")
							.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
							.attr("dy", ".35em")
							.style("text-anchor", "middle")
							.text(function(d) { return d.data[0]; });							
						
						var arc = d3.svg.arc()
								.outerRadius(radius - 10)
								.innerRadius(0);

							var pie = d3.layout.pie()
								.sort(null)
								.value(function(d) {return d[1]; });

								
							 var svg=vis.append("svg:svg");
										
									var gout=svg.attr("width", width- m[1] - m[3])
										.attr("height", height- m[0] - m[2])
										.append("g");
										
										gout.attr("transform", "translate(" + (width- m[1] - m[3]) / 2 + "," + (height- m[0] - m[2]) / 2 + ")");

							var g = gout.selectAll(".arc")
								.data(pie(pieData1))
								.enter().append("g")
								.attr("class", "arc");

							g.append("path")
							.attr("d", arc)
							.style("fill", function(d) {return color(d.data[0]); })
							.style("opacity",0.6);

							g.append("text")
							.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
							.attr("dy", ".35em")
							.style("text-anchor", "middle")
							.text(function(d) { return d.data[0]; });							
						}
					}
					
					if(hideControl==1){
						console.log('hide == 0');
						console.log(butContAt);
						$( "#"+butContAt ).hide();
					}

			//pload.style="visibility: hidden";			
					
	if(newData.ElemDesc.length<100000){	
		
		var somClustElem = [];

		var stable = document.getElementById("SOMTable");
		if(stable!=null){
		var stablebody = stable.getElementsByTagName("tbody")[0];
	    var strow       = stablebody.getElementsByTagName("tr");
		
		if(scope.view==1){
		for(var k=0;k<strow.length;k++){
				var elem = strow[k].getElementsByTagName("td")[0].childNodes[0];
				somClustElem.push(elem.data);
		}
		}
	}
		var columns=["Redescription support"];
		
		var tabid = "";
		
		if(scope.view==1)
			tabid="redSupTableE";
		else if(scope.view == 2) tabid="redSupTableA";
		else if(scope.view == 3) tabid ="redSupTableG";
		
		
		
		var clSupTab = function clSuptabF(){
			console.log('support click '+1);
			if(scope.view==1)
			 $location.hash('somContainer');
			else if(scope.view==2)
				$location.hash('heatmap');
			else if(scope.view==3)
				$location.hash('redCharts');
			 $anchorScroll();
		}
		
		var clSupTabt = function clSuptabFt(){
			var tt="";
			if(scope.view==1)
			tt="redSomContainer";
		else if(scope.view == 2) tt="redTableDiv";
		else if(scope.view == 3) tt ="lists";
		console.log(tt);
				$location.hash(tt);
			 $anchorScroll();
		}
		
		var clSupTabtEnt = function clSuptabFEnt(){
				if(scope.view==2){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[1].active=false;
				}
				else if(scope.view==3){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[2].active=false;
				}
			
				scope.$parent.onTabSelected('entityInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		var clSupTabtAtt = function clSuptabFAtt(){
				if(scope.view==1){
					scope.$parent.tabs[0].active=false;
				    scope.$parent.tabs[1].active=true;
				}
				else if(scope.view==3){
					scope.$parent.tabs[2].active=false;
				    scope.$parent.tabs[1].active=true;
				}
			
				scope.$parent.onTabSelected('attributeInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		
		var clSupTabtGLP = function clSuptabFGlp(){
				if(scope.view==1){
					scope.$parent.tabs[0].active=false;
				    scope.$parent.tabs[2].active=true;
				}
				else if(scope.view==2){
					scope.$parent.tabs[1].active=false;
				    scope.$parent.tabs[2].active=true;
				}
			
				scope.$parent.onTabSelected('globalInfo');
				console.log(scope.$parent.tabs);
				$location.hash('start');
				$anchorScroll();
				scope.$parent.$apply();
		}
		
		var clSupTabtEnt = function clSuptabFEnt(){
			if(scope.view==2){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[1].active=false;
				}
				else if(scope.view==3){
					scope.$parent.tabs[0].active=true;
				    scope.$parent.tabs[2].active=false;
				}
				scope.$parent.onTabSelected('entityInfo');
				console.log(scope.$parent.tabs);
				 $location.hash('start');
				 $anchorScroll();
				scope.$parent.$apply();
		}
      
	  
	  var clSupTabMO = function movclSupTabMO(){
			d3.select(this).style("cursor","pointer");
	  }
	
		var tdiv=d3.select(element[0]).append("div")
			.attr("id", tabid)
			.style("position","relative")
			.style("margin-top","20px")
			.style("margin-bottom","20px")
			.style("height","200px")
			.attr("style", "position: relative; display:inline-block; width:30%; height: 220px; width: 250px; margin-left: 0px; margin-top: 20px; margin-right: 20px;  overflow-y: scroll; overflow-x: hidden;")
			
		//console.log(newData.ElemDesc);
		
		var redsupId = "";
		
		if(scope.view == 1)
			redSupId = "redSupTTE";
		else if(scope.view == 2) redSupId = "redSupTTA";
		else if(scope.view == 3) redSupId = "redSupTTG";
		
		var table = tdiv.append("table")
				.attr("id",redSupId)
				.attr("class", "tablesorter")
				.attr("border-collapse","separate")
				.attr("border-spacing","10 10")
				.attr("style", "position: relative; float:left; height: 220px; width: 220px; margin-left: 0px;")
				//.style("max-height","200px"),
			thead = table.append("thead"),
			tbody = table.append("tbody")
					.attr("style", "height: 200px; overflow-y: scroll; overflow-x: hidden; ");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center")
			.style("cursor", "pointer");

		// create a row for each object in the data
		var rows = tbody.selectAll("tr")
			.data(newData.ElemDesc)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			
		// create a cell in each row for each column
		var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log(row);
				return columns.map(function(column) {
					return {column: column, value: row.elementDescription};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					return d.value; 
				})
			.attr("style", "text-align:center")
			.style("background-color",function(d,i){if($.inArray(d.value, somClustElem)!=-1) return "#4CAF50";});//add array of SOM elements

		if(scope.view == 1)
			$("#redSupTTE").tablesorter({sortList:[[0,0]]});
		else if(scope.view == 2)
			 $("#redSupTTA").tablesorter({sortList:[[0,0]]});
		else if(scope.view == 3)
			 $("#redSupTTG").tablesorter({sortList:[[0,0]]});
	}
		else{
			var butId="";
			var expFuncName = "";
			if(scope.view==1){
				globalVarE1 = newData.ElemDesc;
				butId = "exButtSE";
				expFuncName = "exportFunctionSuppE()";
			}
			else if(scope.view == 2){
				globalVarA1 = newData.ElemDesc;
				butId = "exButtSA";
				expFuncName = "exportFunctionSuppA()";
			}
			else if(scope.view == 3){
				globalVarG1 = newData.ElemDesc;
				butId = "exButtSG";
				expFuncName = "exportFunctionSuppG()";
			}
		globalVar1=newData.ElemDesc;
			var exButtonS = d3.select(element[0]).append("button").attr("type","button")
										.attr("id",butId)
										.attr("onclick",expFuncName)
										.style("margin-bottom","20px")
										.text('Export redescription support');
		}
		
// make a attribute description table
var columns=["Name", "Description"];
			    //console.log('something is wrong!');
				//console.log(element[0]);
				
		var atTableId = "";
		var ttabId = "";
		
		if(scope.view == 1){
			atTableId = "redADContE";
			ttabId = "redADE";
		}
		else if(scope.view == 2){ 
		atTableId = "redADContA";
		ttabId = "redADA";
		}
		else if(scope.view == 3){
			atTableId = "redADContG";
			ttabId = "redADG";
		}
		
		var tdiv=d3.select(element[0]).append("div")
			.attr("id", atTableId)
			.style("position","relative")
			.style("margin-top","20px")
			.style("margin-bottom","20px")
			.style("height","200px")
			.attr("style", "position: relative; display:inline-block; width:30%; height: 220px; width: 350px; margin-left: 0px; margin-top: 20px; overflow-y: scroll; overflow-x: scroll;");
		
		//console.log(newData.ElemDesc);
		
		var table = tdiv.append("table")
				.attr("id",ttabId)
				.attr("class", "tablesorter")
				.attr("border-collapse","separate")
				.attr("border-spacing","10 10")
				.attr("style", "position: relative;  height: 220px; width: 330px; margin-left: 0px;")
				.attr("border","1px solid black")
				.attr("rules","cols")
				.attr("frame","void")
				//.style("max-height","200px"),
			thead = table.append("thead"),
			tbody = table.append("tbody")
					.attr("style", "height: 200px; overflow-y: scroll; overflow-x: scroll; ");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center")
			.style("cursor", "pointer");

		// create a row for each object in the data
		//console.log(newData.AttrDesc);
		var rows = tbody.selectAll("tr")
			.data(newData.AttrDesc)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			
		// create a cell in each row for each column
		var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log(row);
				return columns.map(function(column) {
					return {column: column, value: row.data};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					return d.value[i]; 
				})
			.attr("style", "text-align:center");

//$(document).ready(function() 
  //  { 
  
  if(scope.view==1)
        $("#redADE").tablesorter({sortList:[[0,0]]}); 
	else if(scope.view==2)
		$("#redADA").tablesorter({sortList:[[0,0]]}); 
	else if(scope.view==3)
		$("#redADG").tablesorter({sortList:[[0,0]]}); 
    //} 
//); 
				
 // Returns a function to compute the interquartile range.
		function iqr(k) {
				return function(d, i) {
				var q1 = d.quartiles[0],
				q3 = d.quartiles[2],
				iqr = (q3 - q1) * k,
				i = -1,
				j = d.length;
				while (d[++i] < q1 - iqr);
				while (d[--j] > q3 + iqr);
		return [i, j];
   };
  }
  
   element[0].scrollIntoView(true);
   
    var dlabul=d3.select(element[0]).append("ul")
	.style("list-style","none")
	.style("overflow","hidden")
	.style("background-color","#e6EEEE")
	.style("margin-top", "0.2cm")
	.style("width","760px");
   
   var t="";
   if(scope.view==1)
	   t="Go to SOM";
   else if(scope.view==2)
	   t="Go to heatmap";
   else if(scope.view == 3)
	   t="Go to crossfilter";
   
   var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'lab')
		.style("float", "left")
		.style("display","inline-block");;
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'labt')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",clSupTab)
		.on("mouseover",clSupTabMO);
	
 t="Go to redescription table";
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'rt')
		.style("float", "left")
		.style("display","inline-block");
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'rt')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",clSupTabt)
		.on("mouseover",clSupTabMO);

if(scope.view==1)		
	t="Go to attribute context";
else if(scope.view==2)
	t="Go to entity context"
else if(scope.view==3)
	t="Go to entity context";
	
	var func;
	
	if(scope.view==1)
		func=clSupTabtAtt;
	else func=clSupTabtEnt;
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'fcon')
		.style("float", "left")
		.style("display","inline-block");
		

   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'fcon')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.on("click",func)
		.on("mouseover",clSupTabMO);

if(scope.view==1)		
	t="Go to properties context";
else if(scope.view==2)
	t="Go to properties context"
else if(scope.view==3)
	t="Go to attribute context";

	if(scope.view==3)
		func=clSupTabtAtt;
	else func=clSupTabtGLP;
	
		 var dlab=dlabul.append("li");
   dlab.attr("id", atTableId+'secon')
		.style("float", "left")
		.style("display","inline-block");
   var plab=dlab.append("p");
   plab.attr("id", atTableId + 'secon')
		.append("text")
		.text(t)
		.style("text-decoration","underline")
		.style("font-size","16")
		.style("font-weight","bold")
		.style("color","black")
		.style("text-align", "center")
		.style("padding", "14px 16px")
		.style("margin-top","2cm")
		.on("click",func)
		.on("mouseover",clSupTabMO);		
	
					});
			
			}
	 }
},true);


redApp.directive('somRedescriptions',function(){
	
	return{
		restrict: 'E',
     replace: false,

	 link: function (scope, element, attrs) {
	//console.log("mclick on hexagon: "+i);
	
	scope.$watch('RedsInSOMClust', function (newData, oldData) {
          if (!newData) { return; }
		  
		  $(element[0]).empty();
		  $("#exButtE").remove();
		  $("#remRedContainerE").remove();
		  $("#loaderE").remove();

		  scope.selectionReds=newData;
		  
		//Mouse click function (define a lot of things)
	function mclick(d,i) { 
		//console.log("mclick on redescription: "+newData.redescriptions[i].id);
		//console.log("url: "+attrs.redinfoUrl);
	    d3.selectAll('#selected').style('background-color', 'white');
		d3.selectAll('#selected').attr("id",null);
		d3.select(this).attr("id","selected");
		var options = {url: attrs.redinfoUrl,
               method: 'GET', 
               params: {
               id: JSON.stringify(newData.redescriptions[i].id)
                        }
                          };
		scope.getRedescriptionInfo(options);
		//console.log(scope.RedescriptionInfo);
	};
		
		var columns=["Select","Left query","Right query","J","support","p-value"];
		var data=[];
		
		var buttons = d3.select(element[0]).append("div").attr("id","relCont").style("margin-bottom","20px").style("margin-top","20px");
	
	 var divCont = d3.select("#relCont").append("div").attr("id","progCont").style("width","800px").style("text-align","left");
		 
		 var STButton = divCont.append("button").attr("type","button")
									.attr("id","STButton")
									.attr("onclick","relateRedsE()")
									.style("width","160px")
									.style("margin-left","20px")
									.style("display","inline-block")
									.text('Relate redescriptions');
					
					divCont.append("p").style("margin-right","0px").style("margin-left","20px").style("display","inline-block").append("text").text("Minimal weight: ");
					divCont.append("input").attr("type","text").attr("id","jacConst").attr("value","0.5").style("width","50px").style("margin-left","2px").style("display","inline-block");
					divCont.append("p").style("margin-right","0px").style("margin-left","20px").style("display","inline-block").append("text").text("Num paths: ");
					divCont.append("input").attr("type","text").attr("id","nPaths").attr("value","2").style("width","50px").style("margin-left","2px").style("display","inline-block");
					divCont.append("p").attr("id","graphProg").style("width","200px").style("margin-right","0px").style("margin-left","20px").style("display","inline-block");

		var table = d3.select(element[0]).append("div").attr("id","redSomContainer")
		.style("position","relative")
		.style("margin-bottom","20px")
		.style("height","220px")
		.style("overflow-y","scroll")
		.append("table")
		.attr("class","tablesorter")
		.attr("id","redTable")
		.attr("border-collapse","separate")
		.attr("border-spacing","10 10")
		.attr("border","1px solid black")
		.attr("style", "position: relative;  height: 200px; margin-left: 0px;")
				//.attr("cellpadding","10")
				//.attr("cellspacing","100")
			thead = table.append("thead"),
			tbody = table.append("tbody");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
				.text(function(column) { return column; })
				.style("cursor", "pointer");
			//.attr("align","center");

			//console.log(newData);
			
		// create a row for each object in the data
		var rows = tbody.selectAll("tr")
			.data(newData.redescriptions)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			.attr("border", "solid")
			.attr("border-width", "1px")
			.style("cursor", "pointer")
			.on('mouseover', function(d,i){
				d3.select(this)
			.style('background-color', 'lightgray');
			})
			.on('mouseout', function(d,i){
			//	console.log(d3.select(this).attr('id'));
		if(!(d3.select(this).attr('id')=='selected')){
				d3.select(this)
			.style('background-color', 'white');
			//console.log('not equal');
		}
			})
			//.on('click',mclick)

		// create a cell in each row for each column
		/*var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log(row);
				return columns.map(function(column) {
					//console.log(row.data[0])
					//console.log(column);
					if(column=="Left query")
						return {column: column, value: row.data[0]};
					else if(column=="Right query")
						return {column: column, value: row.data[1]};
					else if(column=="J"){
						//console.log("JS: "+row.data[2]);
						//console.log("JS round: "+row.data[2].toPrecision(2));
						return {column: column, value: row.data[2].toPrecision(2)};
					}
					else if(column=="support")
						return {column: column, value: row.data[3]};
					else if(column=="p-value")
						return {column: column, value: row.data[4].toPrecision(2)};
				});
			})*/
			var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log("row");
				//console.log(row);
				return columns.map(function(column) {
					//console.log(row.data[0])
					//console.log(column);
					if(column=="Left query")
						return {column: column, value: row.data[0], id: row.id};
					else if(column=="Right query")
						return {column: column, value: row.data[1], id: row.id};
					else if(column=="J"){
						//console.log("JS: "+row.data[2]);
						//console.log("JS round: "+row.data[2].toPrecision(2));
						return {column: column, value: row.data[2].toPrecision(2), id: row.id};
					}
					else if(column=="support")
						return {column: column, value: row.data[3], id: row.id};
					else if(column=="p-value")
						return {column: column, value: row.data[4].toPrecision(2), id: row.id};
					else if(column=="Select"){
						//cells.append("input").attr("type","checkbox").attr("id","0");
						//<input type="checkbox"  id="h09_1" name="h09_1" checked class="rounded"/>
						return {column: column, value: "<input type=\"checkbox\"  id="+row.id+"E"+" class=\"rounded\"/>", id: row.id };
					}
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.attr("align",function(d,i){
					if(i==0 || i==1)
						return "left";
					else return "center";
			}
				)
			.attr("width",function(d,i){
				if(i==1 || i==2)
					return "30%";
				else
					return "5%";
				
			})
				.html(function(d,i) { 
					return d.value; 
				}).on('click',function(d,i){ if(i>0){ console.log(d); d3.selectAll('#selected').style('background-color', 'white');
		d3.selectAll('#selected').attr("id",null);
		d3.select(this.parentNode).attr("id","selected");
		var options = {url: attrs.redinfoUrl,
               method: 'GET', 
               params: {
               id: JSON.stringify(d.id)
                        }
                          };
		$("#RelationGraphE").remove();				  
		scope.getRedescriptionInfo(options);} else{
			//	var contained=0; 
				
				d3.selectAll("input").each(function(d1){ 
						if(d3.select(this).attr("type") == "checkbox" && d3.select(this).attr("id") == d.id+"E"){ 
							console.log(d3.select(this).node().checked);
							if(d3.select(this).node().checked == false){
								for(var k=0;k<scope.$parent.checkedOrderSOM.cos.length;k++) 
									if(scope.$parent.checkedOrderSOM.cos[k]==d.id){  
										scope.$parent.checkedOrderSOM.cos.splice(k, 1);
									}
							}
							else{
								var contained=0;
								for(var k=0;k<scope.$parent.checkedOrderSOM.cos.length;k++) 
									if(scope.$parent.checkedOrderSOM.cos[k]==d.id){  
										contained=1;
									}
									if(contained==0){
										console.log('adding to array');
										scope.$parent.checkedOrderSOM.cos.push(d.id);
										console.log(scope.$parent.checkedOrderSOM.cos);
									}
									console.log('contained: '+contained);
							}
						}
							});
				
				console.log(scope.$parent.checkedOrderSOM.cos);
				/*for(var k=0;k<scope.$parent.checkedOrder.co.length;k++) 
						if(scope.$parent.checkedOrder.co[k]==d.id){ 
									contained=1; 
									scope.$parent.checkedOrder.co.splice(k, 1); 
									console.log("checkbox unchecked!");
												console.log(scope.$parent.checkedOrder.co); break;}  
													if(contained==0){
														scope.$parent.checkedOrder.co.push(d.id); 
														console.log("checkbox checked!"); 
														console.log(scope.$parent.checkedOrder.co);}*/
																}});
		//return table;
		
		
		
	
	
	
	//$(document).ready(function() 
   // { 
        $("#redTable").tablesorter(); 
   // }); 
   
			globalVarE=newData;
			var exButton = d3.select("#somContainer").append("button").attr("type","button")
										.attr("id","exButtE")
										.attr("onclick","exportFunctionE()")
										.style("margin-bottom","20px")
										.style("width","150px")
										.text('Export redescriptions');
			
			var informCont = d3.select("#somContainer").append("div").attr("id","remRedContainerE").attr("class","filterInput").style("margin-left","0px").style("margin-right","10px")
																	.style("position","relative").style("float","right").style("width","420px");
									informCont.append("p").text('Max overlap (el.)').style("width","110px").style("position","relative").style("float","left");
			var textElementOverlap = informCont.append("input").attr("type","").attr("value",0).attr("id","eoverIn")
																.style("margin-left","0px").style("width","25px").style("position","relative").style("float","left");
			//.append('input').attr({type: 'input type you want', value: 'your values that can be called with a function'})
									informCont.append("p").text('Max overlap (at.)').style("width","110px").style("position","relative").style("float","left").style("margin-left","10px");
			var textAttributeOverlap = informCont.append("input").attr("type","").attr("value",0).attr("id","atoverIn")
																.style("margin-left","0px").style("width","25px").style("position","relative").style("float","left");							
										
		    var RMRedButton = informCont.append("button").attr("type","button")
									.attr("id","RmRedButtE")
									.attr("onclick","filterRedsNewE()")
									.style("width","120px")
									.style("margin-left","20px")
									.text('Filter redundant');
			var progBar=d3.select("#somContainer").append("img").attr("src","ajax-loader.gif").attr("id","loaderE").style("visibility","hidden");
	  },true); 
	  
    }}	
});
  
redApp.directive('wordNet',function($location,$anchorScroll){
	return {
     restrict: 'E',
     replace: false,
	
	link: function (scope, element, attrs) {
		scope.$watch('RedsInSOMClust', function (newData, oldData) {
			if (!newData) { return; }
		  
		  $(element[0]).empty();
		  
		  console.log("wordNet: ");
		  console.log(newData);
		  
		  var textArray = newData.attributeDescriptions;
		  //console.log(textArray);

		String.prototype.replaceAll = function(str1, str2, ignore) 
	{
		return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
	} 
		
		
		Array.prototype.contains = function(element){
			return this.indexOf(element) > -1;
		};
		
		
		var forbiden=["TOTAL","OTHER","THAN","ABOVE","ALL","AND","OF","TO","","&","ON","-          ","THE","IN","BE","FOR","A","SITC","+"," "];
		
	    var descString = "";
		
		var map=new HashMap();
		
			textArray.forEach(function(d) {
				
		    //descString += d.data[1] + " ";
		
		descString=d.data[1];		
		descString=descString.replaceAll("(",""); descString=descString.replaceAll(")","");
		descString=descString.replaceAll("n.e.s",""); descString=descString.replaceAll("%",""); descString=descString.replaceAll("+","");
		descString=descString.replaceAll(",",""); descString=descString.replaceAll("'",""); descString=descString.replaceAll(".","");
			
		descString=descString.toUpperCase();
		var descArray = descString.split(" ");
	    var descObjects = [];
		
		descArray.forEach(function(d1) {
			//console.log(d);
			if (!$.isNumeric(d1) && !forbiden.contains(d1)) {
			var descObject = {}
			descObject.description = d1;
			descObjects.push(descObject);
			}
		});
		
		var wordCount = d3.nest()
			.key(function(d1) { return d1.description; })
			.rollup(function(v) { return v.length; })
			.entries(descObjects);
		
		

		wordCount.forEach(function(d1) {
			if(!map.has(d1.key)){
				map.set(d1.key,parseInt(d1.values)*parseInt(d.data[0]));
			}
			else{
				var newvalue=map.get(d1.key)+parseInt(d1.values)*parseInt(d.data[0]);
				//console.log(d1.key+": "+newvalue);
				map.set(d1.key,newvalue);
			}
		});
			//console.log(map);
	    });  

		
		var tags = [];
		
		map.forEach(function(value, key){ 
		tags.push([key,value]);
		});
		
		//console.log(tags);
		
		tags.sort(function(a,b) {
			return b[1] - a[1];
		});

		//console.log(tags);
		
		var max=-1;
		var maxLength=-1;
		var avg=0;
		var cnt=0;
		
		tags.forEach(function(d){
			if(d[1]>max)
				max=d[1];
			
			if(d[0].length>24)
				d[0]=d[0].substr(0,24);
			
			avg=avg+d[0].length;
			cnt=cnt+1;
		});
		
		tags.forEach(function(d){
			if(/*d[1]==max &&*/ d[0].length>maxLength)
				maxLength=d[0].length;
		});
		
		avg=avg/cnt;
		
		tags.forEach(function(d){
			d[1]=Math.round((d[1]/max)*200); //originalno bez normalizacije duljinom
			
			//if(d[0].length>avg)
				//d[1]=Math.round((d[1]/max)*200/(maxLength/avg));
		});
		
		console.log("max: ");
		console.log(max);
		tags = tags.slice(0,40);//40
		console.log("tags");
		console.log(tags);
		  
		  //console.log(element[0])
		  
		 /*var wnDiv= d3.select(element[0]).append("div")
					 .style("float","left")
					 .style("position","absolute")
					 .attr("class", "span12")
					 .attr("id", "canvas container")*/
					 //.style("width", "1000px")
					// .style("height", "600px");
		  
		 // wnDiv.append("p").text("The most frequent attributes occuring in redescriptions from the selected hexagon");
		  
		  var lab=d3.select(element[0]).append("h2").text("Frequent attributes occuring in redescriptions from the selected hexagon");
		  lab.attr("id","wnhead");
		  
		  var canvas = d3.select(element[0]).append("canvas")
			.style("width", "500px")
			.style("height", "300px")
			.style("margin-top", "20px")
			.style("margin-right", "20px")
			.style("margin-bottom", "20px")
			.style("margin-left", "20px")
			.style("clear", "left")
			.style("position","relative")
			.attr("id", "canvas")
			.attr("class", "canvas hide")
			.attr("height","600")
			.attr("width","1000")
			
		  
		  function wc(d3Selection){
			  d3Selection.each( function( d, i )
			{
				// this is the actual DOM element
				//console.log($wc( this )( scope ));
		} );
		  }
		  
		  		
			var ctwfun = function changeTabWord(){
				console.log("wordNet clicked!");
				scope.$parent.tabs[0].active=false;
				scope.$parent.tabs[1].active=true;
				scope.$parent.onTabSelected('attributeInfo');
				console.log(scope.$parent.tabs);
				 $location.hash('start');
				 $anchorScroll();
				scope.$parent.$apply();
			}
			
			var ctwmover = function moveTabWord(){
				d3.select(this).style("cursor","pointer");
			}
		  
		  var htmlCanvas = d3.select(element[0]).append("div")
							.style("position","relative")
							.style("width", "1000px")
							.style("height", "600px")
							.attr("class", "canvas")
							.attr("id","html-canvas")
							.attr("height","600")
							.attr("width", "1000")
							.on("mouseover",ctwmover)
							.on("click",ctwfun);
	
		  
		  //console.log(canvas);
		  //console.log(htmlCanvas);
		  
		  //var canvas=d3.select("#canvas");
		  //var htmlCanvas=d3.select("#html-canvas");
		  
		  //console.log(canvas.outerHTML);
		  //console.log(htmlCanvas.outerHTML);
		  
		  //console.log(document.getElementById('attrdist'));
		  
		var canvas = document.getElementById('canvas');
		// var ctx = canvas.getContext("2d");
		 //ctx.font = "30px Arial";
		// ctx.fillText("Hello World",10,50);
		//fill the list with elements and normalize to [6,60]
		var htmlCanvas = document.getElementById('html-canvas');
		
		//var list= [['foo', 60], ['bar', 50],['proba',50],['dodatno',38],['IRB',38],['sok',26],['krafne',25],['bicikl',24],['trava',23],['krava',13],['biljka',8]];
		//console.log(attrs.text);
		//console.log(element.text);
		console.log(maxLength);
		WordCloud([canvas,htmlCanvas], {list:tags.map(function(word) { console.log('word'); console.log(word); return [word[0], Math.round(word[1]/(Math.max((maxLength/4),1)))]})});//{list:list} /3 deff
		});
	}
  }
});

redApp.directive('loadData', function(){
	return {
     restrict: 'E',
     replace: false,

	 link: function (scope, element, attrs) {
		 scope.checked = true;
		 scope.view = 1;
		 console.log(attrs.redelemUrl);
		 console.log("button disabled!");
		
		var options = {url: attrs.redelemUrl,
               method: 'GET', 
               params: {
                        }
                          };
						  
		scope.SOMURL=attrs.somUrl;
		scope.SOMBackURL=attrs.sombackUrl;
		scope.CLusterInfoURL=attrs.clusterinfoUrl;
		scope.CLusterInfoSelURL=attrs.clusterinfoselUrl;
		scope.CLusterInfoSelBackURL=attrs.clusterinfoselbackUrl;
		scope.redElemURL=attrs.redelemUrl;
		scope.sharedDataURL=attrs.sharedUrl;
		scope.redescriptionsSel=attrs.redescriptionsselUrl;
		scope.redescriptionsBack=attrs.redescriptionsbackUrl;
		
		console.log(scope.CLusterInfoURL);
		
		 scope.getRedescriptionElement(options);
		 
		 scope.$watch('SOMInput', function(newData, oldData){
			 if(!newData){return; }
			 console.log(newData);
			 scope.checked = false;
			 console.log("button enabled again!");
		 });
		 
	 }
	}	
  }
);
  
redApp.directive('somMap', function () {
  return {
     restrict: 'E',
     replace: false,

	 link: function (scope, element, attrs) {

		 scope.$parent.checkedOrderSOM.cos = new Array();
		 console.log('scope entity...');
		 console.log(scope);
     
	 //The color of each hexagon
var color = ["#E9FF63", "#7DFF63", "#63F8FF", "#99FF63", "#CFFE63", "#FFC263", "#FFC763", "#FF8E63", "#FF6464", "#FF7563", "#FF6364", "#FF7F63", "#FFE963", "#E3FF63", "#FFD963", "#FFE263", "#BAFF63", "#6BFF63", "#64FF69", "#71FF63", "#63FF6C", "#63FFD8", "#64FF69", "#63FF9A", "#FDFC63", "#88FF63", "#66FF64", "#A6FF63", "#63FFDB", "#63D9FE", "#90FF63", "#FF9B63", "#FF7263", "#9DFF63", "#E5FF63", "#FF7F63", "#FF7463", "#FFAE63", "#F4FF63", "#FFEC63", "#FBFF63", "#FFE663", "#FFC263", "#9DFF63", "#AEFF63", "#6AFF63", "#65FF65", "#63FFC7", "#C5FF63", "#63FFBE", "#63FF93", "#63FFAC", "#62FF79", "#90FF63", "#6AFF63", "#63FFEF", "#63F7FF", "#63FFD1", "#6370FF", "#638DFF", "#63FFDF", "#C5FF63", "#63FF6A", "#64FF69", "#C7FE63", "#FDFC63", "#D0FE63", "#FFDC63", "#E3FF63", "#DCFF63", "#C9FE63", "#FBFF63", "#FFB663", "#D9FF63", "#9DFF63", "#69FF63", "#DCFF63", "#63FFD4", "#63FFB8", "#64FF67", "#74FF63", "#63FCFF", "#63FFF9", "#63FFE9", "#A6FF63", "#63FFCD", "#63CEFE", "#63FBFF", "#63FFFB", "#637CFF", "#6379FF", "#D2FE63", "#CFFE63", "#63FF6E", "#65FF65", "#EEFF63", "#DCFF63", "#9DFF63", "#AAFF63", "#B6FF63", "#D0FE63", "#AEFF63", "#CDFE63", "#64FF67", "#99FF63", "#66FF64", "#63FFC1", "#63FFD4", "#63FF90", "#63FFD1", "#63FFF4", "#63FFEC", "#63FFF9", "#71FF63", "#63FF93", "#63FFC4", "#63F7FF", "#638DFF", "#63E9FF", "#6375FF", "#88FF63", "#95FF63", "#63FFAF", "#63FF93", "#63FF9A", "#9DFF63", "#88FF63", "#EEFF63", "#BDFF63", "#71FF63", "#B6FF63", "#80FF63", "#62FF82", "#63FF6C", "#62FF76", "#63FF6E", "#63FFCD", "#63EFFF", "#63FFF6", "#63FFB5", "#63FFFC", "#63B4FF", "#63FFC1", "#63F5FF", "#63FFB5", "#63FFBB", "#63FFFC", "#6379FF", "#63B0FF", "#63FFBB", "#D5FE63", "#63FFB8", "#63FF6C", "#62FF7C", "#63FFBE", "#FFDF63", "#FFE263", "#FFE963", "#76FF63", "#67FF64", "#63FF90", "#65FF65", "#63FFA0", "#63FFA6", "#62FF73", "#63FFC1", "#63FFC4", "#63FFF9", "#63CEFE", "#63A4FF", "#6373FF", "#63C5FE", "#638DFF", "#63FF9D", "#6387FF", "#63FFBE", "#63FEFE", "#63FFEC", "#63FFF1", "#638DFF", "#FF6A64", "#FBFF63", "#FFEF63", "#63FFE9", "#62FF8C", "#BAFF63", "#FFAB63", "#FFCB63", "#62FF82", "#88FF63", "#63FFB2", "#63FFC1", "#63FFDF", "#63FFB5", "#63FFB5", "#62FF7F", "#63FFC4", "#63ECFF", "#63FFFC", "#63F3FF", "#63FFE5", "#63D2FE", "#63FFF6", "#63A8FF", "#63F8FF", "#63FFFB", "#63E4FF", "#636DFF", "#63FFC4", "#6387FF", "#FF8B63", "#EBFF63", "#C5FF63", "#BDFF63", "#62FF76", "#DCFF63", "#BDFF63", "#99FF63", "#62FF82", "#63FFA6", "#63C9FE", "#63FEFE", "#62FF89", "#63FFD8", "#63FFB8", "#63FFF1", "#63C1FE", "#63FCFF", "#63FFCA", "#63C9FE", "#63FFFC", "#6FFF63", "#63FFE5", "#63E9FF", "#63F7FF", "#63B0FF", "#636CFF", "#636CFF", "#63ACFF", "#63F1FF", "#FF8863", "#FF6864", "#FFB363", "#A2FF63", "#63FFD8", "#63FF96", "#99FF63", "#AEFF63", "#C7FE63", "#63FF93", "#63FFC1", "#63FFF9", "#63FFFB", "#67FF64", "#B2FF63", "#62FF76", "#62FF73", "#639CFF", "#63FFC1", "#63FFEF", "#66FF64", "#62FF76", "#63FFC4", "#63FFCA", "#63FFBE", "#63FFFC", "#6363FF", "#63ACFF", "#6375FF", "#63CEFE", "#FFB663", "#79FF63", "#BDFF63", "#63FF6C", "#66FF64", "#76FF63", "#FEF763", "#D7FE63", "#7DFF63", "#63FFB8", "#63F5FF", "#63F7FF", "#62FF7F", "#63FFA6", "#62FF76", "#63FFA6", "#63FFD1", "#63FEFE", "#63FFDF", "#63F8FF", "#63FF96", "#63FFA9", "#63FFA9", "#63C1FE", "#63FFC1", "#63D6FE", "#636EFF", "#6364FF", "#6370FF", "#6398FF", "#FFE663", "#C0FF63", "#EBFF63", "#C5FF63", "#D2FE63", "#69FF63", "#6FFF63", "#D4FE63", "#F4FF63", "#63FFC4", "#62FF89", "#63FFF4", "#63FFB8", "#63FFF4", "#63F8FF", "#62FF71", "#63FFBB", "#63FFEF", "#63FFF1", "#63FBFF", "#63C1FE", "#63FFDF", "#63FFD1", "#63FFE2", "#63ACFF", "#63F3FF", "#63DDFF", "#63FFF6", "#63D6FE", "#63CEFE", "#D4FE63", "#80FF63", "#FF8B63", "#D5FE63", "#63FFCA", "#90FF63", "#D7FE63", "#FBFF63", "#62FF7C", "#C9FE63", "#76FF63", "#69FF63", "#62FF7C", "#63FFD4", "#63FFA6", "#6BFF63", "#63FFC7", "#63E4FF", "#62FF7C", "#63FFF6", "#6379FF", "#63FFCD", "#63FFCA", "#63FFEF", "#63FFBE", "#63E9FF", "#63ECFF", "#63FFF9", "#63E0FF", "#63C5FE", "#FF6B63", "#FFD663", "#63FF6E", "#63FFB2", "#FFD663", "#62FF7F", "#63FFA6", "#9DFF63", "#F6FF63", "#95FF63", "#95FF63", "#FFD963", "#DCFF63", "#63FF90", "#63FFD1", "#63FFFC", "#63FFA3", "#63FFAF", "#63ECFF", "#63FFEF", "#63C5FE", "#63FDFF", "#63FF93", "#62FF76", "#69FF63", "#63EFFF", "#636DFF", "#6379FF", "#63E7FF", "#63E7FF", "#FF8E63", "#CDFE63", "#BDFF63", "#F9FF63", "#62FF7F", "#63FFE2", "#62FF86", "#67FF64", "#63FFA3", "#6DFF63", "#9DFF63", "#FFE963", "#FFBE63", "#6AFF63", "#62FF7F", "#63FFD4", "#79FF63", "#63D2FE", "#63DDFF", "#63FEFE", "#63BDFE", "#63FFDB", "#64FF69", "#62FF8C", "#63FFD8", "#63BDFE", "#63B8FF", "#6391FF", "#63FFDB", "#63FEFE", "#F8FF63", "#FFF263", "#C2FF63", "#FFDF63", "#D2FE63", "#64FF69", "#63FFE2", "#7DFF63", "#FDFC63", "#FF9763", "#6BFF63", "#F2FF63", "#FBFF63", "#AEFF63", "#80FF63", "#63D9FE", "#63FFBB", "#63FFD8", "#63FFEF", "#63C5FE", "#63FF90", "#62FF89", "#63D2FE", "#63FFC4", "#63FF93", "#63D2FE", "#63DDFF", "#63FDFF", "#6DFF63", "#62FF82", "#FF8363", "#DAFF63", "#74FF63", 
             "#63FF6A", "#63FF6A", "#64FF69", "#FFDF63", "#FF7F63", "#FFEF63", "#EEFF63", "#CFFE63", "#6AFF63", "#95FF63", "#63FF6C", "#63FF90", "#6BFF63", "#63FF90", "#63FFCA", "#63E9FF", "#63FFEC", "#63FFAC", "#63FFD4", "#63FAFF", "#63FFCA", "#63ECFF", "#62FF8C", "#63FFE5", "#69FF63", "#FF7463", "#FF9463", "#E0FF63", "#FFCB63", "#A6FF63", "#63FF93", "#E0FF63", "#FEFA63", "#EBFF63", "#AAFF63", "#C2FF63", "#D4FE63", "#63FFAC", "#65FF65", "#62FF73", "#63FFE9", "#65FF66", "#95FF63", "#62FF7F", "#63FFB5", "#63D2FE", "#63FFAC", "#63FFFB", "#62FF8C", "#64FF69", "#99FF63", "#63FFB2", "#63FFDF", "#63FFB8", "#BAFF63", "#FFDC63", "#62FF76", "#BDFF63", "#C2FF63", "#95FF63", "#F6FF63", "#FFA163", "#CFFE63", "#63FFE9", "#84FF63", "#6BFF63", "#6DFF63", "#63FFC1", "#D0FE63", "#69FF63", "#63FFC1", "#62FF8C", "#63FFBB", "#63FF96", "#63FAFF", "#63FFEC", "#63FEFE", "#62FF76", "#63FF9A", "#FFC563", "#6FFF63", "#63FFAF", "#63F5FF", "#63F1FF", "#63FF6A", "#62FF7C", "#63F8FF", "#9DFF63", "#99FF63", "#AEFF63", "#FF8363", "#FFC963", "#62FF79", "#63FF90", "#63FF6A", "#63FCFF", "#63E9FF", "#63FFA0", "#64FF67", "#FFD463", "#A6FF63", "#CBFE63", "#63FF90", "#63FFC4", "#63C9FE", "#63FFE5", "#63FFDB", "#62FF89", "#63FFD8", "#79FF63", "#63FF9A", "#63FAFF", "#63E9FF", "#63FF6E", "#63F7FF", "#63E4FF", "#63F5FF", "#64FF67", "#C9FE63", "#FFBA63", "#D9FF63", "#63FFD1", "#63FFF6", "#63FF93", "#C0FF63", "#F6FF63", "#62FF82", "#AEFF63", "#CBFE63", "#FF8363", "#63FF6A", "#63FFCD", "#63F7FF", "#63FFF9", "#63FFC4", "#63FFC4", "#95FF63", "#63FFCD", "#A2FF63", "#EBFF63", "#63FFC1", "#63FFA0", "#63E4FF", "#63FFFB", "#63F3FF", "#63CEFE", "#63FBFF"]

var color1=["#FF6666", "#FF4D4D", "#FF3333", "#FF1A1A","#FF0000","#FFB84D","#FFAD33","#FFA31A","#FF9900","#E68A00","#EBEB00","#CCCC00","#B8B800","#A4A400","#909000","#1AFF1A","#00FF00","#00E600","#00CC00","#00EB76","#00CC66","#00B85C","#00A452","#009054","#1AFFFF","#00FFFF","#00E5E6","#00CCCC","#00B2B3","#5BADFF","#47A3FF","#3399FF","#1489FF","#007AF4","#1A75FF","#0066FF","#005CE6","#0052CC","#0047B3","#0040A2","#CC00FF","#B800E6","#A300CC","#8F00B3","#7A0099","#FF5BAD","#FF47A3","#FF3399","#FF1489","#F4007A"];
var color2=["#0040A2","#0047B3","#0052CC","#005CE6","#007AF4","#0066FF","#1489FF","#1A75FF","#3399FF","#47A3FF","#5BADFF",/*cyan start*/"#00B2B3","#00CCCC","#00E5E6","#00FFFF","#1AFFFF",/*green start*/"#009054","#00A452","#00B85C","#00CC66","#00EB76","#00CC00","#00E600","#00FF00","#1AFF1A","#909000","#A4A400","#B8B800","#CCCC00","#EBEB00",/*orange*/"#E68A00","#FF9900","#FFA31A","#FFAD33","#FFB84D",/*red*/"#FF6666", "#FF4D4D", "#FF3333", "#FF1A1A","#FF0000","#FF5BAD","#FF47A3","#FF3399","#FF1489","#F4007A","#CC00FF","#B800E6","#A300CC","#8F00B3","#7A0099"];

///////////////////////////////////////////////////////////////////////////
////////////// Initiate SVG and create hexagon centers ////////////////////
///////////////////////////////////////////////////////////////////////////

//scope.getSOMClusterInfo(attrs.clusterinfoUrl);

scope.$watch('SOMInfo', function (newData, oldData) {
          if (!newData) { return; }

		   $(element[0]).empty();
		   $("#redSomContainer").remove();
		    $("#relCont").remove();
			$("#SOMTable").remove();
			$("#wnhead").remove();
		   $("#html-canvas").remove();
		   //redSOMContainer
		   //word-net
		  
console.log(newData);
//console.log(newData.SOMInfo[0].data)

var averages=[];

var SOMConnectivity=[];
var SOMRedNum=[];
var SOMEntNum=[];

for(i=0;i</*newData.SOMInfo.length*/newData.SOMDim[0].nColumns*newData.SOMDim[0].nRows;i++){
	SOMConnectivity.push(0);
	SOMRedNum.push(0);
	
	var found=0;
	for(var j=0;j<newData.SOMInfo.length;j++){	
		
		if(newData.SOMInfo[j].id-1 == i){
			found=1;
			SOMEntNum.push(newData.SOMInfo[j].data[0]);
			break;
		}
	}
	
	if(found==0)
		SOMEntNum.push(0);
	
	/*if(typeof(newData.SOMInfo[i].data) != "undefined")
		SOMEntNum.push(newData.SOMInfo[i].data[0]);*/
	
}

console.log('SOMInfo');
console.log(newData);

var si=new HashMap();

for(var i=0;i<newData.SOMInfo.length;i++)
	si.set(newData.SOMInfo[i].id,i);

var redInd=new HashMap();

for(var i=0;i<newData.StatisticsSupp.length;i++)
	redInd.set(newData.StatisticsSupp[i].redescriptionID,i);
	
for(i=0;i<newData.StatisticsSOM.length;i++){
	SOMConnectivity[newData.StatisticsSOM[i].clusterID-1]=SOMConnectivity[newData.StatisticsSOM[i].clusterID-1]+newData.StatisticsSOM[i].data[1]/(newData.StatisticsSupp[redInd.get(newData.StatisticsSOM[i].data[0])].suppElCount+newData.SOMInfo[si.get(newData.StatisticsSOM[i].clusterID)].data[0]-newData.StatisticsSOM[i].data[1]);
	SOMRedNum[newData.StatisticsSOM[i].clusterID-1]=SOMRedNum[newData.StatisticsSOM[i].clusterID-1]+1;
}

for(i=0;i<SOMRedNum.length;i++)
	SOMConnectivity[i]=SOMConnectivity[i]/SOMRedNum[i];

console.log(SOMConnectivity); console.log(SOMRedNum);

for(i=0;i<newData.SOMDim[0].nColumns*newData.SOMDim[0].nRows;i++)
		averages.push(0);

for(i=0;i<newData.SOMInfo.length;i++)
	averages[newData.SOMInfo[i].id-1]=newData.SOMInfo[i].data[0]; //.push(/*newData.SOMInfo[i].data[1]/*/newData.SOMInfo[i].data[0]/*newData.SOMInfo[i].data[1]*/);//averages.push(newData.SOMInfo[i].data[1]/newData.SOMInfo[i].data[0]);

console.log("averages");
console.log(averages);

var max=0, min=0;

for(i=0;i<averages.length;i++)
	if(i==0){
		max=averages[i];
		min=averages[i];
	}
	else{
		if(averages[i]>max)
			max=averages[i];
		if(averages[i]<min)
			min=averages[i];
	}
	
	
var bins=(max-min)/50;

//console.log(averages[0]);
  
//Function to call when you mouseover a node
function mover(d,i) {

if(d3.select(this).attr("selected")==null){
  var el = d3.select(this)
		.transition()
		.duration(10)		  
		.style("fill-opacity", 0.3)
		;
  }
  
  d3.select(this).style("cursor","pointer");
	var topLocation= d3.event.pageY;
	
 d3.select("#tooltip")
                 .style("left", (d3.event.pageX+10) + "px")
                 .style("top", (topLocation) + "px")
				 .style("fill-opacity",1.0)
                 .select("#value")
                 .text("Homogeneity: "+SOMConnectivity[i].toFixed(2));
				 
				 d3.select("#tooltip").select("#value1")
				 .text("#Redescriptions: "+SOMRedNum[i]);
				 
				 d3.select("#tooltip").select("#value2")
				 .text("#Entities: "+SOMEntNum[i]);
				 
               //Show the tooltip
               d3.select("#tooltip").classed("hidden", false); 
  
}

//Mouseout function
function mout(d,i) { 
//console.log(i);
//console.log(newData);
  if(d3.select(this).attr("selected")==null){
	var el = d3.select(this)
	   .transition()
	   .duration(1000)
	   .style("fill-opacity", 1)
	   ;
  }
  
  d3.selectAll("text").classed("active", false);
	 d3.select("#tooltip").classed("hidden", true);
  
};

//Mouse click function (define a lot of things)
function mclick(d,i) { 
//console.log("mclick on hexagon: "+i);

	   d3.selectAll('.hexagon').style('fill-opacity', '1');
		d3.selectAll('.hexagon').attr("selected",null);
		d3.selectAll('.hexagon').attr("cursor","pointer");
		d3.select(this).attr("selected","true");
		d3.select(this).style('fill-opacity','0.1');
		d3.select(this).attr("cursor","default");

var options;
 
 if(scope.trainMode==0){
		options={url: attrs.url,
               method: 'GET', 
               params: {
               id: JSON.stringify((i+1))
                        }
                          };
 }
 else if(scope.trainMode==1){
	 options={url: scope.redescriptionsSel,
               method: 'GET', 
               params: {
               id: JSON.stringify((i+1)),
			   userId: JSON.stringify(scope.userInfo.userInfo[0].userId)
                        }
                          };
 }
 else if(scope.trainMode==2){
	console.log('SOM template loaded!');
	options={url: scope.redescriptionsBack,
               method: 'GET', 
               params: {
               id: JSON.stringify((i+1))
                        }
                          };
 }
 else{
	 alert("Error in mode selection!")
	 return;
 }
					  
   scope.getRedescriptonsInSOMCluster(options);

  // console.log(scope.RedsInSOMClust);
};

//svg sizes and margins
var margin = {
    top: 30,
    right: 20,
    bottom: 20,
    left: 50
};

//The next lines should be run, but this seems to go wrong on the first load in bl.ocks.org
//var width = $(window).width() - margin.left - margin.right - 40;
//var height = $(window).height() - margin.top - margin.bottom - 80;
//So I set it fixed to
var width = 850;
var height = 350;

//The number of columns and rows of the som map
var MapColumns = newData.SOMDim[0].nColumns;//4,
	MapRows = newData.SOMDim[0].nRows;//4;
	
//The maximum radius the hexagons can have to still fit the screen
var hexRadius = d3.min([width/((MapColumns + 0.5) * Math.sqrt(3)),
			height/((MapRows + 1/3) * 1.5)]);

//Set the new height and width of the SVG based on the max possible
width = MapColumns*hexRadius*Math.sqrt(3);
heigth = MapRows*1.5*hexRadius+0.5*hexRadius;

//Set the hexagon radius
var hexbin = d3.hexbin()
    	       .radius(hexRadius);

//Calculate the center positions of each hexagon	
var points = [];
for (var i = 0; i < MapRows; i++) {
    for (var j = 0; j < MapColumns; j++) {
        points.push([hexRadius * j * 1.75, hexRadius * i * 1.5]);
    }//for j
}//for i

var width1 = width + margin.left + margin.right + 150;

//Create SVG element
var contDiv = d3.select(element[0]).append("div")
				.attr("id","somContainer")
				.style("width",width1+"px")
				.style("position","relative")
				.style("float","left");

var svg = /*d3.select(element[0])*/contDiv.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

///////////////////////////////////////////////////////////////////////////
////////////////////// Draw hexagons and color them ///////////////////////
///////////////////////////////////////////////////////////////////////////

//Start drawing the hexagons
svg.append("g")
    .selectAll(".hexagon")
    .data(hexbin(points))
    .enter().append("path")
    .attr("class", "hexagon")
    .attr("d", function (d) {
		return "M" + d.x + "," + d.y + hexbin.hexagon();
	})
    .attr("stroke", function (d,i) {
		return "#fff";
	})
    .attr("stroke-width", "1px")
	.attr("cursor","pointer")
	.attr("id",function(d,i){
		return i;
	})
    .style("fill", function (d,i) {
		var av=averages[i];
		for(j=0;j<50;j++)
			if(av>=j*bins && av<=((j+1)*bins)){
				//console.log("j: "+j);
				//console.log("i: "+i)
				//console.log("avg: "+av);
				return color2[j];//color1[j];
			}
			else if(av>(50*bins)){
				//console.log("i: "+i)
				//console.log("avg: "+av);
				return color2[49];//color1[49];
			}
		//return color[i];
	})
	.on("mouseover", mover)
	.on("mouseout", mout)
	.on("click",mclick)
	;

//var colors =	[ ["Local", "#377EB8"],
//				  ["Global", "#4DAF4A"] ];

var colors = [];

for(i=0;i<50;i++){
	//console.log("bins"+bins)
 var binMin=i*bins;
 var binMax=(i+1)*bins;
// console.log("binMin: "+binMin);
// console.log("binMax: "+binMax);
 if(i%3==0)
 colors.push([Math.round(binMin+(binMax-binMin)/2,0),color2[i]/*color1[i]*/]);
if(i==49)
	colors.push([Math.round(binMin+(binMax-binMin)/2,0),color2[i]/*color1[i]*/]);
}

var margin = {top: 25, right: 40, bottom: 35, left: 85},
				w = 500 - margin.left - margin.right,
				h = 350 - margin.top - margin.bottom;				  
	
// add legend   
var legend = /*d3.select(element[0])*/contDiv.append("svg")
		.attr("class", "legend")
		//.attr("x", w - 65)
		//.attr("y", 50)
		.attr("height", 400)//each box takes 20...
		.attr("width", 100)
		.attr('transform', 'translate(20,0)');
		
var legendRect = legend.selectAll('rect').data(colors);

legendRect.enter()
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
	.attr("x",5);

legendRect
    .attr("y", function(d, i) {
        return i * 20+10;
    })
    .style("fill", function(d) {
        return d[1];
    });

var legendText = legend.selectAll('text').data(colors);

legendText.enter()
    .append("text")
	.attr("x",30)

legendText
    .attr("y", function(d, i) {
        return i * 20 + 19;
    })
    .text(function(d) {
        return d[0];
    });
	 });
  }
 }
});
 
 //directive for the second page  
redApp.directive('redFilter', function () {
  return {
     restrict: 'E',
     replace: false,

	 link: function (scope, element, attrs) {
		 
		 scope.view=3;
		 scope.$parent.checkedOrderGL.cog=[];
		 scope.getAllRedescriptions(attrs.allredUrl);
		 scope.allRedUrl=attrs.allredUrl;
		 scope.sharedDataUrl=attrs.sharedUrl;
		 //console.log(attrs.allredUrl);
		 
		 	scope.$watch('AllReds', function (newData, oldData) {
			if (!newData) { return; }
		  
		  $(element[0]).empty();
		  
		  console.log("newData!");
		  console.log(newData);
		  
		  var chartCont=d3.select(element[0]).append("div")
							   .attr("id","redCharts");
				for(i=3;i<newData.measures.length;i++){
					chartCont.append("div")
							   .attr("id","measure "+(i-3)+"-chart")
							   .attr("class","chart")
							   .append("div")
							   .attr("class","title")
							   .text(newData.measureNames[i].displayName);
				}
				
			   /*	var jschartJS = chartCont.append("div")
							   .attr("id","js-chart")
							   .attr("class","chart")
							   .append("div")
							   .attr("class","title")
							   .text("Jaccard similarity");
				
				var jschartSupp = chartCont.append("div")
							   .attr("id","supports-chart")
							   .attr("class","chart")
							   .append("div")
							   .attr("class","title")
							   .text("Redescription support");
							   
				var jschartpVal = chartCont.append("div")
							   .attr("id","pval-chart")
							   .attr("class","chart")
							   .append("div")
							   .attr("class","title")
							   .text("p-value");

				var jschartAEJ = chartCont.append("div")
							   .attr("id","aej-chart")
							   .attr("class","chart")
							   .append("div")
							   .attr("class","title")
							   .text("Average element Jaccard similarity");
							   
				var jschartpAAJ = chartCont.append("div")
							   .attr("id","aaj-chart")
							   .attr("class","chart")
							   .append("div")
							   .attr("class","title")
							   .text("Average atribute Jaccard similarity");*/

		var as = d3.select(element[0]).append("aside");
					as.attr("id","totals").style("position","relative");
		
		var asspan = as.append("span");
			asspan.attr("id","active");
									 
		var pb=as.append("span");
		    pb.text(" of ");
									 
		var asspan1= as.append("span")
			.attr("id","total");
									
		var pl=as.append("span");
			pl.text(" redescriptions selected.");
		
		/*var resd = d3.select(element[0]).append("div")
										.attr("id","results")
										.append("div")
										.append("div")
										.attr("class","title")
										.text("Most frequent attributes")
										.append("div")
										.attr("id","attrCount");*/
		
		var glistWidth = 40+250+385+40+60+45+50*(newData.measures.length-6)+30;
		
		var glist = d3.select(element[0]).append("div")
										 .attr("id","gl")
										 .style("width", glistWidth+"px");
							

									var elGlistSel=glist.append("div")
										 .attr("id","selectR")
										 .attr("class","selectR")
										 .style("height","40px")
										 .style("display","inline-block")
										 .style("text-align","center")
										 .style("margin-top","10px")
										 .style("margin-bottom","10px")
										 .style("cursor","pointer");
											
							  var elGlistpSel = elGlistSel.append("p").style("font-weight", "bold").text("Sl.");							
										
							elGlistSel.style("width","40px");
										
				for(i=0;i<newData.measures.length-1;i++){
										
							  var elGlist=glist.append("div")
										 .attr("id","hcol"+(i+1))
										 .attr("class","hccol"+(i+1))
										 .style("height","40px")
										 .style("display","inline-block")
										 .style("text-align","center")
										 .style("margin-top","10px")
										 .style("margin-bottom","10px")
										 .style("cursor","pointer");
											
							  var elGlistp = elGlist.append("p").style("font-weight", "bold").text(newData.measureNames[i+1].shortName);
										 
										 if(i==0){
											elGlist.style("width","250px");
										 }
										 else if(i==1){
											 elGlist.style("width","385px");
										 }
										 else if(i==2){
											 elGlist.style("width","40px");
										 }
										 else if(i==3){
											 elGlist.style("width","60px");
										 }
										 else if(i==4){
											 elGlist.style("width","45px");
										 }
										 else{
											 elGlist.style("width","50px");
										 }
										
				}
										 
										 /* glist.append("div")
										 .attr("id","hlr")
										 .attr("class","hclr")
										 .append("p").text("LR")
										 
										  glist.append("div")
										 .attr("id","hrr")
										 .attr("class","hcrr")
										 .append("p").text("RR");
										 
										 glist.append("div")
										 .attr("id","hjs")
										 .attr("class","hcjs")
										 .append("p").text("JS")
		
										 glist.append("div")
										 .attr("id","hsupp")
										 .attr("class","hcsupp")
										 .append("p").text("supp")
										 
										  glist.append("div")
										 .attr("id","hpval")
										 .attr("class","hcpval")
										 .append("p").text("pVal")
										 
										  glist.append("div")
										 .attr("id","hejs")
										 .attr("class","hcejs")
										 .append("p").text("EJS")
										 
										  glist.append("div")
										 .attr("id","hajs")
										 .attr("class","hcajs")
										 .append("p").text("AJS")*/
										 
										/* glist.append("div")
										 .attr("id","hajsn1")
										 .attr("class","hcajsn1")
										 .style("font-weight","bold")
										 .style("width","50px")
										 .style("height","40px")
										 .style("display","inline-block")
										 .style("text-align","center")
										 .style("font","bold")
										 .style("margin-bottom","2px")
										 .style("margin-top","10px")
										 .style("margin-bottom","10px")
										 .append("p").text("AJSn1");*/
										 
				d3.select(element[0]).append("div")
									 .attr("id","lists")
									 .append("div")
									 .attr("id","git-list")
									 .attr("class","list") 
									 .style("width", glistWidth+"px");
									 
									 
									 

// (It's CSV, but GitHub Pages only gzip's JSON at the moment.)
//
//d3.csv("repositories_data_119k.json", function(error, repos) {

  // Create the crossfilter for the relevant dimensions and groups.

   function barChart() {
    if (!barChart.id) barChart.id = 0;

    var margin = {top: 10, right: 10, bottom: 20, left: 10},
        x,
        y = d3.scale.linear().range([100, 0]),
        id = barChart.id++,
        axis = d3.svg.axis().orient("bottom"),
        brush = d3.svg.brush(),
        brushDirty,
        dimension,
        group,
        round;

    function chart(div) {
      var width = x.range()[1],
          height = y.range()[0];

      y.domain([0, group.top(1)[0].value]);

      div.each(function() {
        var div = d3.select(this),
            g = div.select("g");

        // Create the skeletal chart.
        if (g.empty()) {
          div.select(".title").append("a")
              .attr("href", "javascript:reset(" + id + ")")
              .attr("class", "reset")
              .text("reset")
              .style("display", "none");

          g = div.append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          g.append("clipPath")
              .attr("id", "clip-" + id)
            .append("rect")
              .attr("width", width)
              .attr("height", height);

          g.selectAll(".bar")
              .data(["background", "foreground"])
            .enter().append("path")
              .attr("class", function(d) { return d + " bar"; })
              .datum(group.all());

          g.selectAll(".foreground.bar")
              .attr("clip-path", "url(#clip-" + id + ")");

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + height + ")")
              .call(axis);

          // Initialize the brush component with pretty resize handles.
          var gBrush = g.append("g").attr("class", "brush").call(brush);
          gBrush.selectAll("rect").attr("height", height);
          gBrush.selectAll(".resize").append("path").attr("d", resizePath);
        }

        // Only redraw the brush if set externally.
        if (brushDirty) {
          brushDirty = false;
          g.selectAll(".brush").call(brush);
          div.select(".title a").style("display", brush.empty() ? "none" : null);
		 // console.log("brush extent");
		  //console.log(x(extent[1])+ " "+x(extent[0]));
          if (brush.empty()) {
            g.selectAll("#clip-" + id + " rect")
                .attr("x", 0)
                .attr("width", width);
          } else {
            var extent = brush.extent();
            g.selectAll("#clip-" + id + " rect")
                .attr("x", x(extent[0]))
                .attr("width", x(extent[1]) - x(extent[0]));
          }
        }

        g.selectAll(".bar").attr("d", barPath);
      });

      function barPath(groups) {
        var path = [],
            i = -1,
            n = groups.length,
            d;
        while (++i < n) {
          d = groups[i];
          path.push("M", x(d.key), ",", height, "V", y(d.value), "h9V", height);
        }
        return path.join("");
      }

      function resizePath(d) {
        var e = +(d == "e"),
            x = e ? 1 : -1,
            y = height / 3;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
      }
    }

    brush.on("brushstart.chart", function() {
      var div = d3.select(this.parentNode.parentNode.parentNode);
      div.select(".title a").style("display", null);
    });

    brush.on("brush.chart", function() {
      var g = d3.select(this.parentNode),
          extent = brush.extent();
      if (round) g.select(".brush")
          .call(brush.extent(extent = extent.map(round)))
        .selectAll(".resize")
          .style("display", null);
      g.select("#clip-" + id + " rect")
          .attr("x", x(extent[0]))
          .attr("width", x(extent[1]) - x(extent[0]));
      dimension.filterRange(extent);
    });

    brush.on("brushend.chart", function() {
      if (brush.empty()) {
        var div = d3.select(this.parentNode.parentNode.parentNode);
        div.select(".title a").style("display", "none");
        div.select("#clip-" + id + " rect").attr("x", null).attr("width", "100%");
        dimension.filterAll();
      }
    });

    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      axis.scale(x);
      brush.x(x);
      return chart;
    };

    chart.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return chart;
    };

    chart.dimension = function(_) {
      if (!arguments.length) return dimension;
      dimension = _;
      return chart;
    };

    chart.filter = function(_) {
      if (_) {
        brush.extent(_);
        dimension.filterRange(_);
      } else {
        brush.clear();
        dimension.filterAll();
      }
      brushDirty = true;
      return chart;
    };

    chart.group = function(_) {
      if (!arguments.length) return group;
      group = _;
      return chart;
    };

    chart.round = function(_) {
      if (!arguments.length) return round;
      round = _;
      return chart;
    };

    return d3.rebind(chart, brush, "on");
  }
  
    // Whenever the brush moves, re-rendering everything.
  function renderAll() {

    /*var nestByLang = d3.nest().key(function(d) { return d.repository_language; });
    var workingData=date.top(Infinity);
    var reposByLang = nestByLang.entries(workingData);
    var langCount = reposByLang.map(function(d) {return {"lang": d.key, "count":d.values.length};});
    var sortedLangCount = langCount.sort(function(a,b) {return b.count-a.count;});

    $("#languageCount").empty();

    var languageData = sortedLangCount.slice(0,20).reverse();

    var margin = {top: 5, right: 30, bottom: 5, left: 80},
        width = 300 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var y = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .1);

    var x = d3.scale.linear()
        .range([0, width]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    y.domain(languageData.map(function(d) { return d.lang; }));
    x.domain([0, d3.max(languageData, function(d) { return d.count; })]);

    var svg = d3.select("#languageCount").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(0, 0)")
          .call(yAxis);

      svg.selectAll(".bar")
          .data(languageData)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("y", function(d) { return y(d.lang); })
          .attr("height", y.rangeBand())
          .attr("x", function(d) { return 0; })
          .attr("width", function(d) { return x(d.count); });

	fuse.list=workingData;*/
	$("[id=attrdistG]").empty();
	$("#redSupTableG").remove();
	$("#redADContG").remove();
	$("#RelationGraphG").remove();
	
    chart.each(render);
	//console.log("render all list");
	//console.log(list);
    list.each(render);
    d3.select("#active").text(all.value());
  }
  
     //var maxJS=-1, minJS=2.0, minPval=2.0, maxPval=-1, maxSupport=-1.0, minSupport= Number.POSITIVE_INFINITY, maxaej=-1, minaej=2.0, maxaaj=-1, minaaj=2.0;
	 var minS= new Array(newData.minMax[0].length), maxS= new Array(newData.minMax[0].length);//new Array(newData.redescriptions[0].data.length-2), maxS= new Array(newData.redescriptions[0].data.length-2);
	// console.log(newData.minMax[0]);
	 //console.log(newData.minMax[0][0]);
	 
	 /*for (var key in data) {
			console.log(key);
		}*/
		
		for (var key in newData.minMax[0]) {
			
			if(key.indexOf("max")>-1){
				var ind= parseInt(key.match(/\d/g));
				maxS[ind-1]=newData.minMax[0][key];
			}
			else{
				var ind= parseInt(key.match(/\d/g));
				minS[ind-1]=newData.minMax[0][key];
			}
			
			/*console.log(key);
			if(key.indexOf("max") > -1)
				console.log("contains max");
			else console.log("contains min");
			console.log(parseInt(key.match(/\d/g)));*/
		}
		//console.log(maxS);
		//console.log(minS);
		
		
	/*var arrayMeas = $.map(newData.minMax[0], function(value, index) {
			return [value];
	});
	
	//console.log("measure array: ");
	//console.log(arrayMeas);
	 
	 var iind=0;
	 for(i=0;i<arrayMeas.length;i++){
			//console.log(arrayMeas[i])
			if((iind%2)==0)
			maxS.push(arrayMeas[i]);
		else
			minS.push(arrayMeas[i]);
		 
		 iind++;
		 
	 }*/
	 
	 //console.log(maxS);
	// console.log(minS);
	 
	/*for(j=0;j<newData.redescriptions.length;j++){ 
		for(i=2;i<newData.redescriptions.length;i++){
			if(newData.redescriptions[j].data[i]>maxS[i-2])
				maxS[i-2]=newData.redescriptions[j].data[i];
			if(newData.redescriptions[j].data[i]<minS[i-2])
				minS[i-2]=newData.redescriptions[j].data[i];
		 }
	 }*/
	 
	 var measureChart=[];
	 var measuresChart=[];
	 var steps=[];
  
  
  var repo = crossfilter(newData.redescriptions),
      all = repo.groupAll();

      /*jaccard = repo.dimension(function(d) {return d.data[2]; }),
      jaccards = jaccard.group(function(d) { return Math.floor(d*100); }),

      support = repo.dimension(function(d) { return d.data[3]; }),
      supports = support.group(function(d) { return Math.floor((d/199)*100); }),

      pval = repo.dimension(function(d) { return d.data[4]; }),
      pvals = pval.group(function(d) { console.log(Math.floor((-Math.log10(d)/17)*100 ));  if(d>0) return 100- Math.floor((-Math.log10(d)/17)*100 ); else return 100; }),
      
      aej = repo.dimension(function(d) { return d.data[5]; }),
      aejs= aej.group(function(d) { return Math.floor(d*100 ); });
	  
	  aaj = repo.dimension(function(d) { return d.data[6]; }),
      aajs= aaj.group(function(d) { return Math.floor(d*100); });*/

	  for(i=2;i<newData.measures.length-1;i++){
		  var step=(maxS[i-2]-minS[i-2])/38;
		 // if(i==2)
			//  step=0.015;
		if(step==0)
			step=0.00001;
		
		  steps.push(step);
		  //console.log(step);

			measureChart.push(repo.dimension(function(d) {return d["col"+(i+1)]/*d.data[i];*/ }));
			measuresChart.push(measureChart[i-2].group(function(d) { /*if(Math.floor(d/step)*step<minS[i-2]) return minS[i-2];*/ return Math.floor(d/step)*step; }));
		  /*}
		  else{
			measureChart.push(repo.dimension(function(d) {return d.data[i]; }));
			measuresChart.push(measureChart[i-2].group(function(d) { return Math.floor(d/step)*step; }));*/
		 // }
	  }
	  
	  /*jaccard = repo.dimension(function(d) {if(d.data[2]>maxJS) maxJS=d.data[2]; if(d.data[2]<minJS) minJS=d.data[2]; return d.data[2]; }),
      jaccards = jaccard.group(function(d) { return Math.floor(d*100)/100; }),

      support = repo.dimension(function(d) {if(d.data[3]>maxSupport) maxSupport=d.data[3]; if(d.data[3]<minSupport) minSupport=d.data[3]; return d.data[3]; }),
      supports = support.group(function(d) { return Math.floor(d/4)*4; }),

      pval = repo.dimension(function(d) { if(d.data[4]>maxPval) maxPval=d.data[4]; if(d.data[4]<minPval) minPval=d.data[4]; return d.data[4]; }),
      pvals = pval.group(function(d) {return Math.floor(d/0.0003)*0.0003;}),
      
      aej = repo.dimension(function(d) {if(d.data[5]>maxaej) maxaej=d.data[5]; if(d.data[5]<minaej) minaej=d.data[5]; return d.data[5]; }),
      aejs= aej.group(function(d) { return Math.floor(d*100 )/100; });
	  
	  aaj = repo.dimension(function(d) {if(d.data[6]>maxaaj) maxaaj=d.data[6]; if(d.data[6]<minaaj) minaaj=d.data[6]; return d.data[6]; }),
      aajs= aaj.group(function(d) { return Math.floor(d*100)/100; });*/
	  
	  
	  /*console.log(jaccard);
	  console.log(jaccards);
	  console.log("max/min JS");
	  console.log(maxJS);
	  console.log(minJS);
	   console.log("max/min pVal");
	  console.log(maxPval);
	  console.log(minPval);*/
	  
  var charts = [];
  
  for(i=2;i<newData.measures.length-1;i++){
	  charts.push(barChart()
        .dimension(measureChart[i-2])
        .group(measuresChart[i-2])
      .x(d3.scale.linear()
        .domain([Math.max(minS[i-2]-steps[i-2],0), maxS[i-2]+steps[i-2]])
        .rangeRound([0, 10 * 40])));
  }

   /* barChart()
        .dimension(jaccard)
        .group(jaccards)
      .x(d3.scale.linear()
        .domain([Math.max(minJS-0.1,0), maxJS+0.1])
        .rangeRound([0, 10 * 40])),

    barChart()
        .dimension(support)
        .group(supports)
      .x(d3.scale.linear()
        .domain([Math.max(minSupport-5,0), maxSupport+5])
        .rangeRound([0, 10 * 40])),

    barChart()
        .dimension(pval)
        .group(pvals)
      .x(d3.scale.linear()
        .domain([Math.max(minPval-0.001,0), maxPval+0.001])
        .rangeRound([0, 10 * 40])),

     barChart()
        .dimension(aej)
        .group(aejs)
      .x(d3.scale.linear()
        .domain([Math.max(minaej-0.1,0), maxaej+0.1])
        .rangeRound([0, 10 * 40])),

     barChart()
        .dimension(aaj)
        .group(aajs)
      .x(d3.scale.linear()
        .domain([Math.max(minaaj-0.1,0), maxaaj+0.1])
        .rangeRound([0, 10 * 40])),*/
 // ];

  // Given our array of charts, which we assume are in the same order as the
  // .chart elements in the DOM, bind the charts to the DOM and render them.
  // We also listen to the chart's brush events to update the display.
  var chart = d3.selectAll(".chart")
      .data(charts)
      .each(function(chart) { chart.on("brush", renderAll).on("brushend", renderAll); });

  // Render the initial lists.
  var list = d3.selectAll(".list")
      .data([repoList]);
      
	  //console.log("repo size: ");
	  //console.log(repo.size());
  // Render the total.
  d3.selectAll("#total")
      .text(repo.size());


 /* var currData;
	
  var keys = [];
      keys.push('repository_url');
      fuse = new Fuse(date.top(Infinity), {
        keys: keys,
        caseSensitive: false
      });*/
	
  renderAll();

  // Renders the specified chart or list.
  function render(method) {
    d3.select(this).call(method);
  }
  
  
 function mclick(d,i) { 
		//console.log("mclick on redescription: "+newData.redescriptions[i].id);
		d3.selectAll('#selected').style('background-color', 'white');
		d3.selectAll('#selected').attr("id",null);
		d3.select(this).attr("id","selected");
		//console.log("url: "+attrs.redinfoUrl);
		var options = {url: attrs.redinfoUrl,
               method: 'GET', 
               params: {
               id: JSON.stringify(newData.redescriptions[i].id)
                        }
                          };
		scope.getRedescriptionInfo(options);
		//console.log(scope.RedescriptionInfo);
	};
  
  function repoList(div) {
	 
    var reposByJS = measureChart[0].top(Infinity);//jaccard.top(Infinity);
	globalVarG=reposByJS;
	
	if(typeof scope.selectionReds == "undefined"){
		scope.selectionReds={};
		scope.$parent.riGG.selectionReds={};
	}
	scope.selectionReds.redescriptions= reposByJS;
	scope.$parent.riGG.selectionReds.redescriptions=reposByJS;
	//console.log("scope: ");
	//console.log(scope);
	GlRedescriptions=reposByJS;
	//console.log("reposByJS");
	//console.log(reposByJS);
    div.each(function() {
    
      var red = d3.select(this).selectAll(".red")
          .data(reposByJS, function(d) {/*console.log("list: "); console.log(d); console.log(d.id);*/ return d.id; });
	  red.enter().append("div")
          .attr("class", "red")
      red.exit().remove();
	 /* red.on('click',function(d,i){
		  d3.selectAll('#selected').style('background-color', 'white');
		d3.selectAll('#selected').attr("id",null);
		d3.select(this).attr("id","selected");
		  var options = {url: attrs.redinfoUrl,
               method: 'GET', 
               params: {
               id: JSON.stringify(reposByJS[i].id)
                        }
                          };
		scope.getRedescriptionInfo(options);
		//console.log(scope.RedescriptionInfo);
		  //console.log('Click on redescription: '+i); console.log('Redescription: '); console.log(reposByJS[i]);
		  });*/
		  
	
	  red.on('mouseout',function(d,i){
				if(!(d3.select(this).attr('id')=='selected')){
						d3.select(this)
						.style('background-color', 'white');
			}
			//console.log('in hover method');
	 }
		 );
	 
	 red.on('mouseover',function(d,i){
		
		d3.select(this)
			.style('background-color', 'lightgray');		
	 });
	 
      var repo = red.order().selectAll(".repo")
          .data(function(d) {/*console.log("repo"); console.log(d);*/ return [d/*.data*/]; });
		 
		
      var repoEnter = repo.enter().append("div")
          .attr("class", "repo");
		  

		  repoEnter.append("div").attr("class","selctR").append("input").attr("type","checkbox").attr("id",function(d){return d.id}).attr("class","rounded");
	
		for(i=0;i<newData.measures.length-1;i++){
			if(i==0){
			 repoEnter.append("div")
				.attr("class", "leftRule").attr("style","word-break: break-all; word-wrap: break-word;")
				.text(function(d) {/*console.log(d);*/ return d["col"+(i+1)]; });
			}
			else if(i==1){
				repoEnter.append("div")
				.attr("class","rightRule").attr("style","word-break: break-all; word-wrap: break-word;")
				.text(function(d) {return d["col"+(i+1)]; });
			}
			else if(i==2){
				 repoEnter.append("div")
				.attr("class", "number")
				.text(function(d) {return parseFloat(d["col"+(i+1)]).toFixed(2); });
			}
			else if(i==3){
				repoEnter.append("div")
				.attr("class", "number")
				.text(function(d) {return d["col"+(i+1)]; });
			}
			else if(i==4){
				repoEnter.append("div")
				.attr("class", "number")
				.text(function(d) {return parseFloat(d["col"+(i+1)]).toFixed(4); });
			}
			else{
				repoEnter.append("div")
				.attr("class", "number")
				.text(function(d) {return parseFloat(d["col"+(i+1)]).toFixed(2); });
			}
		}
		
		var parts = repoEnter.selectAll("div").on('click',function(d,i){
			console.log(d);
			console.log(i);
			if(i>0){
		  d3.selectAll('#selected').style('background-color', 'white');
		d3.selectAll('#selected').attr("id",null);
		var par = d3.select(this.parentNode.parentNode).attr("id","selected");
		  var options = {url: attrs.redinfoUrl,
               method: 'GET', 
               params: {
               id: JSON.stringify(/*reposByJS[i].id*/d.id)
                        }
                          };
		scope.getRedescriptionInfo(options);
		$("#RelationGraphG").remove();
		//console.log(scope.RedescriptionInfo);
		  //console.log('Click on redescription: '+i); console.log('Redescription: '); console.log(reposByJS[i]);
			}
			else{
				console.log('stuff related to selection!');
				
				//	var contained=0; 
				
				d3.selectAll("input").each(function(d1){ 
						if(d3.select(this).attr("type") == "checkbox" && parseInt(d3.select(this).attr("id")) == d.id){ 
							console.log(d3.select(this).node().checked);
							if(d3.select(this).node().checked == false){
								for(var k=0;k<scope.$parent.checkedOrderGL.cog.length;k++) 
									if(scope.$parent.checkedOrderGL.cog[k]==d.id){  
										scope.$parent.checkedOrderGL.cog.splice(k, 1);
									}
							}
							else{
								var contained=0;
								for(var k=0;k<scope.$parent.checkedOrderGL.cog.length;k++) 
									if(scope.$parent.checkedOrderGL.cog[k]==d.id){  
										contained=1;
									}
									if(contained==0){
										//console.log('adding to array');
										scope.$parent.checkedOrderGL.cog.push(d.id);
										//console.log(scope.$parent.checkedOrderGL.cog);
									}
									console.log('contained: '+contained);
							}
						}
							});
				
				console.log(scope.$parent.checkedOrderGL.cog);
			}
		  }); 

      /*repoEnter.append("div")
          .attr("class", "leftrule")
          .text(function(d) { return d[0]; });
      repoEnter.append("div")
          .attr("class", "rightrule")
          .text(function(d) { return d[1];});
      repoEnter.append("div")
          .attr("class", "number")
          .text(function(d) { return parseFloat(d[2]).toFixed(2); });
      repoEnter.append("div")
          .attr("class", "number")
          .text(function(d) { return d[3]; });
      repoEnter.append("div")
          .attr("class", "number")
          .text(function(d) { return parseFloat(d[4]).toFixed(4); });
      repoEnter.append("div")
          .attr("class", "number")
          .text(function(d) { return parseFloat(d[5]).toFixed(2); });
      repoEnter.append("div")
          .attr("class", "number")
          .text(function(d) { return parseFloat(d[6]).toFixed(2); });*/
      repo.exit().remove();
      repo.order();
    });
  }
  
  
  /*
  /*
  function search2(e) {
    $result = $('#searchResults');
    var r = fuse.search($inputSearch.val());
    $result.empty();
    $.each(r.slice(0,14), function() {
    $result.append("<div class='searchResultDiv'><a class='listLink' href='https://github.com"+ this.repository_url + "'>" + this.repository_url + "</a></div>");
    });
  }
  
   var $inputSearch = $('#inputSearch');
  $inputSearch.on('keyup', function(e){search2(e);});*/
  
  var nestG=[], hjs=[];
  
  for(i=2;i<newData.measures.length-1;i++){
	   nestG.push(d3.nest().key(function(d) { return d["col"+(i+1)];/*d.data[i];*/ }));
	  hjs.push($('#hcol'+(i+1)));
	  
	  var tmpMC=measureChart[i-2];
	  var tmpnest=nestG[i-2];
	  var k=i;
	  
	  hjs[i-2].on('click',function(e){/*console.log(e);console.log(e.currentTarget.className);*/ var numb = parseInt(e.currentTarget.className.match(/\d/g)); /*console.log(numb);*/
      var list1 = d3.selectAll(".list")
      .data([function(d){/*console.log("data function"); console.log(k);*/ return repoList1(d,nestG[numb-3],measureChart[numb-3]/*tmpnest,tmpMC*/);}]); list1.each(render);});
	  
	  
	  //console.log(nestG[i-2]);
	 // console.log(hjs[i-2]);  
  }
  
 /* var nestByJS = d3.nest().key(function(d) {console.log("nest"); console.log(d); return d.data[2]; });
  var $hjs=$('#hjs');
  $hjs.on('click',function(e){
      var list1 = d3.selectAll(".list")
      .data([function(d){return repoList1(d,nestByJS,jaccard);}]); list1.each(render);});
    
    var $hsupp=$('#hsupp');
  $hsupp.on('click',function(e){
      var nestBySupport = d3.nest().key(function(d) { return d.data[3]; });
      var list1 = d3.selectAll(".list")
      .data([function(d){return repoList1(d,nestBySupport,support);}]); list1.each(render);});
      
       var $hpval=$('#hpval');
  $hpval.on('click',function(e){
      var nestByPval = d3.nest().key(function(d) { return d.data[4]; });
      var list1 = d3.selectAll(".list")
      .data([function(d){return repoList1(d,nestByPval,pval);}]); list1.each(render);});
      
       var $hejs=$('#hejs');
  $hejs.on('click',function(e){
      var nestByLang = d3.nest().key(function(d) { return d.data[5]; });
      var list1 = d3.selectAll(".list")
      .data([function(d){return repoList1(d,nestByLang,aej);}]); list1.each(render);});
      
             var $hajs=$('#hajs');
  $hajs.on('click',function(e){
      var nestBySize = d3.nest().key(function(d) { return d.data[6]; });
      var list1 = d3.selectAll(".list")
      .data([function(d){return repoList1(d,nestBySize,aaj);}]); list1.each(render);});*/
	  
function repoList1(div,nest,filtData) {
	//console.log(div);
	//console.log(nest);
	//console.log(filtData);
    var reposBy = nest.entries(filtData.top(Infinity));//measureChart[0].top(Infinity);//jaccard.top(Infinity);
	//console.log(reposBy);
	globalVarG=reposBy;
	GlRedescriptions=reposBy;
	var passOn=reposBy;
	
	if(typeof reposBy[0]!='undefined')
		passOn=reposBy[0].values;
	
	//console.log(reposByJS);
    div.each(function() {
    //console.log(reposBy);
      var red = d3.select(this).selectAll(".red")
          .data(passOn/*reposBy[0].values*/, function(d) {/*console.log("list1: "); console.log(d); console.log(d.id);*/ return d.id; });
	  red.enter().append("div")
          .attr("class", "red")
      red.exit().remove();
	 /* red.on('click',function(d,i){

		d3.selectAll('#selected').style('background-color', 'white');
		d3.selectAll('#selected').attr("id",null);
		d3.select(this).attr("id","selected");
		  var options = {url: attrs.redinfoUrl,
               method: 'GET', 
               params: {
               id: JSON.stringify(reposBy[0].values[i].id)
                        }
                          };
		scope.getRedescriptionInfo(options);
		//console.log(scope.RedescriptionInfo);
		 });*/
	 
	 
		  red.on('mouseout',function(d,i){
				if(!(d3.select(this).attr('id')=='selected')){
						d3.select(this)
						.style('background-color', 'white');
			}
	 }
		 );
	 
	 red.on('mouseover',function(d,i){
		
		d3.select(this)
			.style('background-color', 'lightgray');		
	 });
	 
      var repo = red.order().selectAll(".repo")
          .data(function(d) {/*console.log("repo"); console.log(d);*/ return [d/*d.data*/]; });
		  
		 // console.log(repo);
      var repoEnter = repo.enter().append("div")
          .attr("class", "repo");

		for(i=0;i<newData.measures.length-1;i++){
			if(i==0){
			 repoEnter.append("div")
				.attr("class", "leftRule")
				.text(function(d) {/*console.log("LR"); console.log(d);*/ return d["col"+(i+1)]; });
			}
			else if(i==1){
				repoEnter.append("div")
				.attr("class","rightRule")
				.text(function(d) {return d["col"+(i+1)]; });
			}
			else if(i==2){
				 repoEnter.append("div")
				.attr("class", "number")
				.text(function(d) {return parseFloat(d["col"+(i+1)]).toFixed(2); });
			}
			else if(i==3){
				repoEnter.append("div")
				.attr("class", "number")
				.text(function(d) {return d["col"+(i+1)]; });
			}
			else if(i==4){
				repoEnter.append("div")
				.attr("class", "number")
				.text(function(d) {return parseFloat(d["col"+(i+1)]).toFixed(4); });
			}
			else{
				repoEnter.append("div")
				.attr("class", "number")
				.text(function(d) {return parseFloat(d["col"+(i+1)]).toFixed(2); });
			}
		}
		
		var parts = repoEnter.selectAll("div").on('click',function(d,i){
			console.log(d);
			console.log(i);
			if(i>0){
		  d3.selectAll('#selected').style('background-color', 'white');
		d3.selectAll('#selected').attr("id",null);
		d3.select(this.parentNode).attr("id","selected");
		  var options = {url: attrs.redinfoUrl,
               method: 'GET', 
               params: {
               id: JSON.stringify(/*reposByJS[i].id*/d.id)
                        }
                          };
		scope.getRedescriptionInfo(options);
		$("#RelationGraphG").remove();
		//console.log(scope.RedescriptionInfo);
		  //console.log('Click on redescription: '+i); console.log('Redescription: '); console.log(reposByJS[i]);
			}
			else{
				console.log('stuff related to selection!');
				
				//	var contained=0; 
				
				d3.selectAll("input").each(function(d1){ 
						if(d3.select(this).attr("type") == "checkbox" && parseInt(d3.select(this).attr("id")) == d.id){ 
							console.log(d3.select(this).node().checked);
							if(d3.select(this).node().checked == false){
								for(var k=0;k<scope.$parent.checkedOrderGL.cog.length;k++) 
									if(scope.$parent.checkedOrderGL.cog[k]==d.id){  
										scope.$parent.checkedOrderGL.cog.splice(k, 1);
									}
							}
							else{
								var contained=0;
								for(var k=0;k<scope.$parent.checkedOrderGL.cog.length;k++) 
									if(scope.$parent.checkedOrderGL.cog[k]==d.id){  
										contained=1;
									}
									if(contained==0){
										//console.log('adding to array');
										scope.$parent.checkedOrderGL.cog.push(d.id);
										//console.log(scope.$parent.checkedOrderGL.cog);
									}
									console.log('contained: '+contained);
							}
						}
							});
				
				console.log(scope.$parent.checkedOrderGL.cog);
			}
		  }); 
	
      /*repoEnter.append("div")
          .attr("class", "leftrule")
          .text(function(d) { return d[0]; });
      repoEnter.append("div")
          .attr("class", "rightrule")
          .text(function(d) { return d[1];});
      repoEnter.append("div")
          .attr("class", "number")
          .text(function(d) { return parseFloat(d[2]).toFixed(2); });
      repoEnter.append("div")
          .attr("class", "number")
          .text(function(d) { return d[3]; });
      repoEnter.append("div")
          .attr("class", "number")
          .text(function(d) { return parseFloat(d[4]).toFixed(4); });
      repoEnter.append("div")
          .attr("class", "number")
          .text(function(d) { return parseFloat(d[5]).toFixed(2); });
      repoEnter.append("div")
          .attr("class", "number")
          .text(function(d) { return parseFloat(d[6]).toFixed(2); });*/
      repo.exit().remove();
      repo.order();
    });
  }
	  
	  
	  
  function parseDate(d) {
      return new Date(Date.parse(d));
    }

  window.filter = function(filters) {
    filters.forEach(function(d, i) { charts[i].filter(d); });
    renderAll();
  };

  window.reset = function(i) {
    charts[i].filter(null);
    renderAll();
  };
  
  var exButton = d3.select("#lists").append("button").attr("type","button")
										.attr("id","exButtG")
										.attr("onclick","exportFunctionG()")
										.style("margin-top","25px")
										.text('Export redescriptions');
										
			var informCont = d3.select("#lists").append("div").attr("class","filterInput").style("margin-left","0px").style("margin-right","10px")
																	.style("position","relative").style("float","left").style("width","420px").style("margin-top","25px");
									informCont.append("p").text('Max overlap (el.)').style("width","110px").style("position","relative").style("float","left");
			var textElementOverlap = informCont.append("input").attr("type","").attr("value",0).attr("id","eoverIn")
																.style("margin-left","0px").style("width","25px").style("position","relative").style("float","left");
			//.append('input').attr({type: 'input type you want', value: 'your values that can be called with a function'})
									informCont.append("p").text('Max overlap (at.)').style("width","110px").style("position","relative").style("float","left").style("margin-left","10px");
			var textAttributeOverlap = informCont.append("input").attr("type","").attr("value",0).attr("id","atoverIn")
																.style("margin-left","0px").style("width","25px").style("position","relative").style("float","left");							
										
		    var RMRedButton = informCont.append("button").attr("type","button")
									.attr("id","RmRedButtG")
									.attr("onclick","filterRedsNewG()")
									.style("width","120px")
									.style("margin-left","20px")
									.text('Filter redundant');
									
						var progBar=d3.select("#lists").append("img").attr("src","ajax-loader.gif").attr("id","loader").style("visibility","hidden");			
			/*var progBar=d3.select("#lists").append("div").attr("id","barContainer").attr("class","w3-progress-container w3-light-blue").style("visibility","hidden").style("margin-bottom","10px");	
						progBar.append("div").attr("id","bar").attr("class","w3-progressbar w3-blue").style("width","0%").style("margin-bottom","10px").style("opacity","0.5").style("visibility","hidden");
						progBar.append("p").attr("id","barText").style("margin-left","50px").style("font-weight","bold").text("0% complete...");*/
  
  //add control buttons to relate redescriptions
  
   var divCont = d3.select("#lists").append("div").attr("id","progContG").style("width","800px").style("text-align","left").style("clear","both").style("margin-top","10px").style("margin-left","0px").style("position","relative");
		 
		 var STButton = divCont.append("button").attr("type","button")
									.attr("id","STButtonG")
									.attr("onclick","relateRedsG()")
									.style("width","160px")
									.style("margin-left","20px")
									.style("display","inline-block")
									.text('Relate redescriptions');
					
					divCont.append("p").style("margin-right","0px").style("margin-left","20px").style("display","inline-block").append("text").text("Minimal weight: ");
					divCont.append("input").attr("type","text").attr("id","jacConstG").attr("value","0.5").style("width","50px").style("margin-left","2px").style("display","inline-block");
					divCont.append("p").style("margin-right","0px").style("margin-left","20px").style("display","inline-block").append("text").text("Num paths: ");
					divCont.append("input").attr("type","text").attr("id","nPathsG").attr("value","2").style("width","50px").style("margin-left","2px").style("display","inline-block");
					divCont.append("p").attr("id","graphProgG").style("width","200px").style("margin-right","0px").style("margin-left","20px").style("display","inline-block");
			
  
    },true);
								 
			}
  }
});


//directive for the third page

redApp.directive('loadheatData', function($q,$timeout){
	return {
     restrict: 'E',
     replace: false,

	 link: function (scope, element, attrs) {
		 //scope.checked = true;
		 scope.view=2;
		 console.log(attrs.initatUrl);
		 console.log("button disabled!");
		
		var options = {url: attrs.initatUrl,
               method: 'GET', 
               params: {
                        }
                          };
						  
		scope.attrURL=attrs.redattrUrl;
		scope.attrFreqURL=attrs.attrfreqUrl;
		scope.attrcoocURL=attrs.allredUrl;
		scope.sharedDataUrl = attrs.sharedUrl;
		
		scope.getInitAtData(options);
		console.log(scope);

		// scope.getHeatmapData(options);//create
		 
		/* 	function encapsulateHD(options) {
					var deferrer = $q.defer();
				
        $timeout(function() {
            scope.getHeatmapData(options, deferrer);
        }, 100)
        
				return deferrer.promise;
			}
			
					function encapsulateAttrFreqW(options) {
							var deferrer = $q.defer();
        
						$timeout(function() {
							scope.setAttrFreq(options, deferrer);
						}, 100)
        
					return deferrer.promise;
					}
		 
		 		$q.all([encapsulateHD(options)]).then(function(){ //compute attribute frequency and return to database
			    console.log("Heatmap data to be processed...");
				console.log( scope.heatData);
		
				var atHeat=new HashMap();
				
				for(var i=0;i<scope.heatData.frequency.length;i++){
					atHeat.set(scope.heatData.frequency[i].id,scope.heatData.frequency[i].frequency);
				}
				
				var returnData=new Array();
				
				for(var i=0;i<scope.heatData.attributes.length;i++){
					var obj={};
					obj.id=scope.heatData.attributes[i].id;
					obj.name=scope.heatData.attributes[i].Name;
					if(atHeat.has(obj.id)){
						obj.frequency=atHeat.get(obj.id);
						returnData.push(obj);
					}
				}
				
				console.log(returnData);
		
		var options1 = {url: attrs.attrfreqUrl,
               method: 'POST', 
               params: {
                        },
				data: { attributeFrequency:  JSON.stringify(returnData),
						attCooc: JSON.stringify(scope.heatData.attCooc)}		
                          };
						  
						  $q.all([encapsulateAttrFreqW(options1)]).then(function(){console.log('Ready to draw heatmap!')});
						  //scope.setAttrFreq(options1);
		   }
				);
		 
		 
		 scope.$watch('heatData1', function(newData, oldData){
			 if(!newData){return;}
		 });*/
		 
	 }
	}	
  }
);


redApp.directive('attributeHeatmap', function () {
  return {
     restrict: 'E',
     replace: false,

	 link: function (scope, element, attrs) {
		var numItemsToDisplay = 50;
		scope.$parent.checkedOrder.co=new Array();
	
		var optionsStart = {url: attrs.allredUrl,
               method: 'GET', 
               params: {
               offsetRow: JSON.stringify(1),
			   offsetCol: JSON.stringify(1),
			   toDisplay: JSON.stringify(numItemsToDisplay)
                        }
                          };

		//scope.getAttributeCoocurence(optionsStart);
		 
		 //console.log(attrs.allredUrl);
		 
		 	scope.$watch('Coocurence', function (newData, oldData) {
			if (!newData) { return; }
		  
		  console.log("newData heatmap");
		  console.log(newData);
		  
		  $(element[0]).empty();
		  d3.select("#heatmap").remove();
		  d3.select("#redTableDiv").remove();
		  d3.select("#RelationGraphA").remove();
		  $("#exButtA").remove();
		  $("#remRedContainerA").remove();
		  $("#progContA").remove();
		  //console.log(newData);
	
			var cont= d3.select(element[0]).append("div")
							.attr("id","heatmap");
							
					  var aside=d3.select("#heatmap").append("aside")
									 .style("margin-top","0px")
									 .style("margin-left","240px")
									 .style("position","relative")
				
				var p = aside.append("p").text("Order: ")
								
								var sel=p.append("select")
								.attr("id","order").attr("class","name1")
								
								sel.append("option")
								.attr("value","name1").text("by Name")
								
								sel.append("option")
								.attr("value","count1").text("by Frequency")
								
								sel.append("option")
								.attr("value","group1").text("by Coocurence");
								
				var divNAsoc = d3.select("#heatmap").append("div").attr("id","atasocnum").style("width","600px");
				divNAsoc.append("label").text("Number of top associated attributes for each attribute in the selected pair: ").append("input").attr("id","asdispatinp").attr("type","text").attr("value","100").style("width","50px")
				.style("margin-top","20px");
		 
	var margin = {top: 200, right: 0, bottom: 10, left: 50},
    width = 720,
    height = 720;

	var x = d3.scale.ordinal().rangeBands([0, height]),
		z = d3.scale.linear().domain([0, newData.maxCoocurence[0].maxCoocurence]).clamp(true),
		c = d3.scale.category10().domain(d3.range(10)),
		y =d3.scale.ordinal().rangeBands([0, width]);

	var svg = d3.select("#heatmap").append("svg")
		.attr("width", width + margin.left + margin.right+50)
		.attr("height", height + margin.top + margin.bottom)
		.style("margin-left", margin.left + "px")
		.append("g")
		.attr("transform", "translate(" + (margin.left+50) + "," + margin.top + ")");
		
	//d3.json("miserables.json", function(miserables) {
		var matrix = [];
		//nodes = miserables.nodes,
		//n = nodes.length;

  // Compute index per node.
	//nodes.forEach(function(node, i) {
   // node.index = i;
    //node.count = 0;
   // matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
 // });
 
 var map1=new HashMap(), map2=new HashMap();
 
 for(i=0;i<newData.nodes1.length;i++){
	 newData.nodes1[i].ti=i;
	 map1.set(newData.nodes1[i].id,i);
 }
 
  for(i=0;i<newData.nodes2.length;i++){
	 newData.nodes2[i].ti=i;
	 map2.set(newData.nodes2[i].id,i);
  }

 //console.log(newData.nodes1);
 newData.nodes1.forEach(function(node, i){
	matrix[i]=d3.range(newData.nodes2.length).map(function(j){ return {x: j, y: i, z: 0}});
 });


 //console.log(map1); console.log(map2); console.log(matrix);
  // Convert links to matrix; count character occurrences.
	newData.links.forEach(function(link) {
		//console.log("map 1"); console.log(map1.get(link.source));
		//console.log("map 1"); console.log(map1.get(link.source));
    matrix[map1.get(link.source)][map2.get(link.target)].z += link.value;
   // matrix[map1.get(link.target)][map2.get(link.source)].z += link.value;
   // matrix[map1.get(link.source)][map2.get(link.source)].z += link.value;
    //matrix[map1.get(link.target)][map2.get(link.target)].z += link.value;
    //nodes[link.source].count += link.value;
   // nodes[link.target].count += link.value;
  });

  // Precompute the orders.
  var orders = {
    name1: d3.range(newData.nodes1.length).sort(function(a, b) { return d3.ascending(newData.nodes1[a].Name, newData.nodes1[b].Name); }),
    count1: d3.range(newData.nodes1.length).sort(function(a, b) { return newData.nodes1[b].count - newData.nodes1[a].count; }),
	name2: d3.range(newData.nodes2.length).sort(function(a, b) { return d3.ascending(newData.nodes2[a].Name, newData.nodes2[b].Name); }),
    count2: d3.range(newData.nodes2.length).sort(function(a, b) { return newData.nodes2[b].count - newData.nodes2[a].count; }),
   // group: d3.range(n).sort(function(a, b) { return nodes[b].group - nodes[a].group; })
  };

  // The default sort order.
  y.domain(orders.name2);
  x.domain(orders.name1);	
	
  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

  var row = svg.selectAll(".row")
      .data(matrix)
    .enter().append("g")
      .attr("class", "row")
	  .attr("id",function(d,i){return i})
      .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .each(row);

  row.append("line")
      .attr("x2", width);

  row.append("text")
      .attr("x", -6)
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .text(function(d, i) {/*console.log(newData.nodes1[i].Name);*/  var ch=newData.nodes1[i].Name.match(/(.|[\r\n]){1,10}/g); var retString=ch[0]; return retString/*newData.nodes1[i].Name;*/ });

  var column = svg.selectAll(".column")
      .data(matrix[0])
    .enter().append("g")
      .attr("class", "column")
      .attr("transform", function(d, i) { return "translate(" + y(i) + ")rotate(-90)"; });

  column.append("line")
      .attr("x1", -width);

  column.append("text")
      .attr("x", 6)
      .attr("y", y.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .text(function(d, i) {/*console.log(newData.nodes2[i].Name);*/ var ch=newData.nodes2[i].Name.match(/(.|[\r\n]){1,15}/g); var retString=ch[0]; return retString; /*newData.nodes2[i].Name;*/ });

	 scope.checked=false; 
	  
  function row(row) {
    var cell = d3.select(this).selectAll(".cell")
        .data(row.filter(function(d) { return d.z; }))
      .enter().append("rect")
        .attr("class", "cell")
		.attr("id",function(d,i){return i})
        .attr("x", function(d) { return y(d.x); })
        .attr("width", y.rangeBand())
        .attr("height", x.rangeBand())
        .style("fill-opacity", function(d) { return z(d.z); })
        //.style("fill", function(d) { return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
		.on("click",function(d,i){
			//console.log(this.id); console.log(this.parentNode.id);
			//console.log("row:"+d.y); console.log("col:"+d.x);
			
			console.log('text box value: ');
			console.log($("#asdispatinp").val());
			
			var options; 
			
			if(scope.trainMode==0){
				scope.numAttrsLocalToDisplay = parseInt($("#asdispatinp").val());
				scope.attrassocAllUrl = attrs.attrredUrl;
				options= {url: attrs.attrredUrl,
               method: 'GET', 
               params: {
				userId: JSON.stringify(scope.userInfo.userInfo[0].userId),   
               attribute1: JSON.stringify(map1.search(d.y)/*map1.search(parseInt(this.parentNode.id))*/),
			   attribute2: JSON.stringify(map2.search(d.x)/*map2.search(parseInt(this.id))*/),
			   numAttr: JSON.stringify($("#asdispatinp").val())
                        }
                          };
			}
			else if(scope.trainMode==1){
				scope.numAttrsLocalToDisplay = parseInt($("#asdispatinp").val());
				scope.attrassocSelUrl = attrs.attrredselUrl;
					options= {url: attrs.attrredselUrl,
               method: 'GET', 
               params: {
				 userId: JSON.stringify(scope.userInfo.userInfo[0].userId),
               attribute1: JSON.stringify(map1.search(d.y)/*map1.search(parseInt(this.parentNode.id))*/),//view1
			   attribute2: JSON.stringify(map2.search(d.x)/*map2.search(parseInt(this.id))*/),//view2
			   numAttr: JSON.stringify($("#asdispatinp").val())
                        }
                          };
			}
			else{
				alert("Problem with train mode!")
				return;
			}

		 scope.getAttributeRedescriptions(options);
			
			});		
  }


  function mouseover(p){
	  var toPrint="";
    d3.selectAll(".row text").classed("active", function(d, i) {return i == p.y; });
    d3.selectAll(".column text").classed("active", function(d, i) {return i == p.x; });
	/*console.log("on mouse over");
	console.log(p);
	console.log("column: "+newData.nodes2[p.x].Name);
	console.log("row: "+newData.nodes1[p.y].Name);*/
	var sortby=d3.select("#order")[0];
	var sortName=sortby[0].className;
	var tmpar=orders[sortName];
	
	d3.select(this).style("cursor","pointer");
	var topLocation= d3.event.pageY;
	if(tmpar.indexOf(p.y)>numItemsToDisplay-7)
		topLocation = topLocation - 140;
	else if(tmpar.indexOf(p.y)>numItemsToDisplay-10)
		topLocation = topLocation - 80;
	else topLocation= topLocation-10;
	
	d3.select("#tooltipA")
                 .style("left", (d3.event.pageX+10) + "px")
                 .style("top", (topLocation/*d3.event.pageY-10*/) + "px")
				 .style("white-space", "normal")
                 .select("#value")
                 .text(function(){var ch=newData.nodes1[p.y].Description.match(/(.|[\r\n]){1,26}/g); var res=""; for(var it=0;it<ch.length;it++) if(it+1<ch.length) res=res+ch[it]+"\n"; else res=res+ch[it]; return "Row: "+res;/*newData.nodes1[p.y].Description*/})
				 
				 d3.select("#tooltipA").select("#value1")
				 .text(function(){var ch=newData.nodes2[p.x].Description.match(/(.|[\r\n]){1,26}/g); var res=""; for(var it=0;it<ch.length;it++) if(it+1<ch.length) res=res+ch[it]+"\n"; else res=res+ch[it]; return "Column: "+res; /*"Column: "+newData.nodes2[p.x].Description*/});
               //Show the tooltip
               d3.select("#tooltipA").classed("hidden", false);
  }

  function mouseout() {
    d3.selectAll("text").classed("active", false);
	 d3.select("#tooltipA").classed("hidden", true);
  }

  d3.select("#order").on("change", function() {
    clearTimeout(timeout);
    order(this.value);
  });

  function order(value) {
	  d3.select("#redTableDiv").remove();
	  d3.selectAll("#attrdistA").remove();
	  d3.select("#redSupTableA").remove();
	  d3.select("#redADContA").remove();
	  d3.select("#RelationGraphA").remove();
	  d3.select("#order").attr("class",value);
	  $("#exButtA").remove();
	  $("#remRedContainerA").remove();
	  $("#progContA").remove();
	  $("#localAssocAtt1Div").remove();
		 $("#localAssocAtt2Div").remove();
		 $("#globalAssocAtt1Div").remove();
		 $("#globalAssocAtt2Div").remove(); 
		 $("#fieldAtLocal").remove();
		 $("#fieldAtGlobal").remove();
	  if(value=='group1'){
		  
		  /*console.log("entered group All");
		  console.log("matrix check");
		  console.log(matrix);*/
		var size=Math.min(newData.nodes1.length,newData.nodes2.length);
		var max=-1, maxRow=-1, maxCol=-1;
		var t1=[], t2=[];
		for(i=0;i<size;i++){
			for(j=0;j<newData.nodes1.length;j++)
				for(k=0;k<newData.nodes2.length;k++)
					if((matrix[j][k].z>max && $.inArray(j, t1)==-1 && $.inArray(k, t2)==-1) || (matrix[j][k].z>max && i==0)){
							max=matrix[j][k].z;
							maxRow=j;
							maxCol=k;
					}
					//console.log(max); console.log(maxRow); console.log(maxCol);
				t1.push(maxRow); t2.push(maxCol);
				max=-1;
		}
		
		if(newData.nodes1.length>size)
				for(j=0;j<newData.nodes1.length;j++)
					if($.inArray(j, t1)==-1){
							t1.push(j);
					}
					
		if(newData.nodes2.length>size)
				for(j=0;j<newData.nodes2.length;j++)
					if($.inArray(j, t2)==-1){
							t2.push(j);
					}
		
		orders["group1"]=t1,orders["group2"]=t2;
		  
	  }
	  
	  //console.log(value); console.log(orders[value]);
    x.domain(orders[value]);
	var dim2Name = value.replace(/[0-9]/g, '');
	dim2Name=dim2Name+'2';
    y.domain(orders[dim2Name]);
	//console.log( y.domain(orders["count2"]));
    var t = svg.transition().duration(2500);

    t.selectAll(".row")
        .delay(function(d, i) { return x(i) * 4; })
        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .selectAll(".cell")
        .delay(function(d) { return y(d.x) * 4; })
        .attr("x", function(d) { return y(d.x); });

    t.selectAll(".column")
        .delay(function(d, i) {/*console.log("i");console.log(i); console.log(y(i)); */return y(i) * 4; })
        .attr("transform", function(d, i) { return "translate(" + y(i) + ")rotate(-90)"; });
  }

  var timeout = setTimeout(function() {
    order("count1");
    d3.select("#order").property("selectedIndex", 1).node().focus();
  }, 1);
	
	
	var tablePag = d3.select("#heatmap").append("table")
					.attr("id","pagtable")
					  .style("margin-right","20px")
					  .style("margin-left","100px")
					  .style("position","relative")
					  .style("width","900px")
					  .style("height","50px");
					
	var firstRowPag = tablePag.append("tr")
					 
	
					firstRowPag.append("td").style("margin-top","0px").style("paddingTop","0px").style("height","20px")
					.text("Traverse columns: ")
					firstRowPag.append("td")
					.append("div")
					.attr("id","paging")
					  .style("position","relative")
					  .style("width","600px")
					  .style("height","40px");
					  
	var secondRowPag = tablePag.append("tr")
					 
	
					secondRowPag.append("td").style("margin-top","0px").style("paddingTop","0px").style("height","20px")
					.text("Traverse rows: ")
					secondRowPag.append("td")
					.append("div")
					.attr("id","pagingR")
					  .style("position","relative")
					  .style("width","600px")
					  .style("height","40px");
	
	/*d3.select("body").append("div")
						.attr("id","paging")
					  .style("margin-top", "10px")
					  .style("margin-right","20px")
					  .style("margin-left","100px")
					  .style("position","relative")
					  .style("width","900px")
					  .style("height","100px")
	*/
	
			var pagesRow=Math.ceil(newData.attcountW1[0].count/50), pagesCol=Math.ceil(newData.attcountW2[0].count/50);
			//console.log(newData.attcountW1[0].count/50); 
			var pageToSelectRow=parseInt(newData.pageRows), pageToSelectCol=parseInt(newData.pageCols);
			
			$("#paging").pagination({
				pages: pagesCol,
				cssStyle: 'light-theme',
				currentPage: pageToSelectCol,
				onPageClick: function(pageNumber, event){ 
				
			  var p1=$("#pagingR").pagination('getCurrentPage');
			  var p2=$("#paging").pagination('getCurrentPage');
			  $('#order').val('name1');
			  //console.log(p1); console.log(p2);
			  
			  //console.log("url: "+attrs.allredUrl);
		var options = {url: attrs.allredUrl,
               method: 'GET', 
               params: {
			   userId: JSON.stringify(scope.userInfo.userInfo[0].userId),
               offsetRow: JSON.stringify(p1),
			   offsetCol: JSON.stringify(p2),
			   toDisplay: JSON.stringify(numItemsToDisplay)
                        }
                          };
		 scope.getAttributeCoocurence(options);
		//console.log(scope.getAttributeCoocurence);
			  }
		});
		
		$("#pagingR").pagination({
				pages: pagesRow,
				cssStyle: 'light-theme',
				currentPage: pageToSelectRow,
				onPageClick: function(pageNumber, event){ 
				
			  var p1=$("#pagingR").pagination('getCurrentPage');
			  var p2=$("#paging").pagination('getCurrentPage');
			  $('#order').val('name1');
			 // console.log(p1); console.log(p2);
			  
			  //console.log("url: "+attrs.allredUrl);
		var options = {url: attrs.allredUrl,
               method: 'GET', 
               params: {
			   userId: JSON.stringify(scope.userInfo.userInfo[0].userId),   
               offsetRow: JSON.stringify(p1),
			   offsetCol: JSON.stringify(p2),
			   toDisplay: JSON.stringify(numItemsToDisplay)
                        }
                          };
		 scope.getAttributeCoocurence(options);
		//console.log(scope.getAttributeCoocurence);
			  }
		});
		
  /*$("#pagingR").pagination("onPageClick",function(){
			  
			  var p1=$("#pagingR").pagination('getCurrentPage');
			  var p2=$("#paging").pagination('getCurrentPage');
			  
			  console.log(p1); console.log(p2);
			  
		  })*/
			/*var exButton = d3.select("#heatmap").append("button").attr("type","button")
										.attr("id","exButt")
										.attr("onclick","exportFunction()")
										.style("margin-bottom","20px")
										.text('Export redescriptions');*/
																	
			});	
	 }
  } 
});


function copy(o) {
   var output, v, key;
   output = Array.isArray(o) ? [] : {};
   for (key in o) {
       v = o[key];
       output[key] = (typeof v === "object") ? copy(v) : v;
   }
   return output;
}

redApp.directive('attributeRedescriptions',function( $compile){
	
	return{
		restrict: 'E',
     replace: false,

	 link: function (scope, element, attrs) {
	//console.log("mclick on hexagon: "+i);
	
	scope.$watch('Coocurence', function (newData, oldData) {
			if (!newData) { return; }
		  
		  $(element[0]).empty();
		  d3.select("#redTableDiv").remove();
		  $("#exButtA").remove();
		 $("#remRedContainerA").remove();
		 $("#localAssocAtt1Div").remove();
		 $("#localAssocAtt2Div").remove();
		 $("#globalAssocAtt1Div").remove();
		 $("#globalAssocAtt2Div").remove(); 
		 $("#fieldAtLocal").remove();
		 $("#fieldAtGlobal").remove();
	});
	
	
	 /*function filterReds(){
  //var scope = angular.element($("#outer")).scope();
    scope.$apply(function(){
        
					console.log("Function filter redescriptions called!");
					if(scope.RedsContainingAttrs.redescriptions[1].id==81){
						scope.RedsContainingAttrs.redescriptions.splice(0,1);
					}
		});
		}*/
	
	scope.$watch('RedsContainingAttrs', function (newData, oldData) {
          if (!newData) { return; }
		  
		  $(element[0]).empty();
		d3.select("#redTableDiv").remove();
		//console.log(newData);
		 $("#exButtA").remove();
		 $("#remRedContainerA").remove();
		  $("#progContA").remove();
		  $("#loader").remove();
		  $("#localAssocAtt1Div").remove();
		 $("#localAssocAtt2Div").remove();
		 $("#globalAssocAtt1Div").remove();
		 $("#globalAssocAtt2Div").remove(); 
		 $("#fieldAtLocal").remove();
		 $("#fieldAtGlobal").remove();
		 
		 var attrLCountsW1 = new HashMap();//set, get
		 var attrLCountsW2 = new HashMap();//atHeat.has(obj.id)
		 var localAssocArrays = [];
		 var locAssocW1 = [];
		 var locAssocW2 = [];
		 var red = new HashSet();//contains, add
		 
		 for(var i=0;i<newData.redescriptions.length;i++){
			 red.add(newData.redescriptions[i].id);
		 }
		 
		
					
		 for(var i=0;i<newData.redescriptionAttrs.length;i++){
			 
			 if(!red.contains(newData.redescriptionAttrs[i].id))
				 continue;
			 
				if(newData.redescriptionAttrs[i].data[3] == 1){
					if(!attrLCountsW2.has(newData.redescriptionAttrs[i].data[0])){
						attrLCountsW2.set(newData.redescriptionAttrs[i].data[0],1);
						locAssocW2.push(copy(newData.redescriptionAttrs[i].data));
					}
					else{
						var c = attrLCountsW2.get(newData.redescriptionAttrs[i].data[0]);
						attrLCountsW2.set(newData.redescriptionAttrs[i].data[0],c+1);
					}
				}
				else{
					if(!attrLCountsW1.has(newData.redescriptionAttrs[i].data[0])){
						attrLCountsW1.set(newData.redescriptionAttrs[i].data[0],1);
						locAssocW1.push(copy(newData.redescriptionAttrs[i].data));
					}
					else{
						var c = attrLCountsW1.get(newData.redescriptionAttrs[i].data[0]);
						attrLCountsW1.set(newData.redescriptionAttrs[i].data[0],c+1);
					}
				}
		 }
		 
		 for(var i=0;i<locAssocW1.length;i++){
			 locAssocW1[i].push(attrLCountsW1.get(locAssocW1[i][0]));
		 }
		 
		 for(var i=0;i<locAssocW2.length;i++){
			 locAssocW2[i].push(attrLCountsW2.get(locAssocW2[i][0]));
		 }
		
	locAssocW1.sort(function(a, b) {
				return -a[4] + b[4];
			});	
		
	locAssocW2.sort(function(a, b) {
				return -a[4] + b[4];
			});	
			
			console.log("Local assoc to display");
			console.log(scope.numAttrsLocalToDisplay+1);
			
	if(scope.numAttrsLocalToDisplay<locAssocW1.length){
		locAssocW1 = locAssocW1.slice(0,scope.numAttrsLocalToDisplay);
	}
	
	if(scope.numAttrsLocalToDisplay<locAssocW2.length){
		locAssocW2 = locAssocW2.slice(0,scope.numAttrsLocalToDisplay);
	}
	
	console.log('Associations...');	
	console.log(locAssocW1);
	console.log(locAssocW2);
	
	var localAssoc = function(d,i){
			console.log('clicked');
			console.log(d);
			var selRs = new HashSet();
			var attrName;
			
		 if(typeof scope.attrRedSets == 'undefined'){
			 scope.attrRedSets = [];
			 scope.attrRedSets.push(copy(newData.redescriptions));
			 scope.rscount = 1;
		 }
		 else{
			 scope.attrRedSets.push(copy(newData.redescriptions));
			 scope.rscount = scope.rscount+1;
		 }
		 
		 console.log('scope'); console.log(scope);
		 
		// var rrs = copy(newData.redescriptions);
		 
		 for(var i=0;i<newData.redescriptionAttrs.length;i++){
			 if(newData.redescriptionAttrs[i].data[0]==d[0]){
				 selRs.add(newData.redescriptionAttrs[i].id);
				 attrName = newData.redescriptionAttrs[i].data[1];
			 }
		 }
		 
		var rrs=[];

			for(var i=0;i<newData.redescriptions.length;i++){
					if(selRs.contains(newData.redescriptions[i].id))
						rrs.push(newData.redescriptions[i]);
			}
			
			if(rrs.length == newData.redescriptions.length){
				 scope.attrRedSets.pop();
					return;				 
			}
			
			if(typeof scope.lselattrs == 'undefined'){
			scope.lselattrs = [];
			scope.lselattrs.push(attrName);
			}
			else
				scope.lselattrs.push(attrName);
			
			scope.RedsContainingAttrs.redescriptions = rrs;
			scope.$apply();		 
	}
	
	var backFunction = function(){
		console.log('clicked back!');
		scope.rscount = scope.rscount-1;
		scope.RedsContainingAttrs.redescriptions = scope.attrRedSets.pop();
		scope.lselattrs.pop();
		scope.$apply();	
	}
					
			var fieldLocal = d3.select("#heatmap").append("fieldset").attr("id","fieldAtLocal");
		fieldLocal.style("position","relative")
					.style("width","1000px")
					.style("cellspacing",0)
					.style("cellpading",0)
					.style("border",0)
					.style("float","left");
		fieldLocal.append("legend").text("Local attribute associations").style("text-align","center");
	
		var columns=["Count","Name", "Description"];
		
   var localAssocAtDiv1 = fieldLocal.append("div")
						  .attr("id","localAssocAtt1Div")
						  .attr("frame","void")
						  .style("margin-right","20px")
						  .style("margin-left","0px")
						  .style("margin-bottom","10px")
						  .style("position","relative")
						  .style("width","450px")
						  .style("height","200px")
						  .style("cellspacing",0)
						  .style("cellpading",0)
						  .style("border",0)
						  .style("float","left")
						  .style("overflow-x","scroll")
						  .style("overflow-y","scroll");
		
	localAssocAtDiv1.append("p").attr("align","center").append("b").text("Attribute: "+newData.selAttrs[0].attributeName).style("font-size","20px");		
	
	var localAssocAt1 = localAssocAtDiv1.append("table")
					.attr("id","localAssocAtt1")
					.attr("class", "tablesorter")
					.attr("border-collapse","separate")
					.attr("border-spacing","10 10")
					.attr("border","1px solid black")
					.attr("frame","void")
					.style("margin-right","0px")
					.style("margin-left","0px")
					.style("position","relative")
					.style("width","450px")
					.style("height","200px")
					.style("cellspacing",0)
					.style("cellpading",0)
					.style("border",0)
					.style("float","left");
					
	var LasstheadA1 = localAssocAt1.append("thead");
	var LasstbodyA1 = localAssocAt1.append("tbody")
					.attr("style", "height: 50px; overflow-y: scroll; overflow-x: scroll; ");

		LasstheadA1.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center");
			
			var rows = LasstbodyA1.selectAll("tr")
			.data(locAssocW1)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			.style("cursor", "pointer")
			.on('mouseover', function(d,i){
				d3.select(this)
			.style('background-color', 'lightgray');
			})
			.on('mouseout', function(d,i){
				if(!(d3.select(this).attr('id')=='selected')){
				d3.select(this)
					.style('background-color', 'white');}
					})
			.on('click',localAssoc);

		var cells = rows.selectAll("td")
			.data(function(row) {
				return columns.map(function(column) {
					return {column: column, value: row};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					if(i==0)
						return d.value[4];
					else if(i==1)
						return d.value[1];
					else if(i==2) return d.value[2];
					
					//return d.value[i]; 
				})
			.attr("style", "text-align:center")
			.attr("width",function(d,i){if(i==0) return "10%"; else return "45%";});
		

		var localAssocAtDiv2 = fieldLocal.append("div")
						  .attr("id","localAssocAtt2Div")
						  .attr("frame","void")
						  .style("margin-right","20px")
						  .style("margin-left","0px")
						  .style("margin-bottom","10px")
						  .style("position","relative")
						  .style("width","450px")
						  .style("height","200px")
						  .style("cellspacing",0)
						  .style("cellpading",0)
						  .style("border",0)
						  .style("float","left")
						  .style("overflow-x","scroll")
						  .style("overflow-y","scroll");
		
		localAssocAtDiv2.append("p").attr("align","center").append("b").text("Attribute: "+newData.selAttrs[1].attributeName).style("font-size","20px");			
			
		var localAssocAt2 = localAssocAtDiv2.append("table")
					.attr("id","localAssocAt2")
					.attr("class", "tablesorter")
					.attr("border-collapse","separate")
					.attr("border-spacing","10 10")
					.attr("border","1px solid black")
					.attr("frame","void")
					.style("margin-right","20px")
					.style("margin-left","0px")
					.style("position","relative")
					.style("width","450px")
					.style("height","200px")
					.style("cellspacing",0)
					.style("cellpading",0)
					.style("border",0)
					.style("float","left");

				
					
	var LasstheadA2 = localAssocAt2.append("thead");
	var LasstbodyA2 = localAssocAt2.append("tbody")
					.attr("style", "height: 50px; overflow-y: scroll; overflow-x: scroll; ");

		LasstheadA2.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center");
			
			var rowsA2 = LasstbodyA2.selectAll("tr")
			.data(locAssocW2)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			.style("cursor", "pointer")
			.on('mouseover', function(d,i){
				d3.select(this)
			.style('background-color', 'lightgray');
			})
			.on('mouseout', function(d,i){
				if(!(d3.select(this).attr('id')=='selected')){
				d3.select(this)
					.style('background-color', 'white');}
					})
			.on('click',localAssoc);

		var cellsA2 = rowsA2.selectAll("td")
			.data(function(row) {
				return columns.map(function(column) {
					return {column: column, value: row};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					
					if(i==0)
						return d.value[4];
					else if(i==1)
						return d.value[1];
					else if(i==2) return d.value[2];
					
					//return d.value[i]; 
				})
			.attr("style", "text-align:center")
			.attr("width",function(d,i){if(i==0) return "10%"; else return "45%";});
//add here back button and text
	var txtDiv = fieldLocal.append("div").attr("id","lselAttrs").style("height","30px").style("clear","both");
	var txtDivp = txtDiv.append("p").style("font-size","16px").style("margin-top","5px").style("margin-bottom","5px").style("text-align","center").append("b");	
	var txt = "Selected attributes: ";
	
	if(!(typeof scope.lselattrs == 'undefined')){
			if(scope.lselattrs.length>0){
				for(var i=0;i<scope.lselattrs.length;i++){
						if(i!=0)
							txt = txt+' , ';
						txt = txt+scope.lselattrs[i];
				}
	
	txtDivp.text(txt);
			}
	}
	
	if(!(typeof scope.lselattrs == 'undefined'))
		if(scope.lselattrs.length>0)
		txtDiv.append("button").attr("id","retback").on('click',backFunction).text("Previous");
	//txtDiv.append("div").attr("id","retback").append("p").append("b").text("Previous").style("font-size","20px").style("background-color", "teal").style("width","100px")
		//	.style("cursor", "pointer").on('click',backFunction);
		
	var globalAssoc = function(d,i){
		console.log('global associations...');
		console.log(d);
		
		var a1; var a2;
		
		if(d.data[2] == 1){
			a1 = d.id;
			if(newData.selAttrs[0].view==2)
				a2 = newData.selAttrs[0].attributeID;
			else a2 = newData.selAttrs[1].attributeID;
		}
		else{
			a2 = d.id;
			if(newData.selAttrs[0].view==1)
				a1 = newData.selAttrs[0].attributeID;
			else a1 = newData.selAttrs[1].attributeID;
		}
		
		console.log('a1 - a2');
		console.log(a1+' '+a2);
		
		var optionsGl; 
			
			if(scope.trainMode==0){
				scope.numAttrsLocalToDisplay = parseInt($("#asdispatinp").val());
				optionsGl= {url: scope.attrassocAllUrl,
               method: 'GET', 
               params: {
				userId: JSON.stringify(scope.userInfo.userInfo[0].userId),   
               attribute1: JSON.stringify(a1),
			   attribute2: JSON.stringify(a2),
			   numAttr: JSON.stringify($("#asdispatinp").val())
                        }
                          };
			}
			else if(scope.trainMode==1){
				scope.numAttrsLocalToDisplay = parseInt($("#asdispatinp").val());
					optionsGl= {url: scope.attrassocSelUrl,
               method: 'GET', 
               params: {
				 userId: JSON.stringify(scope.userInfo.userInfo[0].userId),
               attribute1: JSON.stringify(a1),//view1
			   attribute2: JSON.stringify(a2),//view2
			   numAttr: JSON.stringify($("#asdispatinp").val())
                        }
                          };
			}
			else{
				alert("Problem with train mode!")
				return;
			}

			console.log(attrs.attrredUrl);
			console.log(optionsGl);
		 scope.getAttributeRedescriptions(optionsGl);
		
	}
		
	var fieldGlobal = d3.select("#heatmap").append("fieldset").attr("id","fieldAtGlobal");
		fieldGlobal.style("position","relative")
					.style("width","1000px")
					.style("cellspacing",0)
					.style("cellpading",0)
					.style("border",0)
					.style("float","left")
					.style("margin-top","50px");
		fieldGlobal.append("legend").text("Global attribute associations").style("text-align","center");	

	var globalAssocAtDiv1 = fieldGlobal.append("div")
						  .attr("id","globalAssocAtt1Div")
						  .attr("frame","void")
						  .style("margin-right","20px")
						  .style("margin-left","0px")
						  .style("position","relative")
						  .style("width","450px")
						  .style("height","200px")
						  .style("cellspacing",0)
						  .style("cellpading",0)
						  .style("border",0)
						  .style("float","left")
						  .style("overflow-x","scroll")
						  .style("overflow-y","scroll");	
						  
	globalAssocAtDiv1.append("p").attr("align","center").append("b").text("Attribute: "+newData.selAttrs[0].attributeName).style("font-size","20px");		
					
	var globalAssocAt1 = globalAssocAtDiv1.append("table")
					.attr("id","globalAssocAt1")
					.attr("class", "tablesorter")
					.attr("border-collapse","separate")
					.attr("border-spacing","10 10")
					.attr("border","1px solid black")
					.attr("frame","void")
					.style("margin-right","20px")
					.style("margin-left","0px")
					.style("position","relative")
					.style("width","450px")
					.style("height","200px")
					.style("cellspacing",0)
					.style("cellpading",0)
					.style("border",0)
					.style("float","left");
					  
					
	var GlobtheadA1 = globalAssocAt1.append("thead");
	var GlobtbodyA1 = globalAssocAt1.append("tbody")
					.attr("style", "height: 50px; overflow-y: scroll; overflow-x: scroll; ");

		GlobtheadA1.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center");
			
			var rowsGA1 = GlobtbodyA1.selectAll("tr")
			.data(newData.attAssoc1)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			.style("cursor", "pointer")
			.on('mouseover', function(d,i){
				d3.select(this)
			.style('background-color', 'lightgray');
			})
			.on('mouseout', function(d,i){
				if(!(d3.select(this).attr('id')=='selected')){
				d3.select(this)
					.style('background-color', 'white');}
					})
					.on('click',globalAssoc);

		var cells = rowsGA1.selectAll("td")
			.data(function(row) {
				return columns.map(function(column) {
					return {column: column, value: row.data};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					
					if(i==0)
						return d.value[3];
					else if(i==1)
						return d.value[0];
					else if(i==2) return d.value[1];
					
					//return d.value[i]; 
				})
			.attr("style", "text-align:center")
			.attr("width",function(d,i){if(i==0) return "10%"; else return "45%";});
		
		var globalAssocAtDiv2 = fieldGlobal.append("div")
						  .attr("id","globalAssocAtt2Div")
						  .attr("frame","void")
						  .style("margin-right","20px")
						  .style("margin-left","0px")
						  .style("position","relative")
						  .style("width","450px")
						  .style("height","200px")
						  .style("cellspacing",0)
						  .style("cellpading",0)
						  .style("border",0)
						  .style("float","left")
						  .style("overflow-x","scroll")
						  .style("overflow-y","scroll");	
						  
	globalAssocAtDiv2.append("p").attr("align","center").append("b").text("Attribute: "+newData.selAttrs[1].attributeName).style("font-size","20px");		
						
		var globalAssocAt2 = globalAssocAtDiv2.append("table")
					.attr("id","globalAssocAt2")
					.attr("class", "tablesorter")
					.attr("border-collapse","separate")
					.attr("border-spacing","10 10")
					.attr("border","1px solid black")
					.attr("frame","void")
					.style("margin-right","20px")
					.style("margin-left","0px")
					.style("position","relative")
					.style("width","450px")
					.style("height","200px")
					.style("cellspacing",0)
					.style("cellpading",0)
					.style("border",0)
					.style("float","left");

				
					
	var GlobtheadA2 = globalAssocAt2.append("thead");
	var GlobbodyA2 = globalAssocAt2.append("tbody")
					.attr("style", "height: 50px; overflow-y: scroll; overflow-x: scroll; ");

		GlobtheadA2.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
			.text(function(column) { return column; })
			.attr("style", "text-align:center");	
			
			var rowsGA2 = GlobbodyA2.selectAll("tr")
			.data(newData.attAssoc2)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			.style("cursor", "pointer")
			.on('mouseover', function(d,i){
				d3.select(this)
			.style('background-color', 'lightgray');
			})
			.on('mouseout', function(d,i){
				if(!(d3.select(this).attr('id')=='selected')){
				d3.select(this)
					.style('background-color', 'white');}
					})
					.on('click',globalAssoc);

		var cells = rowsGA2.selectAll("td")
			.data(function(row) {
				return columns.map(function(column) {
					return {column: column, value: row.data};
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.html(function(d,i) { 
					
					if(i==0)
						return d.value[3];
					else if(i==1)
						return d.value[0];
					else if(i==2) return d.value[1];
					
					//return d.value[i]; 
				})
			.attr("style", "text-align:center")
			.attr("width",function(d,i){if(i==0) return "10%"; else return "45%";});

			
			/*var exButton = d3.select("#heatmap").append("button").attr("type","button")
										.attr("id","exButtA")
										.attr("onclick","exportFunctionA()")
										.style("margin-bottom","20px")
										.style("float","left")
										.style("width","150px")
										.text('Export redescriptions');*/
			
			var informCont = d3.select("#heatmap").append("div").attr("id","remRedContainerA").attr("class","filterInput").style("margin-left","0px").style("margin-right","10px")
																	.style("margin-top","30px").style("position","relative").style("float","left").style("width","570px");
									 informCont.append("button").attr("type","button")
										.attr("id","exButtA")
										.attr("onclick","exportFunctionA()")
										.style("margin-bottom","20px")
										.style("float","left")
										.style("width","150px")
										.text('Export redescriptions');
									informCont.append("p").text('Max overlap (el.)').style("width","110px").style("position","relative").style("float","left");
			var textElementOverlap = informCont.append("input").attr("type","").attr("value",0).attr("id","eoverIn")
																.style("margin-left","0px").style("width","25px").style("position","relative").style("float","left");
			//.append('input').attr({type: 'input type you want', value: 'your values that can be called with a function'})
									informCont.append("p").text('Max overlap (at.)').style("width","110px").style("position","relative").style("float","left").style("margin-left","10px");
			var textAttributeOverlap = informCont.append("input").attr("type","").attr("value",0).attr("id","atoverIn")
																.style("margin-left","0px").style("width","25px").style("position","relative").style("float","left");							
										
		    var RMRedButton = informCont.append("button").attr("type","button")
									.attr("id","RmRedButtA")
									.attr("onclick","filterRedsNewA()")
									.style("width","120px")
									.style("margin-left","20px")
									.text('Filter redundant');
			
			var progBar=d3.select("#heatmap").append("img").attr("src","ajax-loader.gif").attr("id","loader").style("visibility","hidden");
			/*attr("id","barContainer").attr("class","w3-progress-container w3-light-blue").style("visibility","hidden").style("margin-bottom","10px");	
						progBar.append("div").attr("id","bar").attr("class","w3-progressbar w3-blue").style("width","0%").style("margin-bottom","10px").style("opacity","0.5").style("visibility","hidden");
						progBar.append("p").attr("id","barText").style("margin-left","50px").style("font-weight","bold").text("0% complete...");
		*/
		GlScope=scope;
		//element.bind('RMRedButton',filterRedes);
		//scope.filterRedsc=filterReds;
	
		//Mouse click function (define a lot of things)
	function mclick(d,i) { 
		//console.log("mclick on redescription: "+newData.redescriptions[i].id);
		//console.log("url: "+attrs.redinfoUrl);
		d3.selectAll('#selected').style('background-color', 'white');
		d3.selectAll('#selected').attr("id",null);
		d3.select(this).attr("id","selected");
		var options = {url: attrs.redinfoUrl,
               method: 'GET', 
               params: {
               id: JSON.stringify(newData.redescriptions[i].id)
                        }
                          };
		scope.getRedescriptionInfo(options);
		//console.log(scope.RedescriptionInfo);
	};
	
	console.log('On click heatmap');
	console.log(newData);
	
	/*var tables = d3.select("#heatmap").append("div").attr("id","glAt1Tab");
	tables.style("position","relative").style("margin-bottom","5px").style("height","100px").style("overflow-y","scroll").style("width","50px").style("float","left");
	tables.append("table").attr("id","glAt1").attr("class","tablesorter").attr("border-collapse","separate").attr("border-spacing","10 10").attr("border","1px solid black").style("position","relative")
	.style("height","100px").style("margin-left","0px");*/

		
		var columns=["Select","Left query","Right query","J","support","p-value"];
		var data=[];

		var table = d3.select("#heatmap").append("div").attr("id","redTableDiv")
		.style("position","relative")
		.style("margin-bottom","20px")
		.style("height","200px")
		.style("max-height","200px")
		.style("overflow-y","scroll")
		.style("width","1000px")
		.append("table")
		.attr("class","tablesorter")
		.attr("id","redTable")
		.attr("border-collapse","separate")
		.attr("border-spacing","10 10")
		.attr("border","1px solid black")
		.attr("style", "position: relative;  height: 200px; margin-left: 0px;")
				//.attr("cellpadding","10")
				//.attr("cellspacing","100")
			thead = table.append("thead"),
			tbody = table.append("tbody");

		// append the header row
		thead.append("tr")
			.selectAll("th")
			.data(columns)
			.enter()
			.append("th")
				.text(function(column) { return column; })
				.style("cursor", "pointer");
			//.attr("align","center");

			//console.log("new Data in table");
			//console.log(newData);
			
		// create a row for each object in the data
		var rows = tbody.selectAll("tr")
			.data(newData.redescriptions)
			.enter()
			.append("tr")
			.attr("class","spaceunder")
			.attr("border", "solid")
			.attr("border-width", "1px")
			.style("cursor", "pointer")
			.on('mouseover', function(d,i){
				d3.select(this)
			.style('background-color', 'lightgray');
			})
			.on('mouseout', function(d,i){
				if(!(d3.select(this).attr('id')=='selected')){
				d3.select(this)
					.style('background-color', 'white');}
					})
			//.on('click',mclick);
			
		
		// create a cell in each row for each column
		var idT;
		
		var cells = rows.selectAll("td")
			.data(function(row) {
				//console.log("row");
				//console.log(row);
				return columns.map(function(column) {
					//console.log(row.data[0])
					//console.log(column);
					if(column=="Left query")
						return {column: column, value: row.data[0], id: row.id};
					else if(column=="Right query")
						return {column: column, value: row.data[1], id: row.id};
					else if(column=="J"){
						//console.log("JS: "+row.data[2]);
						//console.log("JS round: "+row.data[2].toPrecision(2));
						return {column: column, value: row.data[2].toPrecision(2), id: row.id};
					}
					else if(column=="support")
						return {column: column, value: row.data[3], id: row.id};
					else if(column=="p-value")
						return {column: column, value: row.data[4].toPrecision(2), id: row.id};
					else if(column=="Select"){
						//cells.append("input").attr("type","checkbox").attr("id","0");
						//<input type="checkbox"  id="h09_1" name="h09_1" checked class="rounded"/>
						return {column: column, value: "<input type=\"checkbox\"  id="+row.id+"A"+" class=\"rounded\"/>", id: row.id };
					}
				});
			})
			.enter()
			.append("td")
			.attr("style", "font-family: Courier") // sets the font style
			.attr("align",function(d,i){
					if(i==0 || i==1)
						return "left";
					else return "center";
			}
				)
			.attr("width",function(d,i){
				if(i==1 || i==2)
					return "30%";
				else
					return "5%";
				
			})
			/*.attr("id",function(d,i){
				
				if(i==0){
					//console.log("d");
				//console.log(d);
					var tArr=d.value.split('=');
					//console.log("tArr");
				//	console.log(tArr);
					 var num= tArr[2].split(" ");
					idT=parseInt(num[0]);
				//	console.log(idT);
					return idT;
				}
				return idT;
				
			})*/
				.html(function(d,i) { 
					return d.value; 
				})
				.on('click',function(d,i){ if(i>0){ console.log(d); d3.selectAll('#selected').style('background-color', 'white');
		d3.selectAll('#selected').attr("id",null);
		d3.select(this.parentNode).attr("id","selected");
		var options = {url: attrs.redinfoUrl,
               method: 'GET', 
               params: {
               id: JSON.stringify(d.id)
                        }
                          };
		scope.getRedescriptionInfo(options);} else{
			//	var contained=0; 
				
				d3.selectAll("input").each(function(d1){ 
						if(d3.select(this).attr("type") == "checkbox" && d3.select(this).attr("id") == d.id+"A"){ 
							console.log(d3.select(this).node().checked);
							if(d3.select(this).node().checked == false){
								for(var k=0;k<scope.$parent.checkedOrder.co.length;k++) 
									if(scope.$parent.checkedOrder.co[k]==d.id){  
										scope.$parent.checkedOrder.co.splice(k, 1);
									}
							}
							else{
								var contained=0;
								for(var k=0;k<scope.$parent.checkedOrder.co.length;k++) 
									if(scope.$parent.checkedOrder.co[k]==d.id){  
										contained=1;
									}
									if(contained==0){
										//console.log('adding to array');
										scope.$parent.checkedOrder.co.push(d.id);
										//console.log(scope.$parent.checkedOrder.co);
									}
									console.log('contained: '+contained);
							}
						}
							});
				
				console.log(scope.$parent.checkedOrder.co);
				/*for(var k=0;k<scope.$parent.checkedOrder.co.length;k++) 
						if(scope.$parent.checkedOrder.co[k]==d.id){ 
									contained=1; 
									scope.$parent.checkedOrder.co.splice(k, 1); 
									console.log("checkbox unchecked!");
												console.log(scope.$parent.checkedOrder.co); break;}  
													if(contained==0){
														scope.$parent.checkedOrder.co.push(d.id); 
														console.log("checkbox checked!"); 
														console.log(scope.$parent.checkedOrder.co);}*/
																}});
		
		scope.stFunc = function(){
				console.log('Function executed');
		 }

		 var divCont = d3.select("#heatmap").append("div").attr("id","progContA").style("width","800px").style("text-align","left");
		 
		 var STButton = divCont.append("button").attr("type","button")
									.attr("id","STButton")
									.attr("onclick","relateRedsA()")
									.style("width","160px")
									.style("margin-left","20px")
									.style("display","inline-block")
									.text('Relate redescriptions');
					
					divCont.append("p").style("margin-right","0px").style("margin-left","20px").style("display","inline-block").append("text").text("Minimal weight: ");
					divCont.append("input").attr("type","text").attr("id","jacConst").attr("value","0.5").style("width","50px").style("margin-left","2px").style("display","inline-block");
					divCont.append("p").style("margin-right","0px").style("margin-left","20px").style("display","inline-block").append("text").text("Num paths: ");
					divCont.append("input").attr("type","text").attr("id","nPaths").attr("value","2").style("width","50px").style("margin-left","2px").style("display","inline-block");
					divCont.append("p").attr("id","graphProg").style("width","200px").style("margin-right","0px").style("margin-left","20px").style("display","inline-block");
		
		//return table;
	
	
	//$(document).ready(function() 
   // { 
        $("#redTable").tablesorter(); 
		 element[0].scrollIntoView(true);
   // }); 
	globalVarA=newData;
	  },true); 
	  
    }}	
});
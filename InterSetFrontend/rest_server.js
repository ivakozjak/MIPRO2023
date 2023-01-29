var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database('data/TradeRedescriptions.db');
//var db = new sqlite3.Database('data/DBLPRedescriptions.db');
var db = new sqlite3.Database('data/PhenotypeRedescriptions.db');
var express = require('express');
var restapi = express();
//var bodyParser = require('body-parser')
 //restapi.use(bodyParser.json({ limit: '1gb' }))
var cors = require('cors');
var url = require('url');
var _ = require('underscore')

restapi.use(cors());

var bodyParser = require('body-parser')
restapi.use(bodyParser.urlencoded({ extended: false, limit: '1gb' }));
restapi.use(bodyParser.json({limit: '1gb'}))


restapi.post('/somData',function(req,res){
		console.log("parameters: ");
		//console.log(req.body);
		//console.log(res);
		console.log(req.body.somDat);
		var userId = JSON.parse(req.body.userId);
		var elementCoverage = JSON.parse(req.body.elCov);
		var somClusters = JSON.parse(req.body.somDat);
		var numRows = JSON.parse(req.body.numRows);
		var numCols = JSON.parse(req.body.numCols);
		var selReds = JSON.parse(req.body.selReds);
		console.log(elementCoverage[0]);
		//console.log(req.body.elCov[0]);
		console.log(req.body.numRows); console.log(req.body.numCols);
		
		/*console.log(somClusters[0].neighbors.default)
		console.log(somClusters[1].neighbors.default)
		console.log(somClusters[2].neighbors.default)
		console.log(somClusters[3].neighbors.default)*/
		
		//for(var i=0;i<somClusters.length;i++)
		//	if(somClusters[i].neighbors)
		
		//console.log(elementCoverage[0]);
		
		var test=0;
		
		if(test==1)
			res.end();
		else{
		
		db.serialize(function() {
			db.run("begin transaction");
			db.run("DELETE FROM SOMClusters where userId = "+userId);
			db.run("DELETE FROM SomDimensions where userId = "+userId);
			db.run("DELETE FROM ElementCoverage where userId = "+userId);
			db.run("DELETE FROM SelectedRedescriptionsElem where userId = "+userId);
 
			var stmt = db.prepare("INSERT INTO SomDimensions VALUES (?,?,?)");
						stmt.run(parseInt(userId),parseInt(numRows),parseInt(numCols));

				   /* db.run("BEGIN TRANSACTION");
						function callback(somClusters) {
								somClusters.forEach(function(cluster) {
									console.log("cluster in callback: "+cluster);
									var n= cluster.neighbors.default;
									if( typeof n !== 'undefined')
										for(var j=0;j<somClusters[i].neighbors.default.length;j++){
											console.log('writing to som clusters!');
											db.run("INSERT INTO SOMClusters VALUES (?,?)", [i,parseInt(somClusters[i].neighbors.default[j].id)]);
											//stmt.run(i,parseInt(somClusters[i].neighbors.default[j].id));
								}
						});
					}
					db.run("END");	*/	
						
				 stmt = db.prepare("INSERT INTO SOMClusters VALUES (?,?,?)")		
				for (var i = 0; i < somClusters.length; i++) {
					var n= somClusters[i].neighbors.default;
					if( typeof n === 'undefined')
						continue;
					for(var j=0;j<somClusters[i].neighbors.default.length;j++){
						stmt.run(parseInt(userId),parseInt(somClusters[i].neighbors.default[j].id),i+1);
					}
				}

			 stmt = db.prepare("INSERT INTO ElementCoverage VALUES (?,?,?)")
			for (var i = 0; i < elementCoverage.length; i++) {
						stmt.run(parseInt(userId),parseInt(elementCoverage[i].name),parseInt(elementCoverage[i].count));
				}
			
			 stmt = db.prepare("INSERT INTO SelectedRedescriptionsElem VALUES (?,?)")
			 for (var i = 0; i < selReds.length; i++) {
						stmt.run(parseInt(userId),parseInt(selReds[i]));
				}
				
			stmt.finalize();
			db.run("commit");
        });
		res.end();
		}
});


restapi.post('/somDataBack',function(req,res){
		console.log("parameters: ");
		//console.log(req.body);
		//console.log(res);
		console.log(req.body.somDat);
		var elementCoverage = JSON.parse(req.body.elCov);
		var somClusters = JSON.parse(req.body.somDat);
		var numRows = JSON.parse(req.body.numRows);
		var numCols = JSON.parse(req.body.numCols);
		var selReds = JSON.parse(req.body.selReds);
		console.log(elementCoverage[0]);
		//console.log(req.body.elCov[0]);
		console.log(req.body.numRows); console.log(req.body.numCols);
		
		/*console.log(somClusters[0].neighbors.default)
		console.log(somClusters[1].neighbors.default)
		console.log(somClusters[2].neighbors.default)
		console.log(somClusters[3].neighbors.default)*/
		
		//for(var i=0;i<somClusters.length;i++)
		//	if(somClusters[i].neighbors)
		
		//console.log(elementCoverage[0]);
		
		var test=0;
		
		if(test==1)
			res.end();
		else{
		
		db.serialize(function() {
			db.run("begin transaction");
			db.run("DELETE FROM SOMClustersBack");
			db.run("DELETE FROM SomDimensionsBack");
			db.run("DELETE FROM ElementCoverageBack");
			db.run("DELETE FROM SelectedRedescriptionsElemBack");
 
			var stmt = db.prepare("INSERT INTO SomDimensionsBack VALUES (?,?)");
						stmt.run(parseInt(numRows),parseInt(numCols));

				   /* db.run("BEGIN TRANSACTION");
						function callback(somClusters) {
								somClusters.forEach(function(cluster) {
									console.log("cluster in callback: "+cluster);
									var n= cluster.neighbors.default;
									if( typeof n !== 'undefined')
										for(var j=0;j<somClusters[i].neighbors.default.length;j++){
											console.log('writing to som clusters!');
											db.run("INSERT INTO SOMClusters VALUES (?,?)", [i,parseInt(somClusters[i].neighbors.default[j].id)]);
											//stmt.run(i,parseInt(somClusters[i].neighbors.default[j].id));
								}
						});
					}
					db.run("END");	*/	
						
				 stmt = db.prepare("INSERT INTO SOMClustersBack VALUES (?,?)")		
				for (var i = 0; i < somClusters.length; i++) {
					var n= somClusters[i].neighbors.default;
					if( typeof n === 'undefined')
						continue;
					for(var j=0;j<somClusters[i].neighbors.default.length;j++){
						stmt.run(parseInt(somClusters[i].neighbors.default[j].id),i+1);
					}
				}

			 stmt = db.prepare("INSERT INTO ElementCoverageBack VALUES (?,?)")
			for (var i = 0; i < elementCoverage.length; i++) {
						stmt.run(parseInt(elementCoverage[i].name),parseInt(elementCoverage[i].count));
				}
			
			 stmt = db.prepare("INSERT INTO SelectedRedescriptionsElemBack VALUES (?)")
			 for (var i = 0; i < selReds.length; i++) {
						stmt.run(parseInt(selReds[i]));
				}
				
			stmt.finalize();
			db.run("commit");
        });
		res.end();
		}
});


restapi.get('/somData',function(req,res){
		console.log("GET Som data called! ");
		var tmp=new Array();
		return res.json({'somData':tmp});
		
});


restapi.post('/login',function(req,res){
	
	var userInfo = JSON.parse(req.body.userInfo);
	
	console.log(userInfo['username']);
	console.log(userInfo['password']);
	
	var userInfoQuery = 'SELECT userId, userName from UserTable where userName = '+'\''+userInfo['username']+'\''+' AND password = '+'\''+userInfo['password']+'\'';
	//+userInfo['username'] +
	//'AND password = '+userInfo['password'];
	
	 db.all(userInfoQuery, function(err, rowsUIEl) {
			console.log(rowsUIEl);
			var tmp = JSON.stringify({
						'userInfo': rowsUIEl
                     });
			
			console.log('tmp');
			console.log(tmp);
					 
            res.json({'userInfo': rowsUIEl});
	 })
	 
});

restapi.post('/checkRegInfo',function(req,res){
	
	var userInfo = JSON.parse(req.body.userInfo);
	
	console.log(userInfo['username']);
	console.log(userInfo['password']);
	
	var userInfoQuery = 'SELECT count(*) as count from UserTable where userName = '+'\''+userInfo['username']+'\'';
	var userMaxId = 'SELECT MAX(userId) as maxId from UserTable';
	//+userInfo['username'] +
	//'AND password = '+userInfo['password'];
	
	db.all(userInfoQuery, function(err, count) {
		db.all(userMaxId, function(err, maxId) {
				console.log(maxId);
				console.log(count);
            res.json({
						count,
						maxId})
				});	
						});
				
	
	
	 /*db.all(userInfoQuery, function(err, rowsUIEl) {
			console.log(rowsUIEl);
			var tmp = JSON.stringify({
						'userInfo': rowsUIEl
                     });
			
			console.log('tmp');
			console.log(tmp);
					 
            res.json({'userInfo': rowsUIEl});
	 })*/
	 
});

restapi.post('/register',function(req,res){
	
	var userInfo = JSON.parse(req.body.userInfo);
	
	console.log(userInfo['username']);
	console.log(userInfo['password']);
	console.log(req.body.maxUserId);
	var maxuid = JSON.parse(req.body.maxUserId);
	
	
	db.serialize(function() {
			db.run("begin transaction");

				 stmt = db.prepare("INSERT INTO UserTable VALUES (?,?,?)")		
				 stmt.run((maxuid+1),userInfo['username'],userInfo['password']);
				
				
			stmt.finalize();
			db.run("commit");
        });
		res.end();
	 
});

restapi.get('/redescriptionElement',function(req,res){
	var redInfo = 'SELECT redescriptionID, elemetID from RedescriptionElementTable';
	
	 db.all(redInfo, function(err, rowsRedEl) {
				
            res.json({
						'redElems': rowsRedEl.map(function (a){
							return {'id':a.redescriptionID,'elementID':a.elemetID}})
                     });	
	 })
	
});


restapi.get('/redundancyAll',function(req,res){
	
	var redInfo= 'SELECT redescriptionID, elemetID FROM RedescriptionElementTable';
	
	var attInfo= 'SELECT DISTINCT redescriptionID, attributeID FROM RedescriptionAttributeTable';

	console.log("redundancyAll called!");
	
	 db.all(redInfo, function(err, rowsRedEl) {
				//console.log(rowsRedescriptions);
				db.all(attInfo, function(err,rowsRedAt){
										
					//console.log(rowsAttributeDescriptions);
            res.json({
                      'redAttr': rowsRedAt.map(function(c){return {'id': c.redescriptionID, 'attributeID': c.attributeID}}),
						'redElems': rowsRedEl.map(function (a){
							return {'id':a.redescriptionID,'elementID':a.elemetID}})
                     });	
			});
	 })
});


restapi.get('/redundancySupp',function(req,res){
	
	var redInfo= 'SELECT redescriptionID, elemetID FROM RedescriptionElementTable';

	//console.log("redundancySupp called!");
	
	 db.all(redInfo, function(err, rowsRedEl) {
				//console.log(rowsRedescriptions);
					//console.log(rowsAttributeDescriptions);
            res.json({
						'redElems': rowsRedEl.map(function (a){
							return {'id':a.redescriptionID,'elementID':a.elemetID}})
                     });	
	 })
});

restapi.get('/redundancyAttrs',function(req,res){
	
	var redInfo= 'SELECT redescriptionID, attributeID FROM RedescriptionAttributeTable';

	//console.log("redundancySupp called!");
	
	 db.all(redInfo, function(err, rowsRedAt) {
				//console.log(rowsRedescriptions);
					//console.log(rowsAttributeDescriptions);
            res.json({
						'redAttrs': rowsRedAt.map(function (a){
							return {'id':a.redescriptionID,'attributeID':a.attributeID}})
                     });	
	 })
});


restapi.get('/redundancyinfo',function(req,res){

	if(req.query.ids==null)
		return;
	
console.log('rest called!');
console.log(req.query.ids);
console.log(req.query.ids[0]+" "+req.query.ids[1]+" "+req.query.ids[2]);

var parsed = JSON.parse(req.query.ids);

var arr = [];

for(var x in parsed){
  arr.push(parsed[x]);
}

//console.log(parsed[0]+" "+parsed[1]+" "+parsed[2]);
//console.log(arr[0].value+" "+arr[1].value+" "+arr[2].value);
	
	var redInfo= 'SELECT redescriptionID, elemetID FROM RedescriptionElementTable WHERE redescriptionID=';
	
	for(i=0;i<arr.length;i++){
		redInfo=redInfo+(arr[i].value);
		if(i+1<arr.length)
			redInfo=redInfo+" OR redescriptionID=";
	}
	
	var attInfo= 'SELECT DISTINCT redescriptionID, attributeID FROM RedescriptionAttributeTable WHERE redescriptionID=';
	
	for(i=0;i<arr.length;i++){
		attInfo=attInfo+(arr[i].value);
		if(i+1<arr.length)
			attInfo=attInfo+" OR redescriptionID=";
	}
	
	//console.log("query: ");
	//console.log(redInfo);
	console.log("redundancyInfo called!");
	
	 db.all(redInfo, function(err, rowsRedEl) {
				//console.log(rowsRedescriptions);
				db.all(attInfo, function(err,rowsRedAt){
										
					//console.log(rowsAttributeDescriptions);
            res.json({
                      'redAttr': rowsRedAt.map(function(c){return {'id': c.redescriptionID, 'attributeID': c.attributeID}}),
						'redElems': rowsRedEl.map(function (a){
							return {'id':a.redescriptionID,'elementID':a.elemetID}})
                     });	
			});
	 })
});


restapi.get('/redundancyinfo1',function(req,res){
	
	if(req.query.ids==null)
		return;
	
	var parsed = JSON.parse(req.query.ids);

var arr = [];

for(var x in parsed){
  arr.push(parsed[x]);
}
	
	var redInfo= 'SELECT redescriptionID, elemetID FROM RedescriptionElementTable WHERE redescriptionID=';
	
	for(i=0;i<arr.length;i++){
		redInfo=redInfo+arr[i].value;
		if(i+1<arr.length)
			redInfo=redInfo+" OR redescriptionID=";
	}
	
	var attInfo= 'SELECT DISTINCT redescriptionID, attributeID FROM RedescriptionAttributeTable WHERE redescriptionID=';
	
	for(i=0;i<arr.length;i++){
		attInfo=attInfo+(arr[i].value);
		if(i+1<arr.length)
			attInfo=attInfo+" OR redescriptionID=";
	}
	
	 db.all(redInfo, function(err, rowsRedEl) {
				//console.log(rowsRedescriptions);
				db.all(attInfo, function(err,rowsRedAt){
										
					//console.log(rowsAttributeDescriptions);
            res.json({
                      'redAttr': rowsRedAt.map(function(c){return {'id': c.redescriptionID, 'attributeID': c.attributeID}}),
						'redElems': rowsRedEl.map(function (a){
							return {'id':a.redescriptionID,'elementID':a.elemetID};})
                     });	
			});
	 });
	
});



restapi.get('/redescriptions', function(req, res){


		if(req.query.id==null)
			req.query.id=1;

      var redescriptionsInSOMCluster = 'SELECT * FROM RedescriptionTable as rt '+ 
										'WHERE rt.redescriptionID IN '+
										'(SELECT distinct redescriptionID FROM RedescriptionElementTable '+
										'WHERE elemetID IN (SELECT elementID FROM '+
										'SOMClusters WHERE SOMClusterID = '+req.query.id+'))';
	  
      var elementsInSOMCluster = 'SELECT elementID, elementDescription '+
						  'FROM ElementTable WHERE '+
						  'elementID IN '+
						  '(SELECT elementID '+
                          'FROM SOMClusters '+
						  'WHERE SOMClusterID ='+req.query.id+')';
						  
		//var attributeDescriptionsInSOMCluster = 'SELECT attributeDescription FROM attributeTable '+
		//								'WHERE attributeID IN (SELECT attributeID FROM RedescriptionAttributeTable WHERE '+
		//								'redescriptionID IN ( '+
		//							    'SELECT redescriptionID FROM RedescriptionTable '+ 
		//								'WHERE redescriptionID IN '+
		//								'(SELECT distinct redescriptionID FROM RedescriptionElementTable '+
		//								'WHERE elemetID IN (SELECT elementID FROM '+
		//								'SOMClusters WHERE SOMClusterID = '+req.query.id+')))';

		var attributeDescriptionsInSOMCluster = ''+
										'SELECT ra.attributeID, count(ra.attributeID) as count, at.attributeDescription '+ 
										'FROM attributeTable as at, RedescriptionAttributeTable as ra '+
										'WHERE redescriptionID IN (SELECT redescriptionID FROM RedescriptionTable '+ 
										'WHERE redescriptionID IN '+
										'(SELECT distinct redescriptionID FROM RedescriptionElementTable '+
										'WHERE elemetID IN (SELECT elementID FROM '+
										'SOMClusters WHERE SOMClusterID = '+req.query.id+')))'+
										'AND ra.attributeID = at.attributeID GROUP BY ra.attributeID';
					
		//console.log("rest_server attribute query: ");
		//console.log(attributeDescriptionsInSOMCluster);
      db.all(elementsInSOMCluster, function(err, rowsElements){
			//console.log(rowsElements);
        db.all(redescriptionsInSOMCluster, function(err, rowsRedescriptions) {
				//console.log(rowsRedescriptions);
				db.all(attributeDescriptionsInSOMCluster, function(err,rowsAttributeDescriptions){
					//console.log(rowsAttributeDescriptions);
            res.json({
                      'somElements': rowsElements.map(function(c){return {'id': c.elementID, 'name': c.elementDescription}}),
                      'redescriptions': rowsRedescriptions.map(function(p){
						  var tmpArr=new Array(5);
						  tmpArr[0]=p.redescriptionLR; tmpArr[1]=p.redescriptionRR;
						  tmpArr[2]=p.redescriptionJS; tmpArr[3]=p.redescriptionSupport;
						  tmpArr[4]=p.redescriptionPval; //tmpArr[5]=p.redescriptionAEJ;
						  //tmpArr[6]=p.redescriptionAAJ;
						  return {'id': p.redescriptionID, 'data': tmpArr};}),
						'attributeDescriptions': rowsAttributeDescriptions.map(function (a){
							var tmpArr=new Array(2);
							tmpArr[0]=a.count; tmpArr[1]=a.attributeDescription;
							return {'id':a.attributeID,'data':tmpArr};})
                     });
				});
          });
	  });
});


restapi.get('/redescriptionsSel', function(req, res){


		if(req.query.id==null)
			req.query.id=1;

		var userId = JSON.parse(req.query.userId);
		
      var redescriptionsInSOMCluster = 'SELECT * FROM RedescriptionTable as rt '+ 
										'WHERE rt.redescriptionID IN '+
										'(SELECT distinct redescriptionID FROM RedescriptionElementTable '+
										'WHERE elemetID IN (SELECT elementID FROM '+
										'SOMClusters WHERE SOMClusterID = '+req.query.id+' AND userId = '+userId+') AND redescriptionID IN (SELECT redescriptionID FROM SelectedRedescriptionsElem WHERE userId = '+userId+'))';
	  
      var elementsInSOMCluster = 'SELECT elementID, elementDescription '+
						  'FROM ElementTable WHERE '+
						  'elementID IN '+
						  '(SELECT elementID '+
                          'FROM SOMClusters '+
						  'WHERE SOMClusterID ='+req.query.id+' AND userId = '+userId+')';
						  
		var attributeDescriptionsInSOMCluster = ''+
										'SELECT ra.attributeID, count(ra.attributeID) as count, at.attributeDescription '+ 
										'FROM attributeTable as at, RedescriptionAttributeTable as ra '+
										'WHERE redescriptionID IN (SELECT redescriptionID FROM RedescriptionTable '+ 
										'WHERE redescriptionID IN '+
										'(SELECT distinct redescriptionID FROM RedescriptionElementTable '+
										'WHERE elemetID IN (SELECT elementID FROM '+
										'SOMClusters WHERE SOMClusterID = '+req.query.id+' AND userId = '+userId+') AND redescriptionID IN (SELECT redescriptionID FROM SelectedRedescriptionsElem WHERE userId = '+userId+')))'+
										'AND ra.attributeID = at.attributeID GROUP BY ra.attributeID';
					
      db.all(elementsInSOMCluster, function(err, rowsElements){
			//console.log(rowsElements);
        db.all(redescriptionsInSOMCluster, function(err, rowsRedescriptions) {
				//console.log(rowsRedescriptions);
				db.all(attributeDescriptionsInSOMCluster, function(err,rowsAttributeDescriptions){
					//console.log(rowsAttributeDescriptions);
            res.json({
                      'somElements': rowsElements.map(function(c){return {'id': c.elementID, 'name': c.elementDescription}}),
                      'redescriptions': rowsRedescriptions.map(function(p){
						  var tmpArr=new Array(5);
						  tmpArr[0]=p.redescriptionLR; tmpArr[1]=p.redescriptionRR;
						  tmpArr[2]=p.redescriptionJS; tmpArr[3]=p.redescriptionSupport;
						  tmpArr[4]=p.redescriptionPval; //tmpArr[5]=p.redescriptionAEJ;
						  //tmpArr[6]=p.redescriptionAAJ;
						  return {'id': p.redescriptionID, 'data': tmpArr};}),
						'attributeDescriptions': rowsAttributeDescriptions.map(function (a){
							var tmpArr=new Array(2);
							tmpArr[0]=a.count; tmpArr[1]=a.attributeDescription;
							return {'id':a.attributeID,'data':tmpArr};})
                     });
				});
          });
	  });
});


restapi.get('/redescriptionsBack', function(req, res){


		if(req.query.id==null)
			req.query.id=1;

      var redescriptionsInSOMCluster = 'SELECT * FROM RedescriptionTable as rt '+ 
										'WHERE rt.redescriptionID IN '+
										'(SELECT distinct redescriptionID FROM RedescriptionElementTable '+
										'WHERE elemetID IN (SELECT elementID FROM '+
										'SOMClustersBack WHERE SOMClusterID = '+req.query.id+') AND redescriptionID IN (SELECT redescriptionID FROM SelectedRedescriptionsElemBack))';
	  
      var elementsInSOMCluster = 'SELECT elementID, elementDescription '+
						  'FROM ElementTable WHERE '+
						  'elementID IN '+
						  '(SELECT elementID '+
                          'FROM SOMClustersBack '+
						  'WHERE SOMClusterID ='+req.query.id+')';
						  
		var attributeDescriptionsInSOMCluster = ''+
										'SELECT ra.attributeID, count(ra.attributeID) as count, at.attributeDescription '+ 
										'FROM attributeTable as at, RedescriptionAttributeTable as ra '+
										'WHERE redescriptionID IN (SELECT redescriptionID FROM RedescriptionTable '+ 
										'WHERE redescriptionID IN '+
										'(SELECT distinct redescriptionID FROM RedescriptionElementTable '+
										'WHERE elemetID IN (SELECT elementID FROM '+
										'SOMClustersBack WHERE SOMClusterID = '+req.query.id+') AND redescriptionID IN (SELECT redescriptionID FROM SelectedRedescriptionsElemBack)))'+
										'AND ra.attributeID = at.attributeID GROUP BY ra.attributeID';
					
      db.all(elementsInSOMCluster, function(err, rowsElements){
			//console.log(rowsElements);
        db.all(redescriptionsInSOMCluster, function(err, rowsRedescriptions) {
				//console.log(rowsRedescriptions);
				db.all(attributeDescriptionsInSOMCluster, function(err,rowsAttributeDescriptions){
					//console.log(rowsAttributeDescriptions);
            res.json({
                      'somElements': rowsElements.map(function(c){return {'id': c.elementID, 'name': c.elementDescription}}),
                      'redescriptions': rowsRedescriptions.map(function(p){
						  var tmpArr=new Array(5);
						  tmpArr[0]=p.redescriptionLR; tmpArr[1]=p.redescriptionRR;
						  tmpArr[2]=p.redescriptionJS; tmpArr[3]=p.redescriptionSupport;
						  tmpArr[4]=p.redescriptionPval; //tmpArr[5]=p.redescriptionAEJ;
						  //tmpArr[6]=p.redescriptionAAJ;
						  return {'id': p.redescriptionID, 'data': tmpArr};}),
						'attributeDescriptions': rowsAttributeDescriptions.map(function (a){
							var tmpArr=new Array(2);
							tmpArr[0]=a.count; tmpArr[1]=a.attributeDescription;
							return {'id':a.attributeID,'data':tmpArr};})
                     });
				});
          });
	  });
});

restapi.get('/clusterinfo',function(req,res){
	
	var userId = JSON.parse(req.query.userId);
	
	var SOMClusterInfo = 'Select SOMClusterID, count(coverage.elementID) as clustSize, sum(redescriptionCount) as clustFrequency '+
						'FROM ElementCoverage as coverage, SOMClusters as sc '+
						'WHERE coverage.elementID = sc.elementID AND coverage.userId = sc.userId AND sc.userId = '+userId+' '+
						'GROUP BY sc.SOMClusterID'; 
	
	var StatisticsSOM = 'SELECT SOMClusterID, redescriptionID, count(elemetID) as clEl from RedescriptionElementTable, SOMClusters WHERE '+ 
				      'elemetID IN (SELECT elemetID FROM RedescriptionElementTable as r WHERE r.redescriptionID=redescriptionID) AND elementID=elemetID '+ 
					  'AND userId = '+userId+' '+'GROUP By SOMClusterID, redescriptionID';
		//console.log(StatisticsSOM);			  
	var StatisticsSupp = 'SELECT redescriptionID, count(elemetID) as suppEl from RedescriptionElementTable GROUP BY redescriptionID';

			
	var SOMDimensions = 'SELECT NumRows, NumColumns FROM SOMDimensions WHERE userId = '+userId;
	
			//console.log(SOMClusterInfo);
			db.all(SOMClusterInfo, function(err, rowsClustInfo) {
				//console.log('cluster info');
					db.all(SOMDimensions, function(err, rowsSOMDim) {
						//console.log('som dimensions');
						db.all(StatisticsSOM, function(err, rowsStatisticsSOM) {
						//	console.log('statistics');
							db.all(StatisticsSupp, function(err, rowsStatisticsSupp) {
								//console.log('supports');
            res.json({
                      'SOMInfo': rowsClustInfo.map(function(p){
						  var tmpArr=new Array(2);
						  tmpArr[0]=p.clustSize; tmpArr[1]=p.clustFrequency;
						  return {'id': p.SOMClusterID, 'data': tmpArr};}),
					   'SOMDim' : rowsSOMDim.map(function(d){
						   return {'nRows': d.NumRows, 'nColumns': d.NumColumns};}),
						'StatisticsSOM':rowsStatisticsSOM.map(function(d){
							 var tmpArr=new Array(2);
						  tmpArr[0]=d.redescriptionID; tmpArr[1]=d.clEl;
						return {'clusterID': d.SOMClusterID, 'data':tmpArr};}),
						'StatisticsSupp': rowsStatisticsSupp.map(function(d){
							return{'redescriptionID': d.redescriptionID, 'suppElCount': d.suppEl};})
							});
							});
                     });
				});
          });									
	});
	
	
restapi.get('/clusterinfosel',function(req,res){
	
	var userId = JSON.parse(req.query.userId);
	
	var SOMClusterInfo = 'Select SOMClusterID, count(coverage.elementID) as clustSize, sum(redescriptionCount) as clustFrequency '+
						'FROM ElementCoverage as coverage, SOMClusters as sc '+
						'WHERE coverage.elementID = sc.elementID AND coverage.userId = sc.userId AND coverage.userId = '+userId+' '+
						'GROUP BY sc.SOMClusterID'; 
	
	var StatisticsSOM = 'SELECT SOMClusterID, redescriptionID, count(elemetID) as clEl from RedescriptionElementTable, SOMClusters WHERE '+ 
				       'userId = '+userId+' '+'AND redescriptionID IN (SELECT redescriptionID FROM SelectedRedescriptionsElem WHERE userId = '+userId+') AND elementID=elemetID '+ 
					    'GROUP By SOMClusterID, redescriptionID';
		//console.log(StatisticsSOM);			  
	var StatisticsSupp = 'SELECT redescriptionID, count(elemetID) as suppEl from RedescriptionElementTable WHERE redescriptionID IN (SELECT redescriptionID FROM SelectedRedescriptionsElem where userId = '+userId+')  GROUP BY redescriptionID';

			
	var SOMDimensions = 'SELECT NumRows, NumColumns FROM SOMDimensions WHERE userId = '+userId;
	
			//console.log(SOMClusterInfo);
			db.all(SOMClusterInfo, function(err, rowsClustInfo) {
				//console.log('cluster info');
					db.all(SOMDimensions, function(err, rowsSOMDim) {
						//console.log('som dimensions');
						db.all(StatisticsSOM, function(err, rowsStatisticsSOM) {
						//	console.log('statistics');
							db.all(StatisticsSupp, function(err, rowsStatisticsSupp) {
								//console.log('supports');
            res.json({
                      'SOMInfo': rowsClustInfo.map(function(p){
						  var tmpArr=new Array(2);
						  tmpArr[0]=p.clustSize; tmpArr[1]=p.clustFrequency;
						  return {'id': p.SOMClusterID, 'data': tmpArr};}),
					   'SOMDim' : rowsSOMDim.map(function(d){
						   return {'nRows': d.NumRows, 'nColumns': d.NumColumns};}),
						'StatisticsSOM':rowsStatisticsSOM.map(function(d){
							 var tmpArr=new Array(2);
						  tmpArr[0]=d.redescriptionID; tmpArr[1]=d.clEl;
						return {'clusterID': d.SOMClusterID, 'data':tmpArr};}),
						'StatisticsSupp': rowsStatisticsSupp.map(function(d){
							return{'redescriptionID': d.redescriptionID, 'suppElCount': d.suppEl};})
							});
							});
                     });
				});
          });									
	});
	
	
	restapi.get('/clusterinfoBack',function(req,res){
	
	var SOMClusterInfo = 'Select SOMClusterID, count(coverage.elementID) as clustSize, sum(redescriptionCount) as clustFrequency '+
						'FROM ElementCoverageBack as coverage, SOMClustersBack as sc '+
						'WHERE coverage.elementID = sc.elementID '+
						'GROUP BY sc.SOMClusterID'; 
	
	var StatisticsSOM = 'SELECT SOMClusterID, redescriptionID, count(elemetID) as clEl from RedescriptionElementTable, SOMClustersBack WHERE '+ 
				      'redescriptionID IN (SELECT redescriptionID FROM SelectedRedescriptionsElemBack) AND elementID=elemetID '+ 
					  'GROUP By SOMClusterID, redescriptionID';
		//console.log(StatisticsSOM);			  
	var StatisticsSupp = 'SELECT redescriptionID, count(elemetID) as suppEl from RedescriptionElementTable where redescriptionID IN (SELECT redescriptionID FROM SelectedRedescriptionsElemBack) GROUP BY redescriptionID';

			
	var SOMDimensions = 'SELECT * FROM SOMDimensionsBack';
	
			//console.log(SOMClusterInfo);
			db.all(SOMClusterInfo, function(err, rowsClustInfo) {
				//console.log('cluster info');
					db.all(SOMDimensions, function(err, rowsSOMDim) {
						//console.log('som dimensions');
						db.all(StatisticsSOM, function(err, rowsStatisticsSOM) {
						//	console.log('statistics');
							db.all(StatisticsSupp, function(err, rowsStatisticsSupp) {
								//console.log('supports');
            res.json({
                      'SOMInfo': rowsClustInfo.map(function(p){
						  var tmpArr=new Array(2);
						  tmpArr[0]=p.clustSize; tmpArr[1]=p.clustFrequency;
						  return {'id': p.SOMClusterID, 'data': tmpArr};}),
					   'SOMDim' : rowsSOMDim.map(function(d){
						   return {'nRows': d.NumRows, 'nColumns': d.NumColumns};}),
						'StatisticsSOM':rowsStatisticsSOM.map(function(d){
							 var tmpArr=new Array(2);
						  tmpArr[0]=d.redescriptionID; tmpArr[1]=d.clEl;
						return {'clusterID': d.SOMClusterID, 'data':tmpArr};}),
						'StatisticsSupp': rowsStatisticsSupp.map(function(d){
							return{'redescriptionID': d.redescriptionID, 'suppElCount': d.suppEl};})
							});
						});
                     });
				});
          });									
	});
	

restapi.get('/redescriptionInfo', function(req, res){//try to optimize if possible, lots of data...
			
			if(req.query.id==null)
				req.query.id=0;
			
			var RedAttributeElemValuesAll = 'SELECT elementID, attributeID, Elementvalue FROM DataTable '+ 
								     'WHERE attributeID IN (select attributeID from RedescriptionAttributeTable '+
								     'WHERE redescriptionID='+req.query.id+');';
			
		    var RedAttributeIntervals = 'SELECT clauseID, attributeID, attributeMinValue, attributeMaxValue, negated FROM RedescriptionAttributeTable '+
										'WHERE redescriptionID = '+req.query.id;
		
			var RedSupport = 'SELECT elemetID as element FROM RedescriptionElementTable '+
					   'WHERE redescriptionID = '+req.query.id;
					   
			var RedSupportDescription = 'SELECT elementDescription FROM ElementTable '+
						'WHERE elementID IN( '+
					   'SELECT elemetID as element FROM RedescriptionElementTable '+
					   'WHERE redescriptionID = '+req.query.id+')';
			
			var AttrDes = 'SELECT * FROM AttributeTable '+
						  'WHERE attributeID IN (SELECT attributeID FROM RedescriptionAttributeTable '+
						  'WHERE redescriptionID = '+req.query.id+')';
						  
		    var Category = 'SELECT * FROM CategoryTable '+
			               'WHERE attributeID IN (SELECT attributeID FROM RedescriptionAttributeTable '+
						   'WHERE redescriptionID = '+req.query.id+')';
		
		//console.log(RedAttributeValues);
	  
	  db.all(RedAttributeElemValuesAll, function(err, rowsAttrValues) {
		db.all(RedAttributeIntervals, function(err, rowsAttrIntervals) {
			//console.log(rowsAttrIntervals)
			var count=-1;
			
			db.all(RedSupport,function(err,rowsRedSupp){	
			
				db.all(AttrDes,function(err,rowsAttrDesc){
					
					db.all(RedSupportDescription,function(err,rowsElemDesc){
						db.all(Category,function(err,rowsCategory){
				
					res.json({
							'RedAttributes': rowsAttrValues.map(function(p){
								var tmpArr=new Array(2);
							tmpArr[0]=p.elementID; tmpArr[1]=p.elementValue;
								return {'id': p.attributeID, 'data': tmpArr};}),
							'AttributeIntervals': rowsAttrIntervals.map(function(m){
								var tmpArr=new Array(5);
								 tmpArr[4]=m.clauseID;tmpArr[0]=m.attributeID;tmpArr[1]=m.attributeMinValue; tmpArr[2]=m.attributeMaxValue; tmpArr[3]=m.negated; 
								count=count+1;
								return {'id': count,'data':tmpArr}; //think about setting a new key
							}),
							'RedSupport': rowsRedSupp,
							'AttrDesc' : rowsAttrDesc.map(function(d){
								var tmpArr=new Array(3);
								tmpArr[0]=d.attributeName; tmpArr[1]=d.attributeDescription; tmpArr[2]=d.view;
								return {'id' : d.attributeID, 'data' : tmpArr};
									}),
							'ElemDesc' : rowsElemDesc,
							'CategoryDesc' : rowsCategory.map(function(d){
								var tmpArr=new Array(3);
								tmpArr[0]=d.attributeID; tmpArr[1]=d.categoryValue; tmpArr[2]=d.categoryName;
								return {'data' : tmpArr};
									})
						 });
					   });
					  });
					});
               });
          });	
	  }); 

});

restapi.get('/redescriptionSupport',function(req,res){
		
		if(req.query.id==null){
			req.query.id=0;
		}
		
		var RedSupport='SELECT elemetID FROM RedescriptionElementTable '+
					   'WHERE redescriptionID = '+req.query.id;
					   
		db.all(RedSupport, function(err, rowsRedSupp) {

            res.json({
                      "rowsRedSupp":rowsRedSupp
                     });
          });					   
	
	
});

restapi.get('/allRedescriptions', function(req, res){


	 //var redescriptions = 'SELECT * FROM RedescriptionTable'; 
	  var RedMeasures = 'PRAGMA table_info(RedescriptionTable)';
	  var MeasureNames = 'SELECT displayName, shortName from MeasuresNames';

     // db.all(redescriptions, function(err, rowsRedescriptions) {
	      db.all(RedMeasures, function(err, rowsMeasures) {
			  
			  var RedMinMax = 'SELECT ';
			  
			  for(i=3;i<rowsMeasures.length;i++)
				  if(i+1<rowsMeasures.length)
					RedMinMax= RedMinMax + 'max('+rowsMeasures[i].name+') as maxMeasure'+(i-2)+', '+'min('+rowsMeasures[i].name+') as minMeasure'+(i-2)+', ';
				else
					RedMinMax= RedMinMax + 'max('+rowsMeasures[i].name+') as maxMeasure'+(i-2)+', '+'min('+rowsMeasures[i].name+') as minMeasure'+(i-2)+' FROM RedescriptionTable';
				
				//console.log(RedMinMax);
				
				db.all(RedMinMax, function(err, rowsRedMinMax){
				
					db.all(MeasureNames, function(err, rowsMeasNames){
							
						var redNamesRenamed = 'SELECT ';
						
						for(i=0;i<rowsMeasures.length;i++){
							if(i==0)
								redNamesRenamed= redNamesRenamed + rowsMeasures[i].name +" as id"+", ";
							else if(i+1<rowsMeasures.length)
								redNamesRenamed= redNamesRenamed + rowsMeasures[i].name +" as col"+(i)+", "
							else
								redNamesRenamed= redNamesRenamed + rowsMeasures[i].name +" as col"+(i);
						}
						
						redNamesRenamed= redNamesRenamed + " FROM RedescriptionTable";
						//console.log(redNamesRenamed);
						
						db.all(redNamesRenamed, function(err, rowsRedRenamed){
							
							//console.log(rowsMeasNames);
            res.json({
                     /* 'redescriptions': rowsRedescriptions.map(function(p){
						  var tmpArr=new Array(7);
						  tmpArr[0]=p.redescriptionLR; tmpArr[1]=p.redescriptionRR;
						  tmpArr[2]=p.redescriptionJS; tmpArr[3]=p.redescriptionSupport;
						  tmpArr[4]=p.redescriptionPval; tmpArr[5]=p.redescriptionAEJ;
						  tmpArr[6]=p.redescriptionAAJ;
						  return {'id': p.redescriptionID, 'data': tmpArr};}),*/
						 // 'redescriptions1': rowsRedescriptions,
					  'redescriptions': rowsRedRenamed,
					  'measures': rowsMeasures,
					  'minMax' : rowsRedMinMax,
					  'measureNames': rowsMeasNames
                     });
					 
			/* res.json({
                      'redescriptions': rowsRedescriptions.map(function(p){
						  var tmpArr=new Array(8);
						  tmpArr[0]={"lr":p.redescriptionLR}; tmpArr[1]={"rr":p.redescriptionRR};
						  tmpArr[2]={"jaccard":p.redescriptionJS}; tmpArr[3]={"support":p.redescriptionSupport};
						  tmpArr[4]={"pval":p.redescriptionPval}; tmpArr[5]={"aej":p.redescriptionAEJ};
						  tmpArr[6]={"aaj":p.redescriptionAAJ};
						  return {'id': p.redescriptionID, 'data': tmpArr};}), 
                     });*/
						});
					});
				});
				});	 
         // });
});

restapi.post('/graphData',function(req,res){
	var data = JSON.parse(req.body.graph);
	//console.log(data);
	//console.log(data[0]);
	console.log(data[0].length);
	//create table if not exists TableName (col1 typ1, ..., colN typN)
	//drop table if exists TableName
	
		db.serialize(function() {
			db.run("begin transaction");
			db.run("DROP TABLE IF EXISTS GraphTable");
			db.run("CREATE TABLE IF NOT EXISTS GraphTable (redId1 Integer, redId2 Integer, overlap Float)");
 
				 stmt = db.prepare("INSERT INTO GraphTable VALUES (?,?,?)")		
				for (var i = 0; i < data.length; i++){
					for(var j=0;j<data[i].length;j++){
						//if(data[i][j]=='null' || parseFloat(data[i][j])==0 || parseFloat(data[i][j])==1)
						//	continue;
					stmt.run(parseInt(i),parseInt(j),parseFloat(data[i][j]));
					}
				if(i%100==0)
					console.log(i);
				}				
			stmt.finalize();
			db.run("commit");
        });	
	
	res.end();
});

restapi.post('/graphDataG',function(req,res){
	var data = JSON.parse(req.body.graph);
	var startIndex = parseInt(JSON.parse(req.body.start));
	//console.log(data);
	//console.log(data[0]);
	console.log('data size: '+data[0].length);
	console.log('start Index: '+startIndex);
	//create table if not exists TableName (col1 typ1, ..., colN typN)
	//drop table if exists TableName
	
	if (global.gc) {
    global.gc();
}
	
		db.serialize(function() {
			db.run("begin transaction");
			//db.run("DROP TABLE IF EXISTS GraphTable");
			db.run("CREATE TABLE IF NOT EXISTS GraphTable (redId1 Integer, redId2 Integer, overlap Float)");
 
				 stmt = db.prepare("INSERT INTO GraphTable VALUES (?,?,?)")		
				for (var i = 0; i < data.length; i++){
					for(var j=0;j<data[i].length;j++){
						//if(data[i][j]=='null' || parseFloat(data[i][j])==0 || parseFloat(data[i][j])==1)
						//	continue;
					stmt.run((parseInt(i))+startIndex,parseInt(j),parseFloat(data[i][j]));
					}
				/*if(i%100==0)
					console.log(i);*/
				}				
			stmt.finalize();
			db.run("commit");
        });	
	
	console.log('responce sent');
	res.end();
});

restapi.post('/graphDataAttr',function(req,res){
	var data = JSON.parse(req.body.graphAttr);
	//console.log(data);
	//console.log(data[0]);
	console.log(data[0].length);
	//create table if not exists TableName (col1 typ1, ..., colN typN)
	//drop table if exists TableName
	
		db.serialize(function() {
			db.run("begin transaction");
			db.run("DROP TABLE IF EXISTS GraphTableAttr");
			db.run("CREATE TABLE IF NOT EXISTS GraphTableAttr (redId1 Integer, redId2 Integer, overlAttrap Float)");
 
				 stmt = db.prepare("INSERT INTO GraphTableAttr VALUES (?,?,?)")		
				for (var i = 0; i < data.length; i++){
					for(var j=0;j<data[i].length;j++){
						//if(data[i][j]=='null' || parseFloat(data[i][j])==0 || parseFloat(data[i][j])==1)
						//	continue;
					stmt.run(parseInt(i),parseInt(j),parseFloat(data[i][j]));
					}
				if(i%100==0)
					console.log(i);
				}				
			stmt.finalize();
			db.run("commit");
        });	
	
	res.end();
});

restapi.post('/graphDataAttrG',function(req,res){
	var data = JSON.parse(req.body.graphAttr);
	var startIndex = parseInt(JSON.parse(req.body.start));
	//console.log(data);
	//console.log(data[0]);
	console.log('data size: '+data[0].length);
	console.log('start Index: '+startIndex);
	//create table if not exists TableName (col1 typ1, ..., colN typN)
	//drop table if exists TableName
	
	if (global.gc) {
    global.gc();
}
	
		db.serialize(function() {
			db.run("begin transaction");
			//db.run("DROP TABLE IF EXISTS GraphTable");
			db.run("CREATE TABLE IF NOT EXISTS GraphTableAttr (redId1 Integer, redId2 Integer, overlap Float)");
 
				 stmt = db.prepare("INSERT INTO GraphTableAttr VALUES (?,?,?)")		
				for (var i = 0; i < data.length; i++){
					for(var j=0;j<data[i].length;j++){
						//if(data[i][j]=='null' || parseFloat(data[i][j])==0 || parseFloat(data[i][j])==1)
						//	continue;
					stmt.run((parseInt(i))+startIndex,parseInt(j),parseFloat(data[i][j]));
					}
				/*if(i%100==0)
					console.log(i);*/
				}				
			stmt.finalize();
			db.run("commit");
        });	
	
	console.log('responce sent');
	res.end();
});

//create a query that returns the number of redescriptions

restapi.get('/numReds',function(req,res){

var nr = 'SELECT count(*) as numReds FROM RedescriptionTable';	
	
	db.all(nr,function(err,rowsnr){
		
		res.json({"numReds":rowsnr});
	});
	
});

restapi.get('/graphData',function(req,res){
	
		var startIndex = parseInt(req.query.start);
		var endIndex = parseInt(req.query.end);
		var numReds = parseInt(req.query.nr);
		
		//console.log(startIndex+" "+endIndex);
		//console.log(numReds);
			
		if(numReds == 0 || startIndex > endIndex){
			res.end();
			return;
		}	
		
		console.log(startIndex+" "+endIndex);
	
	var getGraph = 'SELECT * from GraphTable where redId1>='+startIndex+' AND redId1<'+endIndex;

	db.all(getGraph, function(err, rowsGraph) {
		
		var tmp= new Array(endIndex-startIndex);
		
		for(var k=0;k<endIndex-startIndex;k++)
			tmp[k]=new Array(numReds);
		
		rowsGraph.map(function(d){
			tmp[d.redId1-startIndex][d.redId2] = d.overlap;
		});
		
            res.json({
				 "GraphData": tmp
                      /*"GraphData": rowsGraph.map(function(d){
								var tmpArr=new Array(3);
								tmpArr[0]=d.redId1; tmpArr[1]=d.redId2; tmpArr[2]=d.overlap;
								return {'data' : tmpArr};
									})*/
                     });
          });
});

restapi.get('/graphDataAttr',function(req,res){
	
		var startIndex = parseInt(req.query.start);
		var endIndex = parseInt(req.query.end);
		var numReds = parseInt(req.query.nr);
		
		if(numReds == 0 || startIndex > endIndex){
			res.end();
			return;
		}	
		
		
		console.log(startIndex+" "+endIndex);
	
	var getGraphAttr = 'SELECT * from GraphTableAttr where redId1>='+startIndex+' AND redId1<'+endIndex;

	db.all(getGraphAttr, function(err, rowsGraph) {
		
		var tmp= new Array(endIndex-startIndex);
		
		for(var k=0;k<endIndex-startIndex;k++)
			tmp[k]=new Array(numReds);
		
		rowsGraph.map(function(d){
			tmp[d.redId1-startIndex][d.redId2] = d.overlAttrap;
		});
		
            res.json({
				 "GraphDataAttr": tmp
                      /*"GraphData": rowsGraph.map(function(d){
								var tmpArr=new Array(3);
								tmpArr[0]=d.redId1; tmpArr[1]=d.redId2; tmpArr[2]=d.overlap;
								return {'data' : tmpArr};
									})*/
                     });
          });
});

restapi.post('/attrFreq',function(req,res){

		var userId = JSON.parse(req.body.userId);
		var attributeFrequency = JSON.parse(req.body.attributeFrequency);
		var attCooc = JSON.parse(req.body.attCooc);
		var selReds = JSON.parse(req.body.selReds);
		
		/*console.log("writing data");
		console.log("input1: ");
		console.log(attributeFrequency[0]);
		console.log("input2: ");
		console.log(attCooc[0]);*/
		
		db.serialize(function() {
			db.run("begin transaction");
			db.run("DELETE FROM AttributeFrequencyTable where userId = "+userId);
			db.run("DELETE FROM AttributeCoocurenceTable where userId = "+userId);
			db.run("DELETE FROM SelectedRedescriptionsAttr where userId = "+userId);

				 stmt = db.prepare("INSERT INTO AttributeFrequencyTable VALUES (?,?,?,?)")		
				for (var i = 0; i < attributeFrequency.length; i++) {
					stmt.run(parseInt(userId),parseFloat(attributeFrequency[i].frequency),parseInt(attributeFrequency[i].id),attributeFrequency[i].name);
				}
				
				stmt = db.prepare("INSERT INTO AttributeCoocurenceTable VALUES (?,?,?,?)")	
				for (var i = 0; i < attCooc.length; i++) {
					stmt.run(parseInt(userId),parseFloat(attCooc[i].cooc),parseInt(attCooc[i].id1),attCooc[i].id2);
				}
				
				stmt =  db.prepare("INSERT INTO SelectedRedescriptionsAttr VALUES (?,?)")
				for (var i = 0; i < selReds.length; i++) {
					stmt.run(parseInt(userId),parseInt(selReds[i]));
				}
				
			stmt.finalize();
			db.run("commit");
        });
		res.end();
});

restapi.post('/sharedData',function(req,res){

		var sharedData = JSON.parse(req.body.sharedData);
		var userId = JSON.parse(req.body.userId);
		//console.log("sharedData:");
		//console.log(sharedData);
		
		db.serialize(function() {
			db.run("begin transaction");
			db.run("DELETE FROM SelectedRedescriptions where userId = "+userId);

				 stmt = db.prepare("INSERT INTO SelectedRedescriptions VALUES (?,?)")		
				for (var i = 0; i < sharedData.length; i++) {
					stmt.run(parseInt(userId),parseInt(sharedData[i]));
				}
				
			stmt.finalize();
			db.run("commit");
        });
		res.end();
});

restapi.get('/sharedData',function(req,res){
	
	var userId = JSON.parse(req.query.userId);
	
	var sharedData='Select redescriptionID as id from SelectedRedescriptions where userId = '+userId;
			
			db.all(sharedData, function(err, rowsData) {
		 res.json({
                      'data': rowsData
                     });
			});
});

restapi.get('/checkTable',function(req,res){
	
	var checkData='Select count(*) as number from sqlite_master where type=\'table\' AND name=\'GraphTable\'';
			
			db.all(checkData, function(err, rowsData) {
		 res.json({
                      'count': rowsData
                     });
			});
});

restapi.get('/checkTableAttrs',function(req,res){
	
	var checkData='Select count(*) as number from sqlite_master where type=\'table\' AND name=\'GraphTableAttr\'';
			
			db.all(checkData, function(err, rowsData) {
		 res.json({
                      'count': rowsData
                     });
			});
});

restapi.get('/initatData',function(req,res){
	var initalData='SELECT DISTINCT redescriptionID as redId, attributeID as atId from RedescriptionAttributeTable';
	
	db.all(initalData, function(err, rowsData) {
		 res.json({
                      'data': rowsData
                     });
	});
	
});

restapi.get('/attributeData', function(req,res){
		var attributeNames='SELECT attributeID as id, attributeName as Name FROM AttributeTable';
		var attributeRedescription = 'SELECT attributeID as id, count(DISTINCT redescriptionID) as frequency FROM RedescriptionAttributeTable group by attributeID';//define
		var attributeCoocurence = 'SELECT COUNT(a1.redescriptionID) as cooc, a1.attributeID as id1, a2.attributeID as id2 FROM RedescriptionAttributeTable as a1, RedescriptionAttributeTable as a2 '+
		'WHERE a1.redescriptionID=a2.redescriptionID group by a1.attributeID, a2.attributeID';
		
		db.all(attributeNames, function(err, rowsAttributes) {
				db.all(attributeRedescription, function(err, rowsAttRed){
					db.all(attributeCoocurence, function(err, rowsAttCooc){
            res.json({
                      'attributes': rowsAttributes,
					  'frequency': rowsAttRed,
					  'attCooc': rowsAttCooc
                     });
						});
				 });
		});		
});

restapi.get('/attributeCoocurence',function(req,res){
		
		//console.log(req);
		//console.log(req.query);
		//console.log(req.offsetRow);
		//console.log(req.offsetCol);
		
		if(req.query.toDisplay==null)
				req.query.toDisplay=50;
		if(req.query.offsetRow==null)
				req.query.offsetRow=0;
		if(req.query.offsetCol==null)
				req.query.offsetCol=0;
			
			var userId = JSON.parse(req.query.userId);
		
		var attributeNodes='SELECT frequency as count, aft.attributeID as id, at.attributeName as Name, at.attributeDescription as Description '+
							'FROM AttributeFrequencyTable as aft, AttributeTable as at '+
							'WHERE aft.attributeID=at.attributeID AND at.view=1 AND userId = '+userId+' '+
							'ORDER BY frequency desc LIMIT '+req.query.toDisplay+' OFFSET '+((parseInt(req.query.offsetRow)-1)*parseInt(req.query.toDisplay));
							
		var attributeNodes1='SELECT frequency as count, aft.attributeID as id, at.attributeName as Name, at.attributeDescription as Description '+
							'FROM AttributeFrequencyTable as aft, AttributeTable as at '+
							'WHERE aft.attributeID=at.attributeID AND at.view=2 AND userId = '+userId+' '+
							'ORDER BY frequency desc LIMIT '+req.query.toDisplay+' OFFSET '+((parseInt(req.query.offsetCol)-1)*parseInt(req.query.toDisplay));
			
		var attributeCount =	'SELECT count(attributeID) as count FROM AttributeTable';
		var attributeCountRow = 'SELECT count(attributeID) as count FROM AttributeTable WHERE view=1 AND attributeID IN '+
								'(SELECT attributeID1 FROM AttributeCoocurenceTable WHERE userId = '+userId+')';
		var attributeCountCol = 'SELECT count(attributeID) as count FROM AttributeTable WHERE view=2 AND attributeID IN '+
								'(SELECT attributeID2 FROM AttributeCoocurenceTable WHERE userId = '+userId+')';
		
		var links = 'SELECT attributeID1 as source, attributeID2 as target, coocurence as value '+
					'FROM AttributeCoocurenceTable as act, AttributeTable as at1, AttributeTable as at2 '+
					'WHERE attributeID1!=attributeID2 and attributeID1=at1.attributeID AND attributeID2=at2.attributeID '+ 
					'AND at1.view=1 AND at2.view=2 AND act.userId = '+userId+' '+
					'AND attributeID1 IN (SELECT at.attributeID from AttributeFrequencyTable as aft, AttributeTable as at '+
					'WHERE aft.attributeID=at.attributeID AND at.view=1 AND aft.userId = '+userId+' '+'ORDER BY frequency DESC LIMIT '+req.query.toDisplay+' OFFSET '+((parseInt(req.query.offsetRow)-1)*parseInt(req.query.toDisplay)) +') '+
					'AND attributeID2 IN (SELECT at.attributeID from AttributeFrequencyTable as aft, attributeTable as at '+
					'WHERE aft.attributeID=at.attributeID AND at.view=2 AND aft.userId = '+userId+' ORDER BY frequency DESC LIMIT '+req.query.toDisplay+' OFFSET '+((parseInt(req.query.offsetCol)-1)*parseInt(req.query.toDisplay))+') '+
					'ORDER BY coocurence DESC';

		var maxCoocurence = 'SELECT max(coocurence) as maxCoocurence FROM AttributeCoocurenceTable, AttributeTable as at1, AttributeTable as at2 WHERE '+
							'attributeID1!=attributeID2 AND at1.attributeID=attributeID1 AND at2.attributeID=attributeID2 AND at1.view=1 and at2.view=2 AND userId = '+userId;
		//var attributeLinkes='';
					   
		db.all(attributeNodes, function(err, rowsAttNodes) {
				db.all(attributeNodes1, function(err, rowsAttNodes1) {
					db.all(attributeCount, function(err, rowsAttCount) {
						db.all(attributeCountRow, function(err, rowsAttCountRow) {
							db.all(attributeCountCol, function(err, rowsAttCountCol) {
						db.all(links, function(err, rowsLinks) {
							db.all(maxCoocurence, function(err, rowsMax) {
            res.json({
                      'nodes1': rowsAttNodes,
					  'nodes2': rowsAttNodes1,
					  'attcount': rowsAttCount,
					  'attcountW1': rowsAttCountRow,
					  'attcountW2': rowsAttCountCol,
					  'links': rowsLinks,
					  'pageRows': req.query.offsetRow,
					  'pageCols' : req.query.offsetCol,
					  'maxCoocurence' : rowsMax
                     });
						});
					  });
					});
				});		
			});		 
		});
	});
	
	
});

restapi.get('/attributeRedescriptions',function(req,res){

	if(req.query.attribute1==null)//add view to each attr
		req.query.attribute1=0;
	if(req.query.attribute2==null)
		req.query.attribute2=0;
	
	var userId = JSON.parse(req.query.userId);
	var numAttrs = JSON.parse(req.query.numAttr);

	var attributeRedescriptions = 'SELECT DISTINCT rt1.redescriptionID, rt1.redescriptionLR,  rt1.redescriptionRR, rt1.redescriptionJS, rt1.redescriptionSupport, rt1.redescriptionPval '+
								  'FROM RedescriptionTable as rt1, RedescriptionAttributeTable as rat1, RedescriptionAttributeTable as rat2 WHERE '+
								  'rt1.redescriptionID = rat1.redescriptionID AND rt1.redescriptionID=rat2.redescriptionID AND rat1.attributeID='+req.query.attribute1+' '+
								  'AND rat2.attributeID = '+req.query.attribute2+' AND rat1.clauseID=rat2.clauseID';
	
	var selectedAttributeInfo = 'SELECT * FROM AttributeTable WHERE attributeID IN ('+req.query.attribute1+','+req.query.attribute2+')';
	
	var attrAssoc1 = 'SELECT attributeID, attributeName, attributeDescription, view, coocurence from AttributeTable as at, AttributeCoocurenceTable as act where at.attributeID = act.attributeID2 AND act.attributeID1 = '+req.query.attribute1+' AND at.attributeID IN ( SELECT attributeID2 from AttributeTable,AttributeCoocurenceTable where userId='+userId+' and attributeID1 = '+req.query.attribute1+' and attributeID = attributeID2 '+ 
	'and view=2 order by coocurence DESC LIMIT '+numAttrs+') order by coocurence DESC';
	
	var attrAssoc2 = 'SELECT attributeID, attributeName, attributeDescription, view, coocurence from AttributeTable as at, AttributeCoocurenceTable as act where at.attributeID = act.attributeID1 AND act.attributeID2 = '+req.query.attribute2+' AND at.attributeID IN ( SELECT attributeID1 from AttributeTable,AttributeCoocurenceTable where userId='+userId+' and attributeID2 = '+req.query.attribute2+' and attributeID = attributeID1 '+ 
	'and view=1 order by coocurence DESC LIMIT '+numAttrs+') order by coocurence DESC';
	
	var attributesRL1 = 'SELECT rat.redescriptionID, at.attributeID, attributeName, attributeDescription, view FROM AttributeTable as at, RedescriptionAttributeTable as rat WHERE '+
							'at.attributeID = rat.attributeID AND rat.redescriptionID IN ('+
							'SELECT DISTINCT rt1.redescriptionID FROM RedescriptionTable as rt1, RedescriptionAttributeTable as rat1, RedescriptionAttributeTable as rat2 WHERE '+
							'rt1.redescriptionID = rat1.redescriptionID AND rt1.redescriptionID=rat2.redescriptionID AND rat1.attributeID='+req.query.attribute1+' '+
							'AND rat2.attributeID = '+req.query.attribute2+' AND rat1.clauseID=rat2.clauseID)';
	
	/*select attributeID, attributeName, attributeDescription, view, coocurence from AttributeTable as at, AttributeCoocurenceTable as act WHERE at.attributeID = act.attributeID1 AND act.attributeID
2 = 4778 AND at.attributeID IN ( select attributeID1 from AttributeTable,AttributeCoocurenceTable where userId=1 and attributeID2 = 4778 and attributeID = attributeID1 and view=1 order by coocurence D
ESC LIMIT 50) order by coocurence DESC;
924|cog1873|Uncharacterized conserved protein|1|38*/
	
	//console.log(attributeRedescriptions);
	db.all(attributeRedescriptions, function(err, rowsAttReds) {
		db.all(selectedAttributeInfo, function(err, rowsAttInfo) {
			db.all(attrAssoc1, function(err, rowsAttAsoc1) {
				db.all(attrAssoc2, function(err, rowsAttAsoc2) {
					db.all(attributesRL1, function(err, rowsAttDescReds) {
		res.json({
			'redescriptions': rowsAttReds.map(function(p){
						  var tmpArr=new Array(5);
						  tmpArr[0]=p.redescriptionLR; tmpArr[1]=p.redescriptionRR;
						  tmpArr[2]=p.redescriptionJS; tmpArr[3]=p.redescriptionSupport;
						  tmpArr[4]=p.redescriptionPval; //tmpArr[5]=p.redescriptionAEJ;
						  //tmpArr[6]=p.redescriptionAAJ;
						  return {'id': p.redescriptionID, 'data': tmpArr};}),
			'redescriptionAttrs': rowsAttDescReds.map(function(p){
						var tmpArr=new Array(4);
						  tmpArr[0]=p.attributeID; tmpArr[1]=p.attributeName;
						  tmpArr[2]=p.attributeDescription; tmpArr[3]=p.view;
						  return {'id': p.redescriptionID, 'data': tmpArr};}),
			'selAttrs': rowsAttInfo,
			'attAssoc1': rowsAttAsoc1.map(function(p){
				var tmpArr = new Array(4);
				tmpArr[0] = p.attributeName; tmpArr[1] = p.attributeDescription; 
				tmpArr[2] = p.view; tmpArr[3] = p.coocurence;
				return {'id': p.attributeID, 'data': tmpArr};}),
			'attAssoc2': rowsAttAsoc2.map(function(p){
				var tmpArr = new Array(4);
				tmpArr[0] = p.attributeName; tmpArr[1] = p.attributeDescription; 
				tmpArr[2] = p.view; tmpArr[3] = p.coocurence;
				
				return {'id': p.attributeID, 'data': tmpArr};})
					  });
					});
				});
			});
		});
	});
});

restapi.get('/attributeRedescriptionsSel',function(req,res){

	if(req.query.attribute1==null)
		req.query.attribute1=0;
	if(req.query.attribute2==null)
		req.query.attribute2=0;

	var userId = JSON.parse(req.query.userId);
	var numAttrs = JSON.parse(req.query.numAttr);
	
	var attributeRedescriptions = 'SELECT DISTINCT rt1.redescriptionID, rt1.redescriptionLR,  rt1.redescriptionRR, rt1.redescriptionJS, rt1.redescriptionSupport, rt1.redescriptionPval '+
								  'FROM RedescriptionTable as rt1, RedescriptionAttributeTable as rat1, RedescriptionAttributeTable as rat2 WHERE '+
								  'rt1.redescriptionID = rat1.redescriptionID AND rt1.redescriptionID=rat2.redescriptionID AND rt1.redescriptionID IN (SELECT redescriptionID FROM SelectedRedescriptionsAttr WHERE userId = '+userId+') AND rat1.attributeID='+req.query.attribute1+' '+
								  'AND rat2.attributeID = '+req.query.attribute2+' AND rat1.clauseID=rat2.clauseID';
								  
	var selectedAttributeInfo = 'SELECT * FROM AttributeTable WHERE attributeID IN ('+req.query.attribute1+','+req.query.attribute2+')';
	
	var attrAssoc1 = 'SELECT attributeID, attributeName, attributeDescription, view, coocurence from AttributeTable as at, AttributeCoocurenceTable as act where at.attributeID = act.attributeID2 AND act.attributeID1 = '+req.query.attribute1+' AND at.attributeID IN ( SELECT attributeID2 from AttributeTable,AttributeCoocurenceTable where userId='+userId+' and attributeID1 = '+req.query.attribute1+' and attributeID = attributeID2 '+ 
	'and view=2 order by coocurence DESC LIMIT '+numAttrs+') order by coocurence DESC';
	
	var attrAssoc2 = 'SELECT attributeID, attributeName, attributeDescription, view, coocurence from AttributeTable as at, AttributeCoocurenceTable as act where at.attributeID = act.attributeID1 AND act.attributeID2 = '+req.query.attribute2+' AND at.attributeID IN ( SELECT attributeID1 from AttributeTable,AttributeCoocurenceTable where userId='+userId+' and attributeID2 = '+req.query.attribute2+' and attributeID = attributeID1 '+ 
	'and view=1 order by coocurence DESC LIMIT '+numAttrs+') order by coocurence DESC';
	
	var attributesRL1 = 'SELECT rat.redescriptionID, at.attributeID, attributeName, attributeDescription, view FROM AttributeTable as at, RedescriptionAttributeTable as rat WHERE '+
							'at.attributeID = rat.attributeID AND rat.redescriptionID IN ('+
							'SELECT DISTINCT rt1.redescriptionID FROM RedescriptionTable as rt1, RedescriptionAttributeTable as rat1, RedescriptionAttributeTable as rat2 WHERE '+
							'rt1.redescriptionID = rat1.redescriptionID AND rt1.redescriptionID=rat2.redescriptionID AND rt1.redescriptionID IN (SELECT redescriptionID FROM SelectedRedescriptionsAttr WHERE userId = '+userId+') AND rat1.attributeID='+req.query.attribute1+' '+
							'AND rat2.attributeID = '+req.query.attribute2+' AND rat1.clauseID=rat2.clauseID)';							  
	
	db.all(attributeRedescriptions, function(err, rowsAttReds) {
		db.all(selectedAttributeInfo, function(err, rowsAttInfo) {
			db.all(attrAssoc1, function(err, rowsAttAsoc1) {
				db.all(attrAssoc2, function(err, rowsAttAsoc2) {
					db.all(attributesRL1, function(err, rowsAttDescReds) {
		res.json({
			'redescriptions': rowsAttReds.map(function(p){
						  var tmpArr=new Array(5);
						  tmpArr[0]=p.redescriptionLR; tmpArr[1]=p.redescriptionRR;
						  tmpArr[2]=p.redescriptionJS; tmpArr[3]=p.redescriptionSupport;
						  tmpArr[4]=p.redescriptionPval; //tmpArr[5]=p.redescriptionAEJ;
						  //tmpArr[6]=p.redescriptionAAJ;
						  return {'id': p.redescriptionID, 'data': tmpArr};}),
			'redescriptionAttrs': rowsAttDescReds.map(function(p){
						var tmpArr=new Array(4);
						  tmpArr[0]=p.attributeID; tmpArr[1]=p.attributeName;
						  tmpArr[2]=p.attributeDescription; tmpArr[3]=p.view;
						  return {'id': p.redescriptionID, 'data': tmpArr};}),
			'selAttrs': rowsAttInfo,
			'attAssoc1': rowsAttAsoc1.map(function(p){
				var tmpArr = new Array(4);
				tmpArr[0] = p.attributeName; tmpArr[1] = p.attributeDescription; 
				tmpArr[2] = p.view; tmpArr[3] = p.coocurence;
				return {'id': p.attributeID, 'data': tmpArr};}),
			'attAssoc2': rowsAttAsoc2.map(function(p){
				var tmpArr = new Array(4);
				tmpArr[0] = p.attributeName; tmpArr[1] = p.attributeDescription; 
				tmpArr[2] = p.view; tmpArr[3] = p.coocurence;
				
				return {'id': p.attributeID, 'data': tmpArr};})
					  });
					});
				});
			});
		});
	});
	
	
	//console.log(attributeRedescriptions);
	/*db.all(attributeRedescriptions, function(err, rowsAttReds) {
		res.json({
			'redescriptions': rowsAttReds.map(function(p){
						  var tmpArr=new Array(5);
						  tmpArr[0]=p.redescriptionLR; tmpArr[1]=p.redescriptionRR;
						  tmpArr[2]=p.redescriptionJS; tmpArr[3]=p.redescriptionSupport;
						  tmpArr[4]=p.redescriptionPval; //tmpArr[5]=p.redescriptionAEJ;
						  //tmpArr[6]=p.redescriptionAAJ;
						  return {'id': p.redescriptionID, 'data': tmpArr};})
		});
	});*/
});

restapi.listen('8081','localhost');
console.log('Submit GET to ' + 'localhost' + ':' + '8081' + '/redescriptions');
console.log('Submit GET to ' + 'localhost' + ':' + '8081' + '/redundancyinfo');
//console.log('Submit GET to ' + 'localhost' + ':' + '8081' + '/redescriptions');
console.log('Submit GET to ' + 'localhost' + ':' + '8081' + '/clusterinfo');
console.log('Submit GET to ' + 'localhost' + ':' + '8081' + '/redescriptionInfo');
console.log('Submit GET to ' + 'localhost' + ':' + '8081' + '/redescriptionSupport');
console.log('Submit GET to ' + 'localhost' + ':' + '8081' + '/allRedescriptions');
console.log('Submit GET to ' + 'localhost' + ':' + '8081' + '/attributeCoocurence');
console.log('Submit GET to ' + 'localhost' + ':' + '8081' + '/attributeRedescriptions');
var Graph = (function (undefined) {

var _threshold= Number.NEGATIVE_INFINITY;
var _forbiden=[]; _forbiden.contains=function(){return false};

	var extractKeys = function (obj) {
		var keys = [], key;
		for (key in obj) {
		    Object.prototype.hasOwnProperty.call(obj,key) && keys.push(key);
		}
		return keys;
	}

	var sorter = function (a, b) {
		return parseFloat (a) - parseFloat (b);
	}

	var findPaths = function (map, start, end, infinity) {
		infinity = infinity || Infinity;

		var costs = {},
		    open = {'0': [start]},
		    predecessors = {},
		    keys;

		var addToOpen = function (cost, vertex) {
			var key = "" + cost;
			if (!open[key]) open[key] = [];
			open[key].push(vertex);
		}

		costs[start] = 0;

		while (open) {
			if(!(keys = extractKeys(open)).length) break;

			keys.sort(sorter);

			var key = keys[0],
			    bucket = open[key],
			    node = bucket.shift(),
			    currentCost = parseFloat(key),
			    adjacentNodes = map[node] || {};

			if (!bucket.length) delete open[key];

			for (var vertex in adjacentNodes) {
				
				if(adjacentNodes[vertex]>_threshold || (_forbiden.contains(vertex)))
					continue;
				
			    if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
					var cost = adjacentNodes[vertex],
					    totalCost = cost + currentCost,
					    vertexCost = costs[vertex];

					if ((vertexCost === undefined) || (vertexCost > totalCost)) {
						costs[vertex] = totalCost;
						addToOpen(totalCost, vertex);
						predecessors[vertex] = node;
					}
				}
			}
		}

		if (costs[end] === undefined) {
			return null;
		} else {
			return predecessors;
		}
	}

	var extractShortest = function (predecessors, end) {
		var nodes = [],
		    u = end;

		while (u) {
			nodes.push(u);
			u = predecessors[u];
		}

		nodes.reverse();
		return nodes;
	}

	var findShortestPath = function (map, nodes) {
		var start = nodes.shift(),
		    end,
		    predecessors,
		    path = [],
		    shortest;

		while (nodes.length) {
			end = nodes.shift();
			predecessors = findPaths(map, start, end);

			if (predecessors) {
				shortest = extractShortest(predecessors, end);
				if (nodes.length) {
					path.push.apply(path, shortest.slice(0, -1));
				} else {
					return path.concat(shortest);
				}
			} else {
				return null;
			}

			start = end;
		}
	}
	

	var toArray = function (list, offset) {
		try {
			return Array.prototype.slice.call(list, offset);
		} catch (e) {
			var a = [];
			for (var i = offset || 0, l = list.length; i < l; ++i) {
				a.push(list[i]);
			}
			return a;
		}
	}
	

	/*var Graph = function (map) {
		this.map = map;
	}*/
	
	var Graph = function (map, tr, forb) {
		this.map = map;
		this.edgeValueBackup=new Array();
		if(typeof tr!='undefined')
			_threshold=tr;
		if(typeof forb!='undefined')
			_forbiden=forb;
	}

	Graph.prototype.findShortestPath = function (start, end) {
		if (Object.prototype.toString.call(start) === '[object Array]') {
			return findShortestPath(this.map, start);
		} else if (arguments.length === 2) {
			return findShortestPath(this.map, [start, end]);
		} else {
			return findShortestPath(this.map, toArray(arguments));
		}
	}

	Graph.findShortestPath = function (map, start, end) {
		if (Object.prototype.toString.call(start) === '[object Array]') {
			return findShortestPath(map, start);
		} else if (arguments.length === 3) {
			return findShortestPath(map, [start, end]);
		} else {
			return findShortestPath(map, toArray(arguments, 1));
		}
	}
	
		Graph.prototype.findEdge = function (start, end){

				var adjacentNodes = this.map[start];		
				
				return adjacentNodes[end];
	}
	
	Graph.prototype.setEdges = function (starts, ends){
		
		if(starts.length!=ends.length)
			return;
		
		for(var i=0;i<starts.length;i++){
			var adjacentNodes = this.map[starts[i]];
			this.edgeValueBackup.push(adjacentNodes[ends[i]]);
			adjacentNodes[ends[i]]=Number.POSITIVE_INFINITY;
		}
	}	
	
		Graph.prototype.restoreEdges = function (starts, ends){
		
		if(starts.length!=ends.length)
			return;
		
		for(var i=0;i<starts.length;i++){
			var adjacentNodes = this.map[starts[i]];
			//edgeValueBackup.push(adjacentNodes[ends[i]]);
			adjacentNodes[ends[i]]=this.edgeValueBackup[i];
		}
		
		this.edgeValueBackup=[];	
	}	

	return Graph;

})();

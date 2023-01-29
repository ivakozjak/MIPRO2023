function addViolin(svg,interpolation, resolution, results, height, width, domain, imposeMax, violinColor){

        var data = d3.layout.histogram()
                        .bins(resolution)
                        .frequency(0)
                        (results);

        var y = d3.scale.linear()
                    .range([width/2, 0])
                    .domain([0, Math.max(imposeMax, d3.max(data, function(d) { return d.y; }))]);

        var x = d3.scale.linear()
                    .range([height, 0])
                    .domain(domain)
                    .nice();


        var area = d3.svg.area()
            .interpolate(interpolation)
            .x(function(d) {
                   if(interpolation=="step-before")
                        return x(d.x+d.dx/2)
                   return x(d.x);
                })
            .y0(width/2)
            .y1(function(d) { return y(d.y); });

        var line=d3.svg.line()
            .interpolate(interpolation)
            .x(function(d) {
                   if(interpolation=="step-before")
                        return x(d.x+d.dx/2)
                   return x(d.x);
                })
            .y(function(d) { return y(d.y); });

        var gPlus=svg.append("g")
        var gMinus=svg.append("g")

        gPlus.append("path")
          .datum(data)
          .attr("class", "areaV")
          .attr("d", area)
          .style("fill", violinColor);

        gPlus.append("path")
          .datum(data)
          .attr("class", "violin")
          .attr("d", line)
          .style("stroke", violinColor);


        gMinus.append("path")
          .datum(data)
          .attr("class", "areaV")
          .attr("d", area)
          .style("fill", violinColor);

        gMinus.append("path")
          .datum(data)
          .attr("class", "violin")
          .attr("d", line)
          .style("stroke", violinColor);

        var x=width;

        gPlus.attr("transform", "rotate(90,0,0)  translate(0,-"+width+")");//translate(0,-200)");
        gMinus.attr("transform", "rotate(90,0,0) scale(1,-1)");
}

function d3_chart_boxQuartiles(d) {
  return [
    d3.quantile(d, .25),
    d3.quantile(d, .5),
    d3.quantile(d, .75)
  ];
}

function iqr(k) {
				return function(d, i) {
					//console.log("d");
					//console.log(d);
				var q1 = d.quartiles[0],
				q3 = d.quartiles[2],
				iqr = (q3 - q1) * k,
				i = -1,
				j = d.length;
				/*console.log("d[++i]");
				console.log(d[++i]);
				console.log("q1");
				console.log(q1);
				console.log("q3");
				console.log(q3);
				console.log("iqr");
				console.log(iqr);
				console.log("q1-iqr");
				console.log(q1-iqr);
				console.log("q3+iqr");
				console.log(q3+iqr);*/
				while (d[++i] < q1 - iqr);
				while (d[--j] > q3 + iqr);
		return [i, j];
   };
  }

function addBoxPlot(svg ,results, height, width, domain, boxPlotWidth, boxColor, boxInsideColor){
       
	   
	   	var quartiles = d3_chart_boxQuartiles;
		var quartileData = quartiles(results);
		var inter=iqr(1.5);
		var quarRV=[];
		
		var str = results; str["quartiles"]=quartileData;

		var interQuart=inter(str);

		//console.log("domains");
		//console.log(domain);
	   
	   var y = d3.scale.linear()
                    .range([height, 0])
                    .domain(domain);

        var x = d3.scale.linear()
                    .range([0, width])

        var left=0.5-boxPlotWidth/2;
        var right=0.5+boxPlotWidth/2;

        var probs=[0.05,0.25,0.5,0.75,0.95];
        for(var i=0; i<probs.length; i++){
			//console.log("loop quantile");
			//console.log(d3.quantile(results, probs[i]));
			if(i+1<probs.length && i>0)
            probs[i]=y(d3.quantile(results, probs[i]))
			else if(i>0)
				probs[i]=y(results[interQuart[1]]);
			else if(i==0)
				probs[i]=y(results[interQuart[0]]);
        }
		
	//	domain[0]=results[interQuart[0]];
		//domain[1]=results[interQuart[1]];
		
	//	console.log(domain);
		
        svg.append("rect")
            .attr("class", "boxplot1v fill")
            .attr("x", x(left))
            .attr("width", x(right)-x(left))
            .attr("y", probs[3])
            .attr("height", -probs[3]+probs[1])
            .style("fill", boxColor);

        var iS=[0,2,4];
        var iSclass=["","median",""];
        var iSColor=[boxColor, boxInsideColor, boxColor]
        for(var i=0; i<iS.length; i++){
             svg.append("line")
                .attr("class", "boxplot1v "+iSclass[i])
                .attr("x1", x(left))
                .attr("x2", x(right))
                .attr("y1", probs[iS[i]])
                .attr("y2", probs[iS[i]])
                .style("fill", iSColor[i])
                .style("stroke", iSColor[i]);
        }

		var tickR=probs.slice(1,4);
		var probs1=[0.25,0.5,0.75];
		
		 // Update box ticks.
      var boxTick = svg.selectAll("text.box")
          .data(quartileData);

      boxTick.enter().append("svg:text")
          .attr("class", "box")
          .attr("dy", ".3em")
          .attr("dx", function(d, i) { return i & 1 ? 4 : -4 })
          .attr("x", function(d, i) { return i & 1 ? width-20 : 15 })
          .attr("y", function(d,i){return tickR[i];})
          .attr("text-anchor", function(d, i) { return i & 1 ? "start" : "end"; })
          .text(function(d,i){return Math.round(d3.quantile(results, probs1[i]));})
		  
		  tickR = [probs[0],probs[4]];
		  var probs1=[0.0,0.95];
		  
		  var whiskerTick = svg.selectAll("text.whisker")
          .data(probs1 || []);

      whiskerTick.enter().append("svg:text")
          .attr("class", "box")
          .attr("dy", ".3em")
          .attr("dx", 4)
          .attr("x", width-16)
          .attr("y", function(d,i){return tickR[i];})
		  .attr("text-anchor", function(d, i) { return i & 1 ? "start" : "end"; })
          .text(function(d,i){return Math.round(results[interQuart[i]]);})
		  .style("opacity", 1)


        var iS=[[0,1],[3,4]];
		//console.log("probs");
		//console.log(probs);
		
        for(var i=0; i<iS.length; i++){
			
            svg.append("line")
                .attr("class", "boxplot1v")
                .attr("x1", x(0.5))
                .attr("x2", x(0.5))
                .attr("y1", probs[iS[i][0]])
                .attr("y2", probs[iS[i][1]])
                .style("stroke", boxColor);
        }

        svg.append("rect")
            .attr("class", "boxplot1v")
            .attr("x", x(left))
            .attr("width", x(right)-x(left))
            .attr("y", probs[3])
            .attr("height", -probs[3]+probs[1])
            .style("stroke", boxColor);

        svg.append("circle")
            .attr("class", "boxplot1v mean")
            .attr("cx", x(0.5))
            .attr("cy", y(d3.mean(results)))
            .attr("r", x(boxPlotWidth/5))
            .style("fill", boxInsideColor)
            .style("stroke", 'None');

        svg.append("circle")
            .attr("class", "boxplot1v mean")
            .attr("cx", x(0.5))
            .attr("cy", y(d3.mean(results)))
            .attr("r", x(boxPlotWidth/10))
            .style("fill", boxColor)
            .style("stroke", 'None');


}
(function(){d3.chart = {};
// Inspired by http://informationandvisualization.de/blog/box-plot
d3.chart.box = function() {
  var width = 1,
      height = 1,
      duration = 0,
      domain = null,
      value = Number,
      whiskers = d3_chart_boxWhiskers,
      quartiles = d3_chart_boxQuartiles,
      tickFormat = null;

  // For each small multiple…
  function box(g) {
    g.each(function(d, i) {
		//console.log('box');
		//console.log(d);
      d = d.sort(d3.ascending);//d.map(value).sort(d3.ascending);
      var g = d3.select(this),
          n = d.length,
          min = d[0],
          max = d[n - 1];

      // Compute quartiles. Must return exactly 3 elements.
      var quartileData = d.quartiles = quartiles(d);

      // Compute whiskers. Must return exactly 2 elements, or null.
      var whiskerIndices = whiskers && whiskers.call(this, d, i),
          whiskerData = whiskerIndices && whiskerIndices.map(function(i) { return d[i]; });

      // Compute outliers. If no whiskers are specified, all data are "outliers".
      // We compute the outliers as indices, so that we can join across transitions!
      var outlierIndices = whiskerIndices
          ? d3.range(0, whiskerIndices[0]).concat(d3.range(whiskerIndices[1] + 1, n))
          : d3.range(n);

      // Compute the new x-scale.
      var x1 = d3.scale.linear()
          .domain(domain && domain.call(this, d, i) || [min, max])
          .range([height, 0]);

      // Retrieve the old x-scale, if this is an update.
      var x0 = this.__chart__ || d3.scale.linear()
          .domain([0, Infinity])
          .range(x1.range());

      // Stash the new scale.
      this.__chart__ = x1;

      // Note: the box, median, and box tick elements are fixed in number,
      // so we only have to handle enter and update. In contrast, the outliers
      // and other elements are variable, so we need to exit them! Variable
      // elements also fade in and out.

      // Update center line: the vertical line spanning the whiskers.
      var center = g.selectAll("line.center")
          .data(whiskerData ? [whiskerData] : []);

      center.enter().insert("svg:line", "rect")
          .attr("class", "center")
          .attr("x1", width / 2)
          .attr("y1", function(d) { return x0(d[0]); })
          .attr("x2", width / 2)
          .attr("y2", function(d) { return x0(d[1]); })
          .style("opacity", 1e-6)
        .transition()
          .duration(duration)
          .style("opacity", 1)
          .attr("y1", function(d) { return x1(d[0]); })
          .attr("y2", function(d) { return x1(d[1]); });

      center.transition()
          .duration(duration)
          .style("opacity", 1)
          .attr("y1", function(d) { return x1(d[0]); })
          .attr("y2", function(d) { return x1(d[1]); });

      center.exit().transition()
          .duration(duration)
          .style("opacity", 1e-6)
          .attr("y1", function(d) { return x1(d[0]); })
          .attr("y2", function(d) { return x1(d[1]); })
          .remove();

      // Update innerquartile box.
      var box = g.selectAll("rect.box")
          .data([quartileData]);

      box.enter().append("svg:rect")
          .attr("class", "box")
          .attr("x", 0)
          .attr("y", function(d) { return x0(d[2]); })
          .attr("width", width)
          .attr("height", function(d) { return x0(d[0]) - x0(d[2]); })
        .transition()
          .duration(duration)
          .attr("y", function(d) { return x1(d[2]); })
          .attr("height", function(d) { return x1(d[0]) - x1(d[2]); });

      box.transition()
          .duration(duration)
          .attr("y", function(d) { return x1(d[2]); })
          .attr("height", function(d) { return x1(d[0]) - x1(d[2]); });

      // Update median line.
      var medianLine = g.selectAll("line.median")
          .data([quartileData[1]]);

      medianLine.enter().append("svg:line")
          .attr("class", "median")
          .attr("x1", 0)
          .attr("y1", x0)
          .attr("x2", width)
          .attr("y2", x0)
        .transition()
          .duration(duration)
          .attr("y1", x1)
          .attr("y2", x1);

      medianLine.transition()
          .duration(duration)
          .attr("y1", x1)
          .attr("y2", x1);

      // Update whiskers.
      var whisker = g.selectAll("line.whisker")
          .data(whiskerData || []);

      whisker.enter().insert("svg:line", "circle, text")
          .attr("class", "whisker")
          .attr("x1", 0)
          .attr("y1", x0)
          .attr("x2", width)
          .attr("y2", x0)
          .style("opacity", 1e-6)
        .transition()
          .duration(duration)
          .attr("y1", x1)
          .attr("y2", x1)
          .style("opacity", 1);

      whisker.transition()
          .duration(duration)
          .attr("y1", x1)
          .attr("y2", x1)
          .style("opacity", 1);

      whisker.exit().transition()
          .duration(duration)
          .attr("y1", x1)
          .attr("y2", x1)
          .style("opacity", 1e-6)
          .remove();

      // Update outliers.
      var outlier = g.selectAll("circle.outlier")
          .data(outlierIndices, Number);

      outlier.enter().insert("svg:circle", "text")
          .attr("class", "outlier")
          .attr("r", 5)
          .attr("cx", width / 2)
          .attr("cy", function(i) { return x0(d[i]); })
          .style("opacity", 1e-6)
        .transition()
          .duration(duration)
          .attr("cy", function(i) { return x1(d[i]); })
          .style("opacity", 1);

      outlier.transition()
          .duration(duration)
          .attr("cy", function(i) { return x1(d[i]); })
          .style("opacity", 1);

      outlier.exit().transition()
          .duration(duration)
          .attr("cy", function(i) { return x1(d[i]); })
          .style("opacity", 1e-6)
          .remove();

      // Compute the tick format.
      var format = tickFormat || x1.tickFormat(8);

      // Update box ticks.
      var boxTick = g.selectAll("text.box")
          .data(quartileData);

      boxTick.enter().append("svg:text")
          .attr("class", "box")
          .attr("dy", ".3em")
          .attr("dx", function(d, i) { return i & 1 ? 6 : -6 })
          .attr("x", function(d, i) { return i & 1 ? width : 0 })
          .attr("y", x0)
          .attr("text-anchor", function(d, i) { return i & 1 ? "start" : "end"; })
          .text(format)
        .transition()
          .duration(duration)
          .attr("y", x1);

      boxTick.transition()
          .duration(duration)
          .text(format)
          .attr("y", x1);

      // Update whisker ticks. These are handled separately from the box
      // ticks because they may or may not exist, and we want don't want
      // to join box ticks pre-transition with whisker ticks post-.
      var whiskerTick = g.selectAll("text.whisker")
          .data(whiskerData || []);

      whiskerTick.enter().append("svg:text")
          .attr("class", "whisker")
          .attr("dy", ".3em")
          .attr("dx", 6)
          .attr("x", width)
          .attr("y", x0)
          .text(format)
          .style("opacity", 1e-6)
        .transition()
          .duration(duration)
          .attr("y", x1)
          .style("opacity", 1);

      whiskerTick.transition()
          .duration(duration)
          .text(format)
          .attr("y", x1)
          .style("opacity", 1);

      whiskerTick.exit().transition()
          .duration(duration)
          .attr("y", x1)
          .style("opacity", 1e-6)
          .remove();
    });
    d3.timer.flush();
  }

  box.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return box;
  };

  box.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return box;
  };

  box.tickFormat = function(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return box;
  };

  box.duration = function(x) {
    if (!arguments.length) return duration;
    duration = x;
    return box;
  };

  box.domain = function(x) {
    if (!arguments.length) return domain;
    domain = x == null ? x : d3.functor(x);
    return box;
  };

  box.value = function(x) {
    if (!arguments.length) return value;
    value = x;
    return box;
  };

  box.whiskers = function(x) {
    if (!arguments.length) return whiskers;
    whiskers = x;
    return box;
  };

  box.quartiles = function(x) {
    if (!arguments.length) return quartiles;
    quartiles = x;
    return box;
  };

  return box;
};

function d3_chart_boxWhiskers(d) {
  return [0, d.length - 1];
}

function d3_chart_boxQuartiles(d) {
  return [
    d3.quantile(d, .25),
    d3.quantile(d, .5),
    d3.quantile(d, .75)
  ];
}
// Chart design based on the recommendations of Stephen Few. Implementation
// based on the work of Clint Ivy, Jamie Love, and Jason Davies.
// http://projects.instantcognition.com/protovis/bulletchart/
d3.chart.bullet = function() {
  var orient = "left", // TODO top & bottom
      reverse = false,
      duration = 0,
      ranges = d3_chart_bulletRanges,
      markers = d3_chart_bulletMarkers,
      measures = d3_chart_bulletMeasures,
      width = 380,
      height = 30,
      tickFormat = null;

  // For each small multiple…
  function bullet(g) {
    g.each(function(d, i) {
      var rangez = ranges.call(this, d, i).slice().sort(d3.descending),
          markerz = markers.call(this, d, i).slice().sort(d3.descending),
          measurez = measures.call(this, d, i).slice().sort(d3.descending),
          g = d3.select(this);

      // Compute the new x-scale.
      var x1 = d3.scale.linear()
          .domain([0, Math.max(rangez[0], markerz[0], measurez[0])])
          .range(reverse ? [width, 0] : [0, width]);

      // Retrieve the old x-scale, if this is an update.
      var x0 = this.__chart__ || d3.scale.linear()
          .domain([0, Infinity])
          .range(x1.range());

      // Stash the new scale.
      this.__chart__ = x1;

      // Derive width-scales from the x-scales.
      var w0 = d3_chart_bulletWidth(x0),
          w1 = d3_chart_bulletWidth(x1);

      // Update the range rects.
      var range = g.selectAll("rect.range")
          .data(rangez);

      range.enter().append("svg:rect")
          .attr("class", function(d, i) { return "range s" + i; })
          .attr("width", w0)
          .attr("height", height)
          .attr("x", reverse ? x0 : 0)
        .transition()
          .duration(duration)
          .attr("width", w1)
          .attr("x", reverse ? x1 : 0);

      range.transition()
          .duration(duration)
          .attr("x", reverse ? x1 : 0)
          .attr("width", w1)
          .attr("height", height);

      // Update the measure rects.
      var measure = g.selectAll("rect.measure")
          .data(measurez);

      measure.enter().append("svg:rect")
          .attr("class", function(d, i) { return "measure s" + i; })
          .attr("width", w0)
          .attr("height", height / 3)
          .attr("x", reverse ? x0 : 0)
          .attr("y", height / 3)
        .transition()
          .duration(duration)
          .attr("width", w1)
          .attr("x", reverse ? x1 : 0);

      measure.transition()
          .duration(duration)
          .attr("width", w1)
          .attr("height", height / 3)
          .attr("x", reverse ? x1 : 0)
          .attr("y", height / 3);

      // Update the marker lines.
      var marker = g.selectAll("line.marker")
          .data(markerz);

      marker.enter().append("svg:line")
          .attr("class", "marker")
          .attr("x1", x0)
          .attr("x2", x0)
          .attr("y1", height / 6)
          .attr("y2", height * 5 / 6)
        .transition()
          .duration(duration)
          .attr("x1", x1)
          .attr("x2", x1);

      marker.transition()
          .duration(duration)
          .attr("x1", x1)
          .attr("x2", x1)
          .attr("y1", height / 6)
          .attr("y2", height * 5 / 6);

      // Compute the tick format.
      var format = tickFormat || x1.tickFormat(8);

      // Update the tick groups.
      var tick = g.selectAll("g.tick")
          .data(x1.ticks(8), function(d) {
            return this.textContent || format(d);
          });

      // Initialize the ticks with the old scale, x0.
      var tickEnter = tick.enter().append("svg:g")
          .attr("class", "tick")
          .attr("transform", d3_chart_bulletTranslate(x0))
          .style("opacity", 1e-6);

      tickEnter.append("svg:line")
          .attr("y1", height)
          .attr("y2", height * 7 / 6);

      tickEnter.append("svg:text")
          .attr("text-anchor", "middle")
          .attr("dy", "1em")
          .attr("y", height * 7 / 6)
          .text(format);

      // Transition the entering ticks to the new scale, x1.
      tickEnter.transition()
          .duration(duration)
          .attr("transform", d3_chart_bulletTranslate(x1))
          .style("opacity", 1);

      // Transition the updating ticks to the new scale, x1.
      var tickUpdate = tick.transition()
          .duration(duration)
          .attr("transform", d3_chart_bulletTranslate(x1))
          .style("opacity", 1);

      tickUpdate.select("line")
          .attr("y1", height)
          .attr("y2", height * 7 / 6);

      tickUpdate.select("text")
          .attr("y", height * 7 / 6);

      // Transition the exiting ticks to the new scale, x1.
      tick.exit().transition()
          .duration(duration)
          .attr("transform", d3_chart_bulletTranslate(x1))
          .style("opacity", 1e-6)
          .remove();
    });
    d3.timer.flush();
  }

  // left, right, top, bottom
  bullet.orient = function(x) {
    if (!arguments.length) return orient;
    orient = x;
    reverse = orient == "right" || orient == "bottom";
    return bullet;
  };

  // ranges (bad, satisfactory, good)
  bullet.ranges = function(x) {
    if (!arguments.length) return ranges;
    ranges = x;
    return bullet;
  };

  // markers (previous, goal)
  bullet.markers = function(x) {
    if (!arguments.length) return markers;
    markers = x;
    return bullet;
  };

  // measures (actual, forecast)
  bullet.measures = function(x) {
    if (!arguments.length) return measures;
    measures = x;
    return bullet;
  };

  bullet.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return bullet;
  };

  bullet.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return bullet;
  };

  bullet.tickFormat = function(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return bullet;
  };

  bullet.duration = function(x) {
    if (!arguments.length) return duration;
    duration = x;
    return bullet;
  };

  return bullet;
};

function d3_chart_bulletRanges(d) {
  return d.ranges;
}

function d3_chart_bulletMarkers(d) {
  return d.markers;
}

function d3_chart_bulletMeasures(d) {
  return d.measures;
}

function d3_chart_bulletTranslate(x) {
  return function(d) {
    return "translate(" + x(d) + ",0)";
  };
}

function d3_chart_bulletWidth(x) {
  var x0 = x(0);
  return function(d) {
    return Math.abs(x(d) - x0);
  };
}
// Implements a horizon layout, which is a variation of a single-series
// area chart where the area is folded into multiple bands. Color is used to
// encode band, allowing the size of the chart to be reduced significantly
// without impeding readability. This layout algorithm is based on the work of
// J. Heer, N. Kong and M. Agrawala in "Sizing the Horizon: The Effects of Chart
// Size and Layering on the Graphical Perception of Time Series Visualizations",
// CHI 2009. http://hci.stanford.edu/publications/2009/heer-horizon-chi09.pdf
d3.chart.horizon = function() {
  var bands = 1, // between 1 and 5, typically
      mode = "offset", // or mirror
      interpolate = "linear", // or basis, monotone, step-before, etc.
      x = d3_chart_horizonX,
      y = d3_chart_horizonY,
      w = 960,
      h = 40,
      duration = 0;

  var color = d3.scale.linear()
      .domain([-1, 0, 1])
      .range(["#d62728", "#fff", "#1f77b4"]);

  // For each small multiple…
  function horizon(g) {
    g.each(function(d, i) {
      var g = d3.select(this),
          n = 2 * bands + 1,
          xMin = Infinity,
          xMax = -Infinity,
          yMax = -Infinity,
          x0, // old x-scale
          y0, // old y-scale
          id; // unique id for paths

      // Compute x- and y-values along with extents.
      var data = d.map(function(d, i) {
        var xv = x.call(this, d, i),
            yv = y.call(this, d, i);
        if (xv < xMin) xMin = xv;
        if (xv > xMax) xMax = xv;
        if (-yv > yMax) yMax = -yv;
        if (yv > yMax) yMax = yv;
        return [xv, yv];
      });

      // Compute the new x- and y-scales.
      var x1 = d3.scale.linear().domain([xMin, xMax]).range([0, w]),
          y1 = d3.scale.linear().domain([0, yMax]).range([0, h * bands]);

      // Retrieve the old scales, if this is an update.
      if (this.__chart__) {
        x0 = this.__chart__.x;
        y0 = this.__chart__.y;
        id = this.__chart__.id;
      } else {
        x0 = d3.scale.linear().domain([0, Infinity]).range(x1.range());
        y0 = d3.scale.linear().domain([0, Infinity]).range(y1.range());
        id = ++d3_chart_horizonId;
      }

      // We'll use a defs to store the area path and the clip path.
      var defs = g.selectAll("defs")
          .data([data]);

      var defsEnter = defs.enter().append("svg:defs");

      // The clip path is a simple rect.
      defsEnter.append("svg:clipPath")
          .attr("id", "d3_chart_horizon_clip" + id)
        .append("svg:rect")
          .attr("width", w)
          .attr("height", h);

      defs.select("rect").transition()
          .duration(duration)
          .attr("width", w)
          .attr("height", h);

      // The area path is rendered with our resuable d3.svg.area.
      defsEnter.append("svg:path")
          .attr("id", "d3_chart_horizon_path" + id)
          .attr("d", d3_chart_horizonArea
          .interpolate(interpolate)
          .x(function(d) { return x0(d[0]); })
          .y0(h * bands)
          .y1(function(d) { return h * bands - y0(d[1]); }))
        .transition()
          .duration(duration)
          .attr("d", d3_chart_horizonArea
          .x(function(d) { return x1(d[0]); })
          .y1(function(d) { return h * bands - y1(d[1]); }));

      defs.select("path").transition()
          .duration(duration)
          .attr("d", d3_chart_horizonArea);

      // We'll use a container to clip all horizon layers at once.
      g.selectAll("g")
          .data([null])
        .enter().append("svg:g")
          .attr("clip-path", "url(#d3_chart_horizon_clip" + id + ")");

      // Define the transform function based on the mode.
      var transform = mode == "offset"
          ? function(d) { return "translate(0," + (d + (d < 0) - bands) * h + ")"; }
          : function(d) { return (d < 0 ? "scale(1,-1)" : "") + "translate(0," + (d - bands) * h + ")"; };

      // Instantiate each copy of the path with different transforms.
      var u = g.select("g").selectAll("use")
          .data(d3.range(-1, -bands - 1, -1).concat(d3.range(1, bands + 1)), Number);

      // TODO don't fudge the enter transition
      u.enter().append("svg:use")
          .attr("xlink:href", "#d3_chart_horizon_path" + id)
          .attr("transform", function(d) { return transform(d + (d > 0 ? 1 : -1)); })
          .style("fill", color)
        .transition()
          .duration(duration)
          .attr("transform", transform);

      u.transition()
          .duration(duration)
          .attr("transform", transform)
          .style("fill", color);

      u.exit().transition()
          .duration(duration)
          .attr("transform", transform)
          .remove();

      // Stash the new scales.
      this.__chart__ = {x: x1, y: y1, id: id};
    });
    d3.timer.flush();
  }

  horizon.duration = function(x) {
    if (!arguments.length) return duration;
    duration = +x;
    return horizon;
  };

  horizon.bands = function(x) {
    if (!arguments.length) return bands;
    bands = +x;
    color.domain([-bands, 0, bands]);
    return horizon;
  };

  horizon.mode = function(x) {
    if (!arguments.length) return mode;
    mode = x + "";
    return horizon;
  };

  horizon.colors = function(x) {
    if (!arguments.length) return color.range();
    color.range(x);
    return horizon;
  };

  horizon.interpolate = function(x) {
    if (!arguments.length) return interpolate;
    interpolate = x + "";
    return horizon;
  };

  horizon.x = function(z) {
    if (!arguments.length) return x;
    x = z;
    return horizon;
  };

  horizon.y = function(z) {
    if (!arguments.length) return y;
    y = z;
    return horizon;
  };

  horizon.width = function(x) {
    if (!arguments.length) return w;
    w = +x;
    return horizon;
  };

  horizon.height = function(x) {
    if (!arguments.length) return h;
    h = +x;
    return horizon;
  };

  return horizon;
};

var d3_chart_horizonArea = d3.svg.area(),
    d3_chart_horizonId = 0;

function d3_chart_horizonX(d) {
  return d[0];
}

function d3_chart_horizonY(d) {
  return d[1];
}
// Based on http://vis.stanford.edu/protovis/ex/qqplot.html
d3.chart.qq = function() {
  var width = 1,
      height = 1,
      duration = 0,
      domain = null,
      tickFormat = null,
      n = 100,
      x = d3_chart_qqX,
      y = d3_chart_qqY;

  // For each small multiple…
  function qq(g) {
    g.each(function(d, i) {
      var g = d3.select(this),
          qx = d3_chart_qqQuantiles(n, x.call(this, d, i)),
          qy = d3_chart_qqQuantiles(n, y.call(this, d, i)),
          xd = domain && domain.call(this, d, i) || [d3.min(qx), d3.max(qx)], // new x-domain
          yd = domain && domain.call(this, d, i) || [d3.min(qy), d3.max(qy)], // new y-domain
          x0, // old x-scale
          y0; // old y-scale

      // Compute the new x-scale.
      var x1 = d3.scale.linear()
          .domain(xd)
          .range([0, width]);

      // Compute the new y-scale.
      var y1 = d3.scale.linear()
          .domain(yd)
          .range([height, 0]);

      // Retrieve the old scales, if this is an update.
      if (this.__chart__) {
        x0 = this.__chart__.x;
        y0 = this.__chart__.y;
      } else {
        x0 = d3.scale.linear().domain([0, Infinity]).range(x1.range());
        y0 = d3.scale.linear().domain([0, Infinity]).range(y1.range());
      }

      // Stash the new scales.
      this.__chart__ = {x: x1, y: y1};

      // Update diagonal line.
      var diagonal = g.selectAll("line.diagonal")
          .data([null]);

      diagonal.enter().append("svg:line")
          .attr("class", "diagonal")
          .attr("x1", x1(yd[0]))
          .attr("y1", y1(xd[0]))
          .attr("x2", x1(yd[1]))
          .attr("y2", y1(xd[1]));

      diagonal.transition()
          .duration(duration)
          .attr("x1", x1(yd[0]))
          .attr("y1", y1(xd[0]))
          .attr("x2", x1(yd[1]))
          .attr("y2", y1(xd[1]));

      // Update quantile plots.
      var circle = g.selectAll("circle")
          .data(d3.range(n).map(function(i) {
            return {x: qx[i], y: qy[i]};
          }));

      circle.enter().append("svg:circle")
          .attr("class", "quantile")
          .attr("r", 4.5)
          .attr("cx", function(d) { return x0(d.x); })
          .attr("cy", function(d) { return y0(d.y); })
          .style("opacity", 1e-6)
        .transition()
          .duration(duration)
          .attr("cx", function(d) { return x1(d.x); })
          .attr("cy", function(d) { return y1(d.y); })
          .style("opacity", 1);

      circle.transition()
          .duration(duration)
          .attr("cx", function(d) { return x1(d.x); })
          .attr("cy", function(d) { return y1(d.y); })
          .style("opacity", 1);

      circle.exit().transition()
          .duration(duration)
          .attr("cx", function(d) { return x1(d.x); })
          .attr("cy", function(d) { return y1(d.y); })
          .style("opacity", 1e-6)
          .remove();

      var xformat = tickFormat || x1.tickFormat(4),
          yformat = tickFormat || y1.tickFormat(4),
          tx = function(d) { return "translate(" + x1(d) + "," + height + ")"; },
          ty = function(d) { return "translate(0," + y1(d) + ")"; };

      // Update x-ticks.
      var xtick = g.selectAll("g.x.tick")
          .data(x1.ticks(4), function(d) {
            return this.textContent || xformat(d);
          });

      var xtickEnter = xtick.enter().append("svg:g")
          .attr("class", "x tick")
          .attr("transform", function(d) { return "translate(" + x0(d) + "," + height + ")"; })
          .style("opacity", 1e-6);

      xtickEnter.append("svg:line")
          .attr("y1", 0)
          .attr("y2", -6);

      xtickEnter.append("svg:text")
          .attr("text-anchor", "middle")
          .attr("dy", "1em")
          .text(xformat);

      // Transition the entering ticks to the new scale, x1.
      xtickEnter.transition()
          .duration(duration)
          .attr("transform", tx)
          .style("opacity", 1);

      // Transition the updating ticks to the new scale, x1.
      xtick.transition()
          .duration(duration)
          .attr("transform", tx)
          .style("opacity", 1);

      // Transition the exiting ticks to the new scale, x1.
      xtick.exit().transition()
          .duration(duration)
          .attr("transform", tx)
          .style("opacity", 1e-6)
          .remove();

      // Update ticks.
      var ytick = g.selectAll("g.y.tick")
          .data(y1.ticks(4), function(d) {
            return this.textContent || yformat(d);
          });

      var ytickEnter = ytick.enter().append("svg:g")
          .attr("class", "y tick")
          .attr("transform", function(d) { return "translate(0," + y0(d) + ")"; })
          .style("opacity", 1e-6);

      ytickEnter.append("svg:line")
          .attr("x1", 0)
          .attr("x2", 6);

      ytickEnter.append("svg:text")
          .attr("text-anchor", "end")
          .attr("dx", "-.5em")
          .attr("dy", ".3em")
          .text(yformat);

      // Transition the entering ticks to the new scale, y1.
      ytickEnter.transition()
          .duration(duration)
          .attr("transform", ty)
          .style("opacity", 1);

      // Transition the updating ticks to the new scale, y1.
      ytick.transition()
          .duration(duration)
          .attr("transform", ty)
          .style("opacity", 1);

      // Transition the exiting ticks to the new scale, y1.
      ytick.exit().transition()
          .duration(duration)
          .attr("transform", ty)
          .style("opacity", 1e-6)
          .remove();
    });
  }

  qq.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return qq;
  };

  qq.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return qq;
  };

  qq.duration = function(x) {
    if (!arguments.length) return duration;
    duration = x;
    return qq;
  };

  qq.domain = function(x) {
    if (!arguments.length) return domain;
    domain = x == null ? x : d3.functor(x);
    return qq;
  };

  qq.count = function(z) {
    if (!arguments.length) return n;
    n = z;
    return qq;
  };

  qq.x = function(z) {
    if (!arguments.length) return x;
    x = z;
    return qq;
  };

  qq.y = function(z) {
    if (!arguments.length) return y;
    y = z;
    return qq;
  };

  qq.tickFormat = function(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return qq;
  };

  return qq;
};

function d3_chart_qqQuantiles(n, values) {
  var m = values.length - 1;
  values = values.slice().sort(d3.ascending);
  return d3.range(n).map(function(i) {
    return values[~~(i * m / n)];
  });
}

function d3_chart_qqX(d) {
  return d.x;
}

function d3_chart_qqY(d) {
  return d.y;
}
})();
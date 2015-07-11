var ActionCreators = require('../actions/ActionCreators');
var d3 = require('../lib/d3.min');

Zoom = function(){

};

Zoom.prototype.initialise = function(data, node, opts){
  var self = this;

  this.x  = d3.time.scale().range([0,opts.width]);

  this.y  = d3.scale.linear().range([opts.height,0]);

  this.brush = d3.svg.brush()
                  .x(this.x)
                  .on("brush", function(){
                      var xrange = this.brush.empty() ? this.x.domain() : this.brush.extent();
                      //ActionCreators.rangechange(xrange);
                  }.bind(this))
                  .on("brushend", function(){
                      console.log("brush end");
                  });

  var  colours = ["#7bb6a4","#e5cf58","#cd804a","#445662","#d35a51", "#3f3b3c"];
  var colourcount = 0;
  this.colourchart = {};

  this.colour = function(host){
      this.colourchart[host] = this.colourchart[host] || colours[(colourcount++) % colours.length]
      return this.colourchart[host];
  }

  this.stack = d3.layout.stack()
                 .offset("zero")
                 .values(function(d) {return d.values})
                 .x(function(d){return self.x(d.date)})
                 .y(function(d){return d.y});

  this.area = d3.svg.area()
                .interpolate("basis")
                .x(function(d) {return self.x(d.date)})
                .y0(function(d) {return self.y(d.y0)})
                .y1(function(d) {return self.y(d.y0 + d.y);}),

  this.svg = d3.select(node).append('svg')
              .attr('width', opts.width + opts.margin.left + opts.margin.right)
              .attr('height', opts.height + opts.margin.top + opts.margin.bottom)
              .append('g')
              .attr('transform', 'translate(' + opts.margin.left + ',' + opts.margin.top + ')');

  var zoom = this.svg.append("g")
                     .attr("class", "zoom");

  zoom.append("g")
      .attr("class", "x brush")
      .call(self.brush)
      .selectAll("rect")
      .attr("y", -6)
      .attr("height", opts.height + 7);

  this.update(data);
};

Zoom.prototype.update = function(data){
  var self = this;
  //guard against empty data;
  if (!data || !data.browsing){
    console.log("no data yet..");
    return;
  }

  var browsers = this.stack(data.browsing);

  this.x.domain(d3.extent(data.keys, function(d){return d*1000}));

  this.y.domain([0, d3.max(browsers, function(c){
      return d3.max(c.values, function(d) {return d.y0 +d.y});
  })]);

  var chart = this.svg.selectAll("g.zoom");

  var zoom = chart.selectAll("browser")
                     .data(browsers)
                     .enter()
                     .append("g")
                     .attr("class", "browser")

  zoom.append("path")
    .attr("class", "area")
    .attr("d", function(d) {return self.area(d.values);})
    .style("fill", function(d){return self.colour(d.name)})
    .style("fill-opacity", 0.2)
    .style("stroke", function(d){return self.colour(d.name)})
    .style("stroke-opacity", 1.0)
};


module.exports = Zoom;

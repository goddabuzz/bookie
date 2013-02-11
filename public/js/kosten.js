$(document).ready(function(){

    var elId = 'chart';
    
    var earnings = [];
    var expense = [];
    var amount = 0;

    var year = 2011;//new Date().getYear()+1900;
    
    var formatNumber = d3.format(".0f");
    function currency(d) {return "$" + formatNumber(d); };

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 600 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    var formatPercent = d3.format(".0%");
    var c = [ "#E41A1C", "#377EB8", "#4DAF4A" ];

    var x = d3.scale.ordinal()
        .domain(d3.range(12))
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal()
        .domain(d3.range(2))
        .rangeBands([0, x.rangeBand()]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(currency);

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Load the data. And populate =)
    d3.json('/expenses/year/'+year, function(data){

      months = data.map(function(d){ return d._id.month});
      data = data.map(function(d){ return [d.expenses, d.earnings] })

      var biggest = d3.max(data, function(d) { return d[0] < d[1] ? d[1]: d[0] ; });
      console.log(biggest);

      data = d3.transpose(data);

      x.domain(d3.range(12));
      y.domain([0, biggest]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);

     // Series selection
      // We place each series into its own SVG group element. In other words,
      // each SVG group element contains one series (i.e. bars of the same colour).
      // It might be helpful to think of each SVG group element as containing one bar chart.
      var series = svg.selectAll("g.series")
          .data(data)
        .enter().append("svg:g")
          .attr("class", "series") // Not strictly necessary, but helpful when inspecting the DOM
          .attr("fill", function (d, i) { return c[i]; })
          .attr("transform", function (d, i) { return "translate(" + x1(i) + ")"; });

      // Groups selection
      var groups = series.selectAll("rect")
          .data(Object) // The second dimension in the two-dimensional data array
        .enter().append("svg:rect")
            .attr("x", 0)
            .attr("y", function (d) { return height - y(d); })
            .attr("width", x1.rangeBand())
            .attr("height", y)
            .attr("transform", function (d, i) { return "translate(" + x(i) + ")"; });
    });
});
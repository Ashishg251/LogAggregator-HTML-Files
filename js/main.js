var createGraph = function(fileName)
{
  d3.select('#somegraph').remove();
  var margin = {top: 20, right: 80, bottom: 30, left: 150},
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;


  var x = d3.scale.ordinal().rangeRoundBands([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.category10();


  var xAxis = d3.svg.axis()
      .scale(x)
      .ticks(10)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return x(d.period); })
      .y(function(d) { return y(d.logs); });

  var svg = d3.select("div #main").append("svg")
      .attr('id','somegraph')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json(fileName, function(error, data) {
    if (error) throw error;

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "period"; }));


    var continents = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {period: d.period, logs: +d[name]};
        })
      };
    });

    x.domain(data.map(function(d) { return d.period; }));

    y.domain([
      d3.min(continents, function(c) { return d3.min(c.values, function(v) { return v.logs; }); }),
      d3.max(continents, function(c) { return d3.max(c.values, function(v) { return v.logs; }); })
    ]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Request Rate (period-wise)");

    var city = svg.selectAll(".city")
        .data(continents)
      .enter().append("g")
        .attr("class", "city");

    city.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });


        var legend = svg.selectAll(".legend")
        .data(color.domain().slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color)
        .attr("transform", "translate(50,-10)");

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; })
        .attr("transform", "translate(50,-10)");;

  });

}
function addPara(tab,when)
{
  $(tab + " p").remove();
  $(tab).append("<p>Request Rate for all of " + when + " </p>");
  $(tab + " p").css("margin-top","20px");
  $(tab + " p").css("font-size","17px");
}
function filter(value)
{
  $("#radio").show();
  $('#radio input[value="all"]').prop('checked', true);
  $('#radio input').on('change', function() {
  var data=$('input[name="filter"]:checked', '#radio').val();
    createGraph("json/rate/"+data+"/"+value+"_log_"+data+".json");
  });
}
$(function(){
  $('#y2015').click(function(){
      $('#dropdownMenu1').html('2015');
      addPara("#tab1","2015");
      createGraph("json/rate/all/monthwise_log_all.json");
      filter("monthwise");
    });
  $('#y15').click(function(){
      $('#dropdownMenu2').html('2015');

      $("#monthList1 li").click(function() {
          var month = $(this).text();
          var id = $(this).children().attr('id');
          $('#dropdownMenu3').html(month);
          addPara("#tab2",month);
          createGraph("json/rate/all/"+id+"_log_all.json");
            filter(id);
      });


      $('#y2015').click(function(){
          $('#dropdownMenu1').html('2015');
          addPara("#tab1","2015");
          createGraph("json/rate/all/monthwise_log.json");
      });
  });
  $('#year_tab').click(function(){
      $('#dropdownMenu2').html('Year');
      $('#dropdownMenu3').html('Month');
  });
  $('#month_tab').click(function(){
      $('#dropdownMenu1').html('Year');
  });
});

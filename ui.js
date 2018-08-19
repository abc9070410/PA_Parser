
function hideDIV(id)
{
    document.getElementById(id).style.visibility = "hidden";
    //document.getElementById(buttonID).style.display = "none";
}

function showDIV(id)
{
    document.getElementById(id).style.visibility = "visible";
    //document.getElementById(buttonID).style.display = "block";
    //document.getElementById(buttonID).style.textAlign = "center";
}

function updateTitle()
{
    var path = window.location.pathname;
    var page = path.split("/").pop();
    
    var asTemp = page.split(/\./);
    
    log(asTemp[asTemp.length - 2]);

    document.getElementById("idTitle").innerHTML = asTemp[asTemp.length - 2].replace(/_/g, " ");
}



function downloadLog()
{
    var today=new Date();
    var currentDateTime =
        today.getFullYear() + "_" + 
        (today.getMonth()+1) + "_" + 
        today.getDate() + "_" + 
        today.getHours() + "_" + 
        today.getMinutes() + "_" + 
        today.getSeconds();

    downloadText(currentDateTime + ".log", gsTempLog);
    
    log("download log done");
}

function downloadText(filename, text) 
{
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function updateFailResult(str)
{
    updateResult("<p style='color:red;display:inline'>FAIL! (" + str + ") </p>");
}
function updatePassResult(str)
{
    updateResult("<p style='color:Cyan;display:inline'>PASS! (" + str + ") </p>");
}


function updateResultWithTab(str)
{
    log(str.length);
    var iSpace = 30 - str.length;
    
    for (var i = 0; i < iSpace; i++)
    {
        str += "&nbsp;";
    }
    
    updateResult(str);
    
    moveStatusBar(10);
}

function updateResult(str)
{
    gsResult += str + "&nbsp;";
    document.getElementById("idResult").innerHTML = gsResult;
}


function moveStatusBar() {
  var elem = document.getElementById("idStatusBar");   
  var width = 1;
  var id = setInterval(frame, 3);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++; 
      elem.style.width = width + '%'; 
    }
  }
}


function drawCSV()
{
    if (gasCSV[IDX_CSV_CMD_DURATION].length > 0)
    {
        document.getElementById("idCmdDurationTitle").innerHTML = "Cmd Duration Time (us)";
        drawSVG("idDrawCmdDuration", IDX_CSV_CMD_DURATION);
    }
    if (gasCSV[IDX_CSV_COMRESET_RESPONSE].length > 0)
    {
        document.getElementById("idComresetResponseTitle").innerHTML = "COMRESET Response Time (us)";
        drawSVG("idDrawComresetResponse", IDX_CSV_COMRESET_RESPONSE);
    }
    if (gasCSV[IDX_CSV_COMWAKE_RESPONSE].length > 0)
    {
        document.getElementById("idComwakeResponseTitle").innerHTML = "COMWAKE Response Time (us)";
        drawSVG("idDrawComwakeResponse", IDX_CSV_COMWAKE_RESPONSE);
    }
}



function drawSVG(sDrawID, iCSVIdx)
{
    log("draw " + sDrawID + " ID:" + iCSVIdx + " length:" + gasCSV[iCSVIdx].length);
    
    var iSpace = 40;

    var margin = {top: iSpace, right: iSpace, bottom: iSpace, left: iSpace};
    
    var iWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    var iHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    
    iWidth = Math.floor(iWidth * 0.9);
    iHeight = Math.floor(iHeight * 0.9);
    
    var iDrawWidth = iWidth - margin.left - margin.right;
    var iDrawHeight = iHeight - margin.top - margin.bottom;    

    var maxValue = 0;

    var xNudge = iSpace;
    var yNudge = iSpace;

    var minNo;
    var maxNo;

    var rows = d3.csvParseRows(gasCSV[iCSVIdx], function(d, i) {
      return {
         no: Number(d[0]), 
         value: Number(d[1])
      };
    });

    maxValue = d3.max(rows, function(d) { return d.value; });
    minNo = d3.min(rows, function(d) {return d.no; });
    maxNo = d3.max(rows, function(d) { return d.no; });

    var y = d3.scaleLinear()
                .domain([0,maxValue])
                .range([iHeight,0]);

    var x = d3.scaleLinear()
                .domain([minNo,maxNo])
                .range([0,iWidth]);

    var yAxis = d3.axisLeft(y);

    var xAxis = d3.axisBottom(x);

    var valueLine = d3.line()
        .defined(function(d) {
            return d.value;
        })
        .x(function(d){ return x(d.no); })
        .y(function(d){ return y(d.value); })
        //.curve(d3.curveCardinal)
        ;

    
    log("Width:" + iDrawWidth + "_" + iWidth +",Heigth:" + iDrawHeight + "_" + iHeight);
    
    // Define the div for the tooltip
    var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    var svg = d3.select("#" + sDrawID).append("svg").attr("id","svg").attr("height", "100%").attr("width", "100%");
    
    
    var chartGroup = svg.append("g").attr("class","chartGroup").attr("transform","translate("+xNudge+","+yNudge+")");

    chartGroup.append("path")
        .attr("class","line")
        .attr("transform","translate(" + margin.left + "," + 0 + ")")
        .attr("d",function(d){ return valueLine(rows); }); 
    chartGroup.selectAll("dot")
        .data(rows)
        .enter().append("circle")
        .attr("transform","translate(" + margin.left + "," + 0 + ")")
        .attr("r", 3.5)
        .attr("fill", "blue")
        .attr("cx", function(d) { return x(d.no); })
        .attr("cy", function(d) { return y(d.value); })
        .on("mouseover", function(d) {
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		

            var iTime = getNumber(d.value);
            var sUnit = " us";
            if (iTime > 1000)
            {
                iTime /= 1000;
                sUnit = " ms";
            }
            
            var iNo = getNumber(d.no);
            var sInfo = getPAInfo(gaaiCSVPAIdx[iCSVIdx][iNo]) + "<br/>" +
                        getClaimType(gaaiCSVPAIdx[iCSVIdx][iNo]) + iNo + "<br/>" +
                        iTime + sUnit;

            div	.html(sInfo)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

    chartGroup.append("g")
        .attr("class","axis x")
        .attr("transform","translate(" + margin.left + "," + iHeight + ")")
        .call(xAxis);

    chartGroup.append("g")
        .attr("class","axis y")
        .attr("transform","translate(" + margin.left + "," + 0 + ")")
        .call(yAxis);
        
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Time (us)");;
      
    chartGroup.append("text")
      .attr("transform","translate(" + iWidth + "," + (iHeight - iSpace) + ")")
      //.attr("x", -(iSpace * 2))
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("No");;
}

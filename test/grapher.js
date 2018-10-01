var googleSheetsID = '1zp-zkMVmhCKMmgodcMhhADXi8hhKuyXsriW0Nzi8HZg';

var rows = 32; // how many rows to pull?

var requestURL =
'https://sheets.googleapis.com/v4/spreadsheets/' +
googleSheetsID +
'/values/Sheet1!A1:K' + rows + '?valueRenderOption=UNFORMATTED_VALUE';

var GoogleAPIkey = 'AIzaSyDQmiqM5WxHRj9WX7bMVi7nvp_AyV-d9MM'; // AIzaSyDQmiqM5WxHRj9WX7bMVi7nvp_AyV-d9MM

var chartLines = [];

$.getJSON(requestURL + '&key=' + GoogleAPIkey, function(data){ Graph(data); });


function Graph(cellData)
{
	console.log(cellData);
	var columns = 0; // how many rows actually contain data?
	for (i = 1; i <= rows - 3; i++) // start at one because 1 contains headers, and rows - 2 due to totals being at the bottom (and it being a zero indexed array, row 1 = [0]
	{
		if (cellData.values[i].length > 0)
		{ columns = i; }
	}
	console.log('chart columns:' + columns);
	
	var chartData = [];
	chartData[0] = [0, cellData.values[31][0], columns - 1, ['Concept Art', 'Animations', 'Patreon', 'Total Expenses', 'Net Expenses'], ['#38761D', '#4A86E8', '#FF5900', '#980000', '#9900FF'], ['','dashed','','','dashed'], ['#2D333A', [250, 500, 750, 1000]]]
	// format: [min value, max value, number of columns, color of serieses] note: headers are at [x][0]
	for (i = 1; i <= columns; i++)
	{ chartData[i] = [cellData.values[i][0], cellData.values[i][6], cellData.values[i][7], cellData.values[i][8], cellData.values[i][9], cellData.values[i][10]]; }
	
	var charts = document.getElementsByClassName('chart');
	console.log('charts:' + charts.length + ' (expected: 1)');

	var fundingChart = charts[0];
	fundingChart.innerHTML = '';
	
	DrawGraph(charts[charts.length - 1], chartData);
}

function GetLongDate(date)
{
	returnstring = '';
	
	switch (date.getMonth())
	{
		case 0:
		returnstring += 'Jan';
		break;
		case 1:
		returnstring += 'Feb';
		break;
		case 2:
		returnstring += 'Mar';
		break;
		case 3:
		returnstring += 'Apr';
		break;
		case 4:
		returnstring += 'May';
		break;
		case 5:
		returnstring += 'Jun';
		break;
		case 6:
		returnstring += 'Jul';
		break;
		case 7:
		returnstring += 'Aug';
		break;
		case 8:
		returnstring += 'Sep';
		break;
		case 9:
		returnstring += 'Oct';
		break;
		case 10:
		returnstring += 'Nov';
		break;
		case 11:
		returnstring += 'Dec';
		break;
	}
	
	returnstring += ' ' + date.getDate();
	
	return returnstring;
}

function DrawGraph(chartDiv, data)
{
	var div = document.createElement("div");
	div.className = 'chartcontainer';
	chartDiv.appendChild(div);
	chartDiv = chartDiv.childNodes[0];
	console.log(data);
	
	var previousValues = []
	
	for (i = 0; i <= data[0][4].length; i++)
	{ previousValues[i] = []; }
	
	var chartWidth = chartDiv.offsetWidth;
	var chartHeight= chartDiv.offsetHeight;
	var daterange  = data[data.length-1][0] - data[1][0];
	var epoch = new Date(1899, 11, 30); // google sheets epoch starts at December 30, 1899
	console.log('chartWidth:' + chartWidth + ' chartHeight:' + chartHeight);
	
	for (i = 0; i < data[0][6][1].length; i++)
	{
		var div = document.createElement("div");
		div.style.background = data[0][6][0];
		div.style.bottom = (100 * (data[0][6][1][i] / data[0][1])) + '%';
		div.className = 'valueline';
		var value = document.createElement("div");
		value.className = 'value';
		value.innerHTML = '$' + data[0][6][1][i];
		
		div.appendChild(value);
		chartDiv.appendChild(div);
	}
	
	for (i = 2; i < data.length; i++) // start at 2 to skip the first element cause it looks better
	{
		var div = document.createElement("div");
		div.style.background = data[0][6][0];
		div.style.left = (100 * (data[i][0] - data[1][0]) / daterange) + '%';
		div.className = 'headerline';
		var value = document.createElement("div");
		value.className = 'header';
		var date = new Date(epoch.valueOf());
		date.setDate(epoch.getDate() + data[i][0]);
		value.innerHTML = GetLongDate(date);
		
		div.appendChild(value);
		chartDiv.appendChild(div);
	}

	
	for (i = 1; i < data.length; i++)
	{
		chartLines[i-1] = [];
		for (j = 0; j < data[0][4].length; j++)
		{
			index = j+1;
			if (data[i][index] !== undefined && data[i][index] != '')
			{
				var currentTop = 1 - ((data[i][index]) / data[0][1]);
				var currentLeft = (data[i][0] - data[1][0]) / daterange; //(i-1) / data[0][2];
				var div = document.createElement("div");
				div.style.background = data[0][4][j];
				div.style.left = (currentLeft * 100) + '%';
				div.style.top = (100 * currentTop) + '%';
				div.className = 'dot';
				var tooltip = document.createElement("div");
				tooltip.className = 'tooltip donatebutton shadow';
				var date = new Date(epoch.valueOf());
				date.setDate(epoch.getDate() + data[i][0]);
				tooltip.innerHTML = GetLongDate(date) + '<br>' + data[0][3][j] + ': $' + (data[i][index].toFixed(2));
				if (i > data.length / 2)
				{ tooltip.style.right = '0'; }
				
				if (previousValues[j].length > 0)
				{
					var divLine = document.createElement("div");
					//divLine.style.background = data[0][4][j];
					divLine.style.left = (previousValues[j][0] * 100) + '%';
					divLine.style.top = (100 * previousValues[j][1]) + '%';
					divLine.style.borderColor = data[0][4][j];
					if (data[0][5][j].length > 0)
					{ divLine.style.borderStyle = data[0][5][j]; }
					var opposite = (previousValues[j][1] - currentTop);
					var adjacent = (currentLeft - previousValues[j][0]);
					var o = opposite * chartHeight;
					var a = adjacent * chartWidth;
					divLine.style.width = (Math.sqrt(o * o + a * a)) + 'px';
					divLine.style.transform = 'rotate(' + (-Math.atan(o / a)) + 'rad)';
					divLine.className = 'line';
					chartLines[i-2][j] = [divLine, [opposite, adjacent]];
					chartDiv.appendChild(divLine);
				}
				
				div.appendChild(tooltip);
				chartDiv.appendChild(div);
				previousValues[j] = [currentLeft, currentTop];
			}
		}
		
	}
}


var width = $(window).width();
$(window).on('resize', function(){
	if($(this).width() != width){
		width = $(this).width();
		
		var chartDiv = document.getElementsByClassName('chartcontainer')[0];
		var chartWidth = chartDiv.offsetWidth;
		var chartHeight= chartDiv.offsetHeight;
		for (i = 0; i < chartLines.length; i++)
		{
			for (j = 0; j < chartLines[i].length; j++)
			{
				if (chartLines[i][j] !== undefined)
				{
					var o = chartLines[i][j][1][0] * chartHeight;
					var a = chartLines[i][j][1][1] * chartWidth;
					chartLines[i][j][0].style.width = (Math.sqrt(o * o + a * a)) + 'px';
					chartLines[i][j][0].style.transform = 'rotate(' + (-Math.atan(o / a)) + 'rad)';
				}
			}
		}
	}
});
























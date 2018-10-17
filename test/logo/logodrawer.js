var logoclass = 'logo-draw';

var logos = document.getElementsByClassName(logoclass);
var logo = logos[0];
//logo.innerHTML = '';

var svg = logo.childNodes;
var paths = svg[0].childNodes;
paths = paths[1].childNodes;
paths = [ paths[1], paths[3], paths[5] ];
var pathLengths = [];

var run = function() { Animate(); }
var startTime, deltaTime, totalTime, totalDuration, duration1, duration2, timer2;

SetLogo();


function SetLogo()
{
	for (i = 0; i < paths.length; i++)
	{
		if (paths[i].tagName == 'path')
		{
			pathLengths[i] = paths[i].getTotalLength();
			paths[i].setAttribute('stroke-dasharray', pathLengths[i]);
		}
		else
		{ pathLengths[i] = parseFloat(paths[i].getAttribute('stroke-dasharray')); }
		paths[i].style.strokeDashoffset = pathLengths[i];
		paths[i].setAttribute('display', 'inline');
	}
	
	setTimeout(function() { StartAnimation(); }, 500);
}

function StartAnimation()
{
	startTime = new Date();
	timer2 = deltaTime = totalTime = 0;
	totalDuration = 0.8;
	duration1 = (4/5) * totalDuration;
	duration2 = (1/5) * totalDuration;
	setTimeout(run, 0);
}

function Animate()
{
	deltaTime = (new Date() - startTime) / 1000;
	totalTime += deltaTime;
	
	if (totalTime <= duration1)
	{
		var amount = Ease.easeInCubic(totalTime / duration1);
		for (i = 1; i < paths.length; i++)
		{ paths[i].style.strokeDashoffset = pathLengths[i] + (amount * pathLengths[i]); }
	}
	else
	{
		for (i = 1; i < paths.length; i++)
		{ paths[i].style.strokeDashoffset = 0; }
		timer2 += deltaTime;
		var amount = Ease.easeOutQuad(timer2 / duration2);
		paths[0].style.strokeDashoffset = pathLengths[0] - (amount * pathLengths[0]);
	}
	startTime = new Date();
	if (totalTime <= totalDuration)
	{ setTimeout(run, 0); }
	else
	{
		for (i = 0; i < paths.length; i++)
		{ paths[i].style.strokeDashoffset = 0; }
	}
}



// https://gist.github.com/gre/1650294
Ease = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity 
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity 
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration 
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity 
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity 
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration 
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}
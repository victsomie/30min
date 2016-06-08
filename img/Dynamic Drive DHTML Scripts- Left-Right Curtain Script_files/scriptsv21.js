//** AnyLink CSS Menu v2.4a- (c) Dynamic Drive DHTML code library: http://www.dynamicdrive.com
//** Script Download/ instructions page: http://www.dynamicdrive.com/dynamicindex1/anylinkcss.htm
//** January 19', 2009: Script Creation date

//** Custom version for DD site


//**May 23rd, 09': v2.1
	//1) Automatically adds a "selectedanchor" CSS class to the currrently selected anchor link
	//2) For image anchor links, the custom HTML attributes "data-image" and "data-overimage" can be inserted to set the anchor's default and over images.

//**June 1st, 09': v2.2
	//1) Script now runs automatically after DOM has loaded. ddanylinkcssmenu.init) can now be called in the HEAD section

//**May 23rd, 10': v2.21: Fixes script not firing in IE when inside a frame page

//**June 28th, 11': v2.3: Menu updated to work properly in popular mobile devices such as iPad/iPhone and Android tablets.

//**June 29th, 15': v2.4: Removed script powered shadow effect. Just use CSS3 if you wish a drop down menu to carry a shadow

if (typeof dd_domreadycheck=="undefined") //global variable to detect if DOM is ready
	var dd_domreadycheck=false

var ddanylinkcssmenu={

menusmap: {},
preloadimages: [],
effects: {delayhide: 100, fade:{enabled:false, duration:500}}, //customize menu effects
ie8below: /MSIE [1-8]\./.test( navigator.userAgent ), // detect IE8 and below, which doesn't CSS media queries
codehighlight: null, // reference td > .codehighlight and td > pre elements

requestAnimationFrame: function(f){
	var requestAnimationFrame = window.requestAnimationFrame
                               || window.mozRequestAnimationFrame
                               || window.webkitRequestAnimationFrame
                               || window.msRequestAnimationFrame
                               || function(f){f()}
	return requestAnimationFrame(f)

},


mobilemql: (function(){
	if (window.matchMedia){
		return window.matchMedia("screen and (max-width: 730px)")
	}
	else{
		return { // matchMedia shim (for IE9). addListener() needs to be called to properly set matches prop
			matches: false,
			resizetimer: null,
			setmatches: function(maxwinwidth){
				var winwidth = (window.innerWidth || ddanylinkcssmenu.standardbody.clientWidth)-20
				this.matches = (winwidth <= maxwinwidth)? true : false
			},
			addListener: function(callback, maxwinwidth){
				ddanylinkcssmenu.mobilemql.setmatches(maxwinwidth)
				ddanylinkcssmenu.addEvent([window], function(e){
					clearTimeout(ddanylinkcssmenu.mobilemql.resizetimer)
					ddanylinkcssmenu.mobilemql.resizetimer = setTimeout(function(){
						ddanylinkcssmenu.mobilemql.setmatches(maxwinwidth)
						callback()
					}, 50)
				}, "resize")
			}
		}
	}
})(),

makesticky: {
	target: null,
	docheight: null,
	docscrollHeight: null,
	contentcolumnheight: null,
	rightcolumnheight: null,
	resizeTimer: null,
	refreshCoords: function(){
		this.docheight = window.innerHeight || ddanylinkcssmenu.standardbody.clientHeight-15
		this.docscrollHeight = ddanylinkcssmenu.standardbody.scrollHeight-20
		this.contentcolumnheight = document.getElementById("contentcolumn").offsetHeight
		this.rightcolumnheight = document.getElementById("rightcolumn").offsetHeight
		ddanylinkcssmenu.getoffsetof( this.target )
	},
	stickit: function(){
		var target = this.target
		var offsettop = target._offsets.top
		if (offsettop == 0 || ( this.rightcolumnheight >= this.contentcolumnheight)){ // if offsettop of banner container is 0, it means it's hidden, or if right column is longer than content column
			return
		}
		var docscrolly = window.pageYOffset || ddanylinkcssmenu.standardbody.scrollTop
		if ( docscrolly > offsettop && ((docscrolly + this.docheight) < this.docscrollHeight) ){
			if (!ddanylinkcssmenu.setcssclass(target, "sticky", "check")){
				ddanylinkcssmenu.setcssclass(target, "sticky", "add")
			}
		}
		else{
			if (ddanylinkcssmenu.setcssclass(target, "sticky", "check"))
				ddanylinkcssmenu.setcssclass(target, "sticky", "remove")
		}
	},
	init:function(target){
		this.target = target
		this.refreshCoords()
		ddanylinkcssmenu.addEvent([window], function(){
			ddanylinkcssmenu.requestAnimationFrame(function(){
				ddanylinkcssmenu.makesticky.stickit()
			})
		}, "scroll")
	}
},

dimensions: {},
ismobile:navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) != null, //boolean check for popular mobile browsers

getoffset:function(what, offsettype){
	return (what.offsetParent)? what[offsettype]+this.getoffset(what.offsetParent, offsettype) : what[offsettype]
},

getoffsetof:function(el){
	el._offsets={left:this.getoffset(el, "offsetLeft"), top:this.getoffset(el, "offsetTop"), h: el.offsetHeight}
},

getdimensions:function(menu){
	this.dimensions={anchorw:menu.anchorobj.offsetWidth, anchorh:menu.anchorobj.offsetHeight,
		docwidth:(window.innerWidth ||this.standardbody.clientWidth)-20,
		docheight:(window.innerHeight ||this.standardbody.clientHeight)-15,
		docscrollx:window.pageXOffset || this.standardbody.scrollLeft,
		docscrolly:window.pageYOffset || this.standardbody.scrollTop
	}
	if (!this.dimensions.dropmenuw){
		this.dimensions.dropmenuw=menu.dropmenu.offsetWidth
		this.dimensions.dropmenuh=menu.dropmenu.offsetHeight
	}
},

isContained:function(m, e){
	var e=window.event || e
	var c=e.relatedTarget || ((e.type=="mouseover")? e.fromElement : e.toElement)
	while (c && c!=m)try {c=c.parentNode} catch(e){c=m}
	if (c==m)
		return true
	else
		return false
},

setopacity:function(el, value){
	el.style.opacity=value
	if (typeof el.style.opacity!="string"){ //if it's not a string (ie: number instead), it means property not supported
		el.style.MozOpacity=value
		if (document.all && typeof el.style.filter=="string"){
			el.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity="+ value*100 +")"
		}
	}
},

showmenu:function(menuid){
	var menu=ddanylinkcssmenu.menusmap[menuid]
	clearTimeout(menu.hidetimer)
	this.getdimensions(menu)
	if (ddanylinkcssmenu.mobilemql.matches)
		return
	var targetanchorpoint = menu.anchorpoint
	this.getoffsetof(targetanchorpoint)
	var posx=targetanchorpoint._offsets.left + (menu.orientation=="lr"? this.dimensions.anchorw : 0) //base x pos
	var posy=targetanchorpoint._offsets.top+this.dimensions.anchorh - (menu.orientation=="lr"? this.dimensions.anchorh : 0)//base y pos
	if (posx+this.dimensions.dropmenuw>this.dimensions.docscrollx+this.dimensions.docwidth){ //drop left instead?
		posx=posx-this.dimensions.dropmenuw + (menu.orientation=="lr"? -this.dimensions.anchorw : this.dimensions.anchorw)
	}
	if (posy+this.dimensions.dropmenuh>this.dimensions.docscrolly+this.dimensions.docheight){  //drop up instead?
		posy=Math.max(posy-this.dimensions.dropmenuh - (menu.orientation=="lr"? -this.dimensions.anchorh : this.dimensions.anchorh), this.dimensions.docscrolly) //position above anchor or window's top edge
	}
	if (this.effects.fade.enabled){
		this.setopacity(menu.dropmenu, 0) //set opacity to 0 so menu appears hidden initially
	}
	menu.dropmenu.setcss({left:posx+'px', top:posy+'px', visibility:'visible'})
	if (this.effects.fade.enabled){
		clearInterval(menu.animatetimer)
		menu.curanimatedegree=0
		menu.starttime=new Date().getTime() //get time just before animation is run
		menu.animatetimer=setInterval(function(){ddanylinkcssmenu.revealmenu(menuid)}, 20)
	}
},

revealmenu:function(menuid){
	var menu=ddanylinkcssmenu.menusmap[menuid]
	var elapsed=new Date().getTime()-menu.starttime //get time animation has run
	if (elapsed<this.effects.fade.duration){
		this.setopacity(menu.dropmenu, menu.curanimatedegree)
	}
	else{
		clearInterval(menu.animatetimer)
		this.setopacity(menu.dropmenu, 1)
		menu.dropmenu.style.filter=""
	}
	menu.curanimatedegree=(1-Math.cos((elapsed/this.effects.fade.duration)*Math.PI)) / 2
},

setcss:function(param){
	for (prop in param){
		this.style[prop]=param[prop]
	}
},

setcssclass:function(el, targetclass, action){
	var needle=new RegExp("(^|\\s+)"+targetclass+"($|\\s+)", "ig")
	if (action=="check")
		return needle.test(el.className)
	else if (action=="remove")
		el.className=el.className.replace(needle, "")
	else if (action=="add" && !needle.test(el.className))
		el.className+=" "+targetclass
},

hidemenu:function(menuid){
	var menu=ddanylinkcssmenu.menusmap[menuid]
	clearInterval(menu.animatetimer)
	menu.dropmenu.setcss({visibility:'hidden', left:0, top:0})
},

getElementsByClass:function(targetclass){
	if (document.querySelectorAll)
		return document.querySelectorAll("."+targetclass)
	else{
		var classnameRE=new RegExp("(^|\\s+)"+targetclass+"($|\\s+)", "i") //regular expression to screen for classname
		var pieces=[]
		var alltags=document.all? document.all : document.getElementsByTagName("*")
		for (var i=0; i<alltags.length; i++){
			if (typeof alltags[i].className=="string" && alltags[i].className.search(classnameRE)!=-1)
				pieces[pieces.length]=alltags[i]
		}
		return pieces
	}
},

addEvent:function(targetarr, functionref, tasktype){
	if (targetarr.length>0){
		var target=targetarr.shift()
		if (target.addEventListener)
			target.addEventListener(tasktype, functionref, false)
		else if (target.attachEvent)
			target.attachEvent('on'+tasktype, function(){return functionref.call(target, window.event)})
		this.addEvent(targetarr, functionref, tasktype)
	}
},

domready:function(functionref){ //based on code from the jQuery library
	if (dd_domreadycheck){
		functionref()
		return
	}
	// Mozilla, Opera and webkit nightlies currently support this event
	if (document.addEventListener) {
		// Use the handy event callback
		document.addEventListener("DOMContentLoaded", function(){
			document.removeEventListener("DOMContentLoaded", arguments.callee, false )
			functionref();
			dd_domreadycheck=true
		}, false )
	}
	else if (document.attachEvent){
		// If IE and not an iframe
		// continually check to see if the document is ready
		if ( document.documentElement.doScroll && window == window.top) (function(){
			if (dd_domreadycheck) return
			try{
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left")
			}catch(error){
				setTimeout( arguments.callee, 0)
				return;
			}
			//and execute any waiting functions
			functionref();
			dd_domreadycheck=true
		})();
	}
	if (document.attachEvent && parent.length>0) //account for page being in IFRAME, in which above doesn't fire in IE
		this.addEvent([window], function(){functionref()}, "load");
},

addState:function(anchorobj, state){
	if (ddanylinkcssmenu.mobilemql.matches)
		return
	if (anchorobj.getAttribute('data-image')){
		var imgobj=(anchorobj.tagName=="IMG")? anchorobj : anchorobj.getElementsByTagName('img')[0]
		if (imgobj){
			imgobj.src=(state=="add")? anchorobj.getAttribute('data-overimage') : anchorobj.getAttribute('data-image')
		}
	}
	else
		ddanylinkcssmenu.setcssclass(anchorobj, "selectedanchor", state)
},


setupmenu:function(targetclass, anchorobj, pos){
	this.standardbody=(document.compatMode=="CSS1Compat")? document.documentElement : document.body
	var relattr=anchorobj.getAttribute("rel")
	var dropmenuid=relattr.replace(/\[(\w+)\]/, '')
	var menu=this.menusmap[targetclass+pos]={
		id: targetclass+pos,
		anchorobj: anchorobj,
		anchorpoint: document.getElementById('firstmenuitem'),
		dropmenu: document.getElementById(dropmenuid),
		revealtype: (relattr.length!=dropmenuid.length && RegExp.$1=="click") || ddanylinkcssmenu.ismobile? "click" : "mouseover",
		orientation: anchorobj.getAttribute("rev")=="lr"? "lr" : "ud",
	}
	menu.anchorobj._internalID=targetclass+pos
	menu.anchorobj._isanchor=true
	menu.dropmenu._internalID=targetclass+pos
	document.body.appendChild(menu.dropmenu) //move drop down div to end of page
	menu.dropmenu.setcss=this.setcss
	this.addEvent([menu.anchorobj, menu.dropmenu], function(e){ //MOUSEOVER event for anchor
		var menu=ddanylinkcssmenu.menusmap[this._internalID]
		if (this._isanchor && menu.revealtype=="mouseover" && !ddanylinkcssmenu.isContained(this, e)){ //event for anchor
			ddanylinkcssmenu.showmenu(menu.id)
			ddanylinkcssmenu.addState(this, "add")
		}
		else if (typeof this._isanchor=="undefined"){ //event for drop down menu
			clearTimeout(menu.hidetimer)
		}
	}, "mouseover")
	this.addEvent([menu.anchorobj, menu.dropmenu], function(e){ //MOUSEOUT event for anchor, dropmenu
		if (!ddanylinkcssmenu.isContained(this, e)){
			var menu=ddanylinkcssmenu.menusmap[this._internalID]
			menu.hidetimer=setTimeout(function(){
				ddanylinkcssmenu.addState(menu.anchorobj, "remove")
				ddanylinkcssmenu.hidemenu(menu.id)
			}, ddanylinkcssmenu.effects.delayhide)
		}
	}, "mouseout")
	this.addEvent([menu.anchorobj, menu.dropmenu], function(e){ //CLICK event for anchor, dropmenu
		var menu=ddanylinkcssmenu.menusmap[this._internalID]
		if ( this._isanchor && menu.revealtype=="click"){
			if (menu.dropmenu.style.visibility=="visible")
				ddanylinkcssmenu.hidemenu(menu.id)
			else{
				ddanylinkcssmenu.addState(this, "add")
				ddanylinkcssmenu.showmenu(menu.id)
			}
			if (e.preventDefault && !ddanylinkcssmenu.mobilemql.matches)
				e.preventDefault()
		}
		else
			menu.hidetimer=setTimeout(function(){ddanylinkcssmenu.hidemenu(menu.id)}, ddanylinkcssmenu.effects.delayhide)
	}, "click")
},

init:function(targetclass){
	this.domready(function(){ddanylinkcssmenu.trueinit(targetclass)})
},

trueinit:function(targetclass){
	var mobiletoggler = document.getElementById('ddsite-mobiletoggle')
	var topmenuul = document.getElementById('ddsite-topmenuul')
	if (topmenuul){
		var searchli = document.getElementById('search')
		var anchors=this.getElementsByClass(targetclass)
		var preloadimages=this.preloadimages
		var rightcolumnad = document.getElementById('rightcolumnad')
		this.codehighlight = document.querySelectorAll('td > p.codehighlight, td > pre')
	
		for (var i=0; i<anchors.length; i++){
			if (anchors[i].getAttribute('data-image')){ //preload anchor image?
				preloadimages[preloadimages.length]=new Image()
				preloadimages[preloadimages.length-1].src=anchors[i].getAttribute('data-image')
			}
			if (anchors[i].getAttribute('data-overimage')){ //preload anchor image?
				preloadimages[preloadimages.length]=new Image()
				preloadimages[preloadimages.length-1].src=anchors[i].getAttribute('data-overimage')
			}
			this.setupmenu(targetclass, anchors[i], i)
		}
		this.addEvent([mobiletoggler], function(e){
			topmenuul.style.display = (topmenuul.style.display == "block")? "none" : "block"
			e.stopPropagation()
		}, "click")
		this.addEvent([searchli], function(e){
			e.stopPropagation()
		}, "click")
		this.addEvent([document], function(e){
			if (ddanylinkcssmenu.mobilemql.matches && !ddanylinkcssmenu.ie8below)
				topmenuul.style.display = "none"
		}, "click")
		this.mobilemql.addListener(function(){
			if ( !ddanylinkcssmenu.ie8below )
				topmenuul.style.display = (ddanylinkcssmenu.mobilemql.matches)? "none" : "block"
		}, 730)
	}

	if (rightcolumnad){
		ddanylinkcssmenu.makesticky.init( rightcolumnad )
		ddanylinkcssmenu.makesticky.stickit()
		this.addEvent([window], function(e){
			ddanylinkcssmenu.setcssclass(rightcolumnad, "sticky", "remove")
			ddanylinkcssmenu.makesticky.refreshCoords()
			ddanylinkcssmenu.makesticky.stickit()
		}, "load")
		this.addEvent([window], function(e){
			clearTimeout(ddanylinkcssmenu.makesticky.resizeTimer)
			ddanylinkcssmenu.makesticky.resizeTimer = setTimeout(function(){
				ddanylinkcssmenu.setcssclass(rightcolumnad, "sticky", "remove")
				ddanylinkcssmenu.makesticky.refreshCoords()
				ddanylinkcssmenu.makesticky.stickit()
			}, 100)
		}, "resize")
	}

}

}


function dd_scrolltotop(duration){
	duration = duration || 500
	var rootel = (document.compatMode =="BackCompat")? document.body : document.documentElement
	if (rootel.scrollTop == 0) // in some browsers such as chrome, use document.body instead of document.documentElement
		rootel = document.body
	var curscrolltop = rootel.scrollTop, scrolltimer, elapsedtime, starttime = new Date().getTime(), animatedegree = 0
	var totaldis = curscrolltop
	clearTimeout(scrolltimer)
	function jumptop(){
		elapsedtime = new Date().getTime() - starttime
		if (elapsedtime < duration){
			rootel.scrollTop = totaldis - (totaldis * (1-Math.cos((elapsedtime/duration)*Math.PI)) / 2)
			scrolltimer = setTimeout(function(){jumptop()}, 10)
		}
	}
	jumptop()
}

ddanylinkcssmenu.init("dd-anchorclass")
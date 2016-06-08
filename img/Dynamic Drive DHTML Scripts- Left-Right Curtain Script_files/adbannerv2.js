var ddcurpageurl=window.location.toString() //current page url
var ddscripttitle=document.title.replace(/^D.+[-:]\s+/,"")
ddscripttitle=ddscripttitle.replace(/[<>]/g, "")

// Prevent parameters being added to URL - Google PII maddness
if ( /(@)|(ip=)/i.test(location.search) ){
	location.search = ''
}


(function(){
  var bsa = document.createElement('script');
     bsa.type = 'text/javascript';
     bsa.async = true;
     bsa.src = 'http://s3.buysellads.com/ac/bsa.js';
  (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(bsa);
})();


var ran_num=Math.floor(Math.random()*10) // 0 to 9

if (ran_num <= 3){
	document.write('<div id="bsap_1305062" class="bsarocks bsap_f1d07212cbe850be7e3db47ab3e68732"></div>');
}
else{
	document.write('<ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-7051847089736268" data-ad-slot="3413554237"></ins>');
	(adsbygoogle = window.adsbygoogle || []).push({});
}



/////Highlight Current Category/////

var testre=/dynamicindex(\d+)/i
//#D7FBBC
if (ddcurpageurl.match && ddcurpageurl.match(testre)!=null){
var catid="#c"+ddcurpageurl.match(testre)[1]
document.write('<style type="text/css">')
document.write(catid+" a{ color: black; background: #F0F0F0}")
document.write('<\/style>')
}

/////Style Supplimentary pages differently/////

if (ddcurpageurl.indexOf("suppliment")!=-1){
document.write('<style type="text/css">')
document.write("#leftbar .headers{background:#5D5D5D}")
document.write('<\/style>')
}


function jsenabledmark(id){
if (ddcurpageurl.indexOf("dynamicdrive.")!=-1){
if (id=="deli")
window.location='http://del.icio.us/post?&url='+encodeURIComponent(location.href)+'&title='+encodeURIComponent("Dynamic Drive JavaScripts- "+ddscripttitle)
else if (id=="furl")
window.location='http://www.furl.net/storeIt.jsp?u='+encodeURIComponent(location.href)+'&t='+encodeURIComponent("Dynamic Drive JavaScripts- "+ddscripttitle)
}
return false
}


/////Highlight textarea stuff/////

function highlight(x){
var x=x+1
document.forms[x].elements[0].select()
//if (document.getElementById && tally_url!="invalid")
//tally_calculate()
}


/////Page Nav Select Menu function/////

function pagenavselect_dd(selectobj){
location=selectobj.options[selectobj.selectedIndex].value
}




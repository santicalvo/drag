

var comprueba_ejercicio = function(ev){
	var correctas = [ 2,4,3,1 ];
	items.correct( correctas );
	$(document).trigger("EJERCICIO_COMPROBADO");
}
var reset_ejercicio = function(ev){
	items.reset();
}
var bot_comprobar, bot_borrar;

var fix_bots_height = function(){
   var bots = $("#bots_comprobacion"),
       content = $("#content"),
       content_pos = content.offset();
   bots.css("top", content_pos.top);
   bots.css("right", 10);
   bots.css("min-height", content.height()+"px");
   bots.css("height", (10+content.height()) +"px");
   
}

$(document).ready(function(){
	bot_comprobar = $("#bot_comprobar");
	bot_borrar = $("#bot_borrar");
	bot_comprobar.on("click", comprueba_ejercicio);
	bot_borrar.on("click", reset_ejercicio);
	setTimeout(function(){
	    fix_bots_height();
	}, 200)
	
})

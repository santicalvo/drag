(function(){
	
	

if ( typeof console === "undefined" ){
	var console = {
		log: function(){}
	}
}


var items = {
	arrastrables : [],
	soltables : [],
	id_str : "opcion_",
	reset : function(){
		for ( var i=0; i<this.arrastrables.length; i++ ){
			this.arrastrables[i].reset();
		}
	},
	correct : function(correctas){
		var target = null, 
			id = "", 
			target_id ="not", 
			num_correctas = 0,
			i = 1;
		if(correctas.length !== this.arrastrables.length){
			throw Error("el número de correctas no corresponde con el número de items!");
		}
		for (var i=0; i<this.arrastrables.length; i++){
	 		if( this.arrastrables[i].is_correct( correctas[i] ) ){
	 			this.arrastrables[i].update_view("correct");
	 			num_correctas++;
	 		} else {
	 			this.arrastrables[i].update_view("incorrect");
	 		}
		 }
		 //this.show_feedback();
	},
	onResize : function(){
		 for (var i=0; i<this.arrastrables.length; i++){
		 	this.arrastrables[i].initPosition();
		 }
		for (var i=0; i<this.soltables.length; i++){
		 	//this.soltables[i].initPosition();
		 }
	}
};

function ZonaSoltable( elementjq ){
	this.jq_dom_object = elementjq;
	this.soltable = true;
	this.dropped_element = null;
}

ZonaSoltable.prototype = {
	is_droppable : function(){
		if ( this.dropped_element ){
			return false;
		}
		return true;
	},
	id : function(){
		return this.jq_dom_object.attr("id");
	},
	offset : function(){
		return this.jq_dom_object.offset();
	},
	position : function(){
		return this.jq_dom_object.position();
	}
}


function Boton( elementjq, draggable ){
	this.jq_dom_object = elementjq;
	try{
		this.target = null;
		this.initPosition();
		this.droplist = [];
		this.hittable = typeof this.jq_dom_object === "object" && typeof this.jq_dom_object.hittest === "function";
		if( draggable ){
			this.initDrag();
		}
	}catch(e){
		console.log("error: "+e.message);
	}
	
}
Boton.top = null;
Boton.to_front = function( el ){
	if( Boton.top ){
		Boton.top.css("z-index", 1);
	}
	el.css("z-index", 2);
	Boton.top = el;
}

Boton.prototype = {
	initPosition : function(){
		this.original_offset =  this.jq_dom_object.offset();
	},
	id : function(){
		return this.jq_dom_object.attr("id");
	},
	initDrag : function(){
		this.jq_dom_object.draggable();
		var that = this;
		this.jq_dom_object.on("mouseup", function(){
			that.soltar();
		});
		this.jq_dom_object.on("mousedown", function(){
			that.coger();
		});
	},
	checkHitPosition : function(){
		for (var i=0; i<this.droplist.length; i++){
			if( this.droplist[i].is_droppable() && this.hittest( this.droplist[i].jq_dom_object ) ){
				return this.droplist[i];
			}
		}
		return false;
	},
	is_correct : function( param ){
		var id = this.id().split("_")[1],
			target_id = this.target ? this.target.id().split("_")[1] : "#@#";
		if( !param ) return false;
		return (param.toString() === target_id);
	},
	update_view : function( type_update ){
		switch ( type_update ){
			case "correct":
				this.jq_dom_object.css(
					{
						"backgroundColor" : "#d9ffd9"
					});
				break;
			case "incorrect":
				this.jq_dom_object.css(
					{
						"backgroundColor" : "#ffb3b3"
					});
				break;
		}
	},
	soltar : function(){
		var droptarget = this.checkHitPosition();
		if( droptarget ){
			this.coloca( droptarget );
		}else{
			this.toOrigin();
		}
	},
	coger : function(){
		Boton.to_front(this.jq_dom_object);
		if( this.target ) this.target.dropped_element = null;
		this.target = null;
	},
	toOrigin : function(){
		//this.jq_dom_object.offset( this.original_offset );
		//this.jq_dom_object.offset( this.jq_dom_object.offset() )
		var that = this;
		this.jq_dom_object.css({
			"position" : "relative"
		})
		this.jq_dom_object.animate({
			"top" : 0,
			"left" : 0
		}, function(){
			//console.log(that.jq_dom_object.offset())
			//console.log(that.jq_dom_object.position())
		})
	},
	
	coloca : function( droptarget ){
		this.jq_dom_object.offset( droptarget.offset() );
		droptarget.dropped_element = this;
		this.target = droptarget;
	},
	reset : function(){
		if( this.target ) {
			this.target.dropped_element = null;
			this.target = null;
			this.toOrigin();
		}
		this.jq_dom_object.css({
			"backgroundColor" : "white",
			"opacity" : 1
		});
	},
	addDropable : function( item ){
		if( typeof item.is_droppable === "function" && typeof item.offset === "function" ){
			this.droplist.push(item);
		}
	},
	hittest : function( el ){
		return this.hittable && this.jq_dom_object.hittest(el);
	}
}

var fix_height = function(){
	var delay = function(){
		var altura, cabecera, content, doc_height, nueva_altura;
		cabecera = $("#cabecera");
		content =  $("#content");
		margen = 10;
		padding = parseInt( cabecera.css("paddingTop").split("px")[0], 10 ) + parseInt( cabecera.css("paddingBottom").split("px")[0], 10 );
		doc_height = $(window).height();
		nueva_altura = doc_height - cabecera.height();
		nueva_altura -= padding;
		nueva_altura -= margen*3;
		content.height( nueva_altura - margen*2);
	}
	setTimeout(delay, 100);
}

$(document).ready(function(){
	$(".ui-droppable").each(function(){
		items.soltables.push( new ZonaSoltable( $(this) ) );
	});
	
	$(".ui-draggable").each(function(){
		var bot = new Boton($(this), true);
		bot.droplist = items.soltables;
		items.arrastrables.push( bot ); 
	});
	fix_height();
});

$(window).resize(function() {
	items.onResize();
	fix_height();
});

window.items = items;
})()

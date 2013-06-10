(function(){
	function BotonAudio(self, audio, en_src, dis_src){
		this.init(self, audio);
		this.playable = true;
		this.enabled_src = en_src || "img/butt_audio_b.png";
		this.disabled_src = dis_src || "img/butt_audio_a.png"
	}
	BotonAudio.prototype = {
		
		play : function(){
		    if(this.playable){
		        console.log(this)
                this.audio.play();   
		    }
		},
		stop : function(){
		     this.audio.stop();
		},
		init : function(self, audio){
			var that = this;
			this.self = self;
			this.audio = audio;
			this.self.on("click", function(){
				that.play();
			});
		},
		enable : function(){
		    this.playable = true;
		    this.self.attr("src", this.enabled_src);
		},
		disable : function(){
		    this.playable = false;
		    this.self.attr("src", this.disabled_src);
		}
	}
	
	
	var playAudio = function(ev){
		console.log($(this))
		console.log(param)
	}
	
	var startAudios = function(){
		var bot, audios = [],
			botones_audio = [],
			sep = "_"
			audio_id_prefix = "audio_",
			botaudio_id_prefix = "bAudio_",
			id = "";
		audios = document.getElementsByTagName("audio");
		for (var i=0; i<audios.length; i++){
			id = audios[i].getAttribute("id").split(sep)[1];
			bot = $("#"+botaudio_id_prefix+id);
			botones_audio[i] = new BotonAudio( bot, audios[i] );
			//botones_audio[i] = new BotonAudio(bot, )
			//console.log(botones_audio[i])
			//botones_audio[i].on("click", playAudio);
		}
		$(document).on("EJERCICIO_COMPROBADO", function(){
		    for(var i =0; i<botones_audio.length; i++){
                botones_audio[i].enable();
            }
		});
		window.onload = function(){
            for(var i =0; i<botones_audio.length; i++){
                botones_audio[i].disable();
            }
        }
	}
	
	$(document).ready(function(){
		startAudios();
	});
	
})()


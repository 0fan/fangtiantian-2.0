function ShareCard(cfg){
	if(!(this instanceof ShareCard)){
		return new ShareCard(cfg);
	}

	if(typeof(cfg) == 'undefined'){
		cfg = {};
	}

	this.cfg = {
		title : cfg.title || '项目名称',
		text : cfg.text || '请填写项目文字描述',
		name : cfg.name || '联系人',
		tel : cfg.tel || '16888888888',
		maxSize : cfg.maxSize || 20,
		codeW : cfg.codeW || 90,
		code : cfg.code || null,
	}

	this.handlers = {};
	this.src = null;
	that = this;

	this.init();
}

ShareCard.prototype = {
	init : function(){
		var WIDTH         = 648;
		var HEIGHT        = 960;
		var CENTER_X      = WIDTH / 2;
		var CENTER_Y      = HEIGHT / 2;
		var HEADER_HEIGHT = 80;
		var HEADER_BG     = 'rgba(0,0,0,.5)';
		var HEADER_COLOR  = '#fff';
		var MAIN_BG       = '#e7e7e7';
		var TEXT_HEIGHT   = 140;
		var TEXT_BG       = 'rgba(0,0,0,.5)';
		var TEXT_COLOR    = '#fff';
		var FOOTER_HEIGHT = 140;
		var FOOTER_BG     = '#fff';
		var FOOTER_COLOR  = '#444';
		var PADDING       = 20
		
		var cvs           = document.createElement('canvas');
		var ctx           = cvs.getContext('2d');

		cvs.width  = WIDTH;
		cvs.height = HEIGHT;

		document.body.appendChild(cvs);

		event();

		function draw(){

			drawHeader();
			drawMain();
			drawFooter();
		}
		function drawHeader(){
			ctx.save();
			// 背景
			ctx.fillStyle = HEADER_BG;
			ctx.beginPath();
			ctx.fillRect(0,0,WIDTH,HEADER_HEIGHT);
			ctx.closePath();
			ctx.restore();
			// 文字
			ctx.fillStyle    = HEADER_COLOR;
			ctx.font         = '28px Arial';
			ctx.textBaseline = 'middle';
			ctx.beginPath();
			ctx.fillText(that.cfg.title,PADDING,HEADER_HEIGHT/2);
			ctx.closePath();

			ctx.restore();
		}
		function drawMain(){
			ctx.save();
			ctx.beginPath();
			// 背景
			ctx.fillStyle = TEXT_BG;
			ctx.fillRect(0,HEIGHT-TEXT_HEIGHT-FOOTER_HEIGHT,WIDTH,TEXT_HEIGHT);
			ctx.closePath();
			
			// 文字-名字
			ctx.fillStyle    = TEXT_COLOR;
			ctx.font         = '26px Arial';
			ctx.textBaseline = 'middle';
			ctx.beginPath();

			ctx.fillText(that.cfg.text,PADDING,HEIGHT-TEXT_HEIGHT/2-FOOTER_HEIGHT);

			ctx.closePath();

			ctx.restore();
		}
		function drawFooter(){
			ctx.save();
			// 背景
			ctx.fillStyle = FOOTER_BG;
			ctx.beginPath();
			ctx.fillRect(0,HEIGHT-FOOTER_HEIGHT,WIDTH,FOOTER_HEIGHT);
			ctx.closePath();
			// 文字-名字
			ctx.fillStyle    = FOOTER_COLOR;
			ctx.font         = '26px Arial';
			ctx.textBaseline = 'middle';
			ctx.beginPath();

			ctx.fillText('经纪人',PADDING,HEIGHT-FOOTER_HEIGHT/4*2.5);
			ctx.fillText(that.cfg.name,140,HEIGHT-FOOTER_HEIGHT/4*2.5);
			ctx.fillText('电话',PADDING,HEIGHT-FOOTER_HEIGHT/4);
			ctx.fillText(that.cfg.tel,140,HEIGHT-FOOTER_HEIGHT/4);

			ctx.closePath();

			// 绘制二维码
			var code = new Image();
			code.src = that.cfg.code;
			code.onload = function(){
				var imgH = code.height;
				var imgW = code.width;
				ctx.drawImage(code,WIDTH-PADDING-that.cfg.codeW,HEIGHT-FOOTER_HEIGHT/2-imgH/2)
			}

			ctx.restore();
		}
		function event(){
			var uploader = document.createElement('input');
					uploader.addEventListener('change',readFile,false);
					uploader.type = 'file';
					uploader.accept = 'image/*';
					uploader.click();
					window.uploader = function(){
						uploader.click();
					}
			function readFile(){
				var file = this.files[0];
				// 验证文件类型
				if(!/image\/\w+/.test(file.type)){
					alert('文件类型不支持');
					return false;
				}
				// 验证文件尺寸
				if(file.size/1024/1024>that.cfg.maxSize){
					alert('文件尺寸不能大于' + that.cfg.maxSize + 'M');
					return false;
				}
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function(){
					drawToCanvas(this.result);
				}
			}
			function drawToCanvas(imgData){
				var img = new Image();
				img.src = imgData;
				img.onload = function(){
					var imgW = img.width;
					var imgH = img.height;
					var scale = imgW/imgH;
					var transH = parseInt(WIDTH/scale);
					ctx.clearRect(0,0,WIDTH,HEIGHT);
					ctx.drawImage(img,0,0,WIDTH,transH);
					draw();
					that.src = cvs.toDataURL('image/jpeg',7);
					that.cfg.callback && that.cfg.callback();
				}
			}
		}
	},
	reset : function(){}
}
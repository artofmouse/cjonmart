var cjom = function () {
	var common = {
		init: function () {
			common.productOption();
			common.formToggle();
			common.autocomplete.init();
			common.scroll();
			common.input.init(); // placeholder, checkbox, radio, file, textarea, delete
			common.datepicker();
			common.select();
			common.anchor();
			common.tab.init();
			common.modal.init();
			common.accordion.init();
			common.tooltip();
			common.sticky.init();
			common.stickyBtm();
			common.slider.init();
			common.topBtn();
			common.quantity();
			common.filter();
			common.formReset();
			common.location();
			common.cleave.init();
			common.video.init();
			common.prdImg();
			common.caption();
			common.gridList();
			common.brandCategory();
			common.listType();
			common.subsidiary();
			common.todaySelect();
			common.productInfo();
			common.selectLayer();
			common.snsurl();
			common.floatingBanner();
			common.wingBnr();
			common.searchFilter();
			common.chatbot();
			common.category();
			common.winClose();
			common.preview();
			common.stickerEvent();
			common.swiperSlider();
			common.anchorId();
			common.themeCategory();
			common.reviewAnchor.bind(); // 2019-07-09 상품평 앵커 추가
			common.mainModal.bind(); // 2019-07-11 메인 모달 기능 추가
			etc.pageCtr();
		},
		// 2019-07-11 메인 모달 기능 추가
		mainModal : {
			bind : function() {
				var _this = this;
				$(".main-modal").find(".btn-close").each(function(){
					$(this).off("click.mainClose").on('click.mainClose', function () {
						var $modalId = $(this).closest(".main-modal").attr("id");
						_this.close($modalId);
					});
				});
			},
			close : function ($modalId) {
				$("#"+ $modalId).hide();
			},
			 open: function ($modalId) {
				$("#"+ $modalId).show();
			}
		},
		// 2019-07-11 메인 모달 기능 추가
		// 2019-07-09 상품평 앵커 추가
		reviewAnchor : {
			bind : function () {
				var _this = this;
				$("[data-review-anchor]").each(function(){
					$(this).off("click.reviewAnchor").on("click.reviewAnchor" , function(e){
						e.preventDefault();
						var $anchor =$(this).attr("href");
						_this.anchor($anchor);
					});
				})
			},
			anchor :  function ($anchor) {
				var $anchorTop = $($anchor).offset().top - 65;
				$(window).scrollTop($anchorTop);
			}
		},
		// 2019-07-09 상품평 앵커 추가
		themeCategory : function(){
			if (!$(".theme-category").length) return;
			$(".theme-category [data-sticky]").each(function(){
				var $this = $(this);
				var $btn = $this.find(".more");
				$this.on("stateChange", function(a,b){
					if (b === "fixed") {
						$this.find(".category-list").remove();
					}
				});
				$btn.on("click", function(){
					if ($this.hasClass("is-open")){
						$this.removeClass("is-open");
					} else {
						$this.addClass("is-open").find(".category-list").remove();
						$this.append($("#categoryListAnchor").clone(true));
					}
				});
			});
			$(window).off("scroll.themeCategory").on("scroll.themeCategory", function(){
				$(".theme-category [data-sticky]").removeClass("is-open");
			});
		},
		productOption : function(){
			function productOptionHeight(){
				$(".detail-cart .product-option").each(function(){
					var top = 0;
					var btm = 0;
					$(this).prevAll().each(function(){
						top += $(this).outerHeight();
						top += $(this).css("margin-top").replace(/[^-\d\.]/g, '') * 1;
						top += $(this).css("margin-bottom").replace(/[^-\d\.]/g, '') * 1;
					});
					$(this).nextAll().each(function(){
						btm += $(this).outerHeight();
						btm += $(this).css("margin-top").replace(/[^-\d\.]/g, '') * 1;
						btm += $(this).css("margin-bottom").replace(/[^-\d\.]/g, '') * 1;
					});
					if ( $(this).closest(".modal").length ){
						$(this).height( $(this).closest(".modal").height() - top - btm - 80 );
					} else {
						$(this).height( $(window).height() - top - btm - 120 );
					}
				});
			}
			productOptionHeight();
			$(window).off("resize.productOption").on("resize.productOption", function(){
				productOptionHeight();
			})//.resize();
		},
		anchorId :  function(){
			$("[data-anchor-id]").each(function(){
				$(this).off("click.anchorId").on("click.anchorId" , function(e){
					e.preventDefault();
					$anchor =$($(this).attr("href"));
					$anchorTop = $anchor.offset().top - 65;
					$(window).scrollTop($anchorTop);
				});
			});
		},
		swiperSlider :function(){
			$(".health-news").each(function(){
				if ($(this).hasClass("hasSwiper")) return;
				var total = $(this).find(".swiper-slide").length;
				var swiper = new Swiper('.health-news', {
					slidesPerView: 3,
					centeredSlides: true,
					loop:true,
					//pagination: '.pagination',
					//paginationClickable: true,
					onInit : function(swiper){
						if (!$(swiper.container).find(".swiper-pagination-fraction").length){
							$(swiper.container).find(".slick-util-group").prepend("<div class=\"swiper-pagination-fraction\">\n" +
								"\t<span class=\"swiper-pagination-current\">"+(swiper.activeLoopIndex+1)+"</span>\n" +
								"\t<span>/</span>\n" +
								"\t<span class=\"swiper-pagination-total\">"+total+"</span>\n" +
								"</div>");
						}
					},
					onSlideChangeEnd : function(swiper, direction){
						if ($(swiper.container).find(".swiper-pagination-fraction").length){
							$(swiper.container).find(".swiper-pagination-current").html(swiper.activeLoopIndex+1);
						}
					}
				});
				$('.arrow-left', this).on('click', function(e){
					e.preventDefault();
					swiper.swipePrev();
				});
				$('.arrow-right', this).on('click', function(e){
					e.preventDefault();
					swiper.swipeNext();
				});
				$(this).addClass("hasSwiper")
			});
		},
		winClose : function(){
			$("[data-winpop-close]").off("click.winClose").on("click.winClose",function(){
				window.close();
			});
		},
		category : function(){
			$(".nav-inner .btn-category").off("click.category").on("click.category", function(e){
				e.preventDefault();
				var open = !$(".nav-inner").hasClass("active");
				categoryToggle(open);
			});
			$(".btn-category-close").off("click.category").on("click.category", function(e){
				e.preventDefault();
				categoryToggle(false);
			});
			function categoryToggle(open){
				var state = open ? 'addClass' : 'removeClass';
				$(".nav-inner")[state]("active");
			}
		},
		chatbot : function(){
			var $floatingWrap = $('.quick-banner');
			var $chatbotWrap = $('.lay_chatbot_wrap');
			var $chatbotFrame = $chatbotWrap.find('.lay_chatbot_frame');
			$floatingWrap.on( 'click', '.customer-service', function(e) {
				e.preventDefault();
				openChatbot( true );
			});
			$chatbotWrap.on( 'click', 'button.btn_chatbot_close', function() {
				openModalAlert( true );
			});
			$chatbotWrap.on( 'click', 'button.ui_closeCancel', function() {
				openModalAlert( false );
			});
			$chatbotWrap.on( 'click', 'button.ui_closeConfirm', function() {
				openModalAlert( false );
				openChatbot( false );
			});
			function openModalAlert( open ) {
				var state = open ? 'show' : 'hide';
				$chatbotWrap.find('.dimmed')[state]();
				$chatbotWrap.find('.modal_chatbot')[state]();
				if (open){
					$chatbotWrap.find('.modal_chatbot .ui_closeCancel').focus();
				} else {
					$chatbotWrap.find('button.btn_chatbot_close').focus();
				}
			}
			function openChatbot( open ) {
				if( open ) {
					$chatbotWrap.show();
					$chatbotFrame.attr("tabindex","0").focus().animate( {top:0}, 460, 'easeOutCubic' );
				} else {
					$floatingWrap.find(".customer-service").focus();
					$chatbotFrame.animate( {top:640}, 400, 'easeInCubic', function() {
						$chatbotWrap.hide();
					});
				}
			}
		},
		searchFilter : function(){
			$(".search-filter-wrap").each(function(){
				var $this = $(this);
				var $toggleBtn = $(".btn-toggle", this);
				var $toggleCont = $(".search-filter-form", this);
				var speed = 300;
				$toggleBtn.on("click", function(){
					if ($this.hasClass("active")){
						$this.removeClass("active");
						$toggleCont.slideUp(speed);
					} else {
						$this.addClass("active");
						$toggleCont.slideDown(speed);
					}
				});
			});
		},
		wingBnr : function(){
			$(".quick-banner").each(function(){
				var $this = $(this);
				$(".btn-spread", $this).off("click.wingBnr").on("click.wingBnr",function(){
					$(".wing-bnr", $this).removeClass("minimize").addClass("maximize");
					$("[data-slider]", $this).slick('unslick');
					common.scroll($(".product-list-scroll", $this));
					common.checkbox.init($("input[type=checkbox]", $this));
				});
				$(".btn-fold", $this).off("click.wingBnr").on("click.wingBnr",function(){
					$(".wing-bnr", $this).removeClass("maximize").addClass("minimize");
					common.slider.init( $("[data-slider]", $this) );
					$(".product-list-scroll").scrollbar("destroy");
				});
			});
			$(".wing-bnr").each(function(idx){
				var $this = $(this);
				var $wrap = $(this).parent();
				var defaults = {
					top : 100,
					btm : 40,
					height : $this.outerHeight(),
					width : $this.outerWidth()
				};
				var $foot = $(".sticky-btm-wrap").length ? $(".sticky-btm-wrap") : $("#footer");
				var options = $.extend(false, defaults, $(this).data("options"));
				$wrap.height(options.height).width(options.width);

				$(window).off("scroll.winBnr"+idx).on("scroll.winBnr"+idx, function(){
					var winTop = $(this).scrollTop();
					var footerTop = $foot.offset().top;
					if ($wrap.offset().top - options.top > winTop){
						$this.removeClass("fixed").css({
							"position" : "absolute",
							"top" : 0
						});
					} else if ($wrap.offset().top - options.top <= winTop && footerTop - options.height - options.top - options.btm >= winTop) {
						$this.addClass("fixed").css({
							"position" : "fixed",
							"top" : options.top + "px"
						});
					} else {
						$this.removeClass("fixed").css({
							"position" : "absolute",
							"top" : footerTop - $wrap.offset().top - options.height - options.btm +"px"
						});
					}
				}).scroll();
			});
		},
		floatingBanner : function(){
			$(".floating-banner button.close").on("click", function(){
				$(this).closest(".floating-banner").slideUp(400);
			});
		},
		productInfo : function(){
			$(".product-detail-images .btn-more").off("click.productInfo") .on("click.productInfo", function(){
				var $parent = $(this).closest(".product-detail-images");
				$parent.addClass("active");
				if ($parent[0].slick) {
					$parent.slick("setPosition");
					//$(this).remove();
				}
			});
		},
		snsurl : function(){
			$("[data-snsurl]").each(function(){
				var $this = $(this);
				$("[data-add]", this).off("click.snsurl") .on("click.snsurl", function(){
					var hideItem = $this.find("li:not(':first')").not(".active");
					$(hideItem[0]).addClass("active");
					if (!hideItem.length){
						alert("최대 5개");
					}
				});
				$("[data-delete]", this).click(function(){
					var wrap = $(this).closest("li");
					wrap.removeClass("active").find("input").val("");
					$this.append(wrap);
				});
			});
		},
		subsidiary : function(){
			var speed = 300;
			var $wrap = $(".subsidiary-wrap");
			var $title = $wrap.find(".sub-title2");
			var $close = $wrap.find(".btn-close");
			var $openBtn = $(".foot-subsidiary a");
			$openBtn.off("click.subsidiary").on("click.subsidiary", function(e){
				e.preventDefault();
				toggle();
			});

			$close.off("click.subsidiary2").on("click.subsidiary2", function(e){
				e.preventDefault();
				toggle();
			});

			$close.off("keydown.btnBlur").on("keydown.btnBlur",function (e) {
				if(e.keyCode === 9 &&  !e.shiftKey) {
					e.preventDefault();
					$title.focus()
				}
			});
			$title.off("keydown.titleKeyup").on("keydown.titleKeyup",function (e) {
				if (e.keyCode === 9 && e.shiftKey) {
					e.preventDefault();
					$close.focus();
				}
			});
			function toggle(){
				if($wrap.hasClass("active")){
					$wrap.stop(true, false).slideUp(speed).removeClass("active");
					$openBtn.focus();
				}else {
					$wrap.stop(true, false).slideDown(speed).addClass("active");
					$title.focus();
				}
			}
		},
		listType : function(){
			$("[data-list-type]").off("click").on("click", function(){
				var $target = $("[data-list-type-target="+ $(this).data("list-type") +"]");
				if ($target.hasClass("product-list-row")){
					$target.removeClass("product-list-row").addClass("product-list");
					$target.attr("data-column", 4);
					$(this).addClass("list").text("리스트형으로 보기");
				} else {
					$target.removeClass("product-list").addClass("product-list-row");
					$target.attr("data-column", 1);
					$(this).removeClass("list").text("이미지형으로 보기");
				}
			});
		},
		gridList : function(){
			$("[data-grid-list]").each(function(){
				var $wrap = $(this);
				var wrapWidth = $(this).width();
				var $child = $wrap.find("> li");
				var column = Math.floor(wrapWidth / $child.outerWidth());
				var marginLeft = (wrapWidth % $child.outerWidth()) / (column-1);
				var listTopArr = [];
				for (var i = 0; i < column; i++) {
					listTopArr.push(0);
				}
				$child.each(function(idx){
					$(this).removeAttr("data-grid-position");
					var $this = $(this);
					var marginTop = $this.css("margin-top").replace("px","") * 1;
					//$this.css({"top":"auto","left":"auto"});
					var posTop = Math.min.apply(null, listTopArr);
					var leftColumn = listTopArr.indexOf(posTop);
					var posLeft = ($this.outerWidth() * leftColumn) + (marginLeft * leftColumn);
					listTopArr[leftColumn] = posTop + marginTop + $this.outerHeight();
					$this.css({
						"top" : posTop + marginTop + "px",
						"left" : posLeft + "px"
					});
					$(this).attr("data-grid-position", "");
				});
				$wrap.height(Math.max.apply(null, listTopArr));
			});
		},
		prdImg : function(){
			$(".product-info-box").each(function(){
				var img = $(this).find(".product-images-item");
				var $caption = $(".caption-wrap", this);
				$(this).find(".product-images-pager a").on("click.videoBind").on("click.videoBind", function(e){
					e.preventDefault();
					img.removeClass("videoReady play video-wrap").empty();
					img.removeAttr("data-video");
					if ($(this).hasClass("video")) {
						var videoOption = $(this).data("video-bind");
						$caption.show();
						img.attr("data-video", JSON.stringify(videoOption));
						common.video.bind(img[0]);
					} else {
						$caption.hide();
						img.append($(this).find("img").clone())
					}
				});
			});
			$(".pager-item:first-child a").trigger("click");
		},
		video : {
			youTubeIframeAPIReady : false,
			defaults : {
				"video" : {
					"muted" : false,
					"autoplay" : false,
					"controls" : true,
					"height" : "auto",
					"width" : "auto",
					"loop" : false,
					"poster" : false,
					"preload" : false
				},
				"youtube" : {
					width: '1000',
					height: '563',
					playerVars: {
						autoplay:0,
						showinfo:0,
						rel: 0, //추천영상 안보여주게 설정
						controls : 1,
						//modestbranding : 1,
						fs : 0
					},
					events: {
						//'onReady': onPlayerReady, //로딩할때 이벤트 실행
						//'onStateChange': onPlayerStateChange //플레이어 상태 변화시 이벤트실행
					}
				}
			},
			init : function(){
				var _this = this;
				if (window.onYouTubeIframeAPIReady === undefined) {
					window.onYouTubeIframeAPIReady = function(){
						_this.youTubeIframeAPIReady = true;
						_this.bind();
					};
					_this.bind();
					var tag = document.createElement('script');
					tag.src = "https://www.youtube.com/iframe_api";
					var firstScriptTag = document.getElementsByTagName('script')[0];
					firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
				} else {
					_this.bind();
				}
			},
			bind : function (selector) {
				var _this = this;
				var target = (typeof selector === "undefined") ? "[data-video]" : selector;
				$(target).each(function(){
					if ($(this).hasClass("videoReady")) return;
					var $this = $(this);
					var type = JSON.parse($(this).attr("data-video")).type ;
					var options = $.extend(false, _this.defaults[type], JSON.parse($(this).attr("data-video")));
					var $poster;
					var $btnPlay;
					function setting(){
						$this.empty().addClass("video-wrap");
						if (options.poster){
							$this.append('<img src="'+ options.poster +'" class="video-poster" alt="'+ 1 +'" />');
						}
						$this.append('<button type="button" class="btn-play">동영상 플레이</button>');
						$poster = $this.find("img.video-poster");
						$btnPlay = $this.find("button.btn-play");
					}
					if (options.type === "video") {
						var optionsKey = Object.keys(options);
						var optionsKeyFilter = optionsKey.filter(function(key){
							return options[key] === true;
						});
						var videoOptions = optionsKeyFilter.toString().replace(","," ");
						setting();
						$this.append(
							'<video '+videoOptions+' poster="'+ options.poster +'">' +
								'<source src="'+options.src+'" type="video/mp4">' +
							'</video>'
						);
						var $video = $this.find("video");
						if ( options.autoplay ){
							$this.addClass('play');
						}
						$btnPlay.off("click.video").on("click.video", function(){
							if ($this.hasClass("play")) {
								$video[0].pause();
								$this.removeClass("play");
							} else {
								$video[0].play();
								$this.addClass("play");
							}
						});
						$(this).addClass("videoReady");
					}
					if (options.type === "youtube" && _this.youTubeIframeAPIReady){
						if ( options.playerVars.autoplay === 1 ){
							$this.addClass('play');
						}
						setting();
						$this.append("<div class='youtube'></div>");
						var youTubePlayer = new YT.Player($(this).find(".youtube")[0], options);
						$btnPlay.off("click.video").on("click.video", function(){
							if ($this.hasClass("play")) {
								youTubePlayer.pauseVideo();
								$this.removeClass("play");
							} else {
								youTubePlayer.playVideo();
								$this.addClass("play");
							}
						});
						$(this).addClass("videoReady");
					}
				});
				common.caption();
			},
			play : function(selector){
				var _this = this;
				var $this = $(selector);
				var $btnPlay = $this.find("button.btn-play");
				if (!$this.hasClass("play")) {
					$btnPlay.trigger("click");
				}
			},
			pause : function(selector){
				var _this = this;
				var $this = $(selector);
				var $btnPlay = $this.find("button.btn-play");
				if ($this.hasClass("play")) {
					$btnPlay.trigger("click");
				}
			}
		},
		cleave : {
			options : {
				"quantity" : {
					numeral : true,
					numeralThousandsGroupStyle : "thousand",
					delimiter: ''
				},
				"datepicker" : {
					date: true,
					delimiter: '-',
					datePattern: ['Y', 'm', 'd']
				},
				"card" : {
					numericOnly : true,
					blocks: [4, 4, 4, 4],
					delimiter: '-',
					delimiterLazyShow: true
				},
				"scratch" : {
					numericOnly : true,
					blocks: [6]
				},
				"krw" : {
					numeral : true,
					numeralThousandsGroupStyle : "thousand",
					delimiter: ','
				},
				"number" : {
					numericOnly : true,
					blocks: [9999999]
				}
			},
			init : function(){
				var _this = this;
				$("[data-cleave]").each(function(){
					var type = $(this).data("cleave");
					_this.bind(this, type);
				});
			},
			bind : function (selector, type) {
				var _this = this;
				if (type === 'number'){
					if (selector.hasAttribute('maxlength')) {
						_this.options[type].blocks = [$(selector).attr('maxlength')];
					} else {
						_this.options[type].blocks = [999999];
					}
				}
				var cleave = new Cleave(selector, _this.options[type]);
			}
		},
		location : function(){
			var target =".location > li";
			$(target).each(function(){
				var $this = $(this);
				if ($this.find("ul").length) {
					common.scroll($this.find("ul"));
					$this.addClass("location-drop");
					$this.find("> a").off("click.loc").on("click.loc", function(e){
						e.preventDefault();
						$this.toggleClass("active");
					});
				}
			});
			$(window).off("click.loc").on("click.loc", function(e){
				var $target = $(e.target).closest(target).length ? $(e.target).closest(target) : null;
				$(target).not($target).removeClass("active");
			});
		},
		autocomplete : {
			init : function(){
				var _this = this;
				$(".header-search").each(function(){
					//console.log("autocomplete1");
					var $search = $(this);
					var $btnClose = $(".btn-close", $search);
					var $btnTag = $(".btn-search-hash", $search);
					var $input = $("input", $search);
					$btnClose.off("click.close").on("click.close", function () {
						_this.close();
					});
					$btnTag.off("click.hash").on("click.hash", function () {
						if ($search.hasClass("hash")){
							$search.removeClass("hash");
							$(this).html("해시태그로 검색");
							$input.attr("title", "검색");
						} else {
							$search.addClass("hash");
							$(this).html("일반 검색");
							$input.attr("title", "해시태그 검색");
						}
						$input.focus();
					});
				});
				$(".header-search input[type=text]").each(function(){
					//console.log("autocomplete2");
					var $this = $(this);
					var placeholder = $this.attr("placeholder");
					var text = "검색어를 입력하세요.";
					$this.off("focusin.search").on("focusin.search", function(){
						$this.attr("placeholder", text);
					}).off("focusout.search").on("focusout.search", function(){
						$this.attr("placeholder", placeholder);
					});
				});
			},
			open : function(selector){
				$(".search-layer-wrap").show();
				$(selector).show().siblings(".search-layer").hide();
			},
			close : function(){
				$(".search-layer-wrap").hide();
				$(".search-layer-wrap .search-layer").hide();
			}
		},
		formReset : function(){
			$("button[type=reset]").off("click.reset").on("click.reset", function(){
				var form = $(this).closest("form");
				setTimeout(function () {
					form.find("input[type='radio'], input[type='checkbox']").change();
				},1);
			});
		},
		input : {
			init : function(selector){
				var $selector = (selector === undefined) ? $("input") : selector;
				var exceptArr = ['button', 'hidden', 'image', 'reset', 'submit']; // 제외 Type Array;
				$selector.each(function(){
					if ( !$(this).parent("[class^=input-]").length && exceptArr.indexOf($(this).attr("type")) === -1) {
						//console.log("input");
						var $wrap = $(this).wrap("<span class='input-"+$(this).attr('type')+"'></span>").parent();
						$wrap.addClass($(this).attr("data-class"));
						$wrap.attr({style : $(this).attr("style")});
						common.input.focus(this, $wrap);
						if ($(this).attr('type') === 'checkbox'){
							common.checkbox.init($(this));
						}
						if ($(this).attr('type') === 'radio'){
							common.radio($(this));
						}
						if ($(this).attr('type') === 'file'){
							common.file.init($(this));
						}
						if (this.hasAttribute('placeholder')){
							common.input.placeholder($(this));
						}
						if (this.hasAttribute('data-delete')){
							common.input.delete($(this));
						}
						$wrap = null;
					}
					common.input.state(this);
				});
				$selector = null;
				exceptArr = null;

				common.textarea.init();

			},
			focus: function (selector, wrap) {
				var $wrap = (typeof wrap === "undefined") ? $(selector).parent() : wrap;
				$(selector).off("focusin.inputFocus").on("focusin.inputFocus", function() {
					$wrap.addClass('focus');
				}).off("focusout.inputFocus").on("focusout.inputFocus", function() {
					$wrap.removeClass('focus');
				});
			},
			state: function (selector) {
				var $wrap = $(selector).parent("[class^=input-]");
				if ($wrap.length){
					if (selector.hasAttribute("disabled")) {
						$wrap.addClass("disabled");
					} else {
						$wrap.removeClass("disabled");
					}
					if (selector.hasAttribute("readonly")) {
						$wrap.addClass("readonly");
					} else {
						$wrap.removeClass("readonly");
					}
				}
			},
			error : function(selector, text){
				var $parent = $(selector).parent("[class^=input-]");
				var classes = $(selector)[0].hasAttribute('data-error') ?  "input-error-"+$(selector).data('error') : 'input-error';
				if (typeof text === 'undefined'){
					$parent.removeClass(classes);
					$(selector).next(".error-txt").remove();
				} else {
					$parent.addClass(classes);
					if (!$(selector).next(".error-txt").length) {
						$(selector).after("<span class='error-txt'>"+text+"</span>");
					} else {
						$(selector).next(".error-txt").text(text);
					}
					$(window).scrollTop(($parent.offset().top + $parent.height() / 2) - $(window).height() / 2);
				}
			},
			placeholder : function(target){
				if (Modernizr.placeholder) return;
				var $target = (typeof target === "undefined") ? $("[placeholder]") : target;
				$target.each(function(){
					if ( $(this).prev(".placeholder").length ) return;
					var $this = $(this);
					$this.before("<span class='placeholder'>"+ $this.attr("placeholder") +"</span>");

					var $placeholder = $this.prev(".placeholder");
					$placeholder.off("click.placeholder").on("click.placeholder", function(){
						$this.focus();
					});
					$this.off("keyup.placeholder input.placeholder").on("keyup.placeholder input.placeholder", function(){
						if ($this.val() !== "") {
							$placeholder.hide();
						} else {
							$placeholder.show();
						}
					}).keyup();
				});
			},
			delete : function(target){
				var $target = (typeof target === "undefined") ? $("[data-delete]") : target;
				$target.each(function() {
					if ( $(this).next(".btn-delete").length || this.tagName !== "INPUT") return;
					$(this).after("<button type='button' class='btn-delete'>입력 내용 삭제</button>");
					var $this = $(this);
					var $btnDelete = $this.next(".btn-delete");
					$btnDelete.off("click.delete").on("click.delete", function(){
						$this.val("");
					});
				});
			}
		},
		quantity : function (){
			$(".quantity").each(function(){
				if (!$(this).find("input").length || this.hasAttribute("data-quantity")) return;
				var $btn = $(this).find("button");
				var $input = $(this).find("input");
				//console.log("quantity");
				$(this).attr("data-quantity", "");

				common.cleave.bind($input[0], "quantity");


				function minMax($input){
					var val = $input.val() * 1;
					var max = $input.attr("max") ? $input.attr("max")*1 : 9999;
					var min = $input.attr("min") ? $input.attr("min")*1 : 0;
					if (val > max){
						$input.val(max);
					} else if (val < min) {
						$input.val(min);
					}
				}

				minMax($input);

				$input.off("keyup.quantity input.quantity").on("keyup.quantity input.quantity", function(){
					minMax($input);
				})//.keyup();

				$btn.off("click.quantity").on("click.quantity", function () {
					var val = $input.val() * 1;
					var num = $input.attr("step") ? $input.attr("step")*1 : 1;
					if($(this).hasClass("btn-increase")){
						$input.val(val+num);
					}else{
						$input.val(val-num);
					}
					minMax($input);
				})
			});
		},
		checkbox : {
			init : function (target) {
				var _this = this;
				var $target = (typeof target === "undefined") ? $("input[type=checkbox]") : target;
				$target.each(function(){
					$(this).off("change.checkbox").on("change.checkbox", function () {
						_this.toggle(this);
					});
					_this.toggle(this);
				});
				this.checkAll();
			},
			toggle : function(selector, checked){
				$(selector).each(function(){
					//console.log("checkbox")
					checked = (typeof checked === "undefined") ? $(this).prop("checked") : checked;
					var $parent = $(this).closest('.input-checkbox');
					if(checked) {
						$parent.addClass('active');
						$(this).prop("checked", true)
					}else{
						$parent.removeClass('active');
						$(this).prop("checked", false)
					}
					if($(this).prop("disabled")){
						$parent.addClass('disabled');
					}
				});
			},
			checkAll : function(){
				var _this = this;
				$('input[type=checkbox][data-all-check]').off("change.allCheck").on("change.allCheck", function () {
					allCheck(this);
				});
				$('input[type=checkbox][data-child-check]').off("change.childCheck").on("change.childCheck", function(){
					childCheck(this);
				});
				function allCheck(selector){
					var thisData = $(selector).data("all-check");
					var checked = $(selector).prop('checked');
					var $siblings = $('[data-all-check="'+ thisData +'"]');
					var $child = $('[data-child-check="'+ thisData +'"]');
					var childArr = [];
					$siblings.each(function(){
						if ($(this).prop("disabled")) return;
						_this.toggle(this, checked);
					});
					$child.each(function(idx){
						childArr[idx] = {
							"obj" : $(this),
							"checked" : $(this).prop("checked"),
							"disabled" : $(this).prop("disabled")
						};
						if ($(this).prop("disabled")) return;
						_this.toggle(this, checked);
						if (this.hasAttribute("data-all-check")){
							allCheck(this);
						}
					});
					$(selector).trigger("onChange", [childArr]);
				}
				function childCheck(selector){
					var thisData = $(selector).data("child-check");
					var $allCheck = $('[data-all-check="'+ thisData +'"]');
					var unCheckLength = $("[data-child-check='" + thisData + "']").not(":checked").length;
					$allCheck.each(function(){
						if ($(this).prop("disabled")) return;
						_this.toggle(this, unCheckLength === 0);
						if (this.hasAttribute("data-child-check")){
							childCheck(this);
						}
					});
				}
			}
		},
		radio : function (target) {
			var $target = (typeof target === "undefined") ? $('input[type=radio]') : target;
			$target.each(function() {
				var name = $(this).attr('name');
				var $parent = $(this).closest('.input-radio');
				$(this).off("change.radio").on("change.radio", function () {
					if($(this).prop("checked")) {
						$('[name="' + name + '"]').closest('.input-radio').removeClass('on');
						$parent.addClass('on');
					}
					if($(this).prop("disabled")){
						$parent.addClass('disabled');
					}
				}).change();
			});
		},
		select : function (target) {
			if (!$(".select-wrap").length){
				$("body").append("<div class='select-wrap'></div>");
			}
			var $target = (typeof target === "undefined") ? $("select:visible") : target;
			$target.each(function(){
				var $this = $(this);
				if ($this.is(":visible") && this.options.length ){
					if (!$this.hasClass("has-selectbox")) {
						var classes = $this.attr("class") !== undefined ? $this.attr("class") : ""; // 2019-07-09 ie9 대응 문법 수정
						var $selectSet = $(document.createDocumentFragment());
						var $wrap = $this.wrap("<span class='selectbox "+ classes +"' style='width:"+ Math.ceil($this.outerWidth()) +"px'/>").closest(".selectbox");
						//var $select = $wrap.append($this.clone(true)).find("select");
						var $value = $selectSet.append("<button type='button' class='value'><span>"+ this.options[this.selectedIndex].text +"</span></button>").find((".value"));
						var $list = $selectSet.append("<div class='selectbox-list'><ul class='"+classes+"'></ul></div>").find(".selectbox-list");
						this.list = $list;
						var optionsLength = this.options.length;
						for (var i = 0; i < optionsLength; i++) {
							var item = $this[0].options[i];
							var disabled = (item.disabled) ? "disabled" : "";
							var selected = (item.selected) ? "selected" : "";
							var attribute = [disabled, selected];
							$list.find("ul").append('<li class="'+attribute.join(' ').trim()+'">'+ item.text +'</li>');
						}
						$value.on("click keydown", function(e){
							if ($this[0].hasAttribute("disabled")) return;
							if (e.type === "click" || [32].indexOf(e.keyCode) > -1){
								onOff(!$wrap.hasClass("active"), $wrap.hasClass("active"));
							}
							if ([27].indexOf(e.keyCode) > -1){
								onOff(false, false);
							}
							if ([37, 38].indexOf(e.keyCode) > -1){
								selectedOption("up");
							}
							if ([39, 40].indexOf(e.keyCode) > -1){
								selectedOption("down");
							}
						}).on("focusout", function(){
							if ($this[0].hasAttribute("disabled")) return;
							onOff(false, $this[0].selectedIndex !== $list.find("li.selected").index());
							$wrap.removeClass("focus");
						}).on("focusin", function(){
							if ($this[0].hasAttribute("disabled")) return;
							if ($wrap.find("ul").length){
								optionsCreate();
							}
							$wrap.addClass("focus");
						});

						function optionsCreate() {
							if (!$list.hasClass(".scroll-wrapper")){
								cjom.scroll($list, function(){
									$list = $list.closest(".scroll-wrapper");
									$list.css({
										"top": Math.floor($wrap.height() + $wrap.offset().top -1),
										"left": $wrap.offset().left,
										"width" : Math.ceil($wrap.outerWidth()),
										"display" : "block"
									});
									optionsBind();
									$(".select-wrap").append($list);
								});
							}
						}

						function selectedOption(upDown){
							if ($list === null){
								optionsCreate();
							}
							var $selectedOption = $list.find("li.selected");
							var $target = (upDown === undefined) ? $selectedOption : $selectedOption[(upDown === "up") ? 'prevAll' : 'nextAll']("li:not(.disabled):first");
							if ( $target.length && !$target[0].hasAttribute("disabled")){
								selectedChange($target.index());
							}
						}

						function selectedChange(idx){
							var $target = $list.find("li:eq("+idx+")");
							var $scrollWrap = $target.closest(".scroll-content");
							$target.addClass("selected").siblings().removeClass("selected");
							$scrollWrap.scrollTop($scrollWrap.scrollTop() + $target.position().top);
							$value.find("span").html($target.html());
							$this[0].selectedIndex = $target.index();
							$this.trigger("change", "test");
						}

						if ($this.closest(".modal").length){
							$this.closest("[data-scroll]").on("scroll", function(e) {
								onOff(false, false);
							});
						}

						if ($this[0].hasAttribute("data-form-toggle")){
							common.formToggle($this);
						}

						$this.on("change", function(e, selectOption){
							if ($list === null){
								optionsCreate();
							}
							if (selectOption !== "test"){
								selectedChange(this.selectedIndex);
							}
						});
						$wrap.append($selectSet);
						cjom.scroll($list);
						$this.addClass("has-selectbox");
						$selectSet = null;
					} else {
						$(this).next(".value").find("span").text($(this)[0].options[$(this)[0].selectedIndex].text);
						var $optionSet = $(document.createDocumentFragment());
						var optionsLength = this.options.length;
						for (var i = 0; i < optionsLength; i++) {
							var item = $this[0].options[i];
							var disabled = (item.disabled) ? "disabled" : "";
							var selected = (item.selected) ? "selected" : "";
							var attribute = [disabled, selected];
							$optionSet.append('<li class="'+attribute.join(' ').trim()+'">'+ item.text +'</li>');
						}
						this.list.find("ul").html($optionSet);
						optionsBind();
					}
				}

				function onOff(open, select){
					var $wrap = $this.closest(".selectbox");
					var $list = $this[0].list.parent(".scroll-wrapper");
					if ($this[0].hasAttribute("disabled")) return;
					if (select){
						selectedOption();
					}
					$list[open ? 'show' : 'hide']();

					$wrap[open ? 'addClass' : 'removeClass']("active");
					if (open){
						$list.css({
							"top": Math.floor($wrap.height() + $wrap.offset().top -1),
							"left": $wrap.offset().left,
							"width" : Math.ceil($wrap.outerWidth())
						});
					}
				}

				function optionsBind() {
					var $list = $this[0].list;
					$list.find("li").on("mouseenter", function(){
						if (!$(this).hasClass("disabled")){
							$(this).addClass("selected").siblings().removeClass("selected");
						}
					}).off("click.optionsBind").on("click.optionsBind", function(){
						onOff(false, true);
					})
				}

				$(this).closest(".selectbox")[this.hasAttribute("disabled") ? 'addClass' : 'removeClass']("disabled");

			});

			window.addEventListener("keydown", function(e) {
				if( $(".selectbox .value:focus").length && [32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
					e.preventDefault();
				}
			}, false);


		},
		/*select : function (target) {
			var $target = (typeof target === "undefined") ? $("select") : target;
			var defaults = {
				width : "auto",
				position: { my : "left top-1", at: "left bottom" },
				create : function(){
					common.scroll($(this).selectmenu("menuWidget"));
				},
				change : function() {
					$(this).change();
				},
				open : function() {
					if ($(this).closest(".modal").length) {
						$(this).selectmenu("menuWidget").closest(".ui-selectmenu-menu").css({"z-index":"250000"});
					}
					defaults.width = $(this).next(".ui-selectmenu-button").outerWidth();
					$(this).selectmenu("menuWidget").width("auto").parent().width(defaults.width - 2);
					$(this).selectmenu("menuWidget").removeClass("ui-menu-disabled ui-state-disabled");
					$(this).selectmenu("menuWidget").closest(".scroll-wrapper").removeClass("ui-menu-disabled ui-state-disabled");
				}
			};
			$target.each(function(idx){
				var $this = $(this);
				if ( !$this.hasClass("hasSelectMenu") && $this.is(":visible") ) {
					var classes = this.hasAttribute("class") ? $this.attr("class") : null;
					defaults.width = $this.outerWidth();
					defaults.classes = {
						"ui-selectmenu-button": classes,
						//"ui-selectmenu-menu" : classes
					};
					var options = $.extend(false, defaults, $this.data("select"));
					$this.selectmenu(options).addClass("hasSelectMenu");
					$this.selectmenu("menuWidget").width("auto").parent().width(defaults.width - 2);
				} else if ($this.hasClass("hasSelectMenu")) {
					$this.selectmenu("refresh");
				}
				$this.closest("[data-scroll]").off("scroll.select").on("scroll.select", function(){
					$(".hasSelectMenu").selectmenu("close");
				});
			});
			$(window).off("resize.select").on("resize.select", function(){
				$(".hasSelectMenu").selectmenu("close");
			});
		},*/

		selectLayer : function () {
			$('[data-select-layer]').each(function(){
				var $this = $(this);
				var $btnSelect = $('.btn-select', this);
				var $listItem = $(".option-list a", this);
				var sliderHas = $this[0].hasAttribute('data-slider-ctr');
				$btnSelect.off('click.selectLayer').on('click.selectLayer',function (){
					$this.toggleClass('active');
				});
				$listItem.off('click.selectLayer').on('click.selectLayer',function (e){
					e.preventDefault();
					if (sliderHas) {
						$this.removeClass('active');
						if ($(this).hasClass("active")) return;
					}
					$(this).addClass("active").siblings().removeClass("active");
					$btnSelect.text($(".option-name", this).text());
					$this.removeClass('active');
					if (sliderHas) {
						$("[data-slider-ctr="+$this.data("slider-ctr")+"][data-slider]")[0].slick.slickGoTo($(this).index())
					}
				});
			});
		},

		preview : function() {
			$('.image-viewer').each(function(){
				var $anchor = $("[data-preview] a", this);
				var $viewer = $("[data-previewer]");
				$anchor.off("click.preview").on("click.preview", function(e){
					e.preventDefault();
					var $parent = $(this).closest('li');
					var src = $(this).find('img').attr("src");
					$parent.addClass('active').siblings('li').removeClass('active');
					$viewer.attr('src', src);
				});
			});
		},
		caption : function () {
			$('.btn-caption').off('click.caption').on('click.caption',function (){
				$(this).closest('.caption-wrap').toggleClass('active');
				common.gridList();
			});
		},
		brandCategory : function () {
			$('#btnCategoryOpen').off('click.categoryOpen').on('click.categoryOpen', function(){
				cjom.slider.remove();
				$('.brand-list').slick('unslick');
				$('.brand-category').addClass('open');
			});
			$('#btnCategoryClose').off('click.categoryClose').on('click.categoryClose', function(){
				cjom.slider.init();
				$('.brand-category').removeClass('open');
			});
		},
		file : {
			blink : '/cjom/web/images/common/blink.gif',
			arr : [],
			init : function (target){
				var $target = (typeof target === "undefined") ? $("input[type='file']") : target;
				var _this = this;
				$target.each(function(idx){
					//console.log("file")
					if ($(this).next('.file-thumb').length) return;
					var $this = $(this);
					if ($this.data("type") === "text"){
						$this.closest(".input-file").addClass("text-type");
						$this.after('<span class="file-text">'+$this.attr("placeholder")+'</span><button type="button" class="btn-white-sm">찾아보기</button>');
					} else {
						$this.after('<div class="file-thumb"><img src="'+_this.blink+'" alt="첨부파일 이미지"><button type="button" class="file-delete">첨부파일 취소</button></div>');
					}
					$this.attr('data-file-index', idx);
					_this.bind(this);
				});
			},
			bind : function(selector){
				var _this = this;
				var $this = $(selector);
				var $wrap = $this.closest('.input-file');
				var $thumbImg = $this.next('.file-thumb').find('img');
				var $btnDel = $wrap.find('.file-delete');
				var $text = $wrap.find('.file-text');
				var idx = $this.data('file-index');

				_this.arr[idx] = $this.val("").clone(true);
				$this.off('change.file').on('change.file',function(){
					if ($this.val() !== '') {
						if (window.FileReader) {
							var reader = new FileReader();
							reader.onload = function(e) {
								$thumbImg.attr('src', e.target.result);
							};
							reader.readAsDataURL(this.files[0]);
						} else {
							this.select();
							this.blur();
							var imgSrc = document.selection.createRange().text;
							$thumbImg[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enable='true',sizingMethod='scale',src='" + imgSrc + "')";
						}
						$text.html($this[0].files[0].name);
						$wrap.addClass('active');
					} else {
						$text.html($this.attr("placeholder"));
						$wrap.removeClass('active');
					}
				}).change();
				$btnDel.off('click.file').on('click.file', function(){
					_this.reset($this[0]);
				});
			},
			reset : function(selector){
				var _this = this;
				$(selector).each(function(){
					var $this = $(selector);
					var $multiple = $this.closest("[data-multiple]");
					var idx = $this.data('file-index');
					var $wrap = $this.closest('.input-file');
					var $thumbImg = $this.next('.file-thumb').find('img');
					$this.remove();
					$wrap.prepend(_this.arr[idx]).removeClass('active');
					_this.bind($wrap.find("input[type='file']"));
					$thumbImg.removeAttr('style').attr('src', _this.blink);
					$wrap.appendTo($multiple)
				});
			}
		},
		textarea : {
			init : function () {
				$("textarea").each(function(){
					//console.log("textarea")
					var $this = $(this);
					var total = $this.attr("maxlength");
					var height = $this.outerHeight();
					common.scroll($this, function(){
						if ($this.closest(".textarea").length) return;
						$this.closest(".scroll-textarea").wrap("<div class='textarea'></div>");
						$this.closest(".scroll-wrapper").height(height);
						if (typeof total !== 'undefined'){
							$this.closest(".textarea").append("<div class='textarea-count'>(<span class='current'>0</span>/<span class='total'>"+ total +"</span>)</div>");
							$this.off('keyup.textarea input.textarea').on('keyup.textarea input.textarea', function() {
								common.textarea.count($this);
								common.textarea.max($this , total); /* 2019-07-09 textarea ie9 maxlength 작업 */
							}).keyup();
						}
					});
				});
			},
			count : function($this){
				var $current = $this.val().length;
				$this.closest(".textarea").find(".current").text($current);
			},
			/* 2019-07-09 textarea ie9 maxlength 작업// */
			max : function($this, total){
				$this.keyup(function () {
					var valueOfInput = $this.val();
					if (valueOfInput.length > total) {
						$this.html(valueOfInput.substr(0, total));
					}
				});
			}, /* //2019-07-09 textarea ie9 maxlength 작업 */
			error : function(selector, text){
				var $parent = $(selector).closest(".textarea");
				var classes = $(selector)[0].hasAttribute('data-error') ? "input-error-"+$(selector).data('error') : 'input-error';
				if (typeof text === 'undefined'){
					$parent.removeClass(classes);
					$parent.find(".error-txt").remove();
				} else {
					$parent.addClass(classes);
					if (!$parent.find(".error-txt").length) {
						$parent.append("<span class='error-txt'>"+text+"</span>");
					} else {
						$parent.find(".error-txt").text(text);
					}
					$(window).scrollTop(($parent.offset().top + $parent.height() / 2) - $(window).height() / 2);
				}
			}
		},
		datepicker : function () {
			if ($.datepicker._oldAdjustDate === undefined){
				var datepickerExtensions = {
					_oldAdjustDate: $.datepicker._adjustDate,
					_adjustDate: function(id, offset, period) {
						var target = $(id);
						var inst = this._getInst(target[0]);
						var afterAdjustDate = this._get(inst, 'afterAdjustDate');
						this._oldAdjustDate(id, offset, period, inst);
						if(afterAdjustDate){
							afterAdjustDate(id, offset, period, inst);
						}
					}
				};
				$.extend($.datepicker, datepickerExtensions);
			}
			var defaults = {
				showOn: "button",
				position: { my : "left top100", at: "left bottom" },
				dateFormat: 'yy-mm-dd',
				showMonthAfterYear: true,
				prevText: '이전 달',
				nextText: '다음 달',
				monthNames: ['01','02','03','04','05','06','07','08','09','10','11','12'],
				monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
				dayNames: ['일', '월', '화', '수', '목', '금', '토'],
				dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
				dayNamesMin: ['S','M','T','W','T','F','S'],
				yearSuffix: '.',
				currentText: "오늘",
				setToday : false,
				defaultDate : null,
				beforeShowDay : function(date){
					var array = $(this).attr('data-disabled-date') !== undefined ? $(this).attr('data-disabled-date') : [];
					var string = $.datepicker.formatDate('yy-mm-dd', date);
					return [ array.indexOf(string) === -1 ];
				},
				beforeShow : function(input, inst){
					var $this = $(this);
					setTimeout(function(){
						//selectCheck(input,inst);
						var btnType = $(input).closest(".datepicker-btn");
						var $target = btnType.length ? btnType.find("> button") : $(inst.trigger);
						var $widget = inst.dpDiv;
						$widget.append("<span class='after' aria-hidden='true' tabindex='0'></span>");
						accessibility(input, undefined, undefined, inst);
						$widget.attr("tabindex","0").focus();
						$widget.off("keydown").on("keydown", function (e) {
							if(e.shiftKey && e.keyCode === 9 && e.target === this) {
								e.preventDefault();
								$(input).datepicker("hide");
								$target.focus();
							}
						});
						$widget.find(".after").focusin(function () {
							$target.focus();
							$(input).datepicker("hide");
						});
						$this.trigger("beforeShow");
					}, 1);
				},
				afterAdjustDate: function(input, offset, period, inst){
					//selectCheck(inst.input,inst);
					var $widget = inst.dpDiv;
					var $prev = $(".ui-datepicker-prev", $widget);
					var $next = $(".ui-datepicker-next", $widget);
					accessibility(input, offset, period, inst);
					if (period === "M"){
						if (offset === -1){
							$prev.focus();
						} else if (offset === 1) {
							$next.focus();
						}
					}
					$(this).trigger("afterAdjustDate");
				},
				onSelect : function (dateText, inst) {
					var btnType = $(inst.input).closest(".datepicker-btn");
					var $this = inst.input;
					var $target = btnType.length ? btnType.find("> button") : $(inst.trigger);
					$target.focus();
					var fromTo = inst.settings.from || inst.settings.to;
					if (fromTo) {
						var minOrMax = inst.settings.from ? "minDate" : "maxDate";
						var $siblingsIpt = $("[data-from-to="+ fromTo +"]").not($this);
						var getDate = $(this).datepicker("getDate");
						$siblingsIpt.datepicker( "option", minOrMax, getDate );
					}
					$(this).trigger("onSelect");
				}
			};
			/*function selectCheck(input,inst){
				if (inst.input[0].hasAttribute("data-select-check")){
					inst.dpDiv.find("td a").each(function(){
						$(this).on("click", function(e){
							if ($(input).attr("data-select-check") === ""){
							} else {
								e.preventDefault();
								return false;
							}
						});
					});
				}
			}*/
			function accessibility(input, offset, period, inst){
				var $widget = inst.dpDiv;
				var $btn = $(".ui-datepicker-header .ui-corner-all", $widget);
				var $today = $(".ui-datepicker-current", $widget);
				$widget.find(".ui-datepicker-calendar").prepend("<caption>날짜 선택</caption>");
				$btn.attr("href","#").off("click.prev").on("click.prev", function(e){
					e.preventDefault();
				});
				$today.on("click", function () {
					$(input).datepicker("setDate", "today");
					$(input).datepicker("hide");
				});
			}
			$("[data-calendar]").each(function(){
				if ($(this).hasClass("hasDatepicker")) return;
				//console.log("datepicker")
				var $this = $(this);
				if ( !$this.closest("datepicker").length ){
					common.input.init($(this));
				}
				var options = $.extend(false, defaults, $this.data("calendar"));
				$this.datepicker(options);
				if (options.setToday) {
					$this.datepicker("setDate", "today");
				}
				if (options.setDate) {
					$this.datepicker("setDate", options.setDate);
				}
				common.cleave.bind(this, "datepicker");
				var fromTo = options.from || options.to;
				if (fromTo) {
					$this.attr("data-from-to", fromTo);
				}
			});
			$(".datepicker-btn").each(function() {
				var $this = $(this);
				$this.find("button").off("click.datepicker").on("click.datepicker", function(){
					$this.find("input").datepicker("show")
				});
			});
		},
		formToggle : function(selector){
			var $selector = (typeof selector === "undefined") ? $("[data-form-toggle]") : selector;
			$selector.each(function(){
				var $this = $(this);
				if ($this.hasClass("hasToggleForm")) return;
				if ($this[0].tagName === "OPTION") return;
				var $target = ($this[0].tagName === "SELECT") ? $("[data-toggle-content="+$this.find(":selected").data("form-toggle")+"]") : $("[data-toggle-content="+$this.data("form-toggle")+"]");
				$this.off("change.formToggle").on("change.formToggle", function(){
					var $target = (this.tagName === "SELECT") ? $("[data-toggle-content="+$(this).find(":selected").data("form-toggle")+"]") : $("[data-toggle-content="+$(this).data("form-toggle")+"]");
					onOff(this, $target);
				});
				onOff(this, $target);
				function onOff(ctr, $target){
					if ($(ctr).prop("checked") || $(ctr)[0].tagName === "SELECT") {
						$target.addClass("active").siblings("[data-toggle-content]").removeClass("active");
					} else {
						$target.removeClass("active");
					}
					common.select($target.find("select"));
					common.modal.size();
				}
				$this.addClass("hasToggleForm")
			});
		},
		anchor : function () {
			var defaults = {};
			$("[data-anchor]").each(function(){
				var $this = $(this);
				var options = $.extend(false, defaults, $this.data("anchor"));
				options.height = typeof options.height === "undefined" ? $this.outerHeight() : options.height;
				$("a", $this).each(function (idx){
					try{
						var currLink = $(this);
						var $li = currLink.parent();
						var refElement = $(currLink.attr("href"));
						var top, btm;
						currLink.off("click.anchor").on("click.anchor", function(e){
							if (this.hasAttribute("data-modal-open")) return;
							$(window).scroll();
							e.preventDefault();
							$("html, body").stop().animate({"scrollTop":top + 2}, 0);
						});
						$(window).off("scroll.anchor"+idx).on("scroll.anchor"+idx, function(){
							var winTop = $(this).scrollTop();
							top = refElement.offset().top - options.height;
							btm = top + refElement.outerHeight();
							if (top <= winTop && btm > winTop) {
								$li.addClass("active").siblings().removeClass("active");
							}/* else{
								$li.removeClass("active");
							}*/
						});
					}catch(e){
						//
					}
				});
			});
		},
		tab : {
			init : function () {
				$("[data-tab] a").off("click.tab").on("click.tab", function(e){
					e.preventDefault();
					tabActive(this);
				});
				$("[data-tab] .active a").each(function(){
					tabActive(this);
				});
				function tabActive(selector){
					$(selector).each(function(){
						var id = $(this).attr("href").split("#")[1];
						if (id === "") return;
						if (!$("#"+id).length) return;
						common.tab.open(id);
					});
				}
			},
			open : function(id){
				//console.log("tab-open")
				var $li = $('a[href="#' +id + '"]').parent();
				if ($li.hasClass("disabled")) return;
				$li.addClass("active");
				var $target = $("#"+id);
				$target.addClass("active");
				//console.log($target.is(":visible"))
				$li.siblings().each(function(){
					var href = $(this).find("a").attr("href");
					if (href === "#") return;
					if (!$(href).length) return;
					$(this).removeClass("active");
					$(href).removeClass("active");
				});
				common.select($target.find("select"));
				common.scroll($target.find("[data-scroll]"));
				common.slider.init($target.find("[data-slider]"));
				common.modal.size();
				common.gridList();
			}
		},
		accordion: {
			defaults : {
				parent : null,
			},
			init : function(){
				var speed = 300;
				$("[data-accordion]").each(function(){
					//console.log("accordion")
					stateChk($(this), !$(this).hasClass("active"), 0);
					$(this).off("click.accordion").on("click.accordion", function(e){
						e.preventDefault();
						stateChk($(this), $(this).hasClass("active"), speed);
					});
				});
				function stateChk($anchor, state, speed){
					if (state) {
						common.accordion.close($anchor, speed);
					} else {
						common.accordion.open($anchor, speed);
					}
				}
			},
			open : function($anchor, speed){
				var _this = this;
				var options = $.extend(false, _this.defaults, $anchor.data("accordion"));
				var $target = $($anchor.attr("href"));
				speed = (typeof speed !== "undefined") ? speed : 0;
				if (options.openText !== "undefined"){
					$anchor.text(options.openText);
				}
				if ($anchor.data("accordion-group") !== ""){
					var group = $anchor.data("accordion-group");
					this.close(  $("[data-accordion-group="+group+"]").not($anchor), speed);
				}
				if (options.parent !== null){
					$anchor.closest(options.parent).addClass("active");
				}
				$anchor.addClass("active");
				$target.stop().slideDown(speed, function(){
					common.modal.size();
				});
			},
			close : function($anchor, speed){
				var _this = this;
				$anchor.each(function(){
					var $this = $(this);
					var $target = $($this.attr("href"));
					var options = $.extend(false, _this.defaults, $this.data("accordion"));
					if (options.closeText !== "undefined"){
						$this.text(options.closeText);
					}
					speed = (typeof speed !== "undefined") ? speed : 0;
					if (options.parent){
						$this.closest(options.parent).removeClass("active");
					}
					$this.removeClass("active");

					$target.stop().slideUp(speed, function(){
						common.modal.size();
					});
				});
			}
		},
		topBtn : function () {
			var btnTop = $('#btnTop');
			$(window).off('scroll.btnTop').on('scroll.btnTop',function() {
				var bottomSticky = $("[data-sticky-btm]:visible").length ? $("[data-sticky-btm]").height() : 0;
				var stop = $('html').height() - $('#footer').height() - $(window).height();
				var bottom = 100 + bottomSticky;
				var winTop = $(window).scrollTop();
				if (winTop > 300) {
					btnTop.addClass('active');
				} else {
					btnTop.removeClass('active');
				}
				if (winTop >= stop) {
					btnTop.addClass('end').css("bottom", $('#footer').height() + bottom);
				} else {
					btnTop.removeClass('end').css("bottom", bottom);
				}
			}).scroll();
			btnTop.off('click.btnTop').on('click.btnTop', function(e) {
				e.preventDefault();
				$('html, body').animate({scrollTop:0}, '100');
			});
		},
		slider :{
			defaults : {
				accessibility: false,
				slidesToShow: 1,
				slidesToScroll:1,
				draggable:false,
				dots:true,
				infinite:false,
				speed:200,
				count: false,
				arrows : true,
				pauseOnHover: true,
				bgTarget : null,
				importantArrows : false,
				initialSlide : 0
			},
			init : function (target) {
				var $target = (typeof target === "undefined") ? $("[data-slider]:visible") : target;
				var _this = this;
				$target.each(function(){
					var $this = $(this);
					if (typeof this.slick !== "undefined" && !this.slick.unslicked ) return;
					var itemLength = $(this).children().length;
					var options = $.extend(false, _this.defaults, $this.data("slider"));
					var activeIdx = $(this).find("> .active").length ? $(this).find("> .active").index() : 0;
					options.initialSlide = Math.floor(activeIdx / options.slidesToScroll) * options.slidesToScroll;
					$this.find(".slick-util-group").remove();
					$this.off('init.tabindex').on('init.tabindex', function (event, slick, currentSlide) {
						$this.find(".slick-cloned a, .slick-cloned button").attr("tabindex", "-1");
					});
					if (options.dots){
						$this.off('init.dots').on('init.dots', function (event, slick, currentSlide) {
							$this.find(".slick-dots").wrap("<div class='slick-dots-group'></div>");
						});
					}
					if (options.autoplay){
						$this.off('init.autoplay').on('init.autoplay', function (event, slick, currentSlide) {
							var $palyBtn = $this.find(".slick-dots-group").append('<button type="button" class="btn-play-toggle">정지</button>').find(".btn-play-toggle");
							$palyBtn.off("click.play").on("click.play", function(){
								if ($palyBtn.hasClass("play")) {
									slick.slickPlay();
									$palyBtn.text("정지").removeClass("play");
								} else {
									slick.slickPause();
									$palyBtn.text("재생").addClass("play");
								}
							});
						});
					}
					if (options.count && options.slidesToShow < itemLength){
						var $status;
						$this.off('init.count reInit.count').on('init.count reInit.count', function () {
							$this.append('<span class="slick-count"><strong>0</strong>/<span>0</span></span>');
						});
						$this.off('init.count2 reInit.count2 afterChange.count2').on('init.count2 reInit.count2 afterChange.count2', function (event, slick, currentSlide) {
							var dataScroll = options.slidesToScroll;
							var totalCount = slick.slideCount;
							totalCount = totalCount % dataScroll === 0 ?  totalCount/dataScroll  : parseInt(totalCount/dataScroll) + 1;
							var i = slick.currentSlide;
							$status = $this.find(".slick-count");
							if (slick.$slides.length <= dataScroll){
								$status.hide();
							} else {
								$status.show();
								$status.find("strong").html((i / dataScroll) + 1);
								$status.find("span").html(totalCount);
							}
						});
					}
					if (options.productOption){
						$this.off('beforeChange.count').on('beforeChange.count', function (event, slick, currentSlide) {
							$this.removeClass("active");
						});
					}
					if (options.autoplay || options.count || options.arrows || options.dots){
						$this.off('init.test reInit.test').on('init.test reInit.test', function (event, slick, currentSlide) {
							$this.find(".slick-util-group").remove();
							$this.append("<div class='slick-util-group'></div>");
							var $group = $this.find(".slick-util-group");
							var $count = $this.find(".slick-count");
							var $prev = $this.find(".slick-prev");
							var $next = $this.find(".slick-next");
							var $dotsGroup = $this.find(".slick-dots-group");
							$group.append($prev);
							$group.append($count);
							$group.append($next);
							$group.append($dotsGroup);
						});
					}
					if (options.bgTarget !== null){
						$this.off('init.bgTarget reInit.bgTarget afterChange.bgTarget').on('init.bgTarget reInit.bgTarget afterChange.bgTarget', function (event, slick, currentSlide) {
							var bgColor = slick.$slider.find(".slick-active").css("background-color");
							$(options.bgTarget).css("background-color" , bgColor);
						});
					}
					if (this.hasAttribute("data-slider-ctr")){
						$this.off('init.sliderCtr reInit.sliderCtr afterChange.sliderCtr').on('init.sliderCtr reInit.sliderCtr afterChange.sliderCtr', function (event, slick, currentSlide) {
							var ctrTarget = $("[data-slider-ctr="+$this.data("slider-ctr")+"]").not($this);
							ctrTarget.find("a:eq("+slick.currentSlide+")").trigger("click");
						});
					}
					if (options.importantCount){
						$this.off('init.importantCount reInit.importantCount').on('init.importantCount reInit.importantCount', function (event, slick, currentSlide) {
							var $group = $this.find(".slick-util-group");
							$group.append("<span class=\"slick-count\"><strong>1</strong>/<span>1</span></span>");
						});
					}
					if (options.importantArrows && options.slidesToShow >= itemLength){
						$this.off('init.importantArrows reInit.importantArrows').on('init.importantArrows reInit.importantArrows', function (event, slick, currentSlide) {
							var $group = $this.find(".slick-util-group");
							$group.prepend("<button class=\"slick-prev slick-arrow slick-disabled\" aria-label=\"Previous\" type=\"button\" aria-disabled=\"true\" style=\"\">Previous</button>");
							$group.append("<button class=\"slick-next slick-arrow slick-disabled\" aria-label=\"Next\" type=\"button\" style=\"\" aria-disabled=\"true\">Next</button>");
						});
					}

					$this.not('.slick-initialized').slick(options);
					//$this.slick('slickGoTo', Math.floor(activeIdx / options.slidesToScroll));
				});
			},
			add : function(target, item, idx){
				$(target).slick('slickAdd', item, idx, true);
			},
			remove : function(target, idx, removeAll){
				$(target).slick('slickRemove', idx, false, removeAll);
			}
		},

		sticky : {
			arr : [],
			defaults : {
				start: 'top', // top or bottom
				top:0,
				zIndex : 20110,
				first : false
			},
			init : function(){
				var _this = this;
				$('[data-sticky], .nav-wrap').each(function(idx){
					var options = $.extend(false, _this.defaults, $(this).data("sticky"));
					var wrapClass = 'sticky-wrap';
					if (!$(this).parent('.'+wrapClass).length) {
						$(this).wrap('<div class="'+wrapClass+'"></div>');
					}
					var $this = $(this);
					var $parent = $this.closest('[data-sticky-parent]').length ? $this.closest('[data-sticky-parent]') : $('#wrap');
					var $wrap = $this.parent('.'+wrapClass);
					$this.parent("."+wrapClass).height($this.outerHeight());
					_this.arr[idx] = {
						'prevIdx' : idx,
						'nextIdx' : idx,
						'idx' : idx,
						'parent' : $parent[0],
						'parentParent' : $parent.parent().closest('[data-sticky-parent], #wrap')[0],
						'obj' : $(this),
						'wrap' : $wrap,
						'height' : $wrap.outerHeight(),
						'posTop' : 0,
						'posBtm' : 0,
						'bottom' : 0,
						'start' : $wrap.offset().top,
						'end' : $parent.offset().top + $parent.outerHeight() - $wrap.outerHeight(),
						'options' : options
					};
				});
				$.each(_this.arr, function (idx, item) {
					for (var i = idx-1; i > -1; i-- ) {
						if (item.parent === _this.arr[i].parent || item.parentParent === _this.arr[i].parent) {
							item.prevIdx = i;
							break;
						}
					}
					if (idx !== item.prevIdx){
						item.posTop = Math.round( _this.arr[item.prevIdx].posTop +  _this.arr[item.prevIdx].height);
					}
					item.posTop += item.options.top;
					if (item.options.first) {
						item.posTop = 0;
					}
				});
				var reverseArr = _this.arr.slice().reverse();
				$.each(reverseArr, function (idx, item) {
					for (var x = idx-1; x > -1; x-- ) {
						if (item.parent === reverseArr[x].parent) {
							item.nextIdx = reverseArr[x].idx;
							break;
						}
					}
					if (item.idx !== item.nextIdx){
						if (_this.arr[item.nextIdx].options.first){
							item.posBtm = 0;
						} else {
							item.posBtm = Math.round( _this.arr[item.nextIdx].posBtm + _this.arr[item.nextIdx].height);
						}
					}
					item.obj.css("z-index", item.options.zIndex + idx);
				});
				reverseArr = null;
				this.set();
				this.bind();
			},
			set : function(){
				var _this = this;
				$.each(_this.arr, function (idx, item) {
					var end = $(item.parent).offset().top + $(item.parent).outerHeight() - item.wrap.outerHeight() - item.posTop - item.posBtm;
					item.start = Math.round(item.wrap.offset().top - item.posTop);
					item.end = Math.round( end );
					item.bottom = $(item.parent).outerHeight() - item.height - item.posBtm;
					if (_this.arr[item.nextIdx].options.first && item.idx !== item.nextIdx){
						item.end = _this.arr[item.nextIdx].start - item.height;
						item.bottom = _this.arr[item.nextIdx].start - item.height;
					}
				});
			},
			bind : function(){
				var _this = this;
				$(window).off('resize.stickySet').on('resize.stickySet', function () {
					_this.init();
				});
				$(window).off('scroll.sticky resize.sticky').on('scroll.sticky resize.sticky', function () {
					if ( $("html").hasClass("modal-open")) return;
					var winSt = $(window).scrollTop();
					var winSl = $(window).scrollLeft();
					_this.set();
					$.each(_this.arr, function (idx, item) {
						if (winSt < item.start) { // sticky 이전
							item.obj.css({
								'position':'relative',
								'top' : '0',
								'left' : '0',
								'bottom' : 'auto'
							}).removeClass("is-fixed");
						} else if ( winSt >= item.start && winSt < item.end ) { // sticky 시작
							item.obj.css({
								'position' : 'fixed',
								'top' : item.posTop,
								'left' : item.wrap.offset().left - winSl,
								'bottom' : 'auto'
							}).addClass("is-fixed");
						} else if (winSt >= item.end) { // sticky 끝
							item.obj.css({
								'position' : 'absolute',
								'top' : item.bottom,
								'left' : item.wrap.position().left,
								'bottom' : 'auto'
							}).removeClass("is-fixed");
						}
					});
				}).scroll();
			}
		},
		todaySelect : function(state){
			state = typeof state === "undefined" ? false : state;
			var $target = $(".today-selected");
			var itemLength = $(".product-select .item", $target).length;
			if (state || itemLength){
				$target.show();
				common.slider.init($target.find("[data-slider]"));
			} else {
				$target.hide();
			}
			common.stickyBtm();
			$(window).scroll();
		},
		stickyBtm : function(){
			var footerHeight = $('#footer').height();
			$("[data-sticky-btm]").each(function(){
				var wrapClass = 'sticky-btm-wrap';
				if (!$(this).parent('.'+wrapClass).length) {
					$(this).wrap('<div class="'+wrapClass+'"></div>');
				}
				var $this = $(this);
				$this.parent('.'+wrapClass).height( $this.is(":visible") ? $this.outerHeight() : 0 );
				$(window).off('scroll.stickyBtm').on('scroll.stickyBtm',function() {
					console.log("stickyBtm");
					var stop = $('html').height() - footerHeight - $(window).height();
					var bottom = 0;
					var winTop = $(window).scrollTop();
					if (winTop >= stop) {
						$this.css({
							"position" : "absolute",
							"bottom" : footerHeight + bottom
						});
					} else {
						$this.css({
							"position" : "fixed",
							"bottom" : bottom
						});
					}
				}).scroll();
			});
		},
		scroll : function (obj, callback) {
			var $target = (typeof obj !== "undefined") ? obj : $('[data-scroll]');
			$target.each(function(){
				var $this =  $(this);
				////console.log($this)
				var depth = $this.parents("[data-scroll]").length;
				setTimeout(function () {
					//$this.attr("tabindex","0").scrollbar();
					$this.scrollbar();
					if (typeof callback === "function"){
						callback();
					}
					if ($this.closest(".modal").length){
						common.modal.size();
					}
				}, depth);
			});
		},
		tooltip : function(){
			var speed = 200;
			$("[data-tooltip]").each(function(idx){
				//console.log("tooltip")
				var $this = $(this);
				var $toolWrap = $("[class*=tooltip-wrap]", this);
				var $anchor = $("[class*=tooltip-icon]", this);
				var $target = $(".tooltip-content", this);
				var $close = $(".btn-tooltip-close", $target);
				var $wrap = $this.closest("[data-scroll]").length ? $this.closest("[data-scroll]") : ($this.closest(".contents").length) ? $this.closest(".contents") : $("body");

				$anchor.attr({
					"href": "#tooltip"+idx,
					"title": "툴팁 열기"
				});
				$target.attr({
					"id": "tooltip"+idx
					//"tabindex": "0",
				});
				$this.off("click.tooltip").on("click.tooltip", function(e){
					e.preventDefault();
					if ($(e.target).closest(".tooltip-content").length) return;
					var wrapLeft = $wrap.offset().left;
					var wrapWidth = $wrap.outerWidth();
					var wrapRight = wrapLeft + wrapWidth;
					$toolWrap.addClass("active");
					$target.stop().fadeIn(speed);
					$target.css("z-index","99999");
					var icoLeft = $target.offset().left;
					var icoRight = icoLeft + $target.outerWidth();
					if ( wrapLeft > icoLeft ){
						$target.css("margin-left", wrapLeft - icoLeft);
					} else if (wrapRight < icoRight) {
						$target.css("margin-left", wrapRight - icoRight);
					}
					setTimeout(function () {
						$close.focus();
					},10);
				});
			});
			$(".tooltip-wrap").each(function(){
				var $toolWrap = $(this);
				var $anchor = $("[class*=tooltip-icon]", this);
				var $target = $(".tooltip-content", this);
				var $close = $(".btn-tooltip-close", $target);
				$close.off("click.tooltip").on("click.tooltip", function(e){
					e.preventDefault();
					$anchor.focus();
					$target.css("z-index","auto");
					$close.closest("[data-tooltip]");
					$toolWrap.removeClass("active");
					$target.stop().fadeOut(speed);
				});
			});
			$(window).off("click.tooltip").on("click.tooltip", function(e){
				var $target = $("[data-tooltip]").not($(e.target).closest("[data-tooltip]").length ? $(e.target).closest("[data-tooltip]") : null);
				$target.find(".tooltip-wrap").removeClass("active");
				$target.find(".tooltip-content").fadeOut(speed, function(){
					$(this).css("z-index","auto")
				});
			});
		},
		modal : {
			arr : [],
			init : function(){
				$('[data-modal-open]').off("click.modalOpen").on("click.modalOpen", function(e){
					e.preventDefault();
					var id = $(this).attr("href");
					common.modal.open(id);
					common.modal.size();
				});
				$('[data-modal-close]').off("click.modalClose").on("click.modalClose", function(){
					var id = $(this).closest(".modal").attr("id");
					common.modal.close("#"+id);
				});
				$(window).off("resize.modalClose").on("resize.modalClose", function(){
					common.modal.size();
					/*common.modal.cartSize();*/
				}).resize();
			},
			open :function(id, speed){
				speed = (typeof speed !== "undefined") ? speed : 0;
				var $target = $(id);
				var dim = "[data-dimmed='" + id + "']";
				if ($target.is(":visible") || !$target.length || $(dim).length) return;
				$target.addClass("open").attr("tabindex","0");
				common.modal.arr.push(id);
				var top = $(window).scrollTop();
				var left = $(window).scrollLeft();
				var num = common.modal.arr.length;
				$("html").addClass("modal-open");
				var $modalWrap = $("#modal-wrap");
				$modalWrap.prepend("<div class='dimmed' data-dimmed='"+ id +"'>");
				if(num < 2) {
					$("#wrap").scrollTop(top).scrollLeft(left);
				}
				$(dim).stop().fadeIn(speed / 2, function(){
					common.modal.size();
					$target.stop().fadeIn(speed, function(){
						$target.focus();
						common.init();
						$(window).resize();
					}).css("z-index", (199999 + num));
				}).css("z-index", (199999 + num));

				if (!$target.hasClass("accessibility")){
					var $closeBtn = $target.find(".btn-modal-close");
					$target.off("keydown.accessibility").on("keydown.accessibility", function(e){
						if (e.target === $target[0] && e.keyCode === 9 && e.shiftKey) {
							e.preventDefault();
							$closeBtn.focus();
						}
					});
					$closeBtn.off("keydown.accessibility").on("keydown.accessibility", function(e){
						if (e.target === $closeBtn[0] && e.keyCode === 9 && !e.shiftKey) {
							e.preventDefault();
							$target.focus();
						}
					});
				}

			},
			close :function(id, speed, focusTarget){
				speed = (typeof speed !== "undefined") ? speed : 0;
				var top = $("#wrap").scrollTop();
				var left = $("#wrap").scrollLeft();
				var $modal = $(id);
				var $dimmed = $("[data-dimmed='" + id +"']");
				common.modal.arr.pop();
				$modal.stop().fadeOut(speed, function(){
					$modal.css("z-index","").removeClass("open");

					setTimeout(function(){
						$(focusTarget).focus();
					},1000)
					if(common.modal.arr.length < 1){
						$("html").removeClass("modal-open");
						$(document).scrollTop(top).scrollLeft(left);
						$(window).scroll();
					}
				});
				$dimmed.stop().fadeOut(speed, function () {
					$dimmed.remove();
				});
			},
			size : function(){
				var documentH = $(window).height();
				var margin = 100;
				var maxHeight = 800;
				$(".modal.open").each(function () {
					var $this = $(this);
					var $content = $(this).find(".modal-contents > .scroll-wrapper, .modal-contents > .scroll-wrapper > [data-scroll]");
					var headerH = $(this).find(".modal-header").length ? $(this).find(".modal-header").outerHeight() : 0;
					var footerH = $(this).find(".modal-footer").length ? $(this).find(".modal-footer").outerHeight() : 0;
					var height = Math.min(documentH - (headerH + footerH + margin) , maxHeight - headerH - footerH);
					$content.css("max-height" , height);
					$this.find(".detail-cart-wrap").height(height);
					if ( $this.outerHeight() % 2 !== 0){
						var $contents = $this.find(".modal-contents");
						if ($contents.css("margin-bottom") === "1px"){
							$contents.css("margin-bottom", "0");
						} else {
							$contents.css("margin-bottom", "1px");
						}
					}
					if ($(this).find(".product-option").length) {
						common.productOption();
					}
				});
			}
		},
		toastPop : function (val) {
			val = typeof val === "undefined" ? "<strong>장바구니</strong>에 상품이 담겼습니다!" : val;
			var speed = 3000;
			$(".toggle-alert").remove();
			var $alertWrap = $("#container").append("<div class='toggle-alert'>"+val+"</div>").find(".toggle-alert");
			setTimeout(function () {
				$alertWrap.addClass("is-active");
			}, 1);
			setTimeout(function () {
				$alertWrap.removeClass("is-active");
			}, speed);
			setTimeout(function () {
				$alertWrap.remove();
			}, speed + 300);
		},
		filter: function (){
			$('.btn-filter-open').off('click.filterOpen').on('click.filterOpen',function(){
				$('.filter-wrap').addClass('open');
			});
			$('.btn-filter-fold').off('click.filterFold').on('click.filterFold',function(){
				$('.filter-wrap').removeClass('open');
			});
		},
		stickerEvent : function(){
			function getRandomIntInclusive(min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			}
			var $container = $("#container");
			$(".event-coupon-sticker").each(function(){
				var left = getRandomIntInclusive($container.offset().left, $container.offset().left + $container.outerWidth() - 180);
				var top = getRandomIntInclusive($container.offset().top, $container.offset().top + $container.outerHeight() - 180);
				$(this).css({
					left: left,
					top: top
				});
			});
		}
	};
	var etc = {
		queryString: function () {
			var a = window.location.search.substr(1).split('&');
			if (a === "") return;
			var b = {};
			for (var i = 0; i < a.length; i++) {
				var p = a[i].split('=');
				if (p.length !== 2) continue;
				b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
			}
			return b;
		},
		pageCtr: function () {
			if (!etc.queryString()) return;
			var pram = etc.queryString();
			if (pram['modal']) {
				var modal = pram['modal'].split(",");//.map(Number);
				modal.forEach(function(element) {
					common.modal.open("#"+element, 0);
					setTimeout(function(){
						common.modal.size();
					}, 10);
				});
			}
			if (pram['tab']) {
				var tab = pram['tab'].split(",");
				tab.forEach(function(element) {
					common.tab.open(element);
				});
			}
		}
	};
	return common;
}();
$(function () {
	cjom.init();
	/*cjom.init();
	cjom.init();
	cjom.init();*/
});
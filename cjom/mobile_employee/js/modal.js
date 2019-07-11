var modalArr = [];
var funding = function(){
    var common = {
        init : function(){
            common.modal();
            common.modalSize();
        },
        modal : function() {
            $('[data-modalbtn]').off('click.open').on('click.open', function(e){
                e.preventDefault();
                var href = $(this).attr("href");
                common.modalOpen($(href), 300);
            });
            $('[data-modalclose]').off('click.close').on('click.close', function () {
                common.modalClose();
            });
            $(window).resize(function(){
                common.modalSize();
            });
            $("#modal").off('click.modalClick').on('click.modalClick', function(e){
                if (!$(e.target).closest(".modal-dialog").length){
                    //common.modalClose();
                }
            });
            $(document).off('keyup.modalClose').on('keyup.modalClose', function(e){
                if(e.keyCode === 27 && $('html').hasClass('open-modal')){
                    common.modalClose();
                }
            });
        },
        modalSize : function(){
            if($('html').hasClass('open-modal')){
                var $windowH = $(window).height();
                var $openModal = $('.modal-dialog.open');
                var $moWrap = $openModal.find('.scroll-wrapper, .scroll-content');
                var moHeaderHeight = $openModal.find('.modal-header').outerHeight();
                var moFooterHeight = $openModal.find('.modal-footer').outerHeight();
                $moWrap.css('max-height', Math.min($windowH - (moHeaderHeight + moFooterHeight + 200), 800));
            }
        },
        modalOpen : function($modal , speed){
            if (!$modal.length || !$modal.closest("#modal").length || $modal.is(":visible")) return;
            var windowLeft = $(window).scrollLeft();
            var windowTop = $(window).scrollTop();
            var modalId = $modal.attr("id");
            modalArr.push(modalId);
            $('html').addClass('open-modal');
            $modal.addClass("open").css("z-index",modalArr.length).fadeIn(speed, function(){
                common.modalSize();
            }).siblings('.modal-dialog').removeClass("open");
            setTimeout(function(){
                common.modalSize();
            }, 10);
            $modal.closest('#modal').prepend("<div class='dim' data-dim='"+modalId+"'></div>");
            $(".dim[data-dim="+modalId+"]").css("z-index",modalArr.length).fadeIn(speed);
            $("#wrap").scrollTop(windowTop).scrollLeft(windowLeft);
            common.modal();
        },
        modalClose : function(speed) {
            var modalId = modalArr[modalArr.length-1];
            modalArr.pop();
            var bodyTop = $("#wrap").scrollTop();
            var bodyLeft = $("#wrap").scrollLeft();
            $('#'+modalId).fadeOut(speed, function(){
                if (modalArr.length === 0){
                    $("html").removeClass("open-modal");
                    $("html, body").scrollTop(bodyTop).scrollLeft(bodyLeft);
                }
            }).removeClass("open");
            $(".dim[data-dim="+modalId+"]").fadeOut(speed, function(){
                $(".dim[data-dim="+modalId+"]").remove();
            });
        },
    };
    return common;
}();
$(function(){
    funding.init();
});

$(function() {

    if ($('.header').length ) {
        if ( $('.header--main').length ) {
            $.ajax({
                url : "/cjom/mobile/include/header.html",
                success : function(result) {
                    $(".header--main").html(result);
                    $('[data-js=floating]').floating();
                    $('[data-js=swiper]').swiper();
                }
            });
        } else if ( $('.header--sub').length ) {
            $.ajax({
                url : "/cjom/mobile/include/sub-header.html",
                success : function(result) {
                    $(".header--sub").html(result);
                    $('[data-js=floating]').floating();
                }
            });
        }
        $.ajax({
            url : "/cjom/mobile/include/gnb.html",
            success : function(result) {
                $("body").append(result);
                $("[data-js='tab']").tab();

                //catagory page
                if(document.URL.indexOf("TM-SB-M.COM-001.html") >-1){
                    $(".header .header__all-menus").trigger("click");
                }
            }
        });
    }
    if ($('.footer').length ) {
        $.ajax({
            url : "/cjom/mobile/include/footer.html",
            success : function(result) {
                $(".footer").html(result);
            }
        });
    }

})
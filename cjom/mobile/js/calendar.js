jQuery(function($) {
    $.datepicker.setDefaults({
        dateFormat: "yymmdd"
        , showButtonPanel: true
        , showMonthAfterYear: true
        , changeYear: true
        , changeMonth : true
        , monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
        , dayNamesMin: ['일','월','화','수','목','금','토']
        , prevText:""
        , nextText:""
    	, showOn: "button"
        , buttonImage: "//image.crewmate.co.kr/demoshop/ico_calander.gif"
       	, buttonImageOnly: true
    });
});
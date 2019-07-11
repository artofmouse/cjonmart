$(document).ready(function() {
	$('pre code').each(function(i, block) {
		hljs.highlightBlock(block);
	});
	$(".aside a").click(function () {
		$('.aside li').removeClass('active');
		$(this).parents().addClass('active');
		$("#page").attr("src", $(this).attr("href"));
		return false;
	})
});

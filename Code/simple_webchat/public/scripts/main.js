/*$('#container').css('width',$(window).width());*/
$(window).ready(function() {
	if(window.innerWidth < 992) {
		$('.chat').css('height', window.innerHeight-123);
	} else {
		$('.chat').css('height', window.innerHeight-65);
	}
}).resize(function() {
	if(window.innerWidth < 992) {
		$('.chat').css('height', window.innerHeight-123);
	} else {
		$('.chat').css('height', window.innerHeight-65);
	}
});

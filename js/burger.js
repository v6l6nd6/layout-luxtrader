$(document).ready(function() {
	$('.header__budrger').click(function(event) {
		$('.header__burger,.header__menu').toggleClass('active');
		$('body').toggleClass('lock');
	});
	
});

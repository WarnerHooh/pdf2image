$(function() {
	$.ajax({
		url: 'http://127.0.0.1:3000/users/json',
		method: 'POST',
		success: function(data) {
			console.log(data);
		}
	});
});
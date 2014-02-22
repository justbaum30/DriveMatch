$(function() {
	$('.datetimepicker').datetimepicker({
    	format: 'MM dd, yyyy hh:ii P',
    	autoclose: true,
    	minuteStep: 15,
    	showMeridian: true
	});


	$('#createSubmitButton').on('click', function() {
		console.log('press');
	});
});
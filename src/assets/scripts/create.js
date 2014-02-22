$(function() {
	$('.datetimepicker').datetimepicker({
    	format: 'MM dd yyyy hh:ii P',
    	autoclose: true,
    	minuteStep: 15,
    	showMeridian: true
	});


	$('#createSubmitButton').on('click', function() {
		$.ajax({
			url: '/create',
			type: 'POST',
			data: {
				eventName: $('#eventName').val(),
				eventLocation: $('#eventLocation').val(),
				departureLocation: $('#departureLocation').val(),
				departureDateTime: $('#eventDepartureTime').val(),
				returnDateTime: $('#eventReturnTime').val(),
				guests: []
			},
			success: function() { console.log("success!"); },
			error: function(jqXHR, textStatus, errorThrown) { console.error('Failure!'); }
		});
	});
});

// Update the file upload progress bar
function updateProgress(newValue){
  $('.progress-bar').css('width', newValue+'%').attr('aria-valuenow', newValue); 
}

// dummy user data
var userData = [{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"}];

// Generate DataTable
function initializeTable(data){
	
  $('#guestTable').hide();
  var myColumns = [
        	{ "mDataProp": "personName" },
        	{ "mDataProp": "personEmail" },
    	];
  var table = $('#dataTable').dataTable({
      "aaData": data,
      "aoColumns": [
          { "mDataProp": "personName" },
          { "mDataProp": "personEmail" }
      ]
  });
  $('#guestTable').fadeIn('slow');
}

initializeTable(userData);
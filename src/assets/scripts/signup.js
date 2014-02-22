$(function() {
	$('#canDriveInfo').hide();
	$('input[name="canDrive"]').on('change', function() {
		if ($('#canDrive').is(':checked'))
			$('#canDriveInfo').fadeIn('fast');
		else {
			$('#canDriveInfo').hide();
			$('#totalSeats').val('');
			$('#seatsAvailable').val('');
			$('#gasMileage').val('');
		}
	});

	$('#createSubmitButton').on('click', function() {
		var name = $("#nameInput")[0] == undefined ? "" : $("#nameInput").val();
		var email = $("#emailInput")[0] == undefined ? "" : $("#emailInput").val();
		var canDrive = $('#canDrive').is(':checked') ? true : "";
		$.ajax({
			url: '/signup',
			type: 'POST',
			dataType: 'json',
			data: {
				canDrive: canDrive,
				totalSeats: $('#totalSeats').val() == '' ? '0' : ($('#totalSeats').val()),
				availableSeats: $('#seatsAvailable').val() == '' ? '0' : ($('#seatsAvailable').val()),
				gasMileage: $('#gasMileage').val() == '' ? '0' : ($('#gasMileage').val()),
				nameInput: name,
				emailInput: email,
				hostName: getParameterByName("hostName"),
				eventName: getParameterByName("eventName")
			},
			success: function() { 
				console.log('textStatus');
			},
			error: function(jqXHR, textStatus, errorThrown) { 
				console.error('Failure!'); 
			}
		});
	});

	function getParameterByName(name) {
    	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
});
$(function() {
	var selectedPeople = [];
	$('.datetimepicker').datetimepicker({
    	format: 'MM dd yyyy hh:ii P',
    	autoclose: true,
    	minuteStep: 15,
    	showMeridian: true
	});
	$('#guestTable').hide();
	$('#upload-progress').hide();

	$('#createSubmitButton').on('click', function() {
		$.ajax({
			url: '/create',
			type: 'POST',
			dataType: 'json',
			data: {
				eventName: $('#eventName').val(),
				eventLocation: $('#eventLocation').val(),
				departureLocation: $('#departureLocation').val(),
				departureDateTime: $('#eventDepartureTime').val(),
				returnDateTime: $('#eventReturnTime').val(),
				guests: JSON.stringify(selectedPeople)
			},
			success: function(data) { 
				setTimeout(function() {
					window.location = '/signup'+data;
				}, 1000);
			},
			error: function(jqXHR, textStatus, errorThrown) { 
				console.error('Failure!'); 
			}
		});
	});

	$('#contactFileInput').on('change', function() {
		$('#upload-progress').show();
		updateProgress(0);
		var file = this.files[0];
		var reader = new FileReader();
		reader.readAsText(file);
		reader.onload = function(event) {
			var csv = event.target.result;
			var headers = $.csv.toArrays(csv)[0];
			updateProgress(50);
			var nameIndex;
			var emailIndex;
			for (var i=0; i<headers.length; i++) {
				if (headers[i].toLowerCase().indexOf("name") != -1 && nameIndex == undefined)
					nameIndex = headers[i];
				if (headers[i].toLowerCase().indexOf("e-mail") != -1 && emailIndex == undefined)
					emailIndex = headers[i];
			}
			if (nameIndex == undefined || emailIndex == undefined)
				return;

			var objects = $.csv.toObjects(csv);
			var tableData = [];
			for (var objectsProp in objects) {
				var object = objects[objectsProp];
				var tableItem = new Object();
				for (var propName in object) {
					var propValue = object[propName];
					if (propName.toLowerCase().indexOf("name") != -1 && propValue != '' && tableItem.personName == undefined)
						tableItem.personName = propValue;
					if (propName.toLowerCase().indexOf("e-mail") != -1 && propValue != '' && propValue.indexOf('@') != -1 && tableItem.personEmail == undefined)
						tableItem.personEmail = propValue;
				}
				if (tableItem.personName != undefined && tableItem.personEmail != undefined) {
					tableData.push(tableItem);
				}
			}
			selectedPeople = tableData;
			updateProgress(100);
			$('#upload-progress').hide();
			initializeTable(tableData);
		}
	});

	// Update the file upload progress bar
	function updateProgress(newValue){
	  $('.progress-bar').css('width', newValue+'%').attr('aria-valuenow', newValue); 
	}

	// Google places autocomplete
	var startLocation = document.getElementById('eventLocation');
	var autocompleteStart = new google.maps.places.Autocomplete(startLocation);

	var endLocation = document.getElementById('departureLocation');
	var autocompleteEnd = new google.maps.places.Autocomplete(endLocation);

	// dummy user data
	var userData = [{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"},{"personName":"Jacob","personEmail":"bsabugler@gmail.com"}];

	// Generate DataTable
	function initializeTable(data){
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
	  $('#guestTable').show();
	}
});
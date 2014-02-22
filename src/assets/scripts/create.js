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
			success: function() { 
				console.log("Submitted dat form"); 
			},
			error: function(jqXHR, textStatus, errorThrown) { 
				console.error("Shit went wrong."); 
			}
			success: function() { console.log("success!"); },
			error: function(jqXHR, textStatus, errorThrown) { console.error('Failure!'); }
		});
	});
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

	// editor = new $.fn.dataTable.Editor( {
 //        "ajaxUrl": "php/browsers.php",
 //        "domTable": "#dataTable",
 //        "fields": [ {
 //                "label": "Browser:",
 //                "name": "browser"
 //            }, {
 //                "label": "Rendering engine:",
 //                "name": "engine"
 //            }
 //        ]
 //    } );

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

	$('#contactFileInput').on('change', function() {
		var file = this.files[0];
		var reader = new FileReader();
		reader.readAsText(file);
		reader.onload = function(event) {
			var csv = event.target.result;
			var headers = $.csv.toArrays(csv)[0];
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
					if (propName.toLowerCase().indexOf("name") != -1 && propValue != '' && tableItem.name == undefined)
						tableItem.name = propValue;
					if (propName.toLowerCase().indexOf("e-mail") != -1 && propValue != '' && propValue.indexOf('@') != -1 && tableItem.email == undefined)
						tableItem.email = propValue;
				}
				if (tableItem.name != undefined && tableItem.email != undefined) {
					tableData.push(tableItem);
				}
			}
			console.log(tableData);
		}
	});
});
$(function() {
  $('.edit-event-button').on('click', function(event) {
    selectedEvent = $(event.target).closest('.media.well.event');
    selectedEvent.find('.edit-pane').removeClass('hidden');
  });

  $('.edit-event-done-button').on('click', function(event) {
    selectedEvent = $(event.target).closest('.media.well.event');
    selectedEvent.find('.edit-pane').addClass('hidden');
  });

  $('.cancel-event-button').on('click', function(event) {
    selectedEvent = $(event.target).closest('.media.well.event');
    // cancel stuff here
  });

  $('.leave-event-button').on('click', function(event) {
    selectedEvent = $(event.target).closest('.media.well.event');
    // leave event stuff here
  });

  $('.leave-event-button').on('click', function(event) {
    selectedEvent = $(event.target).closest('.media.well.event');
    // leave event stuff here
  });

  // $('.view-carpool-button').on('click', function(event) {
  //   selectedEvent = $(event.target).closest('.media.well.event');
  //   var hostName = $(selectedEvent).find('.hostName')[0].innerHTML;
  //   var eventName = $(selectedEvent).find('.eventName')[0].innerHTML;
  //   $.ajax({
  //     url: '/carpools',
  //     type: 'POST',
  //     data: {
  //       hostName: hostName,
  //       eventName: eventName
  //     },
  //     success: function(data) {
  //       console.log(data);
  //     },
  //     error: function() {
  //       console.log('error');
  //     }
  //   });
  // });
});
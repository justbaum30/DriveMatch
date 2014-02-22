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

  $('.change-info-button').on('click', function(event) {
    selectedEvent = $(event.target).closest('.media.well.event');
    // change info
  });
});
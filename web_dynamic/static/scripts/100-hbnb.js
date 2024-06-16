$(document).ready(function () {
  // Task 3: Check API status
  $.ajax('http://0.0.0.0:5001/api/v1/status').done(function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  // Task 2: Handle amenities, states, and cities filter
  const amenityIds = {};
  const stateIds = {};
  const cityIds = {};

  $('input[type=checkbox]').click(function () {
    const isChecked = $(this).prop('checked');
    const dataId = $(this).attr('data-id');
    const dataName = $(this).attr('data-name');
    const dataType = $(this).attr('data-type'); // 'amenity', 'state', or 'city'

    if (dataType === 'amenity') {
      if (isChecked) {
        amenityIds[dataId] = dataName;
      } else {
        delete amenityIds[dataId];
      }
      updateH4('div.amenities h4', amenityIds);
    } else if (dataType === 'state') {
      if (isChecked) {
        stateIds[dataId] = dataName;
      } else {
        delete stateIds[dataId];
      }
      updateH4('div.locations h4', stateIds);
    } else if (dataType === 'city') {
      if (isChecked) {
        cityIds[dataId] = dataName;
      } else {
        delete cityIds[dataId];
      }
      updateH4('div.locations h4', cityIds);
    }
  });

  function updateH4(selector, ids) {
    if (Object.keys(ids).length === 0) {
      $(selector).html('&nbsp;');
    } else {
      $(selector).text(Object.values(ids).join(', '));
    }
  }

  // Task 4: Handle search button click
  $('.filters button').click(function () {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: Object.keys(amenityIds),
        states: Object.keys(stateIds),
        cities: Object.keys(cityIds)
      })
    }).done(function (data) {
      $('section.places').empty();
      $('section.places').append('<h1>Places</h1>');
      for (const place of data) {
        const template = `<article>
          <div class="title">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">
              <i class="fa fa-users fa-3x" aria-hidden="true"></i>
              <br />
              ${place.max_guest} Guests
            </div>
            <div class="number_rooms">
              <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
              <br />
              ${place.number_rooms} Bedrooms
            </div>
            <div class="number_bathrooms">
              <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
              <br />
              ${place.number_bathrooms} Bathroom
            </div>
          </div>
          <div class="description">
            ${place.description}
          </div>
        </article>`;
        $('section.places').append(template);
      }
    });
  });

  // Update header content when clicking on DIV#update_header
  $('#update_header').click(function () {
    $('header').text('New Header!!!');
  });
});


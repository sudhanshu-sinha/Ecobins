// This is a modified version of the previous frontend code to integrate the route optimization functionality into your driver website.

// Mock data for dustbins (latitude, longitude, fill level)
var dustbins = [
    { id:1, lat: 51.5074, lng: -0.1278, fill_level: 80 },
    { id:2, lat: 51.5185, lng: -0.1389, fill_level: 50 },
    { id:3, lat: 51.5117, lng: -0.0904, fill_level: 70 },
    // ... additional dustbin data ...
  ];

  

 // Display dustbins on the map
 function displayDustbinsOnMap(map) {
    var bounds = new google.maps.LatLngBounds();
  
    dustbins.forEach(function (dustbin) {
      var marker = new google.maps.Marker({
        position: { lat: dustbins.lat, lng: dustbins.lng },
        map: map,
        title: 'Fill Level: ' + dustbins.fill_level
      });
  
      bounds.extend(marker.getPosition());
    });
  
    map.fitBounds(bounds);
  }
  
  // Function to calculate the distance between two coordinates
  function getDistance(origin, destination) {
    const earthRadius = 6371; // Earth's radius in kilometers
    const lat1 = toRadians(origin.lat);
    const lon1 = toRadians(origin.lng);
    const lat2 = toRadians(destination.lat);
    const lon2 = toRadians(destination.lng);
  
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
  
    return distance;
  }
  
  function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }
  
  
  // Function to optimize the route to cover maximum full dustbins
  function optimizeRoute() {
    var perm = permutate(dustbins);
    var shortestDistance = Infinity;
    var optimizedRoute = null;
  
    for (var i = 0; i < perm.length; i++) {
      var route = perm[i];
      var totalDistance = 0;
      var fullDustbins = 0;
  
      for (var j = 0; j < route.length - 1; j++) {
        var origin = { lat: route[j].lat, lng: route[j].lng };
        var destination = { lat: route[j + 1].lat, lng: route[j + 1].lng };
        var distance = getDistance(origin, destination);
        totalDistance += distance;
  
        // Check if the dustbin is full and increment the count
        if (route[j].fill_level > 0) {
          fullDustbins++;
        }
      }
  
      // Update the shortest distance and optimized route if a route with a shorter distance and more full dustbins is found
      if (totalDistance < shortestDistance && fullDustbins > 0) {
        shortestDistance = totalDistance;
        optimizedRoute = route;
      }
    }
  
    displayRouteOnMap(optimizedRoute);
  }
  
  // Function to generate all possible permutations of dustbins
  function permutate(dustbins) {
    var permutations = [];
  
    function permuteHelper(dustbins, prefix) {
      if (dustbins.length === 0) {
        permutations.push(prefix);
      } else {
        for (var i = 0; i < dustbins.length; i++) {
          var remaining = dustbins.slice(0, i).concat(dustbins.slice(i + 1));
          permuteHelper(remaining, prefix.concat(dustbins[i]));
        }
      }
    }
  
    permuteHelper(dustbins, []);
    return permutations;
  }
  
  // Function to display the optimized route on the map
  function displayRouteOnMap(route) {
      // Create an array to hold the LatLng objects for the route
  var routeCoordinates = [];

  // Iterate over the route and extract the coordinates
  for (var i = 0; i < route.length; i++) {
    var latLng = new google.maps.LatLng(route[i].lat, route[i].lng);
    routeCoordinates.push(latLng);
  }

  // Create a polyline to display the route on the map
  var routePolyline = new google.maps.Polyline({
    path: routeCoordinates,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });

  // Set the polyline on the map
  routePolyline.setMap(map);

  // Set the map viewport to fit the route
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < routeCoordinates.length; i++) {
    bounds.extend(routeCoordinates[i]);
  }
  map.fitBounds(bounds);
}
// Function to initialize the map
function initMap() {
    // Set the center coordinates for the map
    var center = { lat: 51.5074, lng: -0.1278 };
  
    // Create a new map object
    map = new google.maps.Map(document.getElementById("map"), {
      center: center,
      zoom: 12,
    });
  
    // Create markers for the dustbins
    for (var i = 0; i < dustbins.length; i++) {
      var dustbin = dustbins[i];
      var marker = new google.maps.Marker({
        position: { lat: dustbin.lat, lng: dustbin.lng },
        map: map,
        title: "Dustbin " + (i + 1),
      });
    }
  }
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 51.5074, lng: -0.1278 },
    zoom: 12,
  });  
  
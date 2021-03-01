import React, { useState, useEffect } from 'react';
import MarkerClusterer from '@googlemaps/markerclustererplus';
const markerImg = "/rolocator/marker.svg";
const marker1Img = "/rolocator/marker1.svg";
const romarkerImg = "/rolocator/ro_marker.svg";
const startDirectionImg = "/rolocator/startDirection.svg";
const endDirectionImg = "/rolocator/endDirection.svg";

type MapProps = {
  id: string;
  options: google.maps.MapOptions | undefined;
  onMapLoad: (arg0: google.maps.Map<Element>) => void;
  selectedLatLng?: google.maps.LatLng
  nearbyPetrolPumps: boolean;
  scriptLoaded: boolean;
  places: Array<any>;
  isDirectionEnabled?: boolean;
  directionStartLatLng?: google.maps.LatLng;
  directionEndLatLng?: google.maps.LatLng;
};

const markerClusterStyles = [{
  width: 50,
  height: 50,
  url: markerImg,
  backgroundSize: 'cover',
  textColor: 'white',
  anchorText: [18, 0]
},
];

const Map = ({ id, options, onMapLoad, selectedLatLng, nearbyPetrolPumps, scriptLoaded, places, directionStartLatLng, directionEndLatLng, isDirectionEnabled }: MapProps) => {

  const [map, setMap] = React.useState<google.maps.Map<Element>>();
  const [markers, setMarkers] = React.useState<Array<any>>();
  const [markerClusters, setMarkerClusters] = React.useState<MarkerClusterer>();
  
  const [directionMarkers, setDirectionMarkers] = React.useState<Array<any>>();
  const [directionsService,setdirectionsService] = React.useState<google.maps.DirectionsService>();
  const [directionsRenderer,setdirectionsRenderer] = React.useState<google.maps.DirectionsRenderer>();
  // useEffect(() => {
  //   if (!window.google) {
  //     let mapScriptTag: HTMLScriptElement = document.createElement('script');
  //     mapScriptTag.type = 'text/javascript';
  //     mapScriptTag.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyASwAb2leunIAzAmtYnpShW23JP7N7KZrc&libraries=places`;
  //     let x = document.getElementsByTagName('script')[0];
  //     x.parentNode.insertBefore(mapScriptTag, x);
  //     mapScriptTag.addEventListener('load', e => {
  //       onScriptLoad()
  //     })
  //   } else {
  //     onScriptLoad();
  //   }
  // }, [])

  // On Script Load
  useEffect(() => {
    if (scriptLoaded) {
      onScriptLoad();
    }
  }, [scriptLoaded])

  // Nearby Places Array Marker and Selected Search Place
  useEffect(() => {
    if(map){
      let markersArray : Array<any> = []
      clearMarkers();
      if(places?.length){
        const nearbyPlacesMarkers = places.map((place, i) => {
          let marker = new google.maps.Marker({
            position: {
              lat : parseFloat(place.geoPoint.latitude),
              lng : parseFloat(place.geoPoint.longitude),
            },
            icon: romarkerImg,
          });
          const infowindow = new google.maps.InfoWindow({
            content: getTootipStyle(place.name),
          });
          marker.addListener("mouseover", () => {
            infowindow.open(map, marker);
          });
          marker.addListener("mouseout", () => {
            infowindow.close();
          });
          return marker;
        });
        
        let markerC = new MarkerClusterer(map, nearbyPlacesMarkers, {
          maxZoom: 10,
          styles: markerClusterStyles,
          clusterClass: "custom-clustericon",
        });
        setMarkerClusters(markerC);
      }
      if(selectedLatLng && !isDirectionEnabled){
        let selectedPlaceMarker = new google.maps.Marker({
          map: map,
          position: selectedLatLng,
          icon: marker1Img
        });
        markersArray.push(selectedPlaceMarker);
        
        map.panTo(selectedLatLng)
        // map.setZoom(10);
        setMarkers(markersArray);
      }
    }
  },[map, places, selectedLatLng, nearbyPetrolPumps,isDirectionEnabled])

  // Directions
  useEffect(() => {
    if(isDirectionEnabled && map && directionsService && directionsRenderer){
      clearMarkers();
      if(directionStartLatLng && directionEndLatLng){
        calculateAndDisplayRoute(directionsService, directionsRenderer, map);
      }
    }else if(!isDirectionEnabled && map && directionsService && directionsRenderer){
      clearDirectionRoute(directionsRenderer);
    }
  }, [isDirectionEnabled,map, directionStartLatLng, directionEndLatLng, directionsService, directionsRenderer])

  const clearMarkers = () => {
    if(markerClusters){
      markerClusters.clearMarkers()
    }
    if(markers && markers.length){
      markers.forEach(marker => {
        marker.setMap(null);
      })
    }
  }

  const onScriptLoad = () => {
     let ds =  new window.google.maps.DirectionsService();
     let dr =  new window.google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: "#ff9455"
      },
      suppressMarkers: true
     });
    const map = new window.google.maps.Map(
      document.getElementById(id) as HTMLElement,
      options);
    onMapLoad(map)
    setMap(map);
    setdirectionsService(ds);
    setdirectionsRenderer(dr); 
  }

  const calculateAndDisplayRoute = (directionsService: google.maps.DirectionsService, directionsRenderer: google.maps.DirectionsRenderer, map : google.maps.Map<Element>) => {
    if(directionMarkers?.length){
      directionMarkers.forEach(marker => marker.setMap(null));
    }
    let dm : Array<any> = []
    directionsRenderer.setMap(map);
    directionsService.route(
      {
        origin: directionStartLatLng,
        destination: directionEndLatLng,
        travelMode: google.maps.TravelMode.DRIVING,

      },
      (response: any, status: string) => {
        if (status === "OK") {
          let leg = response.routes[0].legs[0];
          let smarker = new google.maps.Marker({
            position: leg.start_location,
            icon: startDirectionImg,
            map: map
          });
          let emarker = new google.maps.Marker({
            position: leg.end_location,
            // icon: endDirectionImg,
            icon: startDirectionImg,            
            map: map
          });
          dm.push(smarker);
          dm.push(emarker);
          setDirectionMarkers(dm)
          directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to" + status);
        }
      }
    );
  }

  const clearDirectionRoute = (directionsRenderer: google.maps.DirectionsRenderer) => {
    let dm = directionMarkers;
    if(dm && dm.length){
      dm.forEach(marker => {
        marker.setMap(null);
      })
    }
    setDirectionMarkers([]);
    directionsRenderer.setMap(null)
  }

  const getTootipStyle = (name: String) => {
    const contentString =
    '<div id="content" style=" padding: 3px 10px;background-color:#0369dd; color: #fff; font-size: 12px; font-weight: 600">' +
      `<p style="margin-bottom: 0px;">${name}</p>` +
    "</div>";
    return contentString;
  }

  return (<><div style={{ width: "100%", height: 'calc(100vh - 170px)' }} id={id} /></>)
}
export default Map;
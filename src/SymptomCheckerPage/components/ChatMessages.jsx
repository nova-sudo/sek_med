import React, { useEffect, useRef } from "react";
import { TbMedicalCrossCircle, TbBrandGoogleMaps } from "react-icons/tb";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "../../App.css";
import firstaid from "../../firstaid.png";
import source from "../../home.png";
import {config} from "../../config";

export default function ChatMessages({ messages, chatRef, showDownload, specialization, loadingSpec, showMap, mapLocation }) {
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const directionsRenderersRef = useRef([]); // To store DirectionsRenderer instances
  const GOOGLE_MAPS_API_KEY = config.GOOGLE_MAPS_API_KEY;
  const customMapStyles = [
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#2c2c2c"
            },
            {
                "weight": "2.00"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#696969"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f6f6f6"
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "weight": "0.50"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#565656"
            },
            {
                "weight": "0.50"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "weight": "0.01"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "weight": "0.50"
            },
            {
                "color": "#8e8e8e"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "weight": "0.50"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#b7b7b7"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#404040"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#dedede"
            }
        ]
    }
  ];

  useEffect(() => {
    if (showMap && mapLocation && mapLocation.lat && mapLocation.lng) {
      const loadMap = async () => {
        if (!window.google || !window.google.maps) {
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
          script.async = true;
          script.onload = () => initializeMap();
          script.onerror = () => console.error("Failed to load Google Maps script");
          document.body.appendChild(script);
        } else {
          initializeMap();
        }
      };

      const initializeMap = () => {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: mapLocation.lat, lng: mapLocation.lng },
          zoom: 14,
          styles: customMapStyles,
          disableDefaultUI: false,
          mapTypeControl: false,
          mapTypeId: "roadmap",
        });

        infoWindowRef.current = new window.google.maps.InfoWindow();

        // Add marker for user's location
        const originMarker = new window.google.maps.Marker({
          position: { lat: mapLocation.lat, lng: mapLocation.lng },
          map: map,
          title: "Your Location",
          icon: {
            url: source,
            scaledSize: new window.google.maps.Size(25, 25),
          },
        });
        

        const directionsService = new window.google.maps.DirectionsService();
        const service = new window.google.maps.places.PlacesService(map);
        const querySpecialization = mapLocation.specialization || specialization || "medical specialist";

        service.textSearch(
          {
            query: querySpecialization,
            location: new window.google.maps.LatLng(mapLocation.lat, mapLocation.lng),
            radius: 500, // 5 kilometers
          },
          (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              // Clear previous directions renderers
              directionsRenderersRef.current.forEach(renderer => renderer.setMap(null));
              directionsRenderersRef.current = [];

              results.forEach((place) => {
                const marker = new window.google.maps.Marker({
                  position: place.geometry.location,
                  map: map,
                  title: place.name,
                  icon: {
                    url: firstaid,
                    scaledSize: new window.google.maps.Size(18, 20), // Adjust size as needed
                  },
                });

                // Calculate and render directions
                directionsService.route(
                  {
                    origin: { lat: mapLocation.lat, lng: mapLocation.lng },
                    destination: place.geometry.location,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                  },
                  (result, directionsStatus) => {
                    if (directionsStatus === window.google.maps.DirectionsStatus.OK) {
                      const directionsRenderer = new window.google.maps.DirectionsRenderer({
                        map: map,
                        directions: result,
                        suppressMarkers: true, // Hide default markers since we have custom ones
                        polylineOptions: {
                          strokeColor: "#000000", // Blue color
                          strokeWeight: 3,        // Bold line
                          strokeOpacity: 0.8,
                        },
                      });
                      directionsRenderersRef.current.push(directionsRenderer);
                    } else {
                      console.error("Directions request failed:", directionsStatus);
                    }
                  }
                );

                service.getDetails(
                  {
                    placeId: place.place_id,
                    fields: ["name", "formatted_address", "rating", "international_phone_number", "website", "opening_hours"],
                  },
                  (placeDetails, detailsStatus) => {
                    if (detailsStatus === window.google.maps.places.PlacesServiceStatus.OK) {
                      const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${mapLocation.lat},${mapLocation.lng}&destination=${place.geometry.location.lat()},${place.geometry.location.lng()}`;
                      const googleMapsUrl = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;
                      const shareUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeDetails.name + " " + placeDetails.formatted_address)}`;

                      const content = `
                        <div style="font-family: Arial, sans-serif; padding: 10px; max-width: 300px; background: #fff; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                          <h3 style="margin: 0 0 10px; font-weight: bold; font-size: 16px; color: #333;">${placeDetails.name}</h3>
                          <p style="margin: 0 0 10px; font-size: 14px; color: #666;">${placeDetails.formatted_address || "Address not available"}</p>
                          ${placeDetails.rating ? `<p style="margin: 0 0 5px; font-size: 14px; color: #666;">Rating: ${placeDetails.rating} / 5</p>` : ""}
                          ${placeDetails.international_phone_number ? `<p style="margin: 0 0 5px; font-size: 14px; color: #666;">Phone: <a href="tel:${placeDetails.international_phone_number}" style="color: #000000; text-decoration: none;">${placeDetails.international_phone_number}</a></p>` : ""}
                          ${placeDetails.website ? `<p style="margin: 0 0 5px; font-size: 14px;"><a href="${placeDetails.website}" target="_blank" style="color: #1a73e8; text-decoration: none;">Website</a></p>` : ""}
                          ${placeDetails.opening_hours ? `<p style="margin: 0 0 5px; font-size: 14px; color: #666;">${placeDetails.opening_hours.isOpen() ? "Open Now" : "Closed"}</p>` : ""}
                          <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 10px;">
                            <a href="${directionsUrl}" target="_blank" style="color: #000000; text-decoration: none; font-size: 14px;">Get Directions</a>
                            <a href="${googleMapsUrl}" target="_blank" style="color: #000000; text-decoration: none; font-size: 14px;">View on Google Maps</a>
                            <a href="${shareUrl}" target="_blank" style="color: #000000; text-decoration: none; font-size: 14px;">Share</a>
                            <button onclick="alert('Location saved!')" style="background: #000000; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 14px;">Save Location</button>
                          </div>
                        </div>
                      `;

                      marker.addListener("click", () => {
                        infoWindowRef.current.setContent(content);
                        infoWindowRef.current.open(map, marker);
                      });
                    } else {
                      const fallbackContent = `
                        <div style="font-family: Arial, sans-serif; padding: 10px; max-width: 300px; background: #fff; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                          <h3 style="margin: 0 0 8px; font-size: 16px; color: #333;">${place.name}</h3>
                          <p style="margin: 0 0 5px; font-size: 14px; color: #666;">${place.formatted_address || "Address not available"}</p>
                          <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 10px;">
                            <a href="https://www.google.com/maps/dir/?api=1&origin=${mapLocation.lat},${mapLocation.lng}&destination=${place.geometry.location.lat()},${place.geometry.location.lng()}" target="_blank" style="color: #1a73e8; text-decoration: none; font-size: 14px;">Get Directions</a>
                          </div>
                        </div>
                      `;
                      marker.addListener("click", () => {
                        infoWindowRef.current.setContent(fallbackContent);
                        infoWindowRef.current.open(map, marker);
                      });
                      console.error("Place Details request failed:", detailsStatus);
                    }
                  }
                );
              });
            } else {
              console.error("Places search failed:", status);
            }
          }
        );
      };

      loadMap();
    }
  }, [showMap, mapLocation, specialization]);

  return (
    <div
      ref={chatRef}
      className="flex-1 overflow-y-auto px-4 py-2 space-y-6 bg-white w-full max-w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scroll-smooth"
      style={{ scrollbarWidth: "thin", scrollbarColor: "transparent transparent" }}
    >
      <div className="mx-auto max-w-[800px]" >
        {messages.map((message) => (
        <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
          <div className="flex items-start mb-5">
            {message.sender === "system" && (
              <div className="mr-1">
                <TbMedicalCrossCircle size={24} className="text-zinc-800 mt-[6px]" />
              </div>
            )}
            <div
              className={`max-w-3xl py-1 px-4 rounded-3xl text-md md:text-lg transition-transform duration-300 break-words ${
                message.sender === "user" ? "bg-gray-200 text-zinc-800" : "text-zinc-800"
              }`}
            >
              <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {message.text}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
      {showMap && mapLocation && mapLocation.lat && mapLocation.lng ? (
        <div className="mt-4 pb-2 px-2 bg-zinc-800  rounded-3xl">
          <h1 className="text-white text-center text-lg ">Here are the closest specialists to you</h1>
          <div
            ref={mapRef}
            className="rounded-2xl w-full  shadow-md"
            style={{ height: "450px" }}
          ></div>
        </div>
      ) : showMap && (
        <p className="text-center text-zinc-800 mt-4">Unable to load map: Invalid location data</p>
      )}
      {showDownload && (
        <>
          {loadingSpec && <p className="text-center text-zinc-800 mt-2 animate-pulse">Fetching specialization</p>}
          {specialization && (
            <p className="text-center rounded-full text-zinc-800 font-medium mt-2">
              Recommended Specialization: {specialization}
            </p>
          )}
        </>
      )}
      </div>
    </div>
  );
}
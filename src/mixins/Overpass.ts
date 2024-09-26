import L from "leaflet";
import OverpassQuery from "../osm/OverpassQuery";
import { defineComponent } from "vue";

export default defineComponent({
  data: function () {
    return {
      bounds: null as L.LatLngBounds | null,
    };
  },
  methods: {
    boundsToGeojson: function (): any {
      if (!this.bounds) {
        return {};
      }
      const sw = this.bounds.getSouthWest();
      const ne = this.bounds.getNorthEast();
      return {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [sw.lng, sw.lat],
              [ne.lng, sw.lat],
              [ne.lng, ne.lat],
              [sw.lng, ne.lat],
            ],
          ],
        },
      };
    },
    bboxToString: function (bounds: L.LatLngBounds) {
      return (
        bounds.getSouthWest().lat +
        "," +
        bounds.getSouthWest().lng +
        "," +
        bounds.getNorthEast().lat +
        "," +
        bounds.getNorthEast().lng
      );
    },
    bboxFromCenter: function (latlon: { lat: number; lng: number }) {
      const bounds = L.latLngBounds([
        [latlon.lat - 0.05, latlon.lng - 0.1],
        [latlon.lat + 0.05, latlon.lng + 0.1],
      ]);
      this.bounds = bounds;
      return this.bboxToString(bounds);
    },
    buildQuery: function (center: { lat: number; lng: number }) {
      const bbox = this.bboxFromCenter(center);
      const query = new OverpassQuery();
      const tags = [
        { k: "amenity", v: "recycling" },
        { k: "amenity", v: "waste_disposal" },
      ];
      return query.nodeByTags(tags, bbox).body;
    },
    fetchAmenity: function (
      center: { lat: number; lng: number },
      callback: () => any,
      errorCallback: () => any
    ) {
      fetch(import.meta.env.VITE_APP_OVERPASS_URL, {
        method: "POST",
        body: this.buildQuery(center),
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error(String(response.status));
          }
          return response.json();
        })
        .then(callback)
        .catch(errorCallback);
    },
    fetchNode: function (
      params: { type: string; node: string },
      callback: () => any
    ) {
      const query = new OverpassQuery();
      if (params.type === "way") {
        query.wayById(params.node);
      } else {
        query.nodeById(params.node);
      }
      fetch(import.meta.env.VITE_APP_OVERPASS_URL, {
        method: "POST",
        body: query.body,
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error(String(response.status));
          }
          return response.json();
        })
        .then(callback);
    },
  },
});

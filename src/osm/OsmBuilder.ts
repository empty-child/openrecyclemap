import convert from "xml-js";

export default class OsmBuilder {
  node: {
    type: string;
    name: string;
    elements: any[];
    attributes: Partial<{
      lat: string;
      lon: string;
      changeset: string;
      id: string;
      version: string;
    }>;
  };

  constructor(node_type: string, latlon: { lat: string; lng: string }) {
    this.node = {
      type: "element",
      name: node_type,
      elements: [],
      attributes: {},
    };
    if (node_type === "node" && latlon) {
      this.node.attributes.lat = latlon.lat;
      this.node.attributes.lon = latlon.lng;
    }
  }
  setChangeset(id: string) {
    this.node.attributes.changeset = id;
    return this;
  }
  setExisting(node_id: string, version: string) {
    if (node_id) {
      this.node.attributes.id = node_id;
    }
    if (version) {
      this.node.attributes.version = version;
    }
    return this;
  }
  setRefs(refs: any) {
    refs.forEach((ref: any) =>
      this.node.elements.push({
        type: "element",
        name: "nd",
        attributes: { ref: ref },
      })
    );
  }
  setTags(tags: any) {
    for (const key in tags) {
      if (Object.prototype.hasOwnProperty.call(tags, key)) {
        this.node.elements.push({
          type: "element",
          name: "tag",
          attributes: { k: key, v: tags[key] },
        });
      }
    }
    return this;
  }
  get tree() {
    return { elements: [this.node] };
  }
  get xml() {
    return "<osm>" + convert.js2xml(this.tree) + "</osm>";
  }
}

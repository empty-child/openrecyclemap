export default class OverpassQuery {
  query: string;

  constructor() {
    this.query = "";
  }
  nodeById(id: string) {
    this.query = "  node(" + id + ");\n";
    return this;
  }
  wayById(id: string) {
    this.query = "  way(" + id + ");\n";
    return this;
  }
  nodeByTags(tags: Array<{ k: string; v: string }>, bbox: string) {
    tags.forEach(
      (tag) =>
        (this.query +=
          '  node["' + tag.k + '"="' + tag.v + '"](' + bbox + ");\n")
    );
    tags.forEach(
      (tag) =>
        (this.query +=
          '  way["' + tag.k + '"="' + tag.v + '"](' + bbox + ");\n")
    );
    return this;
  }
  get qlString() {
    return (
      "[out:json][timeout:25];\n" + "(\n" + this.query + ");\n" + "out center;"
    );
  }
  get body() {
    return "data=" + this.qlString;
  }
}

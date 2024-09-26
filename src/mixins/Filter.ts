export default class Filter {
  [s: string]: any;
  plastic?: boolean;
  paper?: boolean;
  cans?: boolean;
  glass?: boolean;
  glass_bottles?: boolean;
  plastic_bags?: boolean;
  clothes?: boolean;
  batteries?: boolean;
  low_energy_bulbs?: boolean;
  plastic_bottles?: boolean;
  hazardous_waste?: boolean;
  scrap_metal?: boolean;
  engine_oil?: boolean;
  car_batteries?: boolean;
  tyres?: boolean;
  waste_disposal?: boolean;
  recycling?: boolean;

  constructor() {
    const stored = localStorage.getItem("filter");
    if (stored) {
      Object.assign(this, JSON.parse(stored));
    } else {
      this.assignRecycling();
      this.waste_disposal = false;
      this.recycling = true;
    }
  }
  assignRecycling() {
    this.plastic = false;
    this.paper = false;
    this.cans = false;
    this.glass = false;
    this.glass_bottles = false;
    this.plastic_bags = false;
    this.clothes = false;
    this.batteries = false;
    this.low_energy_bulbs = false;
    this.plastic_bottles = false;
    this.hazardous_waste = false;
    this.scrap_metal = false;
    this.engine_oil = false;
    this.car_batteries = false;
    this.tyres = false;
  }
  invert(key: string) {
    this[key] = !this[key];
    if (this[key] && key !== "waste_disposal" && key !== "recycling") {
      this.recycling = false;
    }
    if (this[key] && key === "recycling") {
      this.assignRecycling();
    }
    localStorage.setItem("filter", JSON.stringify(this));
  }
  enabled() {
    for (const key in this) {
      if (Object.prototype.hasOwnProperty.call(this, key) && this[key]) {
        return true;
      }
    }
    return false;
  }
  fit(geoJsonProps: any) {
    if (
      Object.prototype.hasOwnProperty.call(geoJsonProps, "amenity") &&
      geoJsonProps["amenity"] === "waste_disposal"
    ) {
      return this.waste_disposal;
    }
    if (
      Object.prototype.hasOwnProperty.call(geoJsonProps, "amenity") &&
      geoJsonProps["amenity"] === "recycling" &&
      this.recycling
    ) {
      return true;
    }
    for (const key in this) {
      if (
        !Object.prototype.hasOwnProperty.call(this, key) ||
        !this[key] ||
        key === "waste_disposal" ||
        key === "recycling"
      ) {
        continue;
      }
      if (
        Object.prototype.hasOwnProperty.call(
          geoJsonProps,
          "recycling:" + key
        ) &&
        geoJsonProps["recycling:" + key] === "yes"
      ) {
        return true;
      }
    }
    return false;
  }
}

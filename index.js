const axios = require('axios');

module.exports = (api) => {
  api.registerAccessory('PrometheusSensorPlugin', PrometheusSensorAccessory);
};

class PrometheusSensorAccessory {

  constructor(log, config, api) {
      this.log = log;
      this.config = config;
      this.api = api;

      this.Service = this.api.hap.Service;
      this.Characteristic = this.api.hap.Characteristic;

      // extract configuration
      this.name = config.name;
      this.url = config.url;
      this.query = config.query;
      this.type = config.type || 'temperature';

      this.log.warn(this.type)
      switch(this.type) {
        case 'temperature':
          // create a new Temperature Sensor service
          this.service = new this.api.hap.Service.TemperatureSensor(this.name);
          this.service.getCharacteristic(this.Characteristic.CurrentTemperature)
            .onGet(this.handleCurrentTemperatureGet.bind(this));
          break;
        case 'occupancy':
          // create a new Occupancy Sensor service
          this.service = new this.api.hap.Service.OccupancySensor(this.name);
          this.service.getCharacteristic(this.Characteristic.OccupancyDetected)
            .onGet(this.handleOccupancyDetectedGet.bind(this));
          break;
      }
  }

  handleCurrentTemperatureGet() {
    this.log.debug('Triggered GET CurrentTemperature');

    return this.queryPrometheus().then((result) => {
      this.log.debug('CurrentTemperature is ' + result)
      return Number.parseFloat(result).toFixed(1);
    });
  }

  handleOccupancyDetectedGet() {
    this.log.debug('Triggered GET OccupancyDetected');

    return this.queryPrometheus().then((result) => {
      this.log.debug('OccupancyDetected is ' + result)
      return parseInt(result);
    });
  }

  queryPrometheus() {
    let url = this.url + "/api/v1/query?query=" + this.query;
    const response = axios.get(url)
    return response.then((response) => {
      return response.data["data"]["result"][0]["value"][1];
    })
  }

  getServices() {
    return [
      this.service
    ];
  }
}

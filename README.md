# homebridge-prometheus-sensor

This is a homebridge plugin to provide a sensor (currently temperature and
occupancy) based on prometheus query.

## Example configuration
```json
{
  "accessory": "PrometheusSensorPlugin",
  "name": "Outside temperature",
  "type": "temperature",
  "url": "https://prometheus.example.com",
  "query": "min(avg_over_time(brickd_temperature_value[10m]))"
}
```

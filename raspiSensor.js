const sensor = require("node-dht-sensor").promises;
const axios = require("axios");

axios.defaults.headers.common["X-Auth-Token"] = "mySecret";

// 22 (DHT22 or AM2302) and 4 (GPIO PIN)
sensor.setMaxRetries(10);
sensor.initialize(22, 4);

// var readout = sensor.readSync(22, 4);

let readIt = () => {
  sensor.read(22, 4).then(
    function(res) {
      console.log(`temp: ${((res.temperature * 9) / 5 + 32).toFixed(1)}°F, ` + `humidity: ${res.humidity.toFixed(1)}%`);
      axios
        .post("https://magnolia-possum-6914.twil.io/raspi", {
          temperature: res.temperature,
          humdity: res.humdidity
        })
        .then(res => console.log(JSON.stringify(res.data, null, 2)))
        .catch(err => console.log(err));
    },
    function(err) {
      console.error("Failed to read sensor data:", err);
    }
  );
};

setInterval(readIt, 2000); // Time in milliseconds

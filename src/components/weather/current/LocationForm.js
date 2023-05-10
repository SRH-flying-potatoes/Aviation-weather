import { Form } from "semantic-ui-react";
import React, { useState, useEffect } from "react";
import SelectLocation from "./SelectAirport";
import axios from "axios";

let airportOptions = [{ key: "NA", value: "NA", text: "Not available" }];

const LocationForm = (props) => {
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [selectedAirport, setSelectedAirport] = useState("");

  //on props update
  useEffect(() => {
    if (props.airportData) {
      const airp = props.airportData.map((item) => {
        return {
          key: item.IATA,
          value: item.IATA,
          text: `${item.Name} (${item.IATA})`,
        };
      });
      airportOptions = airp;
    }
  }, [props.airportData]);

  const handleChange = (e, { name, value }) => {
    name === "lat" ? setLat(value) : setLong(value);
  };
  const getAirportValue = (val) => {
    setSelectedAirport(val);
    const selectedAirportDetails = props.airportData.find(
      (item) => item.IATA === val
    );
    setLat(selectedAirportDetails.Latitude);
    setLong(selectedAirportDetails.Longitude);
  };

  const handleSubmit = () => {
    axios
      .get("http://localhost:5000/currentWeather", {
        params: {
          lat: lat,
          long: long,
        },
      })
      .then((res) => console.log(res.data))
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <SelectLocation
            airportOptions={airportOptions}
            sendVal={getAirportValue}
          />
        </Form.Group>
        <Form.Group>
          <Form.Input
            placeholder="Latitude"
            name="lat"
            value={lat}
            onChange={handleChange}
          />
          <Form.Input
            placeholder="Longitude"
            name="long"
            value={long}
            onChange={handleChange}
          />
          <Form.Button primary disabled={!(lat && long)} content="Submit" />
        </Form.Group>
      </Form>
    </div>
  );
};

export default LocationForm;

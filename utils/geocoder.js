import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import node_geocoder from "node-geocoder";

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY,
  httpAdapter: "https",
  formatter: null,
};

export default node_geocoder(options);

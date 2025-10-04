import axios from "axios";

import { MESSAGES } from "../constants/messages";

const createImage = async (description, setStatus, updateMetadata) => {
  setStatus({ message: MESSAGES.generatingImage, isWaiting: true });

  try {
    const URL = `https://api.vyro.ai/v2/image/generations`;

    const formData = new FormData();
    formData.append("prompt", description);
    formData.append("style", "realistic");
    formData.append("aspect_ratio", "1:1");

    const response = await axios.post(URL, formData, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_IMAGINE_KEY}`,
        Accept: "application/json",
      },
      responseType: "arraybuffer", // raw bytes
    });

    // Convert bytes → base64
    const base64data = btoa(
      new Uint8Array(response.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );

    const img = `data:${response.headers["content-type"]};base64,${base64data}`;

    updateMetadata("image", img); // update App state with image string

    return img;
  } catch (error) {
    console.error(
      "Error creating image:",
      error.response?.data || error.message
    );
    setStatus({ message: MESSAGES.failedToCreateImage, isWaiting: false });
  }
};

export default createImage;

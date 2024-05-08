import axios from 'axios';
import { Buffer } from 'buffer';

import { MESSAGES } from '../constants/messages';

const createImage = async (description, setStatus, updateMetadata) => {
  setStatus({ message: MESSAGES.generatingImage, isWaiting: true });

  try {
    const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`;
    const response = await axios({
      url: URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ inputs: description, options: { wait_for_model: true } }),
      responseType: "arraybuffer",
    });

    const base64data = Buffer.from(response.data).toString("base64");
    const img = `data:${response.headers["content-type"]};base64,${base64data}`;
    updateMetadata('image', img);

    return  response.data;
  } catch (error) {
    console.error("Error creating image:", error);
    setStatus({ message: MESSAGES.failedToCreateImage, isWaiting: false });
  }
};

export default createImage;

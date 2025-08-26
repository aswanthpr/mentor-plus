import axios, { AxiosError } from 'axios';
import { TurnCredentialsResponse } from "../Types";

export const fetchTurnServer = async (): Promise<TurnCredentialsResponse> => {
  try {
    const response = await axios.post(
      "https://turnix.io/api/v1/credentials/ice",
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.TURNIX_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (err) {
    const error = err as AxiosError;

    const message =
      error.response?.data && typeof error.response.data === "object"
        ? JSON.stringify(error.response.data)
        : error.message || "Unknown error while fetching TURN credentials";

    console.error("TURN credential error:", message);
    throw new Error(message);
  }
};

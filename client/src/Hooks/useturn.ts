import { useEffect, useState } from "react";
import axios from "axios";
import {api} from "../Config/axiosInstance";
const useTurn = () => {
  const [iceServers, setIceServers] = useState<TurnCredentials|null>(null);
  const [turnErr, setTurnErr] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const role = location.pathname.split("/")?.[1];
    const fetchTurnCredentials = async () => {
      try {
        setLoading(true);
        
        
        const response = await api.get(`/${role}/turn-credentials`);
       
        if (
          response.data &&
          response.data.turnServerConfig &&
          Array.isArray(response.data?.turnServerConfig?.iceServers)
        ) {
          setIceServers(response.data?.turnServerConfig as TurnCredentials);
          setTurnErr(null);
        } else {
          setTurnErr("Invalid TURN response structure");
        }
      } catch (err) {
        let errorMessage = "TURN credentials error: Unknown error";

        if (axios.isAxiosError(err)) {
          if (err.response) {
            errorMessage = `TURN credentials error: ${err.response.status} ${err.response.statusText}`;
          } else if (err.request) {
            errorMessage = "TURN credentials error: No response from server";
          } else {
            errorMessage = `TURN credentials error: ${err.message}`;
          }
        } else if (err instanceof Error) {
          errorMessage = `TURN credentials error: ${err.message}`;
        }

        console.error("[useTurn] Failed to fetch TURN credentials:", err);
        setTurnErr(errorMessage);
        setIceServers(null); // Optional: Clear servers on failure
      } finally {
        setLoading(false);
      }
    };

    fetchTurnCredentials();
  }, []);

  return { iceServers, turnErr, loading };
};

export default useTurn;

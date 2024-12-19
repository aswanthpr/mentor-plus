
import { useState, useRef } from "react";

export const useTimer = (initialSeconds: number) => {
    const [seconds, setSeconds] = useState<number>(initialSeconds);
    const [isActive, setIsActive] = useState<boolean>(false);
    const intervalRef = useRef<number | undefined>(undefined);

    // Start or restart the timer
    const restart = () => {
        setSeconds(initialSeconds);
        setIsActive(true); 

        // Clear the previous interval if it exists
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Start a new interval
        intervalRef.current = window.setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    setIsActive(false);

                    // Stop the timer when it reaches 0
                    clearInterval(intervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return { seconds, isActive, restart };
};

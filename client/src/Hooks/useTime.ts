import {useState,useEffect} from 'react';

export const useTimer = (initialSeconds:number)=>{
    const [seconds,setSeconds] = useState<number>(initialSeconds);
    const [isActive,setIsActive] = useState<boolean>(true)
    useEffect(()=>{
        let interval:number |undefined;
       
       
        if(isActive && seconds>0){
            interval =window.setInterval(()=>{
                setSeconds((prev)=>{
                    if(prev<=1){
                        setIsActive(false);

                        return 0

                    }
                    return prev - 1
                })

            },1000)
        }
        return ()=>{
            if(interval) clearInterval(interval)
        }
    },[seconds,isActive])
    const restart=()=>{
        setSeconds(initialSeconds);
        setIsActive(true);
    }
    return {seconds,isActive,restart}
}
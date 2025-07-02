import  {useEffect,useState}  from 'react';
//debounced function to make a delay the function execution
const useDebounce = <T>(value:T ,delay:number=500):T => {
    const [debouncedValue,setDebouncedValue] = useState<T>(value);

    useEffect(()=>{
        const handler = setTimeout(()=>{
            setDebouncedValue(value);
        },delay);

        return ()=>clearTimeout(handler);
    },[delay, value])
return debouncedValue;
}

export default useDebounce
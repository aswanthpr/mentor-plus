export function convertTimeToDate(startDate: string, startTime: string, endTime: string) {
    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${startDate}T${endTime}:00`);  
  
    // Check if the Date objects are valid
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      console.error('Invalid date:', startDateTime, endDateTime);
      return null; 
    }
    const localStartTime = startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const localEndTime = endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { localStartTime, localEndTime };
  }

 export  function convertTo24HourTime(date: string, time: string): string {
    // Ensure that the time is in lowercase
    const timeLower = time.toLowerCase();
    const isPM = timeLower.includes('pm');
    const isAM = timeLower.includes('am');
    
    // Extract hours and minutes from the time string
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = timeLower.replace(/(am|pm)/, '').split(':').map(Number);
    
    // Convert hours to 24-hour format
    if (isPM && hours < 12) hours += 12;  // PM adjustment (e.g., 3 PM becomes 15)
    if (isAM && hours === 12) hours = 0;  // AM adjustment (12 AM becomes 00)
    
    // Format the time in the desired format
    const formattedTime = `${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    
    return formattedTime;
  }

 export function convertTo12HourFormat(date: Date): string {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const modifier = hours >= 12 ? 'PM' : 'AM';
  
    // Convert to 12-hour format
    hours = hours % 12;  // Convert hours to 12-hour format (0-11)
    if (hours === 0) hours = 12;  // Handle 0 hours (midnight or noon)
  
    // Format time as 'hh:mm AM/PM' 
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${modifier}`;
    return formattedTime;
  }
  

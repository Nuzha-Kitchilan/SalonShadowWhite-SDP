/**
 * Format date string or Date object to locale date string
 * @param {string|Date} date - Date to format
 * @param {string} format - Optional format (short, medium, long)
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'medium') {
    if (!date) return 'N/A';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // Check if valid date
      if (isNaN(dateObj.getTime())) return 'Invalid date';
      
      let options = {};
      
      switch (format) {
        case 'short':
          options = { month: 'numeric', day: 'numeric', year: '2-digit' };
          break;
        case 'long':
          options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
          break;
        case 'medium':
        default:
          options = { month: 'short', day: 'numeric', year: 'numeric' };
      }
      
      return dateObj.toLocaleDateString(undefined, options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return date ? date.toString() : 'N/A';
    }
  }
  
  /**
   * Format time string to locale time string
   * @param {string} time - Time string to format (e.g. '14:30:00')
   * @returns {string} Formatted time string
   */
  export function formatTime(time) {
    if (!time) return 'N/A';
    
    try {
      // For 24-hour format time strings 
      if (time.includes(':')) {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        
        return date.toLocaleTimeString(undefined, { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
      }
      
      return time;
    } catch (error) {
      console.error("Error formatting time:", error);
      return time;
    }
  }
  
  /**
   * Format datetime string to locale date and time string
   * @param {string|Date} datetime - Datetime to format
   * @returns {string} Formatted date and time string
   */
  export function formatDateTime(datetime) {
    if (!datetime) return 'N/A';
    
    try {
      const dateObj = typeof datetime === 'string' ? new Date(datetime) : datetime;
      
      // Check if valid date
      if (isNaN(dateObj.getTime())) return 'Invalid date';
      
      return dateObj.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error("Error formatting datetime:", error);
      return datetime ? datetime.toString() : 'N/A';
    }
  }
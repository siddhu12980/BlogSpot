export function base64ToFile(base64String:any, fileName:any, mimeType:any) {
    try {
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      
      const file = new File([blob], fileName, { type: mimeType });
  
      return file;
    } catch (error) {
      console.error("Failed to convert base64 string to file:", error);
      return null;
    }
  }
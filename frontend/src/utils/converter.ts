const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); 
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('File could not be read as base64 string.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export default convertToBase64;

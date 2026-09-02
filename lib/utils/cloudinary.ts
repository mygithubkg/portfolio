export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = 'f8njovya';
  const uploadPreset = 'az9zcctj'; // Unsigned preset

  // 1. Read file as Data URL to prevent browser/Turbopack FormData binary bugs
  const base64File = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

  const formData = new FormData();
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'portfolio');
  formData.append('file', base64File);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data.secure_url);
        } catch (e) {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.error?.message || 'Failed to upload image'));
        } catch (e) {
          reject(new Error('Failed to upload image'));
        }
      }
    };
    
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
};

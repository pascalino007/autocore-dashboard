import { api } from './api';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.aakodessewa.com/:4000/api/v1';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const data = await api(`/upload/single?folder=products`, {
    method: 'POST',
    body: formData,
  });
  return data.url;
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const data = await api(`/upload/multiple?folder=products`, {
    method: 'POST',
    body: formData,
  });
  return (Array.isArray(data) ? data : data.files || []).map((item: any) => item.url || item);
}

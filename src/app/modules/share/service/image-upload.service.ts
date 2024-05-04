import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  upload(file: File, id:string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('id', id);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }

  getImageById(id: string): Observable<Blob> {
    // Append the image ID to the URL to request the specific image
    const imageUrl = `${this.baseUrl}/files/${id}`;

    // Set the response type to 'blob' to handle binary data (image)
    return this.http.get(imageUrl, { responseType: 'blob' });
  }

  getImageByFoodId(foodId: string): Observable<string> {
    // Append the foodId to the URL to request the specific image URL or image data
    const imageUrl = `${this.baseUrl}/file/${foodId}`;

    // Set the response type to 'text' to get the image URL as a string
    return this.http.get(imageUrl, { responseType: 'text' });
  }


  deleteFileById(id: string): Observable<any> {
    const url = `${this.baseUrl}/deletefile/${id}`;
    return this.http.delete<any>(url);
  }




  // this.fileUploadService.deleteFileById(this.fileIdToDelete).subscribe(
  //   () => {
  //     console.log('File deleted successfully!');
  //     // Perform any additional actions if needed
  //   },
  //   (error) => {
  //     console.error('Error deleting file:', error);
  //     // Handle the error as needed
  //   }
  // );
}

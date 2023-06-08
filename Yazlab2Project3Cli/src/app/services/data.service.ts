import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

//BASE_URL
import { BASE_URL } from '../configs/config';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  sendArray(array:Array<String> , baslik:String , skor:Number , benzerlik:Number ):Observable<any>
  {
    const requestBody = {
      array: array,
      baslik:baslik,
      skor:skor,
      benzerlik:benzerlik,
    };
  
    // İstek başlıklarını ayarlayın (isteğe bağlı)
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.http.post<any>(BASE_URL + "createGraph", requestBody)
  }

  sendOzet(ozet:any , ozet_asil:any):Observable<any>
  {
    const requestBody = {
      ozet: ozet,
      ozet_asil:ozet_asil,
    };
  
    // İstek başlıklarını ayarlayın (isteğe bağlı)
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.http.post<any>(BASE_URL + "ozet", requestBody)
  }
}

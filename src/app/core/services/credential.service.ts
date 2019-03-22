import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CredentialService {
  private url = 'webauthn';

  public static strToBin(str: string) {
    return (<any>Uint8Array).from(atob(str), c => c.charCodeAt(0));
  }

  private static binToStr(bin) {
    return btoa(new Uint8Array(bin).reduce(
      (s, byte) => s + String.fromCharCode(byte), ''
    ));
  }

  constructor(private http: HttpClient) { }

  login(credential: any): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, JSON.stringify(credential));
  }

  register(credential: any): Observable<any> {
    return this.http.post<any>(`${this.url}/register`, JSON.stringify(credential));
  }

  request(email: string): Observable<any> {
    return this.http.get<any>(`${this.url}/login?email=${email}`);
  }

  create(): Observable<any> {
    return this.http.get<any>(`${this.url}/register`);
  }

  credentialCreation() {
    this.create().subscribe(publicKey => {
      publicKey.challenge = CredentialService.strToBin(publicKey.challenge);
      publicKey.user.id = CredentialService.strToBin(publicKey.user.id);
      if (publicKey.excludeCredentials) {
        publicKey.excludeCredentials = publicKey.excludeCredentials.map(function (data) {
          return {
            ...data,
            'id': CredentialService.strToBin(data.id)
          };
        });
      }

      (<any>navigator).credentials.create({ publicKey }).then((data: any) => {
        const publicKeyCredential = {

          id: data.id,
          type: data.type,
          rawId: CredentialService.binToStr(data.rawId),
          response: {
            clientDataJSON: CredentialService.binToStr(data.response.clientDataJSON),
            attestationObject: CredentialService.binToStr(data.response.attestationObject)
          }
        };
        console.log(publicKeyCredential);
        this.register(publicKeyCredential).subscribe(data2 => {
          console.log('ok');
        });
      });
    });
  }

  credentialRequest(email: string) {
    this.request(email).subscribe(publicKey => {
      publicKey.challenge = CredentialService.strToBin(publicKey.challenge);
      if (publicKey.allowCredentials.length) {
        publicKey.allowCredentials = publicKey.allowCredentials.map(data => {
          return {
            ...data,
            'id': CredentialService.strToBin(data.id)
          };
        });
      }


      (<any>navigator).credentials.get({ publicKey }).then((data: any) => {
        const publicKeyCredential = {

          id: data.id,
          type: data.type,
          rawId: CredentialService.binToStr(data.rawId),
          response: {
            authenticatorData: CredentialService.binToStr(data.response.authenticatorData),
            clientDataJSON: CredentialService.binToStr(data.response.clientDataJSON),
            signature: CredentialService.binToStr(data.response.signature),
            userHandle: data.response.userHandle ? CredentialService.binToStr(data.response.userHandle) : null
          }
        };
        this.login(publicKeyCredential).subscribe(data2 => {
          console.log(data2);
        });
      });
    });
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Person, PersonListResponse } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/persons`;

  getPersons(params?: {
    email?: string;
    last_name?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Observable<PersonListResponse> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.email) httpParams = httpParams.set('email', params.email);
      if (params.last_name) httpParams = httpParams.set('last_name', params.last_name);
      if (params.ordering) httpParams = httpParams.set('ordering', params.ordering);
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.page_size) httpParams = httpParams.set('page_size', params.page_size.toString());
    }

    return this.http.get<PersonListResponse>(`${this.apiUrl}/`, { params: httpParams });
  }

  getPerson(id: string): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}/`);
  }

  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.apiUrl}/`, person);
  }

  updatePerson(id: string, person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${id}/`, person);
  }

  partialUpdatePerson(id: string, person: Partial<Person>): Observable<Person> {
    return this.http.patch<Person>(`${this.apiUrl}/${id}/`, person);
  }

  deletePerson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}

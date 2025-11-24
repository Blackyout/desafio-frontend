import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ProductListResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/products`;

  getProducts(params?: {
    sku?: string;
    price_min?: number;
    price_max?: number;
    q?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Observable<ProductListResponse> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.sku) httpParams = httpParams.set('sku', params.sku);
      if (params.price_min !== undefined) httpParams = httpParams.set('price_min', params.price_min.toString());
      if (params.price_max !== undefined) httpParams = httpParams.set('price_max', params.price_max.toString());
      if (params.q) httpParams = httpParams.set('q', params.q);
      if (params.ordering) httpParams = httpParams.set('ordering', params.ordering);
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.page_size) httpParams = httpParams.set('page_size', params.page_size.toString());
    }

    return this.http.get<ProductListResponse>(`${this.apiUrl}/`, { params: httpParams });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}/`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/`, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/`, product);
  }

  partialUpdateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/`);
  }
}

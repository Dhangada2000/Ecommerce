import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl: string = 'http://localhost:8080/products'
  categoryUrl :string = 'http://localhost:8080/product-category';

  constructor(private http: HttpClient) { }

  // Adding support for pagination in Angular
  getProductListPaginate(thePage: number,
                         thePageSize: number,
                         currentCategoryId: number): Observable<GetProductResponse>{

    const paginationUrl: string = `${this.baseUrl}/search/findByCategoryId?id=${currentCategoryId}`
                                   +`&page=${thePage}&size=${thePageSize}`;

    return this.http.get<GetProductResponse>(paginationUrl);
    
  }



  // Get List of products
  getProducts(currentCategoryId: number): Observable<Product[]>{

    const categoryUrl: string = `${this.baseUrl}/search/findByCategoryId?id=${currentCategoryId}`;

    return this.http.get<GetProductResponse>(categoryUrl).pipe(map(data => data._embedded.products));
    
  }

  // reading category info
  getProductCategory(): Observable<ProductCategory[]>{
    return this.http.get<ProductCategoryResponce>(this.categoryUrl).pipe(
      map(data => data._embedded.productCategory)
    );
  }

  getProduct(productId: number): Observable<Product>{
    const productUrl = `${this.baseUrl}/${productId}`;
    return this.http.get<Product>(productUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]>{
    const searchProductUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.http.get<GetProductResponse>(searchProductUrl).pipe(
      map(response => response._embedded.products)
    );
  }

}//ProductService ends here

interface GetProductResponse{
  _embedded : {
    products : Product[]
  },
  page:{
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface ProductCategoryResponce{
  _embedded: {
    productCategory: ProductCategory[];
  }
}

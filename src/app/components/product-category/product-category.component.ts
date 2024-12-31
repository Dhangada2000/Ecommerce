import { Component } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.css'
})
export class ProductCategoryComponent {

  productCategories: ProductCategory[] = [];

  

  constructor(private ps: ProductService){}

  ngOnInit(){
    this.getProductCategory();
  }

  getProductCategory(){
    this.ps.getProductCategory().subscribe(
      data => {
        this.productCategories = data;
        console.log('data from product categories: '+data[0].categoryName);
        console.log('data from product categories: '+this.productCategories);
      }
    );
  }

}

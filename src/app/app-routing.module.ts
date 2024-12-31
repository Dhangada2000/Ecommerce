import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProductComponent } from './components/list-product/list-product.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';




const routes: Routes = [
  {path: 'search/:keyword', component: ListProductComponent},
  {path: 'category/:id', component: ListProductComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'category', component: ListProductComponent},
  {path: 'products', component: ListProductComponent},
  {path: '', component: ListProductComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'checkout', component: CheckoutComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

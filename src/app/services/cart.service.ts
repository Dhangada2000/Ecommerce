import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);


  addToCart(theCartItem: CartItem) {

    // Check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItems: CartItem = undefined!;

    if (this.cartItems.length > 0) {
      
      // find then item in the cart based on item id

      for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === theCartItem.id) {
          existingCartItems = tempCartItem;
          break;
        }
      }

      // check if we found it
      alreadyExistsInCart = (existingCartItems != undefined)
      
    }

      if (alreadyExistsInCart) {
        
        // increment the quantity
        existingCartItems.quantity++;
      }
      else {
        // just add the item to the array
        this.cartItems.push(theCartItem);
      }

      // complete cart quantity and cart total
      this.computeCartTotals();

    

  } //end addToCart


  decrementQuantity(theCartItem : CartItem) {

    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else {
      this.computeCartTotals();
    }

  } // end decrementQuantity

  remove(theCartItem: CartItem) {
    
    // get index item in the array
    const itemIndex = this.cartItems.findIndex (tempCartItem => tempCartItem.id == theCartItem.id);

    // if found, remove the item from the at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }

  } // end remove

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    
  } // end computeCartTotals

}

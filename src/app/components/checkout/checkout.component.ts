import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';
import { Luv2ShopFormService } from '../../services/luv2-shop-form.service';
import { State } from '../../common/state';
import { Country } from '../../common/country';
import { Purchase } from '../../common/purchase';
import { CheckoutServiceService } from '../../services/checkout-service.service';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{

  // Propertise for total quantity and total price
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity : number = 0;

  //Propertise for credit card years and months
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  checkoutFormGroup!: FormGroup;

  //Propertise for states and countries
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  countries: Country[] = [];
  shippingAddressCountries: Country[] = [];
  billingAddressCountries: Country[] = [];

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private luv2ShopFormService: Luv2ShopFormService,
              private checkoutSrvice: CheckoutServiceService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      
      shippingAddress: this.formBuilder.group({
        country: [''],
        state: [''],
        city:new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')])
      }),

      billingAddress: this.formBuilder.group({
        country: [''],
        state: [''],
        city: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')])
      }),

      creditCard: this.formBuilder.group({
        cartType: [''],
        nameOnCard: new FormControl('', [Validators.required]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$')]),
        securityCode:new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
        expMonth: [''],
        expYear: ['']
      }),

      reviewYourOrder: this.formBuilder.group({
        totalQuantity: [''],
        shippingFree: [''],
        totalPrice: ['']
      })

     
    }); //checkoutFormGroup

    // Populate credit card months
    // Here + 1 because array count from Zero that why +1
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrived credit years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // Populate countries
    this.luv2ShopFormService.getCountries().subscribe (
      data => {
        console.log("Retrieved countriesL " + JSON.stringify(data));
        this.countries = data;
      }
    );



//listCheckoutDetails
     // subscribe to the cart totalPrice
  this.cartService.totalPrice.subscribe(
    data => this.totalPrice = data
  );

  // subscribe to the cart totalQuantity
  this.cartService.totalQuantity.subscribe(
    data => this.totalQuantity = data
  );

  }

  copyShippingAddressToBillingAddress(event: any) {

    if(event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
                                      .setValue(this.checkoutFormGroup.controls['shippingAddress'].value)

     this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }// copyShippingAddressToBillingAddress

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard')!;

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expYear);

    // if the current year equals the selected year, then start with current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );


  }// end handleMonthsAndYears

//Getter for firstName
get firstName()
{
  return this.checkoutFormGroup.get('customer.firstName');
}

//Getter for lastName
get lastName()
{
  return this.checkoutFormGroup.get('customer.lastName');
}

//Getter for email
get email()
{
  return this.checkoutFormGroup.get('customer.email');
}

//Shippping Address
//Getter method for city 
get city() 
{
  return this.checkoutFormGroup.get('shippingAddress.city')
}

get street()
{
  return this.checkoutFormGroup.get('shippingAddress.street')
}

  onSubmit() {
    console.log("Handling the submit button");
    console.log("Customer Infomartion");

    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("Email is " + this.checkoutFormGroup.get('customer')?.value.email);

    console.log("Shipping Address");
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);

    console.log("Billing Address");
    console.log(this.checkoutFormGroup.get('billingAddress')?.value);

    console.log("Credit Card");
    console.log(this.checkoutFormGroup.get('creditCard')?.value);

    // Saving order steps:

    // Setup order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // Get cart items
    const cartItems = this.cartService.cartItems;

    // Create orderItems from cartItems
    let orderItems: OrderItem[] = [];
    for (let i = 0; i < CartItem.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    let orderItemInShot = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // Setup purchase
    let purchase = new Purchase();

    // Populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // Populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;

    const shippingAddressState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));

   purchase.shippingAddress.state = shippingAddressState.name;
   purchase.shippingAddress.country = shippingAddressCountry.name;


    // Populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;

    const billingAddressState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingAddressCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));

    purchase.billingAddress.state = billingAddressState.name;
    purchase.billingAddress.country = billingAddressCountry.name;

    // Populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItemInShot;

    // CAll REST API: 'http://localhost:8080/checkout/purchase' via the CheckoutService
    this.checkoutSrvice.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received.\nOrder treacking number: ${response.orderTrackingNumber}`)
        },
        error: err => {
          alert(`There was an error: ${err.message}`)
        }
      }
    );

  } //onSubmit end here 

  // Go to style.css and search(ctrl+f) for "page-m" and change the padding to (10% 30% 10% 5%)

// states 
getStates(formGroupName: string) {

  const FormGroup = this.checkoutFormGroup.get(formGroupName);
  const countryCode = FormGroup?.value.country.code;

  this.luv2ShopFormService.getStates(countryCode).subscribe (
    data => {

      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      // select first item by default
      FormGroup?.get('state')?.setValue(data[0]);
    }
  );
}

// Countries
getCountries(formGroupName: string) {

  const FormGroup = this.checkoutFormGroup.get(formGroupName);
  const countryCode = FormGroup?.value.country.code;

  this.luv2ShopFormService.getCountries().subscribe (
    data => {

      if (formGroupName === 'shippingAddress') {
        this.shippingAddressCountries = data;
      } else {
        this.billingAddressCountries = data;
      }

      // select first item by default
      FormGroup?.get('country')?.setValue(data[0]);
    }
  );
}


}// CheckoutComponent

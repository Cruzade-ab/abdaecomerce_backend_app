import { IsNumber, IsPositive } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  sizeId: number;

  @IsNumber()
  @IsPositive()
  productPrice: number;
}

export class CartItemDto {
    productPrice: number;
    imageUrl: string;
    size: number;
    totalPrice: number;
}

export class initiaizeCardDto {
  cartId: number;
  userId: number;
  cartItems: CartItemDto[];
  cartTotalPrice: number;
}
  
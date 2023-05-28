import { Component } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { StatusComada } from "src/app/api/dtos/enums/statusComanda.enum";
import { ComandaItem } from "src/app/api/dtos/models/comanda-item.model";
import { ComandaDto } from "src/app/api/dtos/models/comanda.model";
import { IngredienteDto } from "src/app/api/dtos/models/ingrediente.model";
import { ItemDto } from "src/app/api/dtos/models/item.model";
import { Order } from "src/app/api/dtos/models/order.model";
import { ShoppingCartItem } from "src/app/api/dtos/models/shopping-card.model";
import { UserDto } from "src/app/api/dtos/models/user.model";
import { ComandaService } from "src/app/api/services/comanda.service";
import { IngredienService } from "src/app/api/services/ingrediente.service";
import { ItemService } from "src/app/api/services/item.service";
import { UserService } from "src/app/api/services/user.service";

@Component({
  selector: 'CustomerPage-component',
  templateUrl: './CustomerPage.component.html',
  styleUrls: ['./CustomerPage.component.scss'],
})

export class CustomerPageComponent {

  public areProductsVisible = true;
  public isCartVisible = false;
  public areOrdersVisible = false;
  public myAccountVisible = false;
  public ingrediente: Array<IngredienteDto>
  public items: Array<ItemDto> | undefined;
  public isEditEnabled = Array<boolean>();
  public cart = Array<ShoppingCartItem>();
  public orders = Array<Order>();
  public cartSize = 0;
  public displayOrderNotification = false;
  public displayBadStatusOrderNotification = false;
  public displayUserUpdatedNotification = false;
  public displayOrderEdit = false;
  public user = {
    name: '',
    email: '',
  } as UserDto;
  public order: Order;

  constructor(
    private itemService: ItemService,
    private ingredientService: IngredienService,
    private comandaService: ComandaService,
    private userService: UserService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.importItems();
    this.importIngrediente();
    await this.setOrders();
    await this.setUser();
  }

  onOrdersClick(): void {
    this.areOrdersVisible = true;
    this.areProductsVisible = false;
    this.isCartVisible = false;
    this.myAccountVisible = false;
  }

  onItemClick() {
    this.importItems();
    this.areProductsVisible = true;
    this.isCartVisible = false;
    this.areOrdersVisible = false;
    this.myAccountVisible = false;
  }

  getIngredientNameById(ingredientId?: number): string {
    if (!this.ingrediente) {
      return '';
    }
    return this.ingrediente.filter((currentIngredient) => currentIngredient.ingrId == ingredientId)[0].ingrName ?? '';
  }

  async importItems(): Promise<any> {
    this.itemService.getItem().subscribe((Items: Array<ItemDto>) => {
      this.items = Items;
      this.isEditEnabled = Array<boolean>();
      this.items.forEach(() => {
        this.isEditEnabled.push(false);
      });
    });
  }

  async importIngrediente(): Promise<any> {
    this.ingredientService.getIngrediente().subscribe((Ingrediente: Array<IngredienteDto>) => {
      this.ingrediente = Ingrediente;
      this.isEditEnabled = Array<boolean>();
      this.ingrediente.forEach(() => {
        this.isEditEnabled.push(false);
      });
    });
  }

  async setOrders(): Promise<void> {
    this.orders = await lastValueFrom(this.comandaService.getComanda());
  }

  async setUser(): Promise<void> {
    const userId = JSON.parse(sessionStorage.getItem('Session Data') as string).userId;

    this.user = await lastValueFrom(this.userService.getUser(userId));
    this.user.password = '';
  }

  addToCart(item: ItemDto) {
    let alreadyExisting = this.cart.filter(currentItem => currentItem.product.id == item.id);

    if (alreadyExisting.length > 0) {
      this.cart.filter(currentItem => currentItem.product.id == item.id)[0].quantity++;
    } else {
      const { ingrediente, ...itemWIthoutIngredients } = item;
      this.cart.push({
        product: itemWIthoutIngredients,
        quantity: 1,
      });
    }
    this.cartSize++;
  }

  displayCart(): void {
    this.areOrdersVisible = false;
    this.areProductsVisible = false;
    this.myAccountVisible = false;
    this.isCartVisible = true;
  }

  getCartTotal(): number {
    let res = 0;
    this.cart.forEach(item => res += item.quantity * item.product.pret);
    return res;
  }

  increaseQuantity(index: number) {
    this.cart[index].quantity++;
    this.cartSize++;
  }

  decreaseQuantity(index: number) {
    this.cart[index].quantity--;
    this.cartSize--;
    if (this.cart[index].quantity == 0) {
      this.cart.splice(index, 1);
    }
  }

  async finishOrder(): Promise<void> {
    const userId = JSON.parse(sessionStorage.getItem('Session Data') as string).userId;
    await lastValueFrom(this.comandaService.addComanda({
      total: this.getCartTotal(),
      userId: userId,
      item: this.cart
    }));
    this.cart = new Array<ShoppingCartItem>();
    this.cartSize = 0;
    this.displayOrderNotification = true;
    await this.setOrders();
  }

  dismissOrderNotification(): void {
    this.displayOrderNotification = false;
  }

  getStatus(status: number): string {
    return StatusComada[status];
  }

  onEditClick(order: Order): void {
    this.order = { ...order };
    this.displayOrderEdit = true;
  }

  async deleteOrder(order: Order): Promise<void> {
    if (order.status != StatusComada.IN_ASTEPTARE) {
      this.displayBadStatusOrderNotification = false;
      return;
    }

    await lastValueFrom(this.comandaService.deleteComanda(order.comId));
    await this.setOrders();
  }

  getItemOrderInfo(item: ComandaItem): string {
    const itemFound = this.items?.find((currentItem) => currentItem.id == item.itemItemId)
    return `${item.quantity} x ${itemFound?.denumire}`;
  }

  closeBadStatusNotification(): void {
    this.displayBadStatusOrderNotification = false;
  }

  closeEditOrderModal(): void {
    this.displayOrderEdit = false;
    this.setOrders();
  }

  getItemsFromOrder(order: Order): Array<ItemDto> {
    let result = new Array<ItemDto>();
    this.order.items?.forEach((item) => result.push(this.items?.find((currentItem) => currentItem.id == item.itemItemId) as ItemDto))

    return result;
  }

  getItemQuantity(index: number): string {
    return `${((this.order.items as Array<ComandaItem>)[index]).quantity}`;
  }

  decreaseQuantityForOrderEdit(index: number): void {
    (this.order.items as Array<ComandaItem>)[index].quantity--
    if ((this.order.items as Array<ComandaItem>)[index].quantity == 0) {
      this.order.items?.splice(index, 1);
    }
    this.order.total -= this.items?.find(item => (this.order.items as Array<ComandaItem>)[index].itemItemId == item.id)?.pret ?? 0;
  }

  increaseQuantityForOrderEdit(index: number): void {
    (this.order.items as Array<ComandaItem>)[index].quantity++;
    this.order.total += this.items?.find(item => (this.order.items as Array<ComandaItem>)[index].itemItemId == item.id)?.pret ?? 0;
  }

  onMyAccountClick(): void {
    this.myAccountVisible = true;
    this.areOrdersVisible = false;
    this.areProductsVisible = false;
    this.isCartVisible = false;
  }

  async updateUser(): Promise<void> {
    const userId = JSON.parse(sessionStorage.getItem('Session Data') as string).userId;
    await lastValueFrom(this.userService.updateUser(userId, this.user));
    await this.setUser();
    this.displayUserUpdatedNotification = true;
  }

  dismissUserUpdateNotification(): void {
    this.displayUserUpdatedNotification = false;
  }

  async updateOrder(): Promise<void> {
    await lastValueFrom(this.comandaService.updateComanda(this.order.comId, this.order));
    await this.setOrders();
    this.closeEditOrderModal();
  }
}
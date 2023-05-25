import { Component } from "@angular/core";
import { IngredienteDto } from "src/app/api/dtos/models/ingrediente.model";
import { ItemDto } from "src/app/api/dtos/models/item.model";
import { ShoppingCartItem } from "src/app/api/dtos/models/shopping-card.model";
import { ComandaService } from "src/app/api/services/comanda.service";
import { IngredienService } from "src/app/api/services/ingrediente.service";
import { ItemService } from "src/app/api/services/item.service";

@Component({
  selector: 'CustomerPage-component',
  templateUrl: './CustomerPage.component.html',
  styleUrls: ['./CustomerPage.component.scss'],
})

export class CustomerPageComponent {

  public areProductsVisible = true;
  public ingrediente: Array<IngredienteDto>
  public items: Array<ItemDto> | undefined;
  public isEditEnabled = Array<boolean>();
  public cart = Array<ShoppingCartItem>();


  constructor(
    private itemService: ItemService,
    private ingredientService: IngredienService,
    private comandaService: ComandaService
  ) { }

  onItemClick() {
    this.importItems();
  }

  ngOnInit(): void {
    this.importItems();
    this.importIngrediente()
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

  addToCart(item: ItemDto) {
    let added = false;
    this.cart.forEach((product) => {
      if (product.product.id == item.id) {
        product.quantity++;
        added = true;
      }
    })
  }
}
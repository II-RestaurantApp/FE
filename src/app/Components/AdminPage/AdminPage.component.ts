import { Component } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { ComandaDto } from "src/app/api/dtos/models/comanda.model";
import { IngredienteDto } from "src/app/api/dtos/models/ingrediente.model";
import { ItemIngredient } from "src/app/api/dtos/models/item-ingrediente.model";
import { ItemDto } from "src/app/api/dtos/models/item.model";
import { ComandaService } from "src/app/api/services/comanda.service";
import { IngredienService } from "src/app/api/services/ingrediente.service";
import { ItemService } from "src/app/api/services/item.service";


@Component({
  selector: 'AdminPage-page',
  templateUrl: './AdminPage.component.html',
  styleUrls: ['./AdminPage.component.scss']
})

export class AdminPageComponent {

  public items: Array<ItemDto> | undefined;
  public ingrediente: Array<IngredienteDto>
  public comenzi: Array<ComandaDto> | undefined

  public isAddFormVisible = false;
  public areProductsVisible = true;
  public areIngredientesVisible = false;
  public areUsersVisible = false;
  public areOrdersVisible = false;
  public isEditEnabled = Array<boolean>();

  public item: ItemDto = {
    denumire: "",
    pret: 0,
    gramaj: 0,
    ingrediente: new Array<IngredienteDto>(),
  };

  public ingredient: IngredienteDto = {
    ingrName: ""

  }

  constructor(
    private itemService: ItemService,
    private ingredientService: IngredienService,
    private comandaService: ComandaService
  ) { }

  ngOnInit(): void {
    this.importItems();
    this.importIngrediente();
    this.importOrders();
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

  async importOrders(): Promise<any> {
    this.comandaService.getComanda().subscribe((Comenzi: Array<ComandaDto>) => {
      this.comenzi = Comenzi;
      this.isEditEnabled = Array<boolean>();
      this.comenzi.forEach(() => {
        this.isEditEnabled.push(false);
      });
    });
  }

  async onUsersClick(): Promise<void> {
  }
  onProductsClick(): void {
    this.areIngredientesVisible = false;
    this.areOrdersVisible = false;
    this.areProductsVisible = true;
    this.areUsersVisible = false;
  }

  async onOrdersClick(): Promise<void> {
    this.areIngredientesVisible = false;
    this.areOrdersVisible = true;
    this.areProductsVisible = false;
    this.areUsersVisible = false;
  }

  onIngredienteClick(): void {
    this.areIngredientesVisible = true;
    this.areOrdersVisible = false;
    this.areProductsVisible = false;
    this.areUsersVisible = false;
  }

  async onEditClick(index: number) {
    this.isEditEnabled[index] = !this.isEditEnabled[index];
  }

  async editProduct(item: ItemDto, index: number): Promise<void> {
    if (item.denumire != '') {
      this.item.denumire = item.denumire;
    }
    if (item.pret != null) {
      this.item.pret = item.pret;
    }
    if (item.gramaj != null) {
      this.item.gramaj = item.gramaj;
    }

    const response = await lastValueFrom(this.itemService.updateItem(this.item, item.id as number))

  }

  isAddFormDisplayed(): boolean {
    return this.isAddFormVisible;
  }

  async AddItem() {
    await lastValueFrom(this.itemService.createItem(this.item));
    this.importItems();
    this.item = {
      denumire: "",
      pret: 0,
      gramaj: 0,
      ingrediente: new Array<IngredienteDto>(),
    }

    this.onAddProductClick();
  }

  async onAddProductClick() {
    this.isAddFormVisible = !this.isAddFormVisible;
  }

  async onAddIngredientClick() {
    this.isAddFormVisible = !this.isAddFormVisible;
  }

  async deleteProduct(item: ItemDto) {

  }


  selecOrUnselectIngredient(index: number): void {
    if (this.item.ingrediente?.some((currentIngredient) => currentIngredient.ingrId == this.ingrediente[index].ingrId)) {
      this.item.ingrediente = this.item.ingrediente.filter((currentIngredient) => currentIngredient.ingrId != this.ingrediente[index].ingrId);
    } else {
      this.item.ingrediente?.push(this.ingrediente[index]);
    }
  }

  getIngredientNameById(ingredientId?: number): string {
    if (!this.ingrediente) {
      return '';
    }
    return this.ingrediente.filter((currentIngredient) => currentIngredient.ingrId == ingredientId)[0].ingrName ?? '';
  }
}
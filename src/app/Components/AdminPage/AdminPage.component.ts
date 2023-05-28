import { Component } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { StatusComada } from "src/app/api/dtos/enums/statusComanda.enum";
import { ComandaDto } from "src/app/api/dtos/models/comanda.model";
import { IngredienteDto } from "src/app/api/dtos/models/ingrediente.model";
import { ItemDto } from "src/app/api/dtos/models/item.model";
import { Order } from "src/app/api/dtos/models/order.model";
import { UserWithoutPassword } from "src/app/api/dtos/models/user-without-pasword.model";
import { UserDto } from "src/app/api/dtos/models/user.model";
import { ComandaService } from "src/app/api/services/comanda.service";
import { IngredienService } from "src/app/api/services/ingrediente.service";
import { ItemService } from "src/app/api/services/item.service";
import { UserService } from "src/app/api/services/user.service";


@Component({
  selector: 'AdminPage-page',
  templateUrl: './AdminPage.component.html',
  styleUrls: ['./AdminPage.component.scss']
})

export class AdminPageComponent {

  public items: Array<ItemDto>;
  public ingrediente: Array<IngredienteDto>
  public comenzi: Array<ComandaDto> | undefined
  public users: Array<UserWithoutPassword>

  public isAddFormVisible = false;
  public areProductsVisible = true;
  public areIngredientesVisible = false;
  public areUsersVisible = false;
  public areOrdersVisible = false;
  public isEditEnabled = Array<boolean>();
  public editModalActive = false;
  public editIngredientModalActive = false;
  public dropdownActive = false;
  public displayOrderEdit = false;

  public item: ItemDto = {
    denumire: "",
    pret: 0,
    gramaj: 0,
    ingrediente: new Array<IngredienteDto>(),
  };

  public ingredient: IngredienteDto = {
    ingrName: ""
  }

  public ingredientToAdd: IngredienteDto = {
    ingrName: ""
  }

  public order: Order;
  public status: StatusComada;

  constructor(
    private itemService: ItemService,
    private ingredientService: IngredienService,
    private comandaService: ComandaService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.importItems();
    this.importIngrediente();
    this.importOrders();
    this.setUsers();
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
    this.comenzi = await lastValueFrom(this.comandaService.getComanda());
  }

  setUsers(): void {
    this.userService.getUsers()
      .subscribe((result) => this.users = result)
  }

  onUsersClick(): void {
    this.areIngredientesVisible = false;
    this.areOrdersVisible = false;
    this.areProductsVisible = false;
    this.areUsersVisible = true;
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
    this.item = { ...this.items[index] };
    this.item.ingrediente = [];
    this.items[index].ingrediente?.forEach((ingredient) => {
      const ingredientToAdd = this.ingrediente.find((currentIngredient) => currentIngredient.ingrId == ingredient.ingredientId);
      if (ingredientToAdd) {
        this.item.ingrediente?.push(ingredientToAdd);
      }
    });
    this.editModalActive = true;

    // this.isEditEnabled[index] = !this.isEditEnabled[index];
  }

  async editProduct(id: number | undefined): Promise<void> {
    const response = await lastValueFrom(this.itemService.updateItem(this.item, id as number))
    this.importItems();
    this.closeModal();
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

  async deleteProduct(id: number | undefined): Promise<void> {
    await lastValueFrom(this.itemService.deleteItem(id as number));
    this.importItems();
  }


  selecOrUnselectIngredient(index: number): void {
    if (this.item.ingrediente?.some((currentIngredient) => currentIngredient.ingrId == this.ingrediente[index].ingrId)) {
      this.item.ingrediente = this.item.ingrediente.filter((currentIngredient) => currentIngredient.ingrId != this.ingrediente[index].ingrId);
    } else {
      this.item.ingrediente?.push(this.ingrediente[index]);
    }
  }

  selecOrUnselectIngredientFromItem(index: number, item: ItemDto): void {
    if (item.ingrediente?.some((currentIngredient) => currentIngredient.ingrId == this.ingrediente[index].ingrId)) {
      item.ingrediente = item.ingrediente.filter((currentIngredient) => currentIngredient.ingrId != this.ingrediente[index].ingrId);
    } else {
      item.ingrediente?.push(this.ingrediente[index]);
    }
  }

  getIngredientNameById(ingredientId?: number): string {
    if (!this.ingrediente) {
      return '';
    }
    return this.ingrediente.filter((currentIngredient) => currentIngredient.ingrId == ingredientId)[0]?.ingrName ?? '';
  }

  public getTypeOfUser(user: UserWithoutPassword): string {
    return user.type === 0 ? 'Client' : 'Admin';
  }

  public getStatus(status: number): string {
    return StatusComada[status];
  }

  public closeModal(): void {
    this.editModalActive = false;
    this.item = {
      denumire: "",
      pret: 0,
      gramaj: 0,
      ingrediente: new Array<IngredienteDto>(),
    } as ItemDto;
  }

  public triggerDropdown(): void {
    this.dropdownActive = !this.dropdownActive;
  }

  public selectIngredient(id: number | undefined): void {
    if (this.item.ingrediente?.some((ingredient) => ingredient.ingrId === id)) {
      return;
    }

    this.item.ingrediente?.push(this.ingrediente.find((ingredient) => ingredient.ingrId === id) as IngredienteDto)
  }

  public removeIngredient(id: number | undefined): void {
    this.item.ingrediente = this.item.ingrediente?.filter((ingredient) => ingredient.ingrId != id);
  }

  public closeIngredientModal(): void {
    this.editIngredientModalActive = false;
  }

  public async updateIngredient(id: number | undefined): Promise<void> {
    await lastValueFrom(this.ingredientService.updateIngredient(id as number, this.ingredient));
    this.importIngrediente();
    this.ingredient = {
      ingrName: ''
    }
    this.closeIngredientModal();
  }

  public onIngredientClick(id: number | undefined): void {
    this.ingredient = this.ingrediente.find(ingredient => ingredient.ingrId == id) as IngredienteDto;

    if (!this.ingredient) {
      return;
    }

    this.editIngredientModalActive = true;
  }

  public async deleteIngredient(id: number | undefined): Promise<void> {
    await lastValueFrom(this.ingredientService.deleteIngredient(id as number));
    this.importIngrediente();
    this.ingredient = {
      ingrName: ''
    }
    this.closeIngredientModal();
  }

  public async AddIngredient(): Promise<void> {
    await lastValueFrom(this.ingredientService.addIngredient(this.ingredientToAdd));
    this.importIngrediente();
    this.ingredientToAdd.ingrName = '';
    this.isAddFormVisible = false;
  }

  getUserById(id: number): UserWithoutPassword {
    return this.users.find(user => user.userId == id) as UserWithoutPassword;
  }

  async updateStatusComanda(comanda: Order): Promise<void> {
    await lastValueFrom(this.comandaService.updateStatusComanda(comanda.comId, this.status));
    await this.importOrders();
    this.closeEditOrderModal();
  }

  onEditOrderClick(order: Order): void {
    this.displayOrderEdit = true;
    this.order = order;
  }

  async closeEditOrderModal(): Promise<void> {
    this.displayOrderEdit = false;
    await this.importOrders();
  }

  selectStatus(status: number): void {
    this.status = status;
  }
}
import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { PasswordModule } from 'primeng/password';
import { Client, ClientApi } from '../../../restapi/clientapi';
import { User } from '../../../restapi/userapi';
import { DialogService } from 'primeng/dynamicdialog';
import { FileManagerComponent } from '../../shared/file-manager/file-manager.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-client',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    PasswordModule
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
  providers: [MessageService, ConfirmationService, DialogService]

})
export class ClientComponent {
  dialog: boolean = false;
  clients = signal<Client[]>([]);
  client!: Client;
  selectedClient!: Client[] | null;
  submitted: boolean = false;
  showPassword: boolean = false;
  isUpdate: boolean = false;
  baseUrl = `${environment.serverUrl}`;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private clientApi: ClientApi,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.clientApi.getData().subscribe((data: Client[]) => {
      this.clients.set(data);
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.client = {};
    this.submitted = false;
    this.dialog = true;
  }

  edit(client: Client) {
    this.client = { ...client };
    this.dialog = true;
  }

  deleteSelected() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clients.set(this.clients().filter((val) => !this.selectedClient?.includes(val)));
        this.selectedClient = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Data Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.dialog = false;
    this.submitted = false;
  }

  delete(client: Client) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + client.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clientApi.delete(client.id).subscribe((data: any) => {
          if (data.isSucceeded) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: data.message,
              life: 3000
            });
            this.loadData();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: data.message,
              life: 3000
            });
          }
        });

        this.client = {};
      }
    });
  }


  save() {
    this.submitted = true;
    if (this.client.id) {
      this.clientApi.update(this.client).subscribe((data: any) => {
        if (data.isSucceeded) {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: data.message
          });
          this.loadData();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: data.message,
            life: 3000
          });
        }
      });
    }
    else {
      const createRequest = {
        name: this.client.name,
        banner: this.client.banner,
        phone: this.client.phone,
        address: this.client.address,
        email: this.client.email,
        viewUserName: this.client.viewUserName,
        viewPassword: this.client.viewPassword
      };

      this.clientApi.create(createRequest).subscribe((data: any) => {
        if (data.isSucceeded) {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: data.message, life: 3000 });
          this.loadData();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
        }
      });
    }

    this.dialog = false;
  }

  openFileManager() {
    const ref = this.dialogService.open(FileManagerComponent, {
      header: 'Select a File',
      modal: true, // Enables backdrop mode
      dismissableMask: true, // Click outside to close
    });

    ref.onClose.subscribe((file) => {
      if (file) {
        this.client.banner = file[0].url;
      }
    });
  }

  removeImage() {
    this.client.banner = '';
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Toast, ToastModule } from 'primeng/toast';
import { FileManagerComponent } from '../../shared/file-manager/file-manager.component';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from '../../../../environments/environment';
import { TourGuide, TourGuideApi } from '../../../restapi/tourguideapi';

@Component({
  selector: 'app-tourguide',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,

  ],
  templateUrl: './tourguide.component.html',
  styleUrl: './tourguide.component.scss',
  providers: [MessageService, ConfirmationService, DialogService]

})

export class TourguideComponent {
  searchTerm: string = '';
  selectedCity: string | null = null;
  dialog: boolean = false;
  submitted: boolean = false;
  tourGuide!: TourGuide;

  tourGuides: TourGuide[] = [];

  baseUrl = `${environment.serverUrl}`;

  constructor(private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private tourGuideApi: TourGuideApi
  ) { }

  ngOnInit() {
    this.loadData();
  }

  get filteredGuides() {
    return this.tourGuides.filter(guide =>
      guide.name!.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (!this.selectedCity || guide.city === this.selectedCity)
    );
  }

  openNew() {
    this.tourGuide = {};
    this.submitted = false;
    this.dialog = true;
  }

  editGuide(guide: TourGuide) {
    this.tourGuide = { ...guide };
    this.dialog = true;
  }

  deleteGuide(id: string | undefined) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this guide?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tourGuideApi.deleteGuide(id).subscribe((data: any) => {
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

        this.tourGuide = {};


      }

    });
  }

  hideDialog() {
        this.dialog = false;
        this.submitted = false;
      }

  loadData() {
        this.tourGuideApi.getGuides().subscribe((data: TourGuide[]) => {
          this.tourGuides = data;
        });
      }

  save() {
        this.submitted = true;
        if (this.tourGuide.id) {
          this.tourGuideApi.updateGuide(this.tourGuide).subscribe((data: any) => {
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
        }
        else {
          const createRequest: any = {
            name: this.tourGuide.name,
            phone: this.tourGuide.phone,
            address: this.tourGuide.address,
            image: this.tourGuide.image
          };

          this.tourGuideApi.createGuide(createRequest).subscribe((data: any) => {
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
            this.tourGuide.image = file.url;
          }
        });
      }

  removeImage() {
        this.tourGuide.image = '';
      }
    }

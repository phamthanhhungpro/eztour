import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FileManagerComponent } from '../../shared/file-manager/file-manager.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss',
  providers: [DialogService],
})
export class RoleComponent {
  selectedFile: string | null = null;

  constructor(private dialogService: DialogService) {}

  openFileManager() {
    const ref = this.dialogService.open(FileManagerComponent, {
      header: 'Select a File',
      width: '50%',
      modal: true, // Enables backdrop mode
      dismissableMask: true, // Click outside to close
    });

    ref.onClose.subscribe((file) => {
      if (file) {
        this.selectedFile = file.name;
      }
    });
  }

}

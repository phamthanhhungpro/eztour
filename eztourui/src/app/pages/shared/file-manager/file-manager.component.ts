import { Component, ViewChild } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { FileApi, FileItem } from '../../../restapi/fileapi';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule,
    FormsModule,
    ToastModule
  ],
  templateUrl: './file-manager.component.html',
  providers: [MessageService, FileApi]
})

export class FileManagerComponent {
  @ViewChild('fileUpload') fileUpload: any;
  rootFiles: FileItem[] = [];

  currentPath: string[] = [];
  currentFiles: FileItem[] = [];
  selectedFolder: FileItem | null = null;
  previewImage: string | null = null;
  searchTerm: string = ''; // Search input model
  selectedFolderPath: string | null = null; // Track selected folder path
  selectedFile: File | null = null; // Store the selected file
  selectedFiles: FileItem[] = []; // For multiple file selection
  previewTop: number = 0;
  previewLeft: number = 0;

  baseUrl = `${environment.serverUrl}`;

  constructor(public ref: DynamicDialogRef, public fileApi: FileApi,
    private messageService: MessageService
  ) {
    this.currentFiles = this.rootFiles; // Start with root files
  }

  ngOnInit() {
    this.fileApi.getFiles().subscribe(files => {
      this.rootFiles = files;
      this.currentFiles = files;
    });
  }

  navigateFolder(folder: FileItem, parentPath: string = "") {
    this.currentPath = parentPath ? parentPath.split("/") : [folder.name];

    this.currentFiles = folder.children || [];
    this.selectedFolderPath = parentPath ? `${parentPath}/${folder.name}` : folder.name; // Store full path
  }

  goBack() {
    if (this.currentPath.length > 0) {
      this.currentPath.pop();
      this.selectedFolderPath = this.currentPath.join('/') || null;

      let temp = this.rootFiles;
      for (let folder of this.currentPath) {
        temp = temp.find(f => f.name === folder && f.type === 'folder')?.children || [];
      }
      this.currentFiles = temp;
    }
  }

  isFolderActive(folderPath: string): boolean {
    return this.selectedFolderPath?.startsWith(folderPath) || false;
  }

  // Check if a file is in the selectedFiles array
  isFileSelected(file: FileItem): boolean {
    return this.selectedFiles.some(f => f.url === file.url);
  }

  // Toggle file selection
  toggleFileSelection(file: FileItem) {
    if (file.type !== 'file') return;

    const index = this.selectedFiles.findIndex(f => f.url === file.url);
    if (index > -1) {
      // Remove from selection
      this.selectedFiles.splice(index, 1);
    } else {
      // Add to selection
      this.selectedFiles.push(file);
    }
  }

  // Confirm and close with selected files
  confirmSelection() {
    if (this.selectedFiles.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No files selected' });
      return;
    }

    // Close the dialog and return selected files
    this.ref.close(this.selectedFiles);
  }

  selectFile(file: FileItem) {
    this.ref.close(file);
  }

  closeDialog() {
    this.ref.close();
  }

  getFileIcon(file: FileItem): string {
    if (file.type === 'folder') return 'pi pi-folder text-yellow-500';

    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'pi pi-file-pdf text-red-500';
      case 'jpg': case 'png': case 'gif': return 'pi pi-image text-blue-500';
      case 'doc': case 'docx': return 'pi pi-file-word text-blue-700';
      case 'xls': case 'xlsx': return 'pi pi-file-excel text-green-500';
      case 'ppt': case 'pptx': return 'pi pi-file text-orange-500';
      case 'zip': case 'rar': return 'pi pi-folder-open text-gray-500';
      default: return 'pi pi-file text-gray-700';
    }
  }

  // Show image preview on hover with position
  showPreview(file: FileItem, event: MouseEvent) {
    if (file.type === 'file' && file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      this.previewImage = file.url as string;
  
      // Position the preview at the fixed left bottom of the screen
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
  
      // Set to bottom left with some padding
      this.previewTop = viewportHeight - 420; // 20px padding from bottom
      this.previewLeft = 2; // 20px padding from left
    }
  }

  hidePreview() {
    this.previewImage = null;
  }

  formatFileSize(bytes: number): string {
    return bytes < 1024 ? bytes + ' B' : (bytes / 1024).toFixed(2) + ' KB';
  }

  onFileSelected(event: any) {
    if (event.files.length > 0) {
      this.selectedFile = event.files[0]; // Get the first selected file
    }
  }

  uploadFile() {
    const uploadedFile: FileItem = {
      name: this.selectedFile?.name ?? "",
      type: 'file',
    }
    this.fileApi.uploadFile(this.selectedFile as File, this.selectedFolderPath || '').subscribe(response => {
      if (response.isSucceeded) {
        this.fileUpload.clear();
        this.selectedFile = null;
        uploadedFile.url = response.url;

        this.messageService.add({ severity: 'success', summary: 'Successful', detail: response.message });
        this.fileApi.getFiles().subscribe(files => {
          this.rootFiles = files;
          this.currentFiles.push(uploadedFile);
        });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
      }
    });
  }

  // Recursively collect all files from all folders
  getAllFiles(files: FileItem[]): FileItem[] {
    let result: FileItem[] = [];
    for (let file of files) {
      if (file.type === 'file') {
        result.push(file);
      } else if (file.children) {
        result = [...result, ...this.getAllFiles(file.children)];
      }
    }
    return result;
  }

  get filteredFiles(): FileItem[] {
    let allFiles = this.getAllFiles(this.rootFiles); // Get all files from all folders
    return allFiles.filter(file => file.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  cancelUpload() {
    this.selectedFile = null;
    // clear the file input
    this.fileUpload.clear();
  }
}
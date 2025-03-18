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
import { CreateUserRequest, User, UserApi } from '../../../restapi/userapi';
import { PasswordModule } from 'primeng/password';

@Component({
    selector: 'app-user',
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
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
    providers: [MessageService, ConfirmationService]

})
export class UserComponent {
    dialog: boolean = false;
    users = signal<User[]>([]);
    user!: User;
    selectedUsers!: User[] | null;
    submitted: boolean = false;
    showPassword: boolean = false;
    isUpdate: boolean = false;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private userApi: UserApi
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.userApi.getUsers().subscribe((data: User[]) => {
            this.users.set(data);
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.user = { userName: '', password: '' };
        this.submitted = false;
        this.dialog = true;
    }

    editUser(user: User) {
        this.user = { ...user };
        this.dialog = true;
    }

    deleteSelectedUsers() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected users?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users.set(this.users().filter((val) => !this.selectedUsers?.includes(val)));
                this.selectedUsers = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Users Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.dialog = false;
        this.submitted = false;
    }

    deleteUser(user: User) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + user.userName + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.userApi.deleteUser(user.id).subscribe((data: any) => {
                    if (data.isSucceeded) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'User Deleted',
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

                this.user = { userName: '', password: '' };
            }
        });
    }


    saveProduct() {
        this.submitted = true;
        if (this.user.id) {
            this.userApi.updateUser(this.user).subscribe((data: any) => {
                if (data.isSucceeded) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'User Updated'
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
            const createUserRequest: CreateUserRequest = {
                userName: this.user.userName,
                password: this.user.password,
                email: this.user.email,
                fullName: this.user.fullName
            };

            this.userApi.createUser(createUserRequest).subscribe((data: any) => {
                if (data.isSucceeded) {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
                    this.loadData();
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
                }
            });
        }

        this.dialog = false;
    }

}

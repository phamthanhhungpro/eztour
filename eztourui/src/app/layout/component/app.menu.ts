import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] }]
            },
            {
                label: 'Tour Managements',
                items: [
                    {
                        label: 'Tours',
                        icon: 'pi pi-fw pi-map',
                        routerLink: ['/admin/tour']
                    },
                    {
                        label: 'Hotels',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/admin/hotel']
                    },
                    {
                        label: 'Flights',
                        icon: 'pi pi-fw pi-send',
                        routerLink: ['/admin/flight']
                    },
                    {
                        label: 'Restaurants',
                        icon: 'pi pi-fw pi-shop',
                        routerLink: ['/admin/restaurant']
                    },
                    {
                        label: 'Tour Guides',
                        icon: 'pi pi-fw pi-compass',
                        routerLink: ['/admin/tourguide']
                    },
                    {
                        label: 'Clients',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/admin/client']
                    }
                ]
            },
            {
                label: 'System Management',
                items: [
                    {
                        label: 'Users',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/admin/user']
                    },
                    {
                        label: 'Roles',
                        icon: 'pi pi-fw pi-key',
                        routerLink: ['/admin/role']
                    }
                ]
            },
        ];
    }
}
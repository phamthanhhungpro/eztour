import { Routes } from '@angular/router';
import { Dashboard } from '../dashboard/dashboard';
import { TourComponent } from './tour/tour.component';
import { FlightComponent } from './flight/flight.component';
import { HotelComponent } from './hotel/hotel.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { ClientComponent } from './client/client.component';
import { TourguideComponent } from './tourguide/tourguide.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { FileManagerComponent } from '../shared/file-manager/file-manager.component';
import { FileComponent } from './file/file.component';

export default [
    {
        path: '',
        component: Dashboard,
    },
    {
        path: 'tour',
        component: TourComponent
    },
    {
        path: 'flight',
        component: FlightComponent
    },
    {
        path: 'hotel',
        component: HotelComponent
    },
    {
        path: 'restaurant',
        component: RestaurantComponent
    },
    {
        path: 'client',
        component: ClientComponent
    },
    {
        path: 'tourguide',
        component: TourguideComponent
    },
    {
        path: 'user',
        component: UserComponent
    },
    {
        path: 'file',
        component: FileComponent
    },
] as Routes;

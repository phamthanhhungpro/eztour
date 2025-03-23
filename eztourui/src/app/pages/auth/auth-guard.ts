import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const token = localStorage.getItem('token'); // Get token from storage
    if (token) {
        return true; // Allow access if token exists
    } else {
        router.navigate(['/auth/login']); // Redirect to login page
        return false;
    }
};

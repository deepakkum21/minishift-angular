import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { CustomPreloadingService } from './CustomPreloadingService';

const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'employees',
    // set the preload property to true, using the route data property
    // If you do not want the module to be preloaded set it to false
    data: {
      preload: false
    },
    loadChildren: './Employee/employee.module#EmployeeModule'
  },
  // wild card (**) route should be always at last
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes,
      {
        // For eager lazy module i.e. preloading module
        // preloadingStrategy: PreloadAllModules

        // FOR CUSTOM PRELAODING ALL MODULE
        preloadingStrategy: CustomPreloadingService
      })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }

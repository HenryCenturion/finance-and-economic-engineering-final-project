import { Routes } from '@angular/router';
import {SignInComponent} from './public/components/sign-in/sign-in.component';
import {HomeComponent} from './public/components/home/home.component';
import {PageNotFoundComponent} from './public/components/page-not-found/page-not-found.component';
import {BanksComponent} from './business/components/banks-data/banks/banks.component';
import {HelpSectionComponent} from './business/components/help-section/help-section.component';

export const routes: Routes = [
  {path: '', redirectTo: '/sign-in', pathMatch: 'full'},
  {path: 'sign-in', component: SignInComponent},
  {path: 'home', component: HomeComponent},
  // {path: 'portfolio', component: PortfolioComponent},
  // {path: 'discounted-portfolio', component: ViewDiscountedPortfoliosComponent},
  {path: 'banks', component: BanksComponent},
  // {path: 'portfolio/:id', component: ViewPortfolioDetailComponent},
  // {path: 'portfolio/:portfolioId/add-document', component: AddDocumentFormComponent},
  // {path: 'portfolio/:portfolioId/discount-portfolio', component: DiscountPortfolioSummaryComponent},
  {path: 'help', component: HelpSectionComponent},
  {path: '**', component: PageNotFoundComponent}
];

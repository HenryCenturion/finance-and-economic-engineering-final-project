import {Component, HostListener, OnInit} from '@angular/core';
import {PortfolioService} from '../../../../services/portfolio.service';
import {BankService} from '../../../../services/bank.service';
import {DatePipe, DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-view-discounted-portfolios',
  standalone: true,
  imports: [
    DecimalPipe,
    TranslatePipe,
    NgClass,
    DatePipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './view-discounted-portfolios.component.html',
  styleUrl: './view-discounted-portfolios.component.css'
})
export class ViewDiscountedPortfoliosComponent implements OnInit {
  portfolioId: number | undefined;
  details: any[] = [];
  portfolios: any[] = [];
  documentCounts: { [key: string]: number } = {};
  banks: any[] = [];
  discountDetails: any[] = [];
  isCollapsed: boolean = true;
  collapsedStates: { [key: number]: boolean } = {};
  selectedPortfolio: any | null = null;
  discountData: any = [];
  isBrowser: boolean = typeof window !== 'undefined';
  screenWidth: number = window.innerWidth;

  constructor(private portfolioService: PortfolioService,
              private bankService: BankService) {}

  ngOnInit() {
    if (this.isBrowser) {
      this.screenWidth = window.innerWidth;
    }
    this.loadData();
  }

  // Usar @HostListener solo si estamos en un entorno de navegador
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (this.isBrowser) {
      this.screenWidth = (event.target as Window).innerWidth;
    }
  }
  closeDocuments(): void {
    this.selectedPortfolio = null;
  }

  loadData(): void {
    this.getAllBanks()
      .then(() => this.getAllDiscountedDetails())
      .catch(error => console.error(error));
  }

  getAllDiscountedDetails(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.portfolioService.getAllDiscountedDetails().subscribe(
        data => {
          this.discountData = data;
          this.portfolios = data.reduce((acc, detail) => {
            const portfolioId = detail.documentId.portfolioId.id;
            const portfolioName = detail.documentId.portfolioId.name;
            const portfolioCurrency = detail.documentId.portfolioId.currency;
            const portfolioTCEA = detail.documentId.portfolioId.tcea;
            const documentType = detail.documentId.type;
            const bankName = detail.bankId.name;
            const interestRate = detail.interestRate;
            const interestRateType = detail.interestRateType;
            const interestRateTime = detail.interestRateTime;
            const capitalizationFrequency = detail.capitalizationFrequency;
            const discountDate = detail.discountDate;

            if (!acc[portfolioId]) {
              acc[portfolioId] = {
                portfolioId: portfolioId,
                portfolioName: portfolioName,
                bankName: bankName,
                portfolioCurrency: portfolioCurrency,
                portfolioTCEA: portfolioTCEA,
                documentType: documentType,
                interestRate: interestRate,
                interestRateType: interestRateType,
                interestRateTime: interestRateTime,
                capitalizationFrequency: capitalizationFrequency,
                discountDate: discountDate,
                details: [],
                totalNominalValue: 0,
                totalDiscountValue: 0,
                totalNetValue: 0
              };
              this.collapsedStates[portfolioId] = true;
            }
            acc[portfolioId].details.push(detail);
            acc[portfolioId].totalNominalValue += detail.nominalValue;
            acc[portfolioId].totalDiscountValue += detail.discountValue;
            acc[portfolioId].totalNetValue += detail.netValue;
            return acc;
          }, {});
          this.portfolios = Object.values(this.portfolios);
          console.log(this.portfolios);
          resolve();
        },
        error => reject(error)
      );
    });
  }

  getAllBanks(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.bankService.getAllBanks().subscribe(
        (data: any[]) => {
          this.banks = data;
          resolve();
        },
        error => reject(error)
      );
    });
  }

  toggleCollapse(portfolioId: number): void {
    this.collapsedStates[portfolioId] = !this.collapsedStates[portfolioId];
  }

  selectPortfolio(portfolio: any): void {
    if (this.selectedPortfolio === portfolio) {
      this.selectedPortfolio = null;
    } else {
      this.selectedPortfolio = portfolio;
    }
  }
}


import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, ChartType } from 'chart.js';
import { CategorieService } from 'src/services/categorie.service';
import { CommandeService } from 'src/services/commande.service';
import { ArticleService } from 'src/services/article.service'; // Import the ArticleService
@Component({
  selector: 'll-dashboard-index',
  templateUrl: './dashboard-index.component.html',
  styleUrls: ['./dashboard-index.component.scss']
})
export class DashboardIndexComponent implements OnInit, AfterViewInit {
  commandes: any[] = [];
  processingOrdersCount: number = 0;
  completedOrdersCount: number = 0;
  articlesCount: number = 0; // Store total number of articles
  @ViewChild('doughnutChart') private doughnutChartRef: ElementRef;
  @ViewChild('barChart') private barChartRef: ElementRef;
  @ViewChild('scategoryDoughnutChart') private scategoryDoughnutChartRef: ElementRef;
  private initScategoryDoughnutChart(): void {
    const ctx = this.scategoryDoughnutChartRef.nativeElement.getContext('2d');

    this.scategoryDoughnutChart = new Chart(ctx, {
      type: 'doughnut' as ChartType,
      data: this.scategoryDoughnutChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw;
                const total = context.chart.data.datasets[0].data.reduce((a, b) => (a as number) + (b as number), 0);
                const percentage = Math.round(((value as number) / (total as number)) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  private doughnutChart: Chart;
  private barChart: Chart;
  private scategoryDoughnutChart: Chart; // Declare chart for subcategories

  // Doughnut chart for categories (original)
  doughnutChartData: any = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#F67019', '#00A6B4', '#845EC2'
      ],
      hoverBackgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#F67019', '#00A6B4', '#845EC2'
      ]
    }]
  };
// Separate doughnut chart data for subcategories (Scategories)
scategoryDoughnutChartData: any = {
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#F67019', '#00A6B4', '#845EC2'
    ],
    hoverBackgroundColor: [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#F67019', '#00A6B4', '#845EC2'
    ]
  }]
};

  // Bar chart for monthly orders (new)
  barChartData: any = {
    labels: [],
    datasets: [{
      label: 'Monthly Orders',
      data: [],
      backgroundColor: '#36A2EB',
      borderColor: '#36A2EB',
      borderWidth: 1
    }]
  };

  constructor(
    private categorieService: CategorieService,
    private commandeService: CommandeService,
    private articleService:ArticleService
  ) {}

  ngOnInit(): void {
    this.loadCategories(); // Load original categories data
    this.loadCommandes();  // Load orders data for bar chart
    this.loadArticlesCount(); // Fetch total number of items.l
    this.loadArticlesBySubcategory(); // ✅ Call the new method here

  }
  loadArticlesCount(): void {
    this.articleService.getAllArticles().subscribe((articles) => {
      this.articlesCount = articles.length; // Count the total number of articles
    });
  }
  // Original categories loading for doughnut chart
  loadCategories(): void {
    this.categorieService.getCategories().subscribe((categories) => {
      const labels = categories.map(cat => cat.nomcategorie);
      const data = categories.map(() => Math.floor(Math.random() * 100) + 1); // Dummy values
  
      this.doughnutChartData.labels = labels;
      this.doughnutChartData.datasets[0].data = data;
      this.doughnutChartData.datasets[0].backgroundColor = 
        this.doughnutChartData.datasets[0].backgroundColor.slice(0, labels.length);
      this.doughnutChartData.datasets[0].hoverBackgroundColor = 
        this.doughnutChartData.datasets[0].hoverBackgroundColor.slice(0, labels.length);
  
      if (this.doughnutChart) {
        this.doughnutChart.data = this.doughnutChartData;
        this.doughnutChart.update();
      }
    });
  }

  // Orders loading for bar chart
  loadCommandes(): void {
    this.commandeService.getAllCommandes().subscribe((commandes) => {
      this.commandes = commandes;
  
      // Count ongoing orders (Processing)
      this.processingOrdersCount = commandes.filter(c => 
        c.status.toLowerCase() === 'processing'
      ).length;
  
      // Count completed orders
      this.completedOrdersCount = commandes.filter(c => 
        c.status.toLowerCase() === 'completed'
      ).length;
  
      // Process data for monthly orders bar chart
      this.processMonthlyOrdersData();
    });
  }
  

  processMonthlyOrdersData(): void {
    const monthlyOrders = this.commandes.reduce((acc, commande) => {
      const orderDate = new Date(commande.date_commande);
      const monthYear = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear]++;
      return acc;
    }, {} as Record<string, number>);
    
    const sortedMonths = Object.keys(monthlyOrders).sort();
    const monthLabels = sortedMonths.map(monthYear => {
      const [year, month] = monthYear.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    
    this.barChartData.labels = monthLabels;
    this.barChartData.datasets[0].data = sortedMonths.map(month => monthlyOrders[month]);
    
    if (this.barChart) {
      this.barChart.data = this.barChartData;
      this.barChart.update();
    }
  }
  
  ngAfterViewInit(): void {
    this.initDoughnutChart(); // Initialize original doughnut chart
    this.initBarChart();      // Initialize new bar chart
  }

  private initDoughnutChart(): void {
    const ctx = this.doughnutChartRef.nativeElement.getContext('2d');
    
    this.doughnutChart = new Chart(ctx, {
      type: 'doughnut' as ChartType,
      data: this.doughnutChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw;
                const total = context.chart.data.datasets[0].data.reduce((a, b) => (a as number) + (b as number), 0);
                const percentage = Math.round(((value as number) / (total as number)) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  private initBarChart(): void {
    const ctx = this.barChartRef.nativeElement.getContext('2d');
    
    this.barChart = new Chart(ctx, {
      type: 'bar' as ChartType,
      data: this.barChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }
  loadArticlesBySubcategory(): void {
    this.articleService.getAllArticles().subscribe((articles) => {
      const subcategoryCountMap: {[key: string]: number} = {};
      const subcategoryNamesMap: {[id: number]: string} = {};
      const scategorieIds = new Set<number>();
  
      // Collect all unique subcategory IDs from articles
      articles.forEach(article => {
        if (article.scategorieID) {
          scategorieIds.add(article.scategorieID);
          subcategoryCountMap[article.scategorieID] = (subcategoryCountMap[article.scategorieID] || 0) + 1;
        }
      });
  
      // For each unique scategorieID, fetch its name
      const fetches = Array.from(scategorieIds).map(id =>
        this.categorieService.getScategorieById(id).toPromise().then(scategorie => {
          subcategoryNamesMap[id] = scategorie.nomscategorie;
        })
      );
  
      // Wait for all subcategory names to be fetched
      Promise.all(fetches).then(() => {
        const labels = [];
        const data = [];
  
        for (const id of Object.keys(subcategoryCountMap)) {
          const name = subcategoryNamesMap[+id] || `ID ${id}`;
          labels.push(name);
          data.push(subcategoryCountMap[id]);
        }
  
        this.scategoryDoughnutChartData.labels = labels;
        this.scategoryDoughnutChartData.datasets[0].data = data;
        this.scategoryDoughnutChartData.datasets[0].backgroundColor =
          this.scategoryDoughnutChartData.datasets[0].backgroundColor.slice(0, labels.length);
  
        if (this.scategoryDoughnutChart) {
          this.scategoryDoughnutChart.data = this.scategoryDoughnutChartData;
          this.scategoryDoughnutChart.update();
        } else {
          this.initScategoryDoughnutChart();
        }
      });
    });
  }
  
  
  }
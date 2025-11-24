import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
// IMPORTANTE: Asegúrate de tener este servicio creado o impórtalo desde tu ruta correcta
import { PersonService } from '../../services/person.service'; 

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private personService = inject(PersonService); // Inyectamos el servicio de personas

  products: Product[] = [];
  
  // Diccionario para mapear ID -> Nombre Completo
  // Ejemplo: { "uuid-123": "Juan Perez", "uuid-456": "Maria Gomez" }
  ownerNames: { [key: string]: string } = {}; 

  loading = false;
  error: string | null = null;

  skuFilter = '';
  priceMinFilter: number | null = null;
  priceMaxFilter: number | null = null;
  searchQuery = '';
  ordering = '-created_at';

  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  hasNext = false;
  hasPrevious = false;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = null;

    const params: any = {
      page: this.currentPage,
      page_size: this.pageSize
    };

    if (this.skuFilter) params.sku = this.skuFilter;
    if (this.priceMinFilter !== null) params.price_min = this.priceMinFilter;
    if (this.priceMaxFilter !== null) params.price_max = this.priceMaxFilter;
    if (this.searchQuery) params.q = this.searchQuery;
    if (this.ordering) params.ordering = this.ordering;

    this.productService.getProducts(params).subscribe({
      next: (response) => {
        this.products = response.results;
        this.totalCount = response.count;
        this.hasNext = !!response.next;
        this.hasPrevious = !!response.previous;
        
        // Una vez que tenemos los productos, cargamos los nombres de los dueños
        this.loadOwnerNames();

        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar los productos';
        this.loading = false;
      }
    });
  }

  /**
   * Carga la lista de personas y crea un mapa de IDs a Nombres Completos.
   * Nota: Esto asume que el endpoint de personas trae los dueños necesarios.
   * Si tienes muchas páginas de personas, es posible que necesites lógica adicional
   * en el backend o traer todas las personas (sin paginar) para listas desplegables.
   */
  loadOwnerNames() {
    // Puedes pasar parámetros si necesitas filtrar, aquí traigo la página por defecto
    this.personService.getPersons().subscribe({
      next: (response: any) => {
        if (response.results) {
          response.results.forEach((person: any) => {
            // Llenamos el diccionario: ID => Nombre + Apellido
            this.ownerNames[person.id] = `${person.first_name} ${person.last_name}`;
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar nombres de propietarios', err);
        // No bloqueamos la UI principal si falla esto, solo no se mostrarán los nombres
      }
    });
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadProducts();
  }

  clearFilters() {
    this.skuFilter = '';
    this.priceMinFilter = null;
    this.priceMaxFilter = null;
    this.searchQuery = '';
    this.ordering = '-created_at';
    this.currentPage = 1;
    this.loadProducts();
  }

  changeOrdering(field: string) {
    if (this.ordering === field) {
      this.ordering = `-${field}`;
    } else if (this.ordering === `-${field}`) {
      this.ordering = field;
    } else {
      this.ordering = field;
    }
    this.loadProducts();
  }

  nextPage() {
    if (this.hasNext) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  previousPage() {
    if (this.hasPrevious && this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  deleteProduct(product: Product) {
    if (confirm(`¿Está seguro de eliminar el producto "${product.name}"?`)) {
      this.productService.deleteProduct(product.id!).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          this.error = err.message || 'Error al eliminar el producto';
        }
      });
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}
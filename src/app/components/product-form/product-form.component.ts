import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private personService = inject(PersonService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  productForm!: FormGroup;
  loading = false;
  error: string | null = null;
  isEditMode = false;
  
  // CAMBIO 1: El ID ahora es string | null porque tus IDs son UUIDs
  productId: string | null = null;
  
  persons: Person[] = [];
  loadingPersons = false;

  ngOnInit() {
    this.initForm();
    this.loadPersons();

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.isEditMode = false;
      this.productId = null;
      this.error = null;
      this.productForm.reset();

      // CAMBIO 2: Quitamos !isNaN y el simbolo '+'
      // Solo verificamos si existe el parametro 'id'
      if (params['id']) {
        this.isEditMode = true;
        this.productId = params['id']; // Asignamos el string directamente
        this.loadProduct(this.productId!);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      sku: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      price: [0, [Validators.required, Validators.min(0)]],
      owner: [null]
    });
  }

  loadPersons() {
    this.loadingPersons = true;
    this.personService.getPersons({ page_size: 100 }).subscribe({
      next: (response) => {
        this.persons = response.results;
        this.loadingPersons = false;
      },
      error: (err) => {
        console.error('Error al cargar personas:', err);
        this.loadingPersons = false;
      }
    });
  }

  // CAMBIO 3: La función ahora recibe un string
  loadProduct(id: string) {
    this.loading = true;
    // Asegúrate de que tu productService.getProduct acepte string también
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          sku: product.sku,
          price: product.price,
          owner: product.owner || null
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar el producto';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const productData = { ...this.productForm.value };
    if (productData.owner === null || productData.owner === '') {
      delete productData.owner;
    }

    const operation = this.isEditMode
      ? this.productService.updateProduct(this.productId!, productData)
      : this.productService.createProduct(productData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.error = err.message || 'Error al guardar el producto';
        this.loading = false;
      }
    });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.productForm.get(fieldName);
    if (field?.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) return 'Este campo es requerido';
      if (field.errors?.['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors?.['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors?.['min']) return `El valor mínimo es ${field.errors['min'].min}`;
    }
    return null;
  }
}
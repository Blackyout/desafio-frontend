import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PersonService } from '../../services/person.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private personService = inject(PersonService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  personForm!: FormGroup;
  loading = false;
  error: string | null = null;
  isEditMode = false;
  
  // CAMBIO 1: El ID ahora es string | null (para soportar UUIDs)
  personId: string | null = null;

  ngOnInit() {
    this.initForm();

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.isEditMode = false;
      this.personId = null;
      this.error = null;
      this.personForm.reset();

      // CAMBIO 2: Eliminamos la conversión numérica (+) y la validación isNaN
      if (params['id']) {
        this.isEditMode = true;
        this.personId = params['id']; // Asignamos el UUID directamente
        this.loadPerson(this.personId!);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.personForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      last_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // CAMBIO 3: La función ahora recibe un string
  loadPerson(id: string) {
    this.loading = true;
    this.personService.getPerson(id).subscribe({
      next: (person) => {
        this.personForm.patchValue(person);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar la persona';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const personData = this.personForm.value;

    const operation = this.isEditMode
      ? this.personService.updatePerson(this.personId!, personData)
      : this.personService.createPerson(personData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/persons']);
      },
      error: (err) => {
        this.error = err.message || 'Error al guardar la persona';
        this.loading = false;
      }
    });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.personForm.get(fieldName);
    if (field?.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) return 'Este campo es requerido';
      if (field.errors?.['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors?.['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors?.['email']) return 'Email inválido';
    }
    return null;
  }
}
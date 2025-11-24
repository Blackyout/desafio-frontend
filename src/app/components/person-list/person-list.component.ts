import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {
  private personService = inject(PersonService);

  persons: Person[] = [];
  loading = false;
  error: string | null = null;

  emailFilter = '';
  lastNameFilter = '';
  ordering = '-created_at';

  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  hasNext = false;
  hasPrevious = false;

  ngOnInit() {
    this.loadPersons();
  }

  loadPersons() {
    this.loading = true;
    this.error = null;

    const params: any = {
      page: this.currentPage,
      page_size: this.pageSize
    };

    if (this.emailFilter) params.email = this.emailFilter;
    if (this.lastNameFilter) params.last_name = this.lastNameFilter;
    if (this.ordering) params.ordering = this.ordering;

    this.personService.getPersons(params).subscribe({
      next: (response) => {
        this.persons = response.results;
        this.totalCount = response.count;
        this.hasNext = !!response.next;
        this.hasPrevious = !!response.previous;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar las personas';
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadPersons();
  }

  clearFilters() {
    this.emailFilter = '';
    this.lastNameFilter = '';
    this.ordering = '-created_at';
    this.currentPage = 1;
    this.loadPersons();
  }

  changeOrdering(field: string) {
    if (this.ordering === field) {
      this.ordering = `-${field}`;
    } else if (this.ordering === `-${field}`) {
      this.ordering = field;
    } else {
      this.ordering = field;
    }
    this.loadPersons();
  }

  nextPage() {
    if (this.hasNext) {
      this.currentPage++;
      this.loadPersons();
    }
  }

  previousPage() {
    if (this.hasPrevious && this.currentPage > 1) {
      this.currentPage--;
      this.loadPersons();
    }
  }

  deletePerson(person: Person) {
    if (confirm(`¿Está seguro de eliminar a ${person.first_name} ${person.last_name}?`)) {
      this.personService.deletePerson(person.id!).subscribe({
        next: () => {
          this.loadPersons();
        },
        error: (err) => {
          this.error = err.message || 'Error al eliminar la persona';
        }
      });
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
// SUPPRIME l'interface Department locale et utilise celle du core/entities
import { Department, DepartmentForm } from '../entities/department.model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly API_URL = `${environment.apiUrl}/Depatment`;
  
  private departmentsSubject = new BehaviorSubject<Department[]>([]);
  public departments$ = this.departmentsSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadDepartments();
  }

  private loadDepartments(): void {
    this.loadingSubject.next(true);
    this.http.get<Department[]>(`${this.API_URL}/getAllDepartment`)
      .pipe(catchError(this.handleError))
      .subscribe({
        next: (departments: Department[]) => {
          this.departmentsSubject.next(departments);
          this.loadingSubject.next(false);
        },
        error: (error) => {
          this.loadingSubject.next(false);
          this.handleError(error);
        }
      });
  }

  getAllDepartments(): Observable<Department[]> {
    return this.departments$;
  }

  getDepartment(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.API_URL}/getDepartment/${id}`)
      .pipe(catchError(this.handleError));
  }

  createDepartment(department: DepartmentForm): Observable<Department> {
    this.loadingSubject.next(true);
    return this.http.post<Department>(`${this.API_URL}/createDepartment`, department)
      .pipe(
        tap((newDepartment: Department) => {
          const current = this.departmentsSubject.value;
          this.departmentsSubject.next([...current, newDepartment]);
          this.loadingSubject.next(false);
        }),
        catchError(this.handleError)
      );
  }

  updateDepartment(department: Department): Observable<Department> {
    this.loadingSubject.next(true);
    return this.http.put<Department>(`${this.API_URL}/updateDepartment`, department)
      .pipe(
        tap((updatedDepartment: Department) => {
          const current = this.departmentsSubject.value;
          const updated = current.map(dep => 
            dep.idDepartment === updatedDepartment.idDepartment ? updatedDepartment : dep
          );
          this.departmentsSubject.next(updated);
          this.loadingSubject.next(false);
        }),
        catchError(this.handleError)
      );
  }

  deleteDepartment(id: number): Observable<void> {
    this.loadingSubject.next(true);
    return this.http.delete<void>(`${this.API_URL}/deleteDepartment/${id}`)
      .pipe(
        tap(() => {
          const current = this.departmentsSubject.value;
          const updated = current.filter(dep => dep.idDepartment !== id);
          this.departmentsSubject.next(updated);
          this.loadingSubject.next(false);
        }),
        catchError(this.handleError)
      );
  }

  refresh(): void {
    this.loadDepartments();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Erreur ${error.status}: ${error.message}`;
    }
    
    console.error('DepartmentService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

export { Department };

import { Component, OnInit } from '@angular/core';
import { Department, DepartmentService } from '../core/services/department.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  departments: Department[] = [];
  newDepartment: Department = { name: '', location: '', phone: '', head: '' };
  editMode = false;

  constructor(private depService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.depService.getAllDepartments().subscribe(data => this.departments = data);
  }

  saveDepartment(): void {
    if (this.editMode && this.newDepartment.idDepartment) {
      this.depService.updateDepartment(this.newDepartment).subscribe(() => {
        this.loadDepartments();
        this.resetForm();
      });
    } else {
      this.depService.createDepartment(this.newDepartment).subscribe(() => {
        this.loadDepartments();
        this.resetForm();
      });
    }
  }

  editDepartment(dep: Department): void {
    this.newDepartment = { ...dep };
    this.editMode = true;
  }

  deleteDepartment(id: number): void {
    if (confirm('Supprimer ce département ?')) {
      this.depService.deleteDepartment(id).subscribe(() => this.loadDepartments());
    }
  }

  resetForm(): void {
    this.newDepartment = { name: '', location: '', phone: '', head: '' };
    this.editMode = false;
  }
}

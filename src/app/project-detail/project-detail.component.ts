import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  project!: Project;
  projectForm!: FormGroup;
  statusUpdated: boolean = false;
  canEditStatus: boolean = true;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const uniqueNumber = this.route.snapshot.paramMap.get('id');
    if (uniqueNumber) {
      const foundProject = this.projectService.getProjects().find(p => p.uniqueNumber === uniqueNumber);
      if (foundProject) {
        this.project = foundProject;
        this.setEditability();
        this.initializeForm();
      }
    }
  }

  setEditability() {
    this.canEditStatus = this.project.status !== 'დასრულებული';
  }

  initializeForm() {
    this.projectForm = this.fb.group({
      name: [this.project.name, Validators.required],
      priority: [this.project.priority, Validators.required],
      manager: [this.project.manager, Validators.required],
      initiatorDepartment: [this.project.initiatorDepartment, Validators.required],
      contactPerson: [this.project.contactPerson, Validators.required],
      startDate: [this.project.startDate, Validators.required],
      endDate: [this.project.endDate, Validators.required],
      description: [this.project.description],
      file: [this.project.file],
      teamName: [this.project.teamName, Validators.required],
      members: this.fb.array(this.project.members.map(member => this.createMemberFormGroup(member)), Validators.required),
      status: [this.project.status]
    });
  }

  createMemberFormGroup(member: any): FormGroup {
    return this.fb.group({
      personalId: [member.personalId, Validators.required],
      fullName: [member.fullName, Validators.required],
      phoneNumber: [member.phoneNumber, Validators.required],
      email: [member.email, [Validators.required, Validators.email]],
      role: [member.role, Validators.required]
    });
  }

  get members(): FormArray {
    return this.projectForm.get('members') as FormArray;
  }

  updateStatus(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;

    if (this.canEditStatus) {
      this.project.status = newStatus;
      this.statusUpdated = true;
    }
  }

  saveProjectDetails() {
    if (this.projectForm.valid) {
      const updatedProject = { ...this.project, ...this.projectForm.value, members: this.projectForm.value.members.map((member: any) => ({...member})) };
      if (this.statusUpdated) {
        updatedProject.statusUpdateDate = new Date().toISOString().split('T')[0];
        this.statusUpdated = false;
      }
      this.projectService.updateProject(updatedProject);
      this.project = updatedProject;
      if (this.project.status === 'დასრულებული') {
        this.canEditStatus = false;
        this.projectForm.get('status')?.disable();
      }
      alert('ცვლილებები წარმატებით შენახულია');
    }
  }

  onFileChange(event: any) {
    // ფაილის შეცვლა გამორთულია
  }

  goBack() {
    this.router.navigate(['/projects']);
  }

  isOverdue(project: Project): boolean {
    const endDate = new Date(project.endDate);
    const today = new Date();
    return endDate < today && project.status !== 'დასრულებული';
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}

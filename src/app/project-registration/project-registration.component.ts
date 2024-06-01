import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProjectService } from '../project.service';
import { Project, TeamMember } from '../project.model';

@Component({
  selector: 'app-project-registration',
  templateUrl: './project-registration.component.html',
  styleUrls: ['./project-registration.component.css']
})
export class ProjectRegistrationComponent {
  projectForm: FormGroup;
  successMessage: string = '';
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private projectService: ProjectService) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      priority: ['', Validators.required],
      manager: ['', Validators.required],
      initiatorDepartment: ['', Validators.required],
      contactPerson: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.required],
      file: [null, Validators.required],
      teamName: ['', Validators.required],
      members: this.fb.array([], Validators.required)
    });
  }

  get members(): FormArray {
    return this.projectForm.get('members') as FormArray;
  }

  addMember() {
    const memberForm = this.fb.group({
      personalId: ['', Validators.required],
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
    this.members.push(memberForm);
  }

  removeMember(index: number) {
    this.members.removeAt(index);
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('File selected:', this.selectedFile); // Debugging log for selected file
      this.projectForm.patchValue({
        file: this.selectedFile
      });
    } else {
      this.selectedFile = null;
      console.error('No file selected'); // Log error if no file selected
      this.projectForm.patchValue({
        file: null
      });
    }
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  validateForm() {
    for (const control in this.projectForm.controls) {
      if (this.projectForm.controls[control].invalid) {
        console.error(`Form control ${control} is invalid`);
      }
    }
    if (this.members.length === 0) {
      console.error('No members added');
    }
    if (!this.selectedFile) {
      console.error('No file selected');
    }
  }

  onSubmit() {
    console.log('Form value:', this.projectForm.value); // Log form value
    console.log('Selected file:', this.selectedFile); // Log selected file
    console.log('Members:', this.members.controls); // Log members array

    this.validateForm();

    if (this.projectForm.valid && this.members.length > 0 && this.selectedFile) {
      const members = this.members.controls.map(member => {
        const formGroup = member as FormGroup;
        return {
          personalId: formGroup.get('personalId')?.value,
          fullName: formGroup.get('fullName')?.value,
          phoneNumber: formGroup.get('phoneNumber')?.value,
          email: formGroup.get('email')?.value,
          role: formGroup.get('role')?.value,
        } as TeamMember;
      });

      const project: Project = {
        ...this.projectForm.value,
        status: 'მიმდინარე',
        uniqueNumber: '',
        file: this.selectedFile,
        members: members
      };

      console.log('Project to be added:', project); // Debugging log

      this.projectService.addProject(project);
      this.successMessage = 'პროექტი წარმატებით დარეგისტრირდა!';
      setTimeout(() => this.successMessage = '', 3000);
      this.projectForm.reset();
      this.selectedFile = null; // Clear selected file
      // Clear members array
      while (this.members.length) {
        this.members.removeAt(0);
      }
    } else {
      console.error('Form is invalid or no members added or no file selected'); // Log error if form is invalid or no members added or no file selected
      this.successMessage = 'დარწმუნდით რომ ყველა ველი შეავსეთ სწორად და მიაბით ფაილი';
    }
  }
}

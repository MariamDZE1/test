import { Injectable } from '@angular/core';
import { Project } from './project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [];

  constructor() {}

  getProjects(): Project[] {
    return this.projects;
  }

  addProject(project: Project) {
    project.uniqueNumber = this.generateUniqueNumber();
    project.progress = 0;

    if (project.file) {
      const file = project.file as File;
      project.file = URL.createObjectURL(file);
    }

    this.projects.push(project);
  }

  updateProject(updatedProject: Project) {
    const index = this.projects.findIndex(p => p.uniqueNumber === updatedProject.uniqueNumber);
    if (index !== -1) {
      const currentProject = this.projects[index];
      if (currentProject.status !== updatedProject.status) {
        updatedProject.statusUpdateDate = new Date().toISOString();
      }
      this.projects[index] = updatedProject;
    }
  }

  generateUniqueNumber(): string {
    const year = new Date().getFullYear().toString();
    const projectCount = this.projects.length + 1;
    const formattedNumber = projectCount.toString().padStart(2, '0');
    return `P${year}-${formattedNumber}`;
  }
}

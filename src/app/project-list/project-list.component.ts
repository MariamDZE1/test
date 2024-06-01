import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { Project } from '../project.model';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  searchCriteria: any = {};
  selectedProject: Project | null = null;
  newProgress: number | null = null;

  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit() {
    this.projects = this.projectService.getProjects();
    this.filteredProjects = this.projects;
  }

  searchProjects() {
    this.filteredProjects = this.projects.filter(project => {
      let matches = true;
      if (this.searchCriteria.name && !project.name.toLowerCase().includes(this.searchCriteria.name.toLowerCase())) {
        matches = false;
      }
      if (this.searchCriteria.uniqueNumber && !project.uniqueNumber.includes(this.searchCriteria.uniqueNumber)) {
        matches = false;
      }
      if (this.searchCriteria.status && project.status !== this.searchCriteria.status) {
        matches = false;
      }
      if (this.searchCriteria.startDate && project.startDate !== this.searchCriteria.startDate) {
        matches = false;
      }
      if (this.searchCriteria.endDate && project.endDate !== this.searchCriteria.endDate) {
        matches = false;
      }
      if (this.searchCriteria.manager && !project.manager.toLowerCase().includes(this.searchCriteria.manager.toLowerCase())) {
        matches = false;
      }
      if (this.searchCriteria.teamName && !project.teamName.toLowerCase().includes(this.searchCriteria.teamName.toLowerCase())) {
        matches = false;
      }
      return matches;
    });
  }

  clearSearch() {
    this.searchCriteria = {};
    this.filteredProjects = this.projects;
  }

  sortProjects(field: keyof Project) {
    this.filteredProjects.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      if (aValue === undefined || bValue === undefined) {
        return 0;
      }
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    });
  }

  isOverdue(project: Project): boolean {
    const endDate = new Date(project.endDate);
    const today = new Date();
    return endDate < today && project.status !== 'დასრულებული';
  }

  setProgress(project: Project) {
    if (project.status !== 'დასრულებული') {
      this.selectedProject = project;
    }
  }

  updateProgress() {
    if (this.selectedProject && this.newProgress !== null) {
      this.selectedProject.progress = this.newProgress;
      this.projectService.updateProject(this.selectedProject);
      this.newProgress = null;
      this.selectedProject = null;
    }
  }

  goToProjectDetail(uniqueNumber: string) {
    this.router.navigate(['/projects', uniqueNumber]);
  }
}

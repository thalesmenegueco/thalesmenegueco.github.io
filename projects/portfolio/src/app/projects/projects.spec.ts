import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TOOLS } from '../data/portfolio-content';
import { ProjectsComponent } from './projects';

describe('Projects (the /tools lab index)', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders one card per tool, all linking into the lab', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const hrefs = [...compiled.querySelectorAll('.tool-card')].map((card) =>
      card.getAttribute('href'),
    );

    expect(hrefs).toEqual(TOOLS.map((tool) => tool.href));
  });
});

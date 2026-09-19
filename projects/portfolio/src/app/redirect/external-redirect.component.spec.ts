import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ExternalNavigator } from './external-navigator';
import { ExternalRedirectComponent } from './external-redirect.component';

/**
 * The redirect is the one piece of Phase 4 that can silently do nothing — a
 * wrong `data` key or a guard that never fires would leave a visitor on a dead
 * URL with no error anywhere. These assertions are what make it non-silent.
 *
 * `ExternalNavigator` is spied rather than allowed to run: the real one calls
 * `window.location.replace`, which would navigate the Karma page itself away
 * mid-test.
 */
describe('ExternalRedirectComponent', () => {
  const target = 'https://www.visualab.dev/calculo/teoria';
  const navigatorSpy = jasmine.createSpyObj<ExternalNavigator>('ExternalNavigator', ['go']);

  function build(redirectTo?: string): ComponentFixture<ExternalRedirectComponent> {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: redirectTo ? { redirectTo } : {} } },
        },
        { provide: ExternalNavigator, useValue: navigatorSpy },
      ],
    });

    return TestBed.createComponent(ExternalRedirectComponent);
  }

  beforeEach(() => navigatorSpy.go.calls.reset());

  it("navigates to the route's destination on init", () => {
    const fixture = build(target);
    fixture.detectChanges();

    expect(navigatorSpy.go).toHaveBeenCalledWith(target);
  });

  it('renders the destination as a real link, so a blocked redirect is recoverable', () => {
    const fixture = build(target);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe(target);
  });

  it('stays put when the route carries no destination', () => {
    const fixture = build();
    fixture.detectChanges();

    // Navigating to '' would reload the current page — a redirect loop. The
    // route table is the thing that is wrong in this case, and
    // `app.routes.spec.ts` is where that shows up.
    expect(navigatorSpy.go).not.toHaveBeenCalled();
  });
});

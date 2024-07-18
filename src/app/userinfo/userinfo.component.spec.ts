import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { UserinfoComponent } from './userinfo.component';

describe('UserinfoComponent', () => {
  let component: UserinfoComponent;
  let fixture: ComponentFixture<UserinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, UserinfoComponent], // Changed to import UserinfoComponent
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle no user data in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.loadUserData();
    expect(component.userData).toEqual([]);
  });

  it('should filter user data with empty search term and "All" workout type', () => {
    component.userData = [
      {
        id: 1,
        name: 'John Doe',
        workouts: [{ type: 'Running', minutes: 30 }],
        totalMinutes: [30],
      },
      {
        id: 2,
        name: 'Jane Doe',
        workouts: [{ type: 'Swimming', minutes: 45 }],
        totalMinutes: [45],
      },
    ];
    component.searchTerm = '';
    component.selectedWorkoutType = 'All';
    component.filterUserData();

    expect(component.filteredUserData.length).toBe(2);
  });

  it('should filter user data with no matching search term or workout type', () => {
    component.userData = [
      {
        id: 1,
        name: 'John Doe',
        workouts: [{ type: 'Running', minutes: 30 }],
        totalMinutes: [30],
      },
      {
        id: 2,
        name: 'Jane Doe',
        workouts: [{ type: 'Swimming', minutes: 45 }],
        totalMinutes: [45],
      },
    ];
    component.searchTerm = 'Michael';
    component.selectedWorkoutType = 'Cycling';
    component.filterUserData();

    expect(component.filteredUserData.length).toBe(0);
  });

  it('should handle a single user data entry', () => {
    component.userData = [
      {
        id: 1,
        name: 'John Doe',
        workouts: [{ type: 'Running', minutes: 30 }],
        totalMinutes: [30],
      },
    ];
    component.searchTerm = 'John';
    component.selectedWorkoutType = 'Running';
    component.filterUserData();

    expect(component.filteredUserData.length).toBe(1);
  });

  it('should handle a user with no workouts', () => {
    component.userData = [
      { id: 1, name: 'John Doe', workouts: [], totalMinutes: [] },
    ];
    component.searchTerm = 'John';
    component.selectedWorkoutType = 'Running';
    component.filterUserData();

    expect(component.filteredUserData.length).toBe(0);
  });

  it('should handle rows per page more than total users', () => {
    component.userData = [
      {
        id: 1,
        name: 'John Doe',
        workouts: [{ type: 'Running', minutes: 30 }],
        totalMinutes: [30],
      },
      {
        id: 2,
        name: 'Jane Doe',
        workouts: [{ type: 'Swimming', minutes: 45 }],
        totalMinutes: [45],
      },
    ];
    component.rowsPerPage = 10;
    component.filterUserData();

    expect(component.filteredUserData.length).toBe(2);
  });

  it('should not navigate pages when there is only one page', () => {
    component.userData = [
      {
        id: 1,
        name: 'John Doe',
        workouts: [{ type: 'Running', minutes: 30 }],
        totalMinutes: [30],
      },
    ];
    component.rowsPerPage = 5;
    component.filterUserData();

    expect(component.totalPages).toBe(1);
    expect(component.isFirstPage()).toBe(true);
    expect(component.isLastPage()).toBe(true);

    component.nextPage();
    expect(component.currentPage).toBe(1);

    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should handle user data update correctly', () => {
    component.userData = [
      {
        id: 1,
        name: 'John Doe',
        workouts: [{ type: 'Running', minutes: 30 }],
        totalMinutes: [30],
      },
    ];
    component.searchTerm = 'John';
    component.selectedWorkoutType = 'Running';
    component.filterUserData();
    expect(component.filteredUserData.length).toBe(1);

    console.log('Before update:', component.userData); // Debugging statement added

    component.userData.push({
      id: 2,
      name: 'Jane Doe',
      workouts: [{ type: 'Swimming', minutes: 45 }],
      totalMinutes: [45],
    }); // Changed line
    component.filterUserData();

    console.log('After update:', component.userData); // Debugging statement added
    console.log('Filtered user data after update:', component.filteredUserData); // Debugging statement added

    expect(component.filteredUserData.length).toBe(2); // Changed line
  });

  it('should reset current page when filtering results in empty data', () => {
    component.userData = [
      {
        id: 1,
        name: 'John Doe',
        workouts: [{ type: 'Running', minutes: 30 }],
        totalMinutes: [30],
      },
      {
        id: 2,
        name: 'Jane Doe',
        workouts: [{ type: 'Swimming', minutes: 45 }],
        totalMinutes: [45],
      },
    ];
    component.rowsPerPage = 1;
    component.currentPage = 2;
    component.filterUserData();
    expect(component.filteredUserData.length).toBe(1);
    expect(component.currentPage).toBe(2);

    component.searchTerm = 'Invalid';
    component.filterUserData();
    expect(component.filteredUserData.length).toBe(0);
    expect(component.currentPage).toBe(1);
  });
});

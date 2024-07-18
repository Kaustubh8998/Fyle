import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-userinfo',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, NgClass, RouterLink],
  templateUrl: './userinfo.component.html',
})
export class UserinfoComponent implements OnInit {
  // Properties
  searchTerm: string = ''; // Holds the search term entered by the user
  selectedWorkoutType: string = 'All'; // Holds the selected workout type filter
  userData: any[] = []; // Array to store user data loaded from localStorage
  filteredUserData: any[] = []; // Array to store filtered user data based on search and filters
  rowsPerPage: number = 5; // Number of rows per page for pagination
  currentPage: number = 1; // Current page number
  totalPages: number = 0; // Total number of pages based on filtered data
  pageNumbers: number[] = []; // Array to store page numbers for pagination
  showMessage = true; // Flag to show/hide message if no user data is available

  ngOnInit() {
    this.loadUserData(); // Initialize component by loading user data
    this.filterUserData(); // Filter user data based on initial settings
  }

  // Method to load user data from localStorage
  loadUserData() {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem('userData'); // Retrieve data from localStorage
      if (data) {
        this.userData = JSON.parse(data); // Parse JSON data into userData array
      } else {
        this.showMessage = false; // No data available, hide message
      }
    } else {
      this.showMessage = false; // If localStorage is not supported, hide message
    }
    console.log('Loaded user data:', this.userData); // Log loaded user data to console
  }

  // Method to filter user data based on search term and selected workout type
  filterUserData() {
    const searchTermLower = this.searchTerm.toLowerCase(); // Convert search term to lowercase
    // Filter userData based on search term and selected workout type
    const filtered = this.userData.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTermLower) && // Filter by user name
        (this.selectedWorkoutType === 'All' || // Filter by workout type
          user.workouts.some(
            (workout: any) =>
              workout.type === this.selectedWorkoutType ||
              workout.type2 === this.selectedWorkoutType
          ))
    );

    // Calculate pagination details
    this.totalPages = Math.ceil(filtered.length / this.rowsPerPage); // Calculate total pages
    this.pageNumbers = Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1); // Generate page numbers

    // Slice filtered data based on current page and rows per page
    this.filteredUserData = filtered.slice(
      (this.currentPage - 1) * this.rowsPerPage,
      this.currentPage * this.rowsPerPage
    );

    // Reset current page if no data is found on the current page
    if (this.filteredUserData.length === 0) {
      this.currentPage = 1;
    }

    console.log('Filtered user data:', this.filteredUserData); // Log filtered user data to console
  }

  // Event handler for changing rows per page
  onRowsPerPageChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement; // Typecast event target to HTMLSelectElement
    this.rowsPerPage = parseInt(selectElement.value, 10); // Parse selected value to integer
    this.currentPage = 1; // Reset current page to 1
    this.filterUserData(); // Re-filter user data based on new rows per page
  }

  // Event handler for changing workout type filter
  onWorkoutTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement; // Typecast event target to HTMLSelectElement
    this.selectedWorkoutType = selectElement.value; // Update selected workout type
    this.currentPage = 1; // Reset current page to 1
    this.filterUserData(); // Re-filter user data based on new workout type
  }

  // Method to navigate to previous page
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--; // Decrement current page number
      this.filterUserData(); // Re-filter user data for previous page
    }
  }

  // Method to navigate to next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++; // Increment current page number
      this.filterUserData(); // Re-filter user data for next page
    }
  }

  // Method to navigate to a specific page
  goToPage(page: number) {
    this.currentPage = page; // Set current page to specified page number
    this.filterUserData(); // Re-filter user data for specified page
  }

  // Check if current page is the first page
  isFirstPage(): boolean {
    return this.currentPage === 1; // Return true if current page is 1, else false
  }

  // Check if current page is the last page
  isLastPage(): boolean {
    return this.currentPage === this.totalPages; // Return true if current page is last page, else false
  }
}

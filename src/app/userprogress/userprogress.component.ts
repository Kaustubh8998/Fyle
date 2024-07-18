import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-userprogress',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './userprogress.component.html',
})
export class UserprogressComponent implements OnInit, AfterViewInit {
  userData: any = []; // Array to store user data from localStorage
  chart: Chart | null = null; // Variable to hold the Chart.js instance
  selectedUser: any = null; // Variable to store currently selected user
  showMessage = true; // Flag to control message visibility

  ngOnInit() {
    this.loadUserData(); // Load user data when component initializes
  }

  ngAfterViewInit() {
    if (this.userData.length > 0) {
      this.selectedUser = this.userData[0]; // Set the selected user to the first user in userData array
      this.renderChart(this.selectedUser); // Render chart for the selected user
    } else {
      this.showMessage = false; // Hide message if no user data is available
    }
  }

  // Method to load user data from localStorage
  loadUserData() {
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem('userData');
      if (data) {
        this.userData = JSON.parse(data); // Parse stored data into userData array
      }
    }

    if (this.userData.length === 0) {
      this.showMessage = false; // Hide message if no user data is available
    }
  }

  // Method to render the Chart.js chart for a given user
  renderChart(user: any) {
    if (this.chart) {
      this.chart.destroy(); // Destroy existing chart if it exists
    }

    const canvas = document.getElementById('userChart') as HTMLCanvasElement; // Get the canvas element
    const ctx = canvas?.getContext('2d'); // Get 2D context of the canvas

    if (!ctx) {
      console.error('Could not get context'); // Log an error if context cannot be obtained
      return;
    }

    const datasets: any[] = []; // Array to hold datasets for the chart
    const labelsSet = new Set<string>(); // Set to hold unique labels (workout types)

    // Iterate through user's workouts to create datasets for the chart
    user.workouts.forEach((workout: any, index: number) => {
      // Create dataset for each workout entry
      datasets.push({
        label: workout.type,
        data: [workout.minutes], // Data array for workout minutes
        backgroundColor: '#ff336680', // Background color for the dataset bars
        borderColor: '#ff336690', // Border color for the dataset bars
        borderWidth: 1,
        barThickness: 40,
        barPercentage: 0.5,
        categoryPercentage: 0.5,
        order: index * 2, // Order index to control bar stacking
      });

      labelsSet.add(workout.type); // Add workout type to labelsSet

      // Check if there is a second workout type and minutes defined
      if (workout.type2 && workout.minutes2 !== undefined) {
        datasets.push({
          label: workout.type2,
          data: [workout.minutes2],
          backgroundColor: '#ff336620',
          borderColor: '#ff336680',
          borderWidth: 1,
          barThickness: 40,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          order: index * 2 + 1,
        });

        labelsSet.add(workout.type2); // Add second workout type to labelsSet
      }
    });

    const labels = Array.from(labelsSet); // Convert labelsSet to array

    // Create new Chart.js instance
    this.chart = new Chart(ctx, {
      type: 'bar', // Chart type
      data: {
        labels: labels, // Labels for x-axis
        datasets: datasets, // Datasets for chart bars
      },
      options: {
        plugins: {
          legend: {
            display: false, // Hide legend
          },
        },
        scales: {
          y: {
            beginAtZero: true, // Start y-axis from zero
            ticks: {
              callback: function (value: any) {
                if (value === 0) {
                  return 0; // Return 0 if value is 0
                } else {
                  return value; // Return value as is
                }
              },
            },
            title: {
              display: true,
              text: 'Minutes', // Y-axis title
            },
          },
          x: {
            ticks: {
              stepSize: 0, // Step size for x-axis ticks
            },
          },
        },
      },
    });
  }

  // Method to handle user click event and render chart for selected user
  onUserClick(user: any) {
    this.renderChart(user); // Render chart for selected user
    this.selectedUser = user; // Set selectedUser to clicked user
  }
}

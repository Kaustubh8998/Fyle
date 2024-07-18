import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';

@Component({
  selector: 'app-userinput',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, CommonModule],
  templateUrl: './userinput.component.html',
})
export class UserinputComponent implements OnInit {
  workoutForm: FormGroup; // Form group for capturing user input for workouts
  userData: any[] = []; // Array to store user data from localStorage
  showAddMoreButton: boolean = true; // Flag to control visibility of 'Add More' button

  constructor(private fb: FormBuilder) {
    // Initialize the form structure using FormBuilder
    this.workoutForm = this.fb.group({
      name: ['', Validators.required], // Name field with required validator
      workoutType: ['Swimming', Validators.required], // Default workout type with required validator
      minutes: ['', [Validators.required, Validators.min(1)]], // Minutes field with required and minimum value validator
      workoutType2: ['Swimming'], // Second workout type (optional)
      minutes2: ['', [Validators.min(1)]], // Second workout minutes (optional) with minimum value validator
    });
  }

  // Getter for accessing the FormArray inside workoutForm
  get workoutControls(): FormArray {
    return this.workoutForm.get('workouts') as FormArray;
  }

  ngOnInit(): void {
    // Load user data from localStorage when component initializes
    if (typeof localStorage !== 'undefined') {
      const data = localStorage.getItem('userData');
      if (data) {
        this.userData = JSON.parse(data); // Parse stored data into userData array
      }
    }
  }

  // Method to handle adding another workout section
  addWorkoutSection() {
    this.showAddMoreButton = false; // Hide the 'Add More' button
  }

  // Method to handle form submission and adding user workout data
  addWorkout(): void {
    const name = this.workoutForm.get('name')?.value; // Retrieve name input value
    const workoutType = this.workoutForm.get('workoutType')?.value; // Retrieve workoutType input value
    const minutes = this.workoutForm.get('minutes')?.value; // Retrieve minutes input value
    const workoutType2 = this.workoutForm.get('workoutType2')?.value; // Retrieve workoutType2 input value
    const minutes2 = this.workoutForm.get('minutes2')?.value; // Retrieve minutes2 input value

    // Check conditions based on whether 'Add More' button is shown or not
    if (this.showAddMoreButton && name && workoutType && minutes) {
      // Create new workout object with one workout entry
      const newWorkout = {
        id: this.userData.length + 1,
        name,
        workouts: [{ type: workoutType, minutes }],
        totalMinutes: [minutes],
      };
      this.userData.push(newWorkout); // Push new workout data to userData array
      this.saveUserData(); // Save updated userData to localStorage
      window.alert(
        'Form submitted Successfully ! Go to "Users Workout Info" tab for more details'
      );
      this.workoutForm.reset(); // Reset the form after successful submission
    } else if (
      !this.showAddMoreButton &&
      name &&
      workoutType &&
      minutes &&
      workoutType2 &&
      minutes2
    ) {
      // Create new workout object with two workout entries
      const newWorkout = {
        id: this.userData.length + 1,
        name,
        workouts: [
          { type: workoutType, minutes },
          { type2: workoutType2, minutes2 },
        ],
        totalMinutes: [minutes + minutes2],
      };
      this.userData.push(newWorkout); // Push new workout data to userData array
      this.saveUserData(); // Save updated userData to localStorage
      window.alert(
        'Form submitted Successfully ! Go to "Users Workout Info" tab for more details'
      );
      this.workoutForm.reset(); // Reset the form after successful submission
    } else {
      window.alert('Form submission failed. Please check your inputs.'); // Alert if form submission fails
    }
  }

  // Private method to save userData to localStorage
  private saveUserData(): void {
    localStorage.setItem('userData', JSON.stringify(this.userData)); // Store userData as string in localStorage
  }
}

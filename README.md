The UserinfoComponent has been thoroughly tested to ensure functionality and reliability. Below is a summary of the test cases and outcomes:

Test Cases
Component Creation

Verified successful component creation.
Handling No User Data

Correctly initializes with an empty array when localStorage is empty.
Filtering User Data

Tested with empty search term and "All" workout types.
Verified behavior with no matching search term or workout type.
Confirmed filtering with a single user entry.
Checked handling of users with no workouts.
Pagination and Navigation

Ensured proper handling of rows per page more than total users.
Verified single-page navigation behavior.
Confirmed page reset when filtering results in empty data.
User Data Updates

Tested dynamic updates to user data.
Outcomes
All test cases passed, demonstrating robustness in user data management, filtering, and pagination.

Debugging
Included debugging statements verified internal component state during updates, ensuring accurate filtering and data handling.

# User Story for BilboMD

[ ] Replace current BilboMD app running on stomp
[x] Add a public facing page with basic info about BilboMD
[ ] Provide Information about preparing input files
[ ] Users can edit their Account details.
[ ] Users can delete their own account.
[x] Allow users to sign up for an account with email and username
[x] Verify accounts via emails
[x] Users log in by obtaining a MagickLink OTP
[x] Provide a welcome page after login
[x] Provide easy navigation
[ ] Display current user's username and assigned role
[x] Provide ability to logout
[x] Require users to login at least once per week
[ ] Provide a way to remove user access asap if needed
[x] BilboMD Jobs are created by Users and belong to them
[x] BilboMD Jobs have a ticket/job #, title, run parameters, created & updated dates
[x] BilboMD Jobs are either SUBMITTED, PENDING, RUNNING, or COMPLETED
[x] Users can be Users, Managers, or Admins
[ ] BilboMD Jobs can only be deleted by Owners, or Admins
[x] Users can only view and edit their own BilboMD Jobs
[x] Managers and Admins can view, edit, and delete all BilboMD Jobs
[x] Only Managers and Admins can access User Settings
[ ] Users can download BilboMD results
[ ] Jobs are added to a queue using BullMQ
[ ] Email is sent to User when Job is complete or produces an error

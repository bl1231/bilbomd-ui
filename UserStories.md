# User Story for BilboMD

1.  [ ] Replace current BilboMD app running on stomp
2.  [x] Add a public facing page with basic info about BilboMD
3.  [x] Allow users to sign up for an account with email and username
4.  [x] Verify accounts via emails
5.  [x] Users log in by obtaining a MagickLink OTP
6.  [x] Provide a welcome page after login
7.  [x] Provide easy navigation
8.  [ ] Display current user's username and assigned role
9.  [x] Provide ability to logout
10. [x] Require users to login at least once per week
11. [ ] Provide a way to remove user access asap if needed
12. [x] BilboMD Jobs are created by Users and belong to them
13. [x] BilboMD Jobs have a ticket/job #, title, run parameters, created & updated dates
14. [x] BilboMD Jobs are either SUBMITTED, PENDING, RUNNING, or COMPLETED
15. [x] Users can be Users, Managers, or Admins
16. [ ] BilboMD Jobs can only be deleted by Owners, or Admins
17. [x] Users can only view and edit their own BilboMD Jobs
18. [x] Managers and Admins can view, edit, and delete all BilboMD Jobs
19. [x] Only Managers and Admins can access User Settings
20. [ ] Users can download BilboMD results
21. [ ] Jobs are added to a queue using BullMQ
22. [ ] Email is sent to User when Job is complete or produces an error

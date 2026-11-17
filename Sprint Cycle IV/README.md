
# Sprint Cycle IV — Sign-in, authorization, and retrieval 
Scrum Master: Leeyand Blot 
This folder is the working application. It is the site from `Website implementation sprint cycle`, with this sprint's retrievals reading the MySQL database from Sprint Cycle III. 
Accounts are created in the application, then used to sign in. Apply creates a Creator, Creative Mentor, or Talent Scout application. An administrator approves it, and that approval saves the role account in MySQL. Moderator and administrator accounts are created with the terminal scripts below, and those accounts are saved in MySQL as well. The names already stored in the database are sample pieces, reports, and account rows from Sprint Cycle III. They are what the searches return. They are not the sign-in instructions. 
Repository: https://github.com/Jvmes3/Xpression_ISProject.git 
Presentation: Tuesday, November 17, 2026 
## 1. Database 
The database `xpression` must already exist. From `Sprint Cycle III`, run `sql/01-schema.sql` and then `sql/02-sample-data.sql` if you need a clean copy. 
Then, from this folder, add passwords: 
From PowerShell, in this folder: 
```text 
cmd /c '"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe" -u root --default-character-set=utf8mb4 < sql\01-auth.sql' 
cmd /c '"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe" -u root --default-character-set=utf8mb4 < sql\02-comments.sql' 
cmd /c '"C:\Program Files\MySQL\MySQL Server 9.5\bin\mysql.exe" -u root --default-character-set=utf8mb4 < sql\03-unsent-thread.sql' 
``` 
If `root` has a password, add `-p` after `-u root`. 
`sql/01-auth.sql` adds `password_hash` to `account`. Re-run it after any recreate of the Cycle III database. New accounts created in the application write their own password hash. `sql/02-comments.sql` lets a comment sit under another comment. `sql/03-unsent-thread.sql` adds like and dislike counts and the Unsent letter comments. Re-run those two after any recreate as well. 
## 2. Application 
```text 
copy .env.example .env.local 
npm.cmd install 
npm.cmd run dev 
``` 
Open the address printed as `Local:`. It is usually http://localhost:3000. 
`DATABASE_URL` in `.env.local` must point at the MySQL database. The example is 
`mysql://root@localhost:3306/xpression`. 
## 3. Create an account, then sign in 
Creator, Creative Mentor, and Talent Scout start at Apply. They choose an email and password, finish the
application, and an administrator approves it. The approval creates the role login. Sign in with that login. Moderator and administrator accounts: 
```text 
npm.cmd run create-moderator 
npm.cmd run create-administrator 
``` 
The script asks for a first name, a last name, an email, a password, and a background. Sign in with that email and password. 
A wrong password is rejected. A role page opened by a different role asks for the correct account. ## 4. What each role can open 
| Role | Working screen | Database | 
| --- | --- | --- | 
| Administrator | Accounts on the administrator desk | `account` | 
| Creator | Community feed | `creative_work` | 
| Creative Mentor | Discover work on the mentor desk | `creative_work` | 
| Talent Scout | Search creators, then a portfolio | `account`, `creative_work` | 
| Community Moderator | Reported creative work | `reported_work` | 
The other sections stay on the same desks and still say they are not completed in this sprint. ## 5. Presentation order 
The spoken order is `Presentation/Sprint Cycle IV Presentation.md`. The demonstration is the running application. 

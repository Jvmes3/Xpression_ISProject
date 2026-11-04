# Executed PostgreSQL evidence

Executed locally on November 3, 2026 using **PostgreSQL 16.2**. The database is `xpression`, schema `xpression`, in this sprint’s isolated local cluster. All sample people and content are fictional fixtures.

| File | Executed operation and result |
| --- | --- |
| `setup.txt` | Atomic schema and sample-data installation succeeded: 30 tables, 3 views, constraints, indexes and workflow triggers. |
| `queries.txt` | All nine prepared retrieve/search and relationship queries executed successfully. |
| `demo.txt` | Publish/edit work, opportunity invitation/acceptance, and reported-work moderation executed successfully. Each segment rolled back. |
| `verification.txt` | **83 checks passed.** Every table contains sample data; expected invalid operations were rejected; valid workflows succeeded. Test writes rolled back. |
| `instructor_queries.txt` | Seven additional query examples executed successfully, including grouping, left joins, anti-joins and live foreign-key introspection. |
| `presentation_sample_data.txt` | Five read-only pgAdmin-compatible queries executed successfully: accounts without password hashes, works with creators, opportunities with scouts, invitations, and review requests. |

The seed contains **105 rows across all 30 tables**, including 10 accounts spanning all five roles, 7 creative works, 6 role applications, 4 invitations and 3 automatically opened moderation cases. The data dictionary and diagram are based on the live schema: 231 columns, 54 foreign keys, 180 catalog constraints and 14 user-defined triggers.

Reproduce these results using the commands in the sprint README. These are execution records, not evidence of team meetings, individual GitHub contributions or a remote push. The Windows setup instructions are documented but have not been executed on a Windows machine.

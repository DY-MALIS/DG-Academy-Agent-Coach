# Security Specification: DG Academy AI Coach

## Data Invariants
1. A user can only access their own profile and private chat history.
2. Lessons and Courses are publicly readable but only admin can write.
3. User progress is private to the user.
4. Problem reports are private to the user.
5. All IDs must be valid (max 128 chars, alphanumeric).
6. Admin role is verified against the `users` collection.

## The Dirty Dozen Payloads (Target: Rejection)
1. Write to `users/attacker-uid` with `role: 'admin'`. (Identity Spoofing)
2. Read `chat_history/some-other-user-uid`. (Privacy Leak)
3. Write a `course` with a 10MB description string. (Resource Exhaustion)
4. Update `user_progress` and change `userId` to someone else. (Relational Sync Gap)
5. Create a `lesson` without a valid `courseId`. (Orphaned Record)
6. Delete a `course` as a student. (Privilege Escalation)
7. Inject a script into a `prompt` content field. (XSS/Payload Injection - Schema Validation should block large/weird strings)
8. Update `createdAt` timestamp. (Immutability violation)
9. List all `problem_reports` without a userId filter. (Query Scraping)
10. Create a `chat_history` with an empty message array. (Schema Violation)
11. Set a document ID to `../../../etc/passwd`. (Path Poisoning)
12. Update a `course` category to an invalid value. (Enum Violation)

## Test Runner (Logic Concept)
The `firestore.rules` will be validated against these scenarios.

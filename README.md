# Knowledge Repository

Descentralized, community driven alternative to Wikipedia. Implemented in
Blockchain, IPFS, and Freenet.

## Ecosystem interface
To implement the logic to connect, view and edit the repository in a specific
ecosystem, a class with these functions should be implemented:

### Fetch an article
```typescript
function fetchArticle(name: string): string | null;
```
Fetches an article given it's name, or null if the article doesn't exist.

### Add an article
```typescript
function addArticle(name: string, content: string): boolean;
```
Adds article to repository, returns true if it was successful, false otherwise.
An article name must be unique.

### Edit an article
```typescript
function editArticle(name: string, changes: string[]): boolean;
```
Edits an article in a git style, where only the changes are passed to the
method.
TODO: standarize change declaration.

### View history of an article
```typescript
function viewHistory(name: string): string[][];
```
Returns all the changes done to an article.


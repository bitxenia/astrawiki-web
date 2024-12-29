# Knowledge Repository

Descentralized, community driven alternative to Wikipedia. Implemented in
Blockchain, IPFS, and Freenet.

## Ecosystem interface

To implement the logic to connect, view and edit the repository in a specific
ecosystem, a class with these functions should be implemented:

### Article object

```typescript
class Article {
  name: string,
  changelog: Change[],
}
```

### Fetch an article

```typescript
function fetchArticle(name: string): Promise<Article | null>;
```

Fetches an article given it's name, or null if the article doesn't exist.

### Create an article

```typescript
function addArticle(name: string): Promise<boolean>;
```

Adds empty article to repository, returns true if it was successful, false otherwise.
An article name must be unique.

### Edit an article

```typescript
function editArticle(name: string, change: Change): Promise<boolean>;
```

Edits an article in a git style, where only the changes are passed to the
method.
TODO: standarize change declaration.

## Ethereum Ecosystem

There is a directory with the solidity contracts used for this ecosystem. It needs to be provided with a Sepolia API key in the `.env` file (see `.env.example`).

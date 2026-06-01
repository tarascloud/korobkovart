-- CreateIndex: index on ArtworkCollection.collectionId
-- Rationale: composite PK (artworkId, collectionId) covers only the leading
-- column. Queries filtering by collectionId alone (gallery listing per
-- collection, ON DELETE CASCADE from Collection) need this index to avoid
-- a sequential scan.
CREATE INDEX IF NOT EXISTS "ArtworkCollection_collectionId_idx"
  ON "ArtworkCollection"("collectionId");

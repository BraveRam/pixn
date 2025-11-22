-- Fix for match_embeddings function
-- The previous version likely returned a UUID or queried the wrong table.
-- This version queries the 'embeddings' table and returns the 'id' as text (which matches the image path).

create or replace function match_embeddings (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    embeddings.id as id,
    1 - (embeddings.embedding <=> query_embedding) as similarity
  from embeddings
  where 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  order by embeddings.embedding <=> query_embedding
  limit match_count;
end;
$$;

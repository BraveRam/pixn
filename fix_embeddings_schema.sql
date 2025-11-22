-- Add user_id and path columns to embeddings table
alter table embeddings add column if not exists user_id uuid references auth.users(id);
alter table embeddings add column if not exists path text;

-- Update match_embeddings function to return path instead of id (UUID)
-- Added filter_user_id parameter to restrict search to a specific user
create or replace function match_embeddings (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_user_id uuid
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
    embeddings.path as id,
    1 - (embeddings.embedding <=> query_embedding) as similarity
  from embeddings
  where 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  and embeddings.user_id = filter_user_id
  order by embeddings.embedding <=> query_embedding
  limit match_count;
end;
$$;

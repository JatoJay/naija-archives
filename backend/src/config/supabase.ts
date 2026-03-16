import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && (supabaseServiceKey || supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey!, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

export const isSupabaseEnabled = (): boolean => !!supabase;

export async function getSupabaseStorageUrl(bucket: string, path: string): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadToSupabaseStorage(
  bucket: string,
  path: string,
  file: Buffer,
  contentType: string
): Promise<string> {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const { error } = await supabaseAdmin.storage.from(bucket).upload(path, file, {
    contentType,
    upsert: true,
  });

  if (error) {
    throw new Error(`Failed to upload to Supabase Storage: ${error.message}`);
  }

  return getSupabaseStorageUrl(bucket, path);
}

export async function deleteFromSupabaseStorage(bucket: string, paths: string[]): Promise<void> {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const { error } = await supabaseAdmin.storage.from(bucket).remove(paths);

  if (error) {
    throw new Error(`Failed to delete from Supabase Storage: ${error.message}`);
  }
}

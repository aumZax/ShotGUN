import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qouaquzfcedgzytuhlsn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6PdXTbSl8bUuUEVcWGfnQQ_03TRFMMx';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
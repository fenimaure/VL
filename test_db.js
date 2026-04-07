import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
    const { data } = await supabase.from('about_content').select('*').in('section_key', ['story', 'manifesto', 'split_narrative']);
    console.log(JSON.stringify(data, null, 2));
}
run();

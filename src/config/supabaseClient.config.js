import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://utsikfcqsmcbwkfdyctm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0c2lrZmNxc21jYndrZmR5Y3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjUyNzksImV4cCI6MjA5MDEwMTI3OX0.JdtDfym0MN3uWxiyS32jllGWfO0MYuDUPRJanm4QeS8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
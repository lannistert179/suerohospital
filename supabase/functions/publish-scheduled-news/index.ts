import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Create a client with the anon key first for auth verification
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey)
    
    // Verify authentication
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      console.log('[publish-scheduled-news] Unauthorized: No authorization header')
      return new Response(
        JSON.stringify({ error: 'Unauthorized: No authorization header provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token)
    
    if (authError || !user) {
      console.log('[publish-scheduled-news] Unauthorized: Invalid token', authError?.message)
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use service role client for role check and database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Verify admin role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()
    
    if (roleError) {
      console.error('[publish-scheduled-news] Error checking admin role:', roleError)
      return new Response(
        JSON.stringify({ error: 'Error verifying permissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!roleData) {
      console.log(`[publish-scheduled-news] Forbidden: User ${user.id} is not an admin`)
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    const now = new Date().toISOString()
    
    console.log(`[publish-scheduled-news] Admin ${user.email} checking for scheduled articles at ${now}`)
    
    // Find articles that are scheduled (not published but have a published_at in the past)
    const { data: scheduledArticles, error: fetchError } = await supabase
      .from('news')
      .select('id, title, published_at')
      .eq('is_published', false)
      .not('published_at', 'is', null)
      .lte('published_at', now)
    
    if (fetchError) {
      console.error('[publish-scheduled-news] Error fetching scheduled articles:', fetchError)
      throw fetchError
    }
    
    if (!scheduledArticles || scheduledArticles.length === 0) {
      console.log('[publish-scheduled-news] No articles to publish')
      return new Response(
        JSON.stringify({ message: 'No articles to publish', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    console.log(`[publish-scheduled-news] Found ${scheduledArticles.length} articles to publish`)
    
    // Publish each scheduled article
    const articleIds = scheduledArticles.map(a => a.id)
    const { error: updateError } = await supabase
      .from('news')
      .update({ is_published: true })
      .in('id', articleIds)
    
    if (updateError) {
      console.error('[publish-scheduled-news] Error publishing articles:', updateError)
      throw updateError
    }
    
    // Log to audit_logs table
    for (const article of scheduledArticles) {
      console.log(`[publish-scheduled-news] Published: "${article.title}" (scheduled for ${article.published_at})`)
      
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        user_email: user.email,
        action: 'publish_scheduled',
        entity_type: 'news',
        entity_id: article.id,
        entity_name: article.title,
        details: { scheduled_for: article.published_at, triggered_by: 'edge_function' }
      })
    }
    
    return new Response(
      JSON.stringify({ 
        message: 'Articles published successfully', 
        count: scheduledArticles.length,
        articles: scheduledArticles.map(a => a.title)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[publish-scheduled-news] Error:', errorMessage)
    return new Response(
      JSON.stringify({ error: 'An internal error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

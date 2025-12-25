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
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const now = new Date().toISOString()
    
    console.log(`[publish-scheduled-news] Checking for scheduled articles at ${now}`)
    
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
    
    // Log what was published
    for (const article of scheduledArticles) {
      console.log(`[publish-scheduled-news] Published: "${article.title}" (scheduled for ${article.published_at})`)
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
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
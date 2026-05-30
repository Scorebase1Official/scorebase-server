const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(cors())

const supabase = createClient(
  'https://hgdbcbbqipvkfcwvxxxd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnZGJjYmJxaXB2a2Zjd3Z4eHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MjQ0OTksImV4cCI6MjA5NTQwMDQ5OX0.xI49jBDosqyo2K8Hp3lwW4cDCg3aoMBNrSxE97shgGE'
)

const SPORT_MAP = {
  nfl:'football', cfb:'football', nba:'basketball', ncaab:'basketball',
  mlb:'baseball', nhl:'hockey', soccer:'soccer', rugby:'rugby',
  tennis:'tennis', golf:'golf', f1:'f1', ski_fis:'skiing',
  freeride:'freeride', xgames:'xgames'
}

app.get('/search', async (req, res) => {
  const { sport, competition, athlete, decade, year } = req.query
  try {
    let query = supabase.from('matches').select('*').order('date', { ascending: false }).limit(6)
    if(sport) query = query.eq('sport', SPORT_MAP[sport] || sport)
    if(competition) query = query.ilike('competition', '%' + competition + '%')
    if(year) query = query.gte('date', year + '-01-01').lte('date', year + '-12-31')
    else if(decade) {
      const sy = decade.slice(0,4)
      query = query.gte('date', sy + '-01-01').lte('date', (parseInt(sy)+9) + '-12-31')
    }
    if(athlete) query = query.or('home_team.ilike.%' + athlete + '%,away_team.ilike.%' + athlete + '%')
    const { data, error } = await query
    if(error) return res.json({ results: [] })
    res.json({ results: data || [] })
  } catch(e) {
    res.json({ results: [] })
  }
})

app.listen(3001, () => console.log('ScoreBase server running on port 3001!'))

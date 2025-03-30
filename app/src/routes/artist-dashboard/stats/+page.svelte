<script lang="ts">
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import { Button } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "$lib/components/ui/select";
  
  // Placeholder data
  let topTracks = $state([
    { title: "Track Title 1", plays: 5243, change: "+12%", duration: "3:45" },
    { title: "Another Great Song", plays: 4125, change: "+8%", duration: "4:12" },
    { title: "My Best Track", plays: 3967, change: "-3%", duration: "2:58" },
    { title: "Popular Song", plays: 2845, change: "+23%", duration: "3:24" },
    { title: "Awesome Track", plays: 2356, change: "+5%", duration: "4:01" },
  ]);
  
  let geoData = $state([
    { country: "United States", listeners: 4256, percentage: 42 },
    { country: "United Kingdom", listeners: 1843, percentage: 18 },
    { country: "Germany", listeners: 954, percentage: 9 },
    { country: "Canada", listeners: 724, percentage: 7 },
    { country: "Australia", listeners: 524, percentage: 5 },
    { country: "Other", listeners: 1923, percentage: 19 },
  ]);
  
  let timeFrame = $state('30days');
  let selectedMetric = $state('plays');
</script>

<div class="space-y-6">
  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Stats & Analytics</h1>
      <p class="text-muted-foreground">Track your music performance metrics</p>
    </div>
    
    <div class="flex flex-col sm:flex-row gap-2">
      <Select value={timeFrame} onValueChange={(value) => timeFrame = value}>
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Select timeframe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7days">Last 7 days</SelectItem>
          <SelectItem value="30days">Last 30 days</SelectItem>
          <SelectItem value="90days">Last 90 days</SelectItem>
          <SelectItem value="year">Last year</SelectItem>
          <SelectItem value="alltime">All time</SelectItem>
        </SelectContent>
      </Select>
      
      <Button variant="outline">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="16" x2="16" y1="8" y2="16"/><line x1="8" x2="8" y1="8" y2="16"/></svg>
        Download CSV
      </Button>
    </div>
  </div>
  
  <Tabs defaultValue="overview" class="space-y-4">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="plays">Plays</TabsTrigger>
      <TabsTrigger value="audience">Audience</TabsTrigger>
      <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
    </TabsList>
    
    <TabsContent value="overview" class="space-y-4">
      <!-- Overview Stats Cards -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Total Plays</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">24,689</div>
            <p class="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Unique Listeners</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">10,224</div>
            <p class="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Avg. Completion</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">84%</div>
            <p class="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">New Followers</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">312</div>
            <p class="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <!-- Charts -->
      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plays Over Time</CardTitle>
            <CardDescription>Daily play count for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="h-[300px] bg-muted rounded-md flex items-center justify-center">
              <p class="text-muted-foreground">Line chart visualization will appear here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Tracks</CardTitle>
            <CardDescription>Your most played tracks</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              {#each topTracks as track, i}
                <div class="flex items-center justify-between pb-2 {i < topTracks.length - 1 ? 'border-b' : ''}">
                  <div class="flex gap-2 items-center">
                    <div class="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      {i + 1}
                    </div>
                    <div>
                      <p class="text-sm font-medium">{track.title}</p>
                      <p class="text-xs text-muted-foreground">{track.duration}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium">{track.plays.toLocaleString()}</p>
                    <p class="text-xs {track.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}">{track.change}</p>
                  </div>
                </div>
              {/each}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" class="w-full">View All Tracks</Button>
          </CardFooter>
        </Card>
      </div>
      
      <!-- Geographic Distribution -->
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>Where your listeners are located</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="h-[300px] bg-muted rounded-md flex items-center justify-center">
              <p class="text-muted-foreground">Map visualization will appear here</p>
            </div>
            
            <div>
              <div class="space-y-3">
                {#each geoData as geo}
                  <div class="space-y-1">
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium">{geo.country}</span>
                      <span class="text-sm text-muted-foreground">{geo.listeners.toLocaleString()} listeners</span>
                    </div>
                    <div class="h-2 bg-muted rounded overflow-hidden">
                      <div class="h-full bg-primary" style="width: {geo.percentage}%"></div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
    
    <TabsContent value="plays" class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Playback Analytics</CardTitle>
          <CardDescription>Detailed play statistics for your tracks</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex flex-col gap-2 sm:flex-row">
              <Select value={selectedMetric} onValueChange={(value) => selectedMetric = value}>
                <SelectTrigger class="w-[180px]">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plays">Total Plays</SelectItem>
                  <SelectItem value="unique">Unique Listeners</SelectItem>
                  <SelectItem value="completion">Completion Rate</SelectItem>
                  <SelectItem value="skips">Skip Rate</SelectItem>
                </SelectContent>
              </Select>
              
              <div class="flex gap-2">
                <Button variant="outline" size="sm">Daily</Button>
                <Button variant="outline" size="sm">Weekly</Button>
                <Button variant="outline" size="sm">Monthly</Button>
              </div>
            </div>
            
            <div class="h-[300px] bg-muted rounded-md flex items-center justify-center">
              <p class="text-muted-foreground">Detailed play metrics chart will appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Play Sessions by Time of Day</CardTitle>
            <CardDescription>When people listen to your music</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="h-[300px] bg-muted rounded-md flex items-center justify-center">
              <p class="text-muted-foreground">Heatmap visualization will appear here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Track Completion Rate</CardTitle>
            <CardDescription>How much of your tracks people listen to</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="h-[300px] bg-muted rounded-md flex items-center justify-center">
              <p class="text-muted-foreground">Completion curve chart will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
    
    <TabsContent value="audience" class="space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Follower Growth</CardTitle>
            <CardDescription>How your audience is growing over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="h-[300px] bg-muted rounded-md flex items-center justify-center">
              <p class="text-muted-foreground">Follower growth chart will appear here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Listener Retention</CardTitle>
            <CardDescription>How many listeners come back to your music</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="h-[300px] bg-muted rounded-md flex items-center justify-center">
              <p class="text-muted-foreground">Retention heatmap will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Audience Demographics</CardTitle>
          <CardDescription>Insights about your listeners (data is anonymized)</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <h3 class="text-sm font-medium mb-2">Age Distribution</h3>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm">18-24</span>
                  <span class="text-sm text-muted-foreground">32%</span>
                </div>
                <div class="h-2 bg-muted rounded overflow-hidden">
                  <div class="h-full bg-primary" style="width: 32%"></div>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm">25-34</span>
                  <span class="text-sm text-muted-foreground">41%</span>
                </div>
                <div class="h-2 bg-muted rounded overflow-hidden">
                  <div class="h-full bg-primary" style="width: 41%"></div>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm">35-44</span>
                  <span class="text-sm text-muted-foreground">18%</span>
                </div>
                <div class="h-2 bg-muted rounded overflow-hidden">
                  <div class="h-full bg-primary" style="width: 18%"></div>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm">45+</span>
                  <span class="text-sm text-muted-foreground">9%</span>
                </div>
                <div class="h-2 bg-muted rounded overflow-hidden">
                  <div class="h-full bg-primary" style="width: 9%"></div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-sm font-medium mb-2">Platform Usage</h3>
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm">Mobile</span>
                  <span class="text-sm text-muted-foreground">64%</span>
                </div>
                <div class="h-2 bg-muted rounded overflow-hidden">
                  <div class="h-full bg-primary" style="width: 64%"></div>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm">Desktop</span>
                  <span class="text-sm text-muted-foreground">28%</span>
                </div>
                <div class="h-2 bg-muted rounded overflow-hidden">
                  <div class="h-full bg-primary" style="width: 28%"></div>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm">Tablet</span>
                  <span class="text-sm text-muted-foreground">5%</span>
                </div>
                <div class="h-2 bg-muted rounded overflow-hidden">
                  <div class="h-full bg-primary" style="width: 5%"></div>
                </div>
                
                <div class="flex justify-between items-center">
                  <span class="text-sm">Other</span>
                  <span class="text-sm text-muted-foreground">3%</span>
                </div>
                <div class="h-2 bg-muted rounded overflow-hidden">
                  <div class="h-full bg-primary" style="width: 3%"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
    
    <TabsContent value="traffic" class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
          <CardDescription>Where listeners discover your music</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] bg-muted rounded-md flex items-center justify-center">
            <p class="text-muted-foreground">Traffic sources chart will appear here</p>
          </div>
        </CardContent>
      </Card>
      
      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top External Referrers</CardTitle>
            <CardDescription>Websites sending traffic to your music</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">1</div>
                  <div>
                    <p class="text-sm font-medium">Social Media Platform</p>
                    <p class="text-xs text-muted-foreground">42% of referrals</p>
                  </div>
                </div>
                <p class="text-sm font-medium">4,256 plays</p>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">2</div>
                  <div>
                    <p class="text-sm font-medium">Music Blog</p>
                    <p class="text-xs text-muted-foreground">24% of referrals</p>
                  </div>
                </div>
                <p class="text-sm font-medium">2,432 plays</p>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">3</div>
                  <div>
                    <p class="text-sm font-medium">Other Streaming Service</p>
                    <p class="text-xs text-muted-foreground">16% of referrals</p>
                  </div>
                </div>
                <p class="text-sm font-medium">1,624 plays</p>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">4</div>
                  <div>
                    <p class="text-sm font-medium">Your Website</p>
                    <p class="text-xs text-muted-foreground">11% of referrals</p>
                  </div>
                </div>
                <p class="text-sm font-medium">1,116 plays</p>
              </div>
              
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">5</div>
                  <div>
                    <p class="text-sm font-medium">Other Sources</p>
                    <p class="text-xs text-muted-foreground">7% of referrals</p>
                  </div>
                </div>
                <p class="text-sm font-medium">712 plays</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Discovery Methods</CardTitle>
            <CardDescription>How people find your music</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="space-y-1">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium">Search</span>
                  <span class="text-sm text-muted-foreground">35%</span>
                </div>
                <div class="h-2 bg-muted rounded overflow-hidden">
                  <div class="h-full bg-primary" style="width: 35%"></div>
                </div>
              </div>
              
              <div class="space-y-1">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium">Playlists</span>
                  <span class="text-sm text-muted-foreground">28%</span>
                </div>
                <div class="h-2 bg-muted rounded overflow-hidden">
                  <div class="h-full bg-primary" style="width: 28%"></div>
                </div>
              </div>
              
              <div class="space-y-1">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium">Direct Links</span>
                  <span class="text-sm text-muted-foreground">18%</span>
                </div>
                <div class="h-2 bg-muted rounded overflow-hidden">
                  <div class="h-full bg-primary" style="width: 18%"></div>
                </div>
              </div>
              
              <div class="space-y-1">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium">Recommendations</span>
                  <span class="text-sm text-muted-foreground">12%</span>
                </div>
                <div class="h-2 bg-muted rounded overflow-hidden">
                  <div class="h-full bg-primary" style="width: 12%"></div>
                </div>
              </div>
              
              <div class="space-y-1">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium">Other</span>
                  <span class="text-sm text-muted-foreground">7%</span>
                </div>
                <div class="h-2 bg-muted rounded overflow-hidden">
                  <div class="h-full bg-primary" style="width: 7%"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Playlist Appearances</CardTitle>
          <CardDescription>Public playlists featuring your music</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="relative overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="text-xs uppercase bg-muted/50">
                <tr>
                  <th scope="col" class="px-4 py-3">Playlist Name</th>
                  <th scope="col" class="px-4 py-3">Creator</th>
                  <th scope="col" class="px-4 py-3">Followers</th>
                  <th scope="col" class="px-4 py-3">Plays Generated</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b">
                  <td class="px-4 py-3 font-medium">Best New Indie</td>
                  <td class="px-4 py-3">Platform Editorial</td>
                  <td class="px-4 py-3">45.2K</td>
                  <td class="px-4 py-3">1,254</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-3 font-medium">Underground Gems</td>
                  <td class="px-4 py-3">Music Blogger</td>
                  <td class="px-4 py-3">12.8K</td>
                  <td class="px-4 py-3">856</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-3 font-medium">Chill Vibes</td>
                  <td class="px-4 py-3">User123</td>
                  <td class="px-4 py-3">8.5K</td>
                  <td class="px-4 py-3">642</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-3 font-medium">Weekend Mix</td>
                  <td class="px-4 py-3">Platform Editorial</td>
                  <td class="px-4 py-3">32.1K</td>
                  <td class="px-4 py-3">412</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 font-medium">Fresh Finds</td>
                  <td class="px-4 py-3">Platform Algorithm</td>
                  <td class="px-4 py-3">78.6K</td>
                  <td class="px-4 py-3">326</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" class="w-full">View All Playlists</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  </Tabs>
</div>

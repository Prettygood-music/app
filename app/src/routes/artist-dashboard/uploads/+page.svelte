<script lang="ts">
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  
  // Placeholder data
  let tracks = $state([
    { 
      id: "trk-001", 
      title: "Track Title 1", 
      duration: "3:45", 
      plays: 5243, 
      release_date: "2025-01-15", 
      status: "published" 
    },
    { 
      id: "trk-002", 
      title: "Another Great Song", 
      duration: "4:12", 
      plays: 4125, 
      release_date: "2025-01-15", 
      status: "published" 
    },
    { 
      id: "trk-003", 
      title: "My Best Track", 
      duration: "2:58", 
      plays: 3967, 
      release_date: "2025-02-01", 
      status: "published" 
    },
    { 
      id: "trk-004", 
      title: "Popular Song", 
      duration: "3:24", 
      plays: 2845, 
      release_date: "2025-02-01", 
      status: "published" 
    },
    { 
      id: "trk-005", 
      title: "Awesome Track", 
      duration: "4:01", 
      plays: 2356, 
      release_date: "2025-02-22", 
      status: "published" 
    },
    { 
      id: "trk-006", 
      title: "New Song (Draft)", 
      duration: "3:33", 
      plays: 0, 
      release_date: "", 
      status: "draft" 
    }
  ]);
  
  let albums = $state([
    {
      id: "alb-001",
      title: "My Album",
      tracks: 5,
      release_date: "2025-01-15",
      plays: 14590,
      status: "published"
    },
    {
      id: "alb-002",
      title: "New Project (In Progress)",
      tracks: 3,
      release_date: "",
      plays: 0,
      status: "draft"
    }
  ]);
  
  // Format date function
  function formatDate(dateString: string) {
    if (!dateString) return "Not released";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
</script>

<div class="space-y-6">
  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Content Management</h1>
      <p class="text-muted-foreground">Manage your tracks, albums, and uploads</p>
    </div>
    
    <div class="flex flex-col sm:flex-row gap-2">
      <Button variant="default">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
        Upload New
      </Button>
    </div>
  </div>
  
  <div class="bg-muted/50 p-4 rounded-lg border border-muted">
    <div class="flex items-center gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
      <div>
        <h3 class="font-medium">Upload Tips</h3>
        <p class="text-sm text-muted-foreground">For best results, use high-quality audio files (WAV, FLAC, or MP3 at 320kbps) and artwork at 3000x3000 pixels.</p>
      </div>
    </div>
  </div>
  
  <Tabs defaultValue="tracks" class="space-y-4">
    <TabsList>
      <TabsTrigger value="tracks">Tracks</TabsTrigger>
      <TabsTrigger value="albums">Albums</TabsTrigger>
      <TabsTrigger value="uploads">Upload New</TabsTrigger>
    </TabsList>
    
    <TabsContent value="tracks" class="space-y-4">
      <Card>
        <CardHeader>
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <CardTitle>Your Tracks</CardTitle>
              <CardDescription>Manage your uploaded tracks</CardDescription>
            </div>
            <div class="flex gap-2">
              <Input placeholder="Search tracks..." class="max-w-xs" />
              <Button variant="outline" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="relative overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="text-xs uppercase bg-muted/50">
                <tr>
                  <th scope="col" class="px-4 py-3">Title</th>
                  <th scope="col" class="px-4 py-3">Duration</th>
                  <th scope="col" class="px-4 py-3">Release Date</th>
                  <th scope="col" class="px-4 py-3">Plays</th>
                  <th scope="col" class="px-4 py-3">Status</th>
                  <th scope="col" class="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {#each tracks as track}
                  <tr class="border-b">
                    <td class="px-4 py-3 font-medium">{track.title}</td>
                    <td class="px-4 py-3">{track.duration}</td>
                    <td class="px-4 py-3">{formatDate(track.release_date)}</td>
                    <td class="px-4 py-3">{track.plays.toLocaleString()}</td>
                    <td class="px-4 py-3">
                      <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        track.status === 'published' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
                      }`}>
                        {track.status.charAt(0).toUpperCase() + track.status.slice(1)}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter class="flex justify-between">
          <Button variant="outline" disabled>Previous</Button>
          <div class="text-sm text-muted-foreground">Page 1 of 1</div>
          <Button variant="outline" disabled>Next</Button>
        </CardFooter>
      </Card>
    </TabsContent>
    
    <TabsContent value="albums" class="space-y-4">
      <Card>
        <CardHeader>
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <CardTitle>Your Albums</CardTitle>
              <CardDescription>Manage your album releases</CardDescription>
            </div>
            <div>
              <Button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                Create Album
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {#each albums as album}
              <Card>
                <CardHeader class="pb-2">
                  <div class="aspect-square bg-muted rounded-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
                      <path d="M9 18V5l12-2v13"></path>
                      <circle cx="6" cy="18" r="3"></circle>
                      <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 class="font-semibold text-lg">{album.title}</h3>
                  <div class="text-sm text-muted-foreground mt-1">
                    <p>{album.tracks} tracks</p>
                    <p>Released: {formatDate(album.release_date)}</p>
                    <p>Plays: {album.plays.toLocaleString()}</p>
                  </div>
                </CardContent>
                <CardFooter class="flex justify-end gap-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </CardFooter>
              </Card>
            {/each}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
    
    <TabsContent value="uploads" class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Content</CardTitle>
          <CardDescription>Add new tracks or create albums</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload Track</CardTitle>
                <CardDescription>Add a single track to your catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="flex items-center justify-center h-40 border-2 border-dashed rounded-md border-muted-foreground/25">
                  <div class="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-muted-foreground">
                      <path d="M9 18V5l12-2v13"></path>
                      <circle cx="6" cy="18" r="3"></circle>
                      <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                    <p class="mt-2 text-sm text-muted-foreground">Drag and drop your audio file or click to browse</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button class="w-full">Upload Track</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Create Album</CardTitle>
                <CardDescription>Organize multiple tracks into an album</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="flex items-center justify-center h-40 border-2 border-dashed rounded-md border-muted-foreground/25">
                  <div class="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-muted-foreground">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p class="mt-2 text-sm text-muted-foreground">Create a new album and add tracks to it</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button class="w-full">Create Album</Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Bulk Upload</CardTitle>
          <CardDescription>Upload multiple tracks at once</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex items-center justify-center h-40 border-2 border-dashed rounded-md border-muted-foreground/25">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto text-muted-foreground">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <p class="mt-2 text-sm font-medium">Drag and drop multiple audio files or click to browse</p>
              <p class="text-xs text-muted-foreground mt-1">Supports MP3, WAV, FLAC (max 50MB per file)</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button class="w-full">Start Bulk Upload</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  </Tabs>
</div>

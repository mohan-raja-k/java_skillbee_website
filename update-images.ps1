param([switch]$Watch)
Set-Location $PSScriptRoot
$ext = '.jpg','.jpeg','.png','.webp','.gif'
function Get-Imgs($folder){
  if(-not (Test-Path $folder)){ return @() }
  Get-ChildItem $folder -Recurse -File | Where-Object { $ext -contains $_.Extension.ToLower() } | Sort-Object FullName
}
function Rel($f){ $f.FullName.Substring($PWD.Path.Length+1).Replace('\','/') }
function Build {
  $seen = @{}
  # winners first, so a photo found in both folders stays under Winners only
  $winners = foreach($f in Get-Imgs 'Activity_Winners'){ $h=(Get-FileHash $f.FullName).Hash; if(-not $seen[$h]){ $seen[$h]=1; Rel $f } }
  $events  = foreach($f in Get-Imgs 'Event_pics'){ $h=(Get-FileHash $f.FullName).Hash; if(-not $seen[$h]){ $seen[$h]=1; Rel $f } }
  $members = foreach($f in Get-Imgs 'club_members'){ Rel $f }
  $main = [ordered]@{}
  Get-ChildItem . -File | Where-Object { $ext -contains $_.Extension.ToLower() } | ForEach-Object { $main[$_.BaseName] = $_.Name }
  $obj = [ordered]@{ main=$main; events=@($events); winners=@($winners); members=@($members) }
  $js = 'window.IMAGES = ' + ($obj | ConvertTo-Json -Depth 5) + ';'
  if(-not (Test-Path images.js) -or (Get-Content images.js -Raw) -ne ($js)){ Set-Content images.js $js -Encoding UTF8; Write-Host ("Updated: {0} events, {1} winners, {2} members" -f @($events).Count,@($winners).Count,@($members).Count) }
}
Build
if($Watch){ Write-Host 'Watching for new photos. Keep this window open.'; while($true){ Start-Sleep 5; Build } }
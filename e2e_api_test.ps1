$ErrorActionPreference='Stop'
$base='http://localhost:3001'
$result=[ordered]@{}

$users1 = Invoke-RestMethod -Uri "$base/api/admin/usuarios" -Method Get
if($users1 -isnot [System.Array]){ $users1 = @($users1) }
$ids1 = $users1 | ForEach-Object { [int]$_.id } | Sort-Object
$result.step1 = [ordered]@{ pass = ($ids1.Count -gt 0); ids = $ids1 }

$target = $users1 | Where-Object { -not $_.isAdmin } | Select-Object -First 1
if(-not $target){ throw 'Nenhum usuário não-admin encontrado para atualização.' }
$newName = "$($target.nome)_teste"
$putBody = [ordered]@{
  nome = $newName
  email = $target.email
  telefone = $target.telefone
  cpf = $target.cpf
  isAdmin = $true
} | ConvertTo-Json
Invoke-RestMethod -Uri "$base/api/admin/usuarios/$($target.id)" -Method Put -ContentType 'application/json' -Body $putBody | Out-Null
$result.step2 = [ordered]@{ pass = $true; targetId = [int]$target.id; newNome = $newName; newIsAdmin = $true }

$users2 = Invoke-RestMethod -Uri "$base/api/admin/usuarios" -Method Get
if($users2 -isnot [System.Array]){ $users2 = @($users2) }
$updated = $users2 | Where-Object { $_.id -eq $target.id } | Select-Object -First 1
$persistOk = $false
if($updated){ $persistOk = (($updated.nome -eq $newName) -and ([bool]$updated.isAdmin -eq $true)) }
$result.step3 = [ordered]@{ pass = $persistOk; confirmedNome = $updated.nome; confirmedIsAdmin = [bool]$updated.isAdmin }

$ts = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$tmp1Email = "tmp$ts@teste.com"
$tmp1Cpf = ('9' + ($ts.ToString().Substring($ts.ToString().Length-10,10)))
$body1 = [ordered]@{
  nome = 'Usuario Temporario 1'
  email = $tmp1Email
  senha = 'Senha@12345'
  telefone = '11912345678'
  cpf = $tmp1Cpf
} | ConvertTo-Json
$reg1 = Invoke-RestMethod -Uri "$base/api/registro" -Method Post -ContentType 'application/json' -Body $body1
$tmp1Id = if($reg1.id){ [int]$reg1.id } elseif($reg1.usuario.id){ [int]$reg1.usuario.id } else { $null }
if(-not $tmp1Id){
  $afterReg1 = Invoke-RestMethod -Uri "$base/api/admin/usuarios" -Method Get
  if($afterReg1 -isnot [System.Array]){ $afterReg1=@($afterReg1) }
  $tmp1 = $afterReg1 | Where-Object { $_.email -eq $tmp1Email } | Select-Object -First 1
  if($tmp1){ $tmp1Id = [int]$tmp1.id }
}
$result.step4 = [ordered]@{ pass = [bool]$tmp1Id; temp1Id = $tmp1Id; temp1Email = $tmp1Email }

$del1Pass = $false
if($tmp1Id){
  Invoke-RestMethod -Uri "$base/api/admin/usuarios/$tmp1Id" -Method Delete | Out-Null
  $afterDel = Invoke-RestMethod -Uri "$base/api/admin/usuarios" -Method Get
  if($afterDel -isnot [System.Array]){ $afterDel=@($afterDel) }
  $stillThere = $afterDel | Where-Object { $_.id -eq $tmp1Id } | Select-Object -First 1
  $del1Pass = -not [bool]$stillThere
}
$result.step5 = [ordered]@{ pass = $del1Pass; deletedId = $tmp1Id }

$ts2 = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$tmp2Email = "tmp$ts2@teste.com"
$tmp2Cpf = ('8' + ($ts2.ToString().Substring($ts2.ToString().Length-10,10)))
$body2 = [ordered]@{
  nome = 'Usuario Temporario 2'
  email = $tmp2Email
  senha = 'Senha@12345'
  telefone = '11987654321'
  cpf = $tmp2Cpf
} | ConvertTo-Json
$reg2 = Invoke-RestMethod -Uri "$base/api/registro" -Method Post -ContentType 'application/json' -Body $body2
$tmp2Id = if($reg2.id){ [int]$reg2.id } elseif($reg2.usuario.id){ [int]$reg2.usuario.id } else { $null }
if(-not $tmp2Id){
  $afterReg2 = Invoke-RestMethod -Uri "$base/api/admin/usuarios" -Method Get
  if($afterReg2 -isnot [System.Array]){ $afterReg2=@($afterReg2) }
  $tmp2 = $afterReg2 | Where-Object { $_.email -eq $tmp2Email } | Select-Object -First 1
  if($tmp2){ $tmp2Id = [int]$tmp2.id }
}
$reused = ($tmp1Id -and $tmp2Id -and ($tmp2Id -eq $tmp1Id))
$result.step6 = [ordered]@{ pass = [bool]$reused; expectedReusedId = $tmp1Id; temp2Id = $tmp2Id; temp2Email = $tmp2Email }

$cleanupDeleted=@()
if($tmp2Id){
  try { Invoke-RestMethod -Uri "$base/api/admin/usuarios/$tmp2Id" -Method Delete | Out-Null; $cleanupDeleted += $tmp2Id } catch {}
}
$result.step7 = [ordered]@{ pass = ($cleanupDeleted.Count -ge 1); deletedTempIds = $cleanupDeleted }

$result | ConvertTo-Json -Depth 6

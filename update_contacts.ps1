$files = Get-ChildItem -Filter *.html

foreach ($file in $files) {
    $content = Get-Content -Raw $file.FullName
    
    $content = $content -replace '<a href="https://github\.com" target="_blank" rel="noopener" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>', '<a href="https://github.com/ziadx6" target="_blank" rel="noopener" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>'
    $content = $content -replace '<a href="https://linkedin\.com" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>', '<a href="https://www.linkedin.com/in/ziad-khalid-x6" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>'
    $content = $content -replace '<a href="https://facebook\.com" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>', '<a href="https://www.facebook.com/Ziad.x6" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>'
    $content = $content -replace '<a href="mailto:ziad@example\.com" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>', '<a href="mailto:ziad.khalid.x6@gmail.com" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>'
    
    if ($file.Name -eq 'contact.html') {
        $content = $content -replace '<a class="contact-item glass-card" href="mailto:ziad@example\.com">', '<a class="contact-item glass-card" href="mailto:ziad.khalid.x6@gmail.com">'
        $content = $content -replace '<span class="value">ziad@example\.com</span>', '<span class="value">ziad.khalid.x6@gmail.com</span>'
        
        $content = $content -replace 'github\.com/ziadkhaled', 'github.com/ziadx6'
        $content = $content -replace 'linkedin\.com/in/ziadkhaled', 'linkedin.com/in/ziad-khalid-x6'
        $content = $content -replace 'facebook\.com/ziadkhaled', 'facebook.com/Ziad.x6'
        
        $content = $content -replace '<a class="contact-item glass-card" href="https://github\.com"', '<a class="contact-item glass-card" href="https://github.com/ziadx6"'
        $content = $content -replace '<a class="contact-item glass-card" href="https://linkedin\.com"', '<a class="contact-item glass-card" href="https://www.linkedin.com/in/ziad-khalid-x6"'
        $content = $content -replace '<a class="contact-item glass-card" href="https://facebook\.com"', '<a class="contact-item glass-card" href="https://www.facebook.com/Ziad.x6"'
    }
    
    [IO.File]::WriteAllText($file.FullName, $content)
}
Write-Output "Done"

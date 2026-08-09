const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Footer replacements
  content = content.replace(/<a href="https:\/\/github\.com" target="_blank" rel="noopener" aria-label="GitHub"><i class="fa-brands fa-github"><\/i><\/a>/g, '<a href="https://github.com/ziadx6" target="_blank" rel="noopener" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>');
  content = content.replace(/<a href="https:\/\/linkedin\.com" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"><\/i><\/a>/g, '<a href="https://www.linkedin.com/in/ziad-khalid-x6" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>');
  content = content.replace(/<a href="https:\/\/facebook\.com" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"><\/i><\/a>/g, '<a href="https://www.facebook.com/Ziad.x6" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>');
  content = content.replace(/<a href="mailto:ziad@example\.com" aria-label="Email"><i class="fa-solid fa-envelope"><\/i><\/a>/g, '<a href="mailto:ziad.khalid.x6@gmail.com" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>');
  
  // Contact page specific
  if (file === 'contact.html') {
    content = content.replace(/<a class="contact-item glass-card" href="mailto:ziad@example\.com">/g, '<a class="contact-item glass-card" href="mailto:ziad.khalid.x6@gmail.com">');
    content = content.replace(/<span class="value">ziad@example\.com<\/span>/g, '<span class="value">ziad.khalid.x6@gmail.com</span>');
    
    content = content.replace(/github\.com\/ziadkhaled/g, 'github.com/ziadx6');
    content = content.replace(/linkedin\.com\/in\/ziadkhaled/g, 'linkedin.com/in/ziad-khalid-x6');
    content = content.replace(/facebook\.com\/ziadkhaled/g, 'facebook.com/Ziad.x6');
    
    content = content.replace(/<a class="contact-item glass-card" href="https:\/\/github\.com"/g, '<a class="contact-item glass-card" href="https://github.com/ziadx6"');
    content = content.replace(/<a class="contact-item glass-card" href="https:\/\/linkedin\.com"/g, '<a class="contact-item glass-card" href="https://www.linkedin.com/in/ziad-khalid-x6"');
    content = content.replace(/<a class="contact-item glass-card" href="https:\/\/facebook\.com"/g, '<a class="contact-item glass-card" href="https://www.facebook.com/Ziad.x6"');
  }
  
  fs.writeFileSync(file, content);
});
console.log('Done');

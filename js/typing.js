function typeLoop(targets, host, opts = {}) {
  if (!host) return;
  const speed = opts.speed || 75;
  const deleteSpeed = opts.deleteSpeed || 40;
  const pause = opts.pause || 1400;
  const startDelay = opts.startDelay || 300;
  let i = 0;
  let charIdx = 0;
  let deleting = false;

  function ensureCursor() {
    let cursor = host.querySelector('.cursor');
    if (!cursor) {
      cursor = document.createElement('span');
      cursor.className = 'cursor';
      host.appendChild(cursor);
    }
    return cursor;
  }

  function step() {
    if (host._typedCanceled) return;
    const cursor = ensureCursor();
    const current = targets[i % targets.length] || '';
    if (!deleting) {
      charIdx++;
      let textNode = host.firstChild && host.firstChild.nodeType === 3 ? host.firstChild : null;
      if (!textNode) {
        textNode = document.createTextNode('');
        host.insertBefore(textNode, cursor);
      }
      textNode.textContent = current.slice(0, charIdx);
      if (charIdx >= current.length) {
        deleting = true;
        host._typedTimer = setTimeout(step, pause);
        return;
      }
      host._typedTimer = setTimeout(step, speed);
    } else {
      charIdx--;
      if (host.firstChild && host.firstChild.nodeType === 3) {
        host.firstChild.textContent = current.slice(0, charIdx);
      }
      if (charIdx <= 0) {
        deleting = false;
        i++;
        host._typedTimer = setTimeout(step, 400);
        return;
      }
      host._typedTimer = setTimeout(step, deleteSpeed);
    }
  }

  host._typedCanceled = false;
  if (host._typedTimer) clearTimeout(host._typedTimer);
  host._typedTimer = setTimeout(step, startDelay);
}

function typedTargets(key) {
  const lang = Storage.getLang();
  if (!Translations || !Translations[lang]) return [];
  return resolve(Translations[lang], key) || [];
}

function startTyped(host, key, opts) {
  if (!host) return;

  const run = () => {
    if (host._typedTimer) clearTimeout(host._typedTimer);
    host._typedCanceled = true;
    host.textContent = '';
    const span = document.createElement('span');
    span.className = 'cursor';
    host.appendChild(span);
    host._typedCanceled = false;
    typeLoop(typedTargets(key), host, opts);
  };

  run();

  if (!host._typedLangBound) {
    host._typedLangBound = true;
    document.addEventListener('lang:changed', run);
  }
}
